#!/usr/bin/env node

/**
 * GitHub Issues 轉 VitePress Markdown 腳本
 * 
 * 功能：
 * 1. 從 GitHub API 擷取符合條件的 issues（label: blog, state: closed）
 * 2. 將 issue 內容轉換為 VitePress markdown 格式
 * 3. 生成文章列表頁面
 */

import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  owner: 'cscolabear',
  repo: 'cscolabear.github.io',
  label: 'blog',
  state: 'closed',
  postsDir: path.join(__dirname, '../docs/posts'),
  postsIndexPath: path.join(__dirname, '../docs/posts/index.md')
};

// 初始化 Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || process.env.GH_TOKEN
});

/**
 * 擷取所有符合條件的 GitHub Issues
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
        labels: CONFIG.label,
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
    
    console.log(`✅ 共擷取 ${issues.length} 篇文章\n`);
    return issues;
    
  } catch (error) {
    console.error('❌ 擷取 Issues 失敗:', error.message);
    throw error;
  }
}

/**
 * 將 issue 轉換為 Markdown frontmatter + body
 */
function convertIssueToMarkdown(issue) {
  const {
    number,
    title,
    body,
    created_at,
    updated_at,
    html_url,
    labels
  } = issue;
  
  // 生成描述（取前 150 字元）
  const description = body
    ? body
        .replace(/[#*`\[\]]/g, '') // 移除 Markdown 特殊字元
        .replace(/\n+/g, ' ')      // 移除換行
        .trim()
        .substring(0, 150)
    : '';
  
  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  // 提取標籤名稱
  const labelNames = labels
    .map(label => typeof label === 'string' ? label : label.name)
    .filter(name => name !== 'blog'); // 排除 'blog' label
  
  // 生成 frontmatter
  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${formatDate(created_at)}
updated: ${formatDate(updated_at)}
description: "${description.replace(/"/g, '\\"')}"
issueId: ${number}
githubUrl: "${html_url}"
labels: ${JSON.stringify(labelNames)}
---

`;
  
  // 處理圖片連結（確保 GitHub 上傳的圖片連結正常）
  let processedBody = body || '';
  
  // GitHub 圖片連結通常已經是完整的 URL，不需要特別處理
  
  // 添加 GitHub 討論連結
  const discussionLink = `

---

<div class="github-discussion">
  <a href="${html_url}" target="_blank" rel="noopener noreferrer">
    💬 在 GitHub 上討論這篇文章
  </a>
</div>
`;
  
  return frontmatter + processedBody + discussionLink;
}

/**
 * 將 Markdown 內容寫入檔案
 */
async function writeMarkdownFile(issue) {
  const filename = `${issue.number}.md`;
  const filepath = path.join(CONFIG.postsDir, filename);
  const content = convertIssueToMarkdown(issue);
  
  try {
    await fs.writeFile(filepath, content, 'utf-8');
    console.log(`   ✓ ${filename} - ${issue.title}`);
    return true;
  } catch (error) {
    console.error(`   ✗ ${filename} 寫入失敗:`, error.message);
    return false;
  }
}

/**
 * 生成文章列表頁面
 */
async function generatePostsList(issues) {
  console.log('\n📝 正在生成文章列表頁面...');
  
  // 依更新時間排序（最新的在前）
  const sortedIssues = [...issues].sort((a, b) => {
    return new Date(b.updated_at) - new Date(a.updated_at);
  });
  
  // 生成列表內容
  let listContent = `# 文章列表

共 ${issues.length} 篇文章

---

`;
  
  sortedIssues.forEach(issue => {
    const date = new Date(issue.updated_at).toLocaleDateString('zh-TW');
    const labels = issue.labels
      .map(label => typeof label === 'string' ? label : label.name)
      .filter(name => name !== 'blog')
      .map(name => `\`${name}\``)
      .join(' ');
    
    listContent += `
## [${issue.title}](/posts/${issue.number})

${labels ? `**標籤**: ${labels}` : ''}

**更新時間**: ${date}

---
`;
  });
  
  try {
    await fs.writeFile(CONFIG.postsIndexPath, listContent, 'utf-8');
    console.log('✅ 文章列表頁面生成完成\n');
  } catch (error) {
    console.error('❌ 文章列表生成失敗:', error.message);
    throw error;
  }
}

/**
 * 清理舊的文章檔案（保留 index.md）
 */
async function cleanOldPosts() {
  console.log('🧹 正在清理舊文章...');
  
  try {
    const files = await fs.readdir(CONFIG.postsDir);
    
    for (const file of files) {
      if (file !== 'index.md' && file.endsWith('.md')) {
        await fs.unlink(path.join(CONFIG.postsDir, file));
        console.log(`   ✓ 已刪除 ${file}`);
      }
    }
    
    console.log('✅ 清理完成\n');
  } catch (error) {
    console.error('❌ 清理失敗:', error.message);
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
    
    // 清理舊文章
    await cleanOldPosts();
    
    // 擷取 Issues
    const issues = await fetchIssues();
    
    if (issues.length === 0) {
      console.log('⚠️  沒有找到符合條件的文章（label: blog, state: closed）');
      return;
    }
    
    // 轉換並寫入文章
    console.log('📝 正在轉換文章...');
    let successCount = 0;
    
    for (const issue of issues) {
      const success = await writeMarkdownFile(issue);
      if (success) successCount++;
    }
    
    console.log(`✅ 成功轉換 ${successCount}/${issues.length} 篇文章\n`);
    
    // 生成文章列表
    await generatePostsList(issues);
    
    console.log('🎉 建置完成！\n');
    
  } catch (error) {
    console.error('❌ 建置失敗:', error);
    process.exit(1);
  }
}

// 執行主函數
main();
