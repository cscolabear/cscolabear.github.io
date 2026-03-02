#!/usr/bin/env node

/**
 * GitHub Issues 轉 VitePress Markdown 腳本
 * 
 * 功能：
 * 1. 從 GitHub API 擷取符合條件的 issues（label: Publishing, state: closed）
 * 2. 將 issue 內容轉換為 VitePress markdown 格式
 * 3. 生成文章列表頁面
 */

import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readingTime from 'reading-time';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 動態載入 SEO 配置檔
const seoConfigPath = path.join(__dirname, '../seo.config.js');
const seoConfig = (await import(seoConfigPath)).default;

// 配置（從 seo.config.js 讀取）
const CONFIG = {
  owner: seoConfig.github.owner,
  repo: seoConfig.github.repo,
  publishLabel: seoConfig.github.publishLabel,
  state: seoConfig.github.state,
  siteUrl: seoConfig.site.url,
  postsDir: path.join(__dirname, '../docs/posts'),
  postsIndexPath: path.join(__dirname, '../docs/articles.md'),
  syncLogPath: path.join(__dirname, '../docs/.vitepress/sync-log.json')
};

// 初始化 Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || process.env.GH_TOKEN
});

/**
 * 讀取同步日誌
 */
async function readSyncLog() {
  try {
    const content = await fs.readFile(CONFIG.syncLogPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return {}; // 如果檔案不存在，返回空物件
  }
}

/**
 * 寫入同步日誌
 */
async function writeSyncLog(log) {
  try {
    await fs.writeFile(CONFIG.syncLogPath, JSON.stringify(log, null, 2), 'utf-8');
  } catch (error) {
    console.error('⚠️  同步日誌寫入失敗:', error.message);
  }
}

/**
 * 檢查 issue 是否需要更新（包含留言變動檢查）
 */
function needsUpdate(issue, syncLog) {
  const issueKey = `issue-${issue.number}`;
  const lastSync = syncLog[issueKey];
  
  if (!lastSync) {
    return true; // 新文章，需要建立
  }
  
  // 檢查 issue 本身是否有更新
  const issueUpdatedAt = new Date(issue.updated_at).getTime();
  const lastSyncTime = new Date(lastSync.updated_at).getTime();
  
  if (issueUpdatedAt > lastSyncTime) {
    return true; // Issue 更新時間晚於上次同步
  }
  
  // 檢查留言是否有更新
  if (issue.comments_data && issue.comments_data.length > 0) {
    // 取得最新留言的更新時間
    const latestCommentUpdatedAt = Math.max(
      ...issue.comments_data.map(c => new Date(c.updated_at).getTime())
    );
    
    // 如果之前沒有記錄留言時間，或留言有更新，則需要重新生成
    if (!lastSync.comments_updated_at) {
      return true;
    }
    
    const lastCommentsSync = new Date(lastSync.comments_updated_at).getTime();
    if (latestCommentUpdatedAt > lastCommentsSync) {
      return true; // 留言有更新
    }
  }
  
  return false; // 無需更新
}

/**
 * 擷取指定 issue 的最新留言（最多 10 則）
 */
async function fetchIssueComments(issueNumber) {
  try {
    const { data: comments } = await octokit.rest.issues.listComments({
      owner: CONFIG.owner,
      repo: CONFIG.repo,
      issue_number: issueNumber,
      per_page: 100,
      sort: 'created',
      direction: 'desc' // 最新的在前
    });
    
    // 只取最新 10 則
    return comments.slice(0, 10);
    
  } catch (error) {
    console.warn(`⚠️  擷取 Issue #${issueNumber} 留言失敗:`, error.message);
    return []; // 失敗時返回空陣列，不中斷流程
  }
}

/**
 * 擷取所有符合條件的 GitHub Issues（包含留言）
 */
async function fetchIssues() {
  console.log('📥 正在擷取 GitHub Issues...');
  
  try {
    const issues = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const response = await octokit.rest.issues.listForRepo({
        owner: CONFIG.owner,
        repo: CONFIG.repo,
        state: CONFIG.state,
        labels: CONFIG.publishLabel,
        sort: 'updated',
        direction: 'desc',
        per_page: 100,
        page: page
      });
      
      issues.push(...response.data);
      
      // 檢查是否還有更多頁面
      hasMore = response.data.length === 100;
      page++;
      
      console.log(`   ✓ 已擷取第 ${page - 1} 頁，共 ${response.data.length} 篇`);
    }
    
    console.log(`✅ 共擷取 ${issues.length} 篇文章`);
    
    // 為每個 issue 取得留言
    console.log('📥 正在擷取留言...');
    for (const issue of issues) {
      const comments = await fetchIssueComments(issue.number);
      issue.comments_data = comments; // 附加留言資料到 issue 物件
      
      if (comments.length > 0) {
        console.log(`   ✓ Issue #${issue.number}: ${comments.length} 則留言`);
      }
    }
    
    console.log(`✅ 留言擷取完成\n`);
    return issues;
    
  } catch (error) {
    console.error('❌ 擷取 Issues 失敗:', error.message);
    throw error;
  }
}

/**
 * 生成文章摘要（用於 meta description）
 */
function generateExcerpt(body, maxLength = 160) {
  if (!body) return '';
  
  // 移除 Markdown 語法和 HTML 標籤
  let text = body
    .replace(/^#+\s+/gm, '') // 移除標題符號
    .replace(/\*\*([^*]+)\*\*/g, '$1') // 移除粗體
    .replace(/\*([^*]+)\*/g, '$1') // 移除斜體
    .replace(/`([^`]+)`/g, '$1') // 移除行內程式碼
    .replace(/```[\s\S]*?```/g, '') // 移除程式碼區塊
    .replace(/!\[.*?\]\([^)]+\)/g, '') // 移除 Markdown 圖片（必須在連結之前）
    .replace(/!\[[^\]]*$/gm, '') // 移除不完整的圖片語法（行尾）
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除連結，保留文字
    .replace(/<img[^>]*>/gi, '') // 移除 HTML img 標籤
    .replace(/<[^>]+>/g, '') // 移除所有其他 HTML 標籤
    .replace(/>\s+/g, '') // 移除引用符號
    .replace(/\n+/g, ' ') // 將換行轉為空格
    .replace(/\s+/g, ' ') // 合併多個空格
    .trim();
  
  // 截取指定長度
  if (text.length <= maxLength) {
    return text;
  }
  
  // 嘗試在句號、問號、驚嘆號處截斷
  const sentenceEnd = text.substring(0, maxLength).match(/[。！？.!?](?=[^。！？.!?]*$)/);
  if (sentenceEnd) {
    return text.substring(0, sentenceEnd.index + 1);
  }
  
  // 否則在最後一個空格處截斷
  const lastSpace = text.substring(0, maxLength).lastIndexOf(' ');
  if (lastSpace > maxLength * 0.8) {
    return text.substring(0, lastSpace) + '...';
  }
  
  return text.substring(0, maxLength) + '...';
}

/**
 * 從 issue body 中提取自訂 URL
 * @param {string} body - Issue 內容
 * @returns {string|null} - 清理後的自訂 URL，若無則返回 null
 */
function extractCustomUrl(body) {
  if (!body) return null;
  
  // 匹配開頭的 url: 標記（忽略前面的空白行）
  const urlMatch = body.trim().match(/^url:\s*(.+)$/m);
  
  if (!urlMatch) return null;
  
  // 提取並清理 URL
  const customUrl = urlMatch[1].trim();
  
  if (!customUrl) return null;
  
  // 驗證格式：僅允許英數字、連字符、底線
  // 自動轉換為小寫，將不合法字符轉為連字符
  const sanitized = customUrl
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')  // 非法字符轉為連字符
    .replace(/-+/g, '-')            // 多個連字符合併為一個
    .replace(/^-|-$/g, '');         // 移除開頭和結尾的連字符
  
  // 防止清理後變成空字符串
  return sanitized || null;
}

/**
 * 從 issue body 中移除 url: 標記
 * @param {string} body - Issue 內容
 * @returns {string} - 移除標記後的內容
 */
function removeUrlTag(body) {
  if (!body) return '';
  
  // 移除 url: 標記行（包含換行符）
  return body.replace(/^url:\s*.+(\r?\n)?/m, '').trim();
}

/**
 * 將 issue 轉換為 Markdown frontmatter + body + comments
 */
function convertIssueToMarkdown(issue) {
  const {
    number,
    title,
    body,
    created_at,
    updated_at,
    html_url,
    labels,
    comments_data
  } = issue;
  
  // 先移除 URL 標記，再用於其他處理
  const cleanBody = removeUrlTag(body);
  
  // 生成描述（使用移除標記後的內容）
  const description = generateExcerpt(cleanBody, seoConfig.posts.metaDescriptionLength);
  
  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  // 格式化留言時間（繁體中文格式）
  const formatCommentDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // 提取標籤名稱（排除發佈用 label，使用不區分大小寫比對）
  const labelNames = labels
    .map(label => typeof label === 'string' ? label : label.name)
    .filter(name => name.toLowerCase() !== CONFIG.publishLabel.toLowerCase());
  
  // 提取關鍵字（包含標籤 + SEO 預設關鍵字）
  const keywords = [...new Set([
    ...labelNames,
    ...seoConfig.seo.keywords.slice(0, 2) // 添加前兩個網站預設關鍵字
  ])];
  
  // 判斷文章分類（可以根據 labels 或其他邏輯決定）
  const category = labelNames.length > 0 ? labelNames[0] : seoConfig.posts.defaultCategory;
  
  // 計算閱讀時間（使用原始 body，因為 readingTime 需要完整文章）
  const stats = readingTime(cleanBody || '');
  
  // 提取自訂 URL（如果有）
  const customUrl = extractCustomUrl(body);
  const slug = customUrl || number.toString();
  const permalink = `/${slug}`;
  
  // 生成 frontmatter
  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${formatDate(created_at)}
updated: ${formatDate(updated_at)}
description: "${description.replace(/"/g, '\\"')}"
author: "${seoConfig.posts.defaultAuthor}"
category: "${category}"
tags: ${JSON.stringify(labelNames)}
keywords: ${JSON.stringify(keywords)}
readingTime: "${stats.text}"
readingMinutes: ${Math.ceil(stats.minutes)}
permalink: "${permalink}"
slug: "${slug}"
issueId: ${number}
githubUrl: "${html_url}"
labels: ${JSON.stringify(labelNames)}
---

`;
  
  // 使用已清理的 body（已在前面移除 URL 標記）
  let processedBody = cleanBody;
  
  // GitHub 圖片連結通常已經是完整的 URL，不需要特別處理
  
  // 生成留言區塊（如果有留言）
  let commentsSection = '';
  if (comments_data && comments_data.length > 0) {
    commentsSection = `

---

## 💬 留言討論 (${comments_data.length} 則)

`;
    
    comments_data.forEach(comment => {
      const authorName = comment.user?.login || '匿名使用者';
      const commentDate = formatCommentDate(comment.updated_at);
      
      // 處理換行：將單個 \n 轉換為 <br>（保持 GitHub 風格）
      // 這樣可以保留留言中的換行，與 GitHub Issue 頁面顯示一致
      const commentBody = (comment.body || '').replace(/\n/g, '<br>\n');
      
      // 使用純 Markdown + 簡單的 HTML，確保留言內容格式正確渲染
      commentsSection += `
<div class="comment-card">
<div class="comment-header">
<strong>@${authorName}</strong>
<span class="comment-date">${commentDate}</span>
</div>

${commentBody}

</div>

`;
    });
  }
  
  // 添加 h1 標題（SEO 優化）
  const h1Title = `# ${title}\n\n`;
  
  // 添加 GitHub 討論連結
  const discussionLink = `

---

<div class="github-discussion">
  <a href="${html_url}" target="_blank" rel="noopener noreferrer">
    💬 在 GitHub 上討論這篇文章
  </a>
</div>
`;
  
  return frontmatter + h1Title + processedBody + commentsSection + discussionLink;
}

/**
 * 將 Markdown 內容寫入檔案
 */
async function writeMarkdownFile(issue, syncLog) {
  // 提取自訂 URL 決定檔名
  const customUrl = extractCustomUrl(issue.body);
  const slug = customUrl || issue.number.toString();
  const filename = `${slug}.md`;
  const filepath = path.join(CONFIG.postsDir, filename);
  
  // 檢查 slug 是否變更，如果變更則刪除舊檔案
  const issueKey = `issue-${issue.number}`;
  const oldSlug = syncLog[issueKey]?.slug;
  const slugChanged = oldSlug && oldSlug !== slug;
  
  if (slugChanged) {
    const oldFilename = `${oldSlug}.md`;
    const oldFilepath = path.join(CONFIG.postsDir, oldFilename);
    try {
      await fs.unlink(oldFilepath);
      console.log(`   🗑️  已刪除舊檔案: ${oldFilename} (slug 變更: ${oldSlug} → ${slug})`);
    } catch (error) {
      // 舊檔案可能已不存在，忽略錯誤
      if (error.code !== 'ENOENT') {
        console.warn(`   ⚠️  刪除舊檔案失敗: ${oldFilename}`, error.message);
      }
    }
  }
  
  // 檢查檔案是否存在
  let fileExists = false;
  try {
    await fs.access(filepath);
    fileExists = true;
  } catch {
    fileExists = false;
  }
  
  // 檢查是否需要更新（slug 變更或檔案不存在時強制更新）
  if (!slugChanged && fileExists && !needsUpdate(issue, syncLog)) {
    console.log(`   ⏭️  ${filename} - 無需更新`);
    return 'skipped';
  }
  
  const content = convertIssueToMarkdown(issue);
  
  try {
    await fs.writeFile(filepath, content, 'utf-8');
    console.log(`   ✓ ${filename} - ${issue.title}`);
    
    // 計算留言的最後更新時間
    let commentsUpdatedAt = null;
    if (issue.comments_data && issue.comments_data.length > 0) {
      const latestCommentDate = Math.max(
        ...issue.comments_data.map(c => new Date(c.updated_at).getTime())
      );
      commentsUpdatedAt = new Date(latestCommentDate).toISOString();
    }
    
    // 更新同步日誌（記錄 slug 和 filename 用於追蹤變更）
    syncLog[`issue-${issue.number}`] = {
      title: issue.title,
      updated_at: issue.updated_at,
      comments_updated_at: commentsUpdatedAt,
      comments_count: issue.comments_data?.length || 0,
      slug: slug,
      filename: filename,
      synced_at: new Date().toISOString()
    };
    
    return 'success';
  } catch (error) {
    console.error(`   ✗ ${filename} 寫入失敗:`, error.message);
    return 'failed';
  }
}

/**
 * 生成文章列表的 Markdown 內容（共用函數）
 */
function generateArticleListMarkdown(issues, syncLog) {
  let content = '';
  
  issues.forEach((issue, index) => {
    const date = new Date(issue.updated_at).toLocaleDateString('zh-TW');
    const labels = issue.labels
      .map(label => typeof label === 'string' ? label : label.name)
      .filter(name => name.toLowerCase() !== CONFIG.publishLabel.toLowerCase())
      .map(name => `\`${name}\``)
      .join(' ');
    
    // 取得留言數量
    const issueKey = `issue-${issue.number}`;
    const commentsCount = syncLog[issueKey]?.comments_count || 0;
    
    // 提取自訂 URL 生成連結
    const customUrl = extractCustomUrl(issue.body);
    const slug = customUrl || issue.number.toString();
    
    // 建立 meta 資訊陣列（合併為一行）
    const metaParts = [`**更新時間**: ${date}`];
    if (commentsCount > 0) {
      metaParts.push(`💬 ${commentsCount} 則留言`);
    }
    if (labels && labels.trim()) {
      metaParts.push(`**標籤**: ${labels}`);
    }
    
    content += `
## [${issue.title}](/${slug})

${metaParts.join(' | ')}

`;
  });
  
  return content;
}

/**
 * 生成文章列表頁面
 */
async function generatePostsList(issues) {
  console.log('\n📝 正在生成文章列表頁面...');
  
  // 讀取 sync-log 以取得留言數量
  const syncLog = await readSyncLog();
  
  // 依更新時間排序（最新的在前）
  const sortedIssues = [...issues].sort((a, b) => {
    return new Date(b.updated_at) - new Date(a.updated_at);
  });
  
  // 生成列表內容
  let listContent = `# 文章列表

共 ${issues.length} 篇文章

`;
  
  // 使用共用函數生成文章列表
  listContent += generateArticleListMarkdown(sortedIssues, syncLog);
  
  try {
    await fs.writeFile(CONFIG.postsIndexPath, listContent, 'utf-8');
    console.log('✅ 文章列表頁面生成完成\n');
  } catch (error) {
    console.error('❌ 文章列表生成失敗:', error.message);
    throw error;
  }
}

/**
 * 清理已刪除的 issue 對應的文章檔案
 */
async function cleanDeletedPosts(currentIssues) {
  console.log('🧹 正在清理已刪除的文章...');
  
  try {
    const files = await fs.readdir(CONFIG.postsDir);
    
    // 建立當前有效的檔名集合（使用 slug）
    const currentFilenames = new Set(
      currentIssues.map(issue => {
        const customUrl = extractCustomUrl(issue.body);
        const slug = customUrl || issue.number.toString();
        return `${slug}.md`;
      })
    );
    
    let cleanedCount = 0;
    for (const file of files) {
      if (file !== 'index.md' && file.endsWith('.md') && !currentFilenames.has(file)) {
        await fs.unlink(path.join(CONFIG.postsDir, file));
        console.log(`   ✓ 已刪除 ${file}（對應的 issue 已不符合條件）`);
        cleanedCount++;
      }
    }
    
    if (cleanedCount === 0) {
      console.log('   ✓ 無需清理');
    }
    console.log('');
  } catch (error) {
    console.error('❌ 清理失敗:', error.message);
  }
}

/**
 * 更新首頁的文章列表（最新 5 篇）
 */
async function updateHomePage(issues) {
  console.log('\n🏠 正在更新首頁文章列表...');
  
  const homePagePath = path.join(__dirname, '../docs/index.md');
  
  try {
    // 讀取首頁內容
    let homeContent = await fs.readFile(homePagePath, 'utf-8');
    
    // 讀取 sync-log 以取得留言數量
    const syncLog = await readSyncLog();
    
    // 依更新時間排序（最新的在前），取前 5 篇
    const latestIssues = [...issues]
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 5);
    
    // 生成文章列表內容
    let articlesContent = '';
    
    if (latestIssues.length === 0) {
      articlesContent = '\n尚無文章，請建立第一篇 Issue 並添加 `Publishing` label！\n';
    } else {
      // 使用共用函數生成 Markdown 格式的文章列表
      articlesContent = '\n' + generateArticleListMarkdown(latestIssues, syncLog);
      articlesContent += '\n<p class="view-all"><a href="/articles">查看所有文章 →</a></p>\n';
    }
    
    // 替換「最新文章」區域的內容
    const articlesSectionRegex = /(## 最新文章\s*\n)([\s\S]*)$/;
    
    if (articlesSectionRegex.test(homeContent)) {
      // 完全替換「最新文章」之後的所有內容
      homeContent = homeContent.replace(
        articlesSectionRegex,
        `$1${articlesContent}`
      );
    } else {
      // 如果找不到「最新文章」標題，在文件末尾添加
      homeContent += `\n## 最新文章\n${articlesContent}`;
    }
    
    // 寫入更新後的內容
    await fs.writeFile(homePagePath, homeContent, 'utf-8');
    console.log(`✅ 首頁已更新（顯示 ${latestIssues.length} 篇文章）\n`);
    
  } catch (error) {
    console.error('❌ 首頁更新失敗:', error.message);
    throw error;
  }
}

/**
 * 主函數
 */
async function main() {
  console.log('🚀 開始建置文章...\n');
  
  try {
    // 確保目錄存在
    await fs.mkdir(CONFIG.postsDir, { recursive: true });
    await fs.mkdir(path.dirname(CONFIG.syncLogPath), { recursive: true });
    
    // 讀取同步日誌
    const syncLog = await readSyncLog();
    console.log(`📋 已載入同步日誌（${Object.keys(syncLog).length} 筆記錄）\n`);
    
    // 擷取 Issues
    const issues = await fetchIssues();
    
    if (issues.length === 0) {
      console.log(`⚠️  沒有找到符合條件的文章（label: ${CONFIG.publishLabel}, state: ${CONFIG.state}）`);
      return;
    }
    
    // 檢測 slug 衝突
    console.log('🔍 檢查 slug 衝突...');
    const slugMap = new Map();
    const conflicts = [];
    
    for (const issue of issues) {
      const customUrl = extractCustomUrl(issue.body);
      const slug = customUrl || issue.number.toString();
      
      if (slugMap.has(slug)) {
        conflicts.push({
          slug,
          issues: [slugMap.get(slug), issue.number]
        });
      } else {
        slugMap.set(slug, issue.number);
      }
    }
    
    if (conflicts.length > 0) {
      console.log('⚠️  偵測到 slug 衝突：');
      conflicts.forEach(c => {
        console.log(`   - slug "${c.slug}" 被 issue #${c.issues.join(' 和 #')} 使用`);
      });
      console.log('   提示：後處理的 issue 會覆蓋前者的檔案\n');
    } else {
      console.log('   ✓ 無衝突\n');
    }
    
    // 轉換並寫入文章
    console.log('📝 正在轉換文章...');
    let successCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    
    for (const issue of issues) {
      const result = await writeMarkdownFile(issue, syncLog);
      if (result === 'success') successCount++;
      else if (result === 'skipped') skippedCount++;
      else failedCount++;
    }
    
    console.log(`\n📊 轉換結果：`);
    console.log(`   ✅ 成功: ${successCount} 篇`);
    console.log(`   ⏭️  跳過: ${skippedCount} 篇（無需更新）`);
    if (failedCount > 0) {
      console.log(`   ❌ 失敗: ${failedCount} 篇`);
    }
    console.log('');
    
    // 寫入同步日誌
    await writeSyncLog(syncLog);
    
    // 清理已刪除的 issues 對應的檔案
    await cleanDeletedPosts(issues);
    
    // 生成文章列表
    await generatePostsList(issues);
    
    // 更新首頁文章列表
    await updateHomePage(issues);
    
    console.log('🎉 建置完成！\n');
    
  } catch (error) {
    console.error('❌ 建置失敗:', error);
    process.exit(1);
  }
}

// 執行主函數
main();
