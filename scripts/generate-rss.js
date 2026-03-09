#!/usr/bin/env node

/**
 * RSS Feed 生成腳本
 * 
 * 功能：
 * 1. 讀取已生成的文章 Markdown 檔案
 * 2. 解析 frontmatter 資訊
 * 3. 生成 RSS 2.0 和 Atom feed
 */

import { Feed } from 'feed';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 載入 SEO 配置
const seoConfigPath = path.join(__dirname, '../seo.config.js');
const seoConfig = (await import(seoConfigPath)).default;

const CONFIG = {
  postsDir: path.join(__dirname, '../pages/posts'),
  outputDir: path.join(__dirname, '../pages/public'),
  maxItems: seoConfig.rss.maxItems || 20
};

/**
 * 解析 frontmatter
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]+?)\n---/);
  if (!match) return null;
  
  const frontmatter = {};
  const lines = match[1].split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();
    
    // 處理字串值（移除引號）
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value.startsWith('[') && value.endsWith(']')) {
      // 處理陣列（簡單 JSON parse）
      try {
        value = JSON.parse(value);
      } catch (e) {
        // 解析失敗保持字串
      }
    } else if (!isNaN(value)) {
      // 處理數字
      value = Number(value);
    }
    
    frontmatter[key] = value;
  }
  
  return frontmatter;
}

/**
 * 提取文章內容（移除 frontmatter）
 */
function extractContent(content) {
  return content.replace(/^---\n[\s\S]+?\n---\n/, '').trim();
}

/**
 * 將 Markdown 和 HTML 內容轉換為純文字
 * @param {string} content - 原始內容
 * @param {number} maxLength - 最大長度（預設 200）
 * @returns {string} 純文字內容
 */
function convertToPlainText(content, maxLength = 200) {
  let text = content
    // 移除 Markdown 程式碼區塊
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // 移除 Markdown 圖片（必須在連結之前處理）
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    // 移除 Markdown 連結，保留文字部分
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 移除 Markdown 標題
    .replace(/^#+\s+/gm, '')
    // 移除 Markdown 粗體和斜體
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // 移除所有 HTML 標籤（包括 img, a, div 等）
    .replace(/<[^>]+>/g, '')
    // 移除 HTML 實體
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/&#[0-9]+;/g, ' ')
    // 移除 Markdown 列表標記
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // 移除 Markdown 引用標記
    .replace(/^>\s+/gm, '')
    // 移除 Markdown 分隔線
    .replace(/^[\s]*[-*_]{3,}[\s]*$/gm, '')
    // 移除多餘空白和換行
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // 截斷到指定長度
  if (text.length > maxLength) {
    text = text.substring(0, maxLength).trim();
    // 避免在詞中間截斷，尋找最後一個空格
    const lastSpace = text.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      text = text.substring(0, lastSpace);
    }
    text += '...';
  }
  
  return text;
}

/**
 * 讀取所有文章
 */
async function getAllPosts() {
  const files = await fs.readdir(CONFIG.postsDir);
  const posts = [];
  
  for (const file of files) {
    if (!file.endsWith('.md') || file === 'index.md') continue;
    
    const filePath = path.join(CONFIG.postsDir, file);
    const content = await fs.readFile(filePath, 'utf-8');
    const frontmatter = parseFrontmatter(content);
    
    if (!frontmatter) continue;
    
    const postContent = extractContent(content);
    const slug = file.replace(/\.md$/, '');
    
    posts.push({
      ...frontmatter,
      content: postContent,
      slug,
      url: `${seoConfig.site.url}/${slug}.html`
    });
  }
  
  // 按更新時間排序（最新在前）
  return posts.sort((a, b) => {
    const dateA = new Date(a.updated || a.date);
    const dateB = new Date(b.updated || b.date);
    return dateB - dateA;
  });
}

/**
 * 生成 RSS Feed
 */
async function generateRSSFeed() {
  console.log('🔄 開始生成 RSS Feed...');
  
  const posts = await getAllPosts();
  const latestPosts = posts.slice(0, CONFIG.maxItems);
  
  // 建立 Feed 實例
  const feed = new Feed({
    title: seoConfig.site.name,
    description: seoConfig.site.description,
    id: seoConfig.site.url,
    link: seoConfig.site.url,
    language: seoConfig.site.locale.replace('_', '-'), // zh_TW -> zh-TW
    favicon: `${seoConfig.site.url}/favicon.ico`,
    copyright: `Copyright © ${new Date().getFullYear()} ${seoConfig.site.author.name}`,
    updated: new Date(latestPosts[0]?.updated || latestPosts[0]?.date || new Date()),
    feedLinks: {
      rss2: `${seoConfig.site.url}/rss.xml`,
      atom: `${seoConfig.site.url}/atom.xml`,
      json: `${seoConfig.site.url}/feed.json`
    },
    author: {
      name: seoConfig.site.author.name,
      email: seoConfig.site.author.email,
      link: seoConfig.site.url
    }
  });
  
  // 添加文章
  for (const post of latestPosts) {
    feed.addItem({
      title: post.title,
      id: post.url,
      link: post.url,
      description: convertToPlainText(post.content, 160),
      content: convertToPlainText(post.content, 200),
      author: [
        {
          name: post.author || seoConfig.site.author.name,
          email: seoConfig.site.author.email,
          link: seoConfig.site.url
        }
      ],
      date: new Date(post.updated || post.date),
      category: (post.tags || []).map(tag => ({ name: tag })),
      image: post.image || `${seoConfig.site.url}${seoConfig.seo.defaultOgImage}`
    });
  }
  
  // 輸出 RSS 檔案
  await fs.writeFile(
    path.join(CONFIG.outputDir, 'rss.xml'),
    feed.rss2(),
    'utf-8'
  );
  
  // 輸出 Atom 檔案
  await fs.writeFile(
    path.join(CONFIG.outputDir, 'atom.xml'),
    feed.atom1(),
    'utf-8'
  );
  
  // 輸出 JSON Feed
  await fs.writeFile(
    path.join(CONFIG.outputDir, 'feed.json'),
    feed.json1(),
    'utf-8'
  );
  
  console.log(`✅ RSS Feed 生成完成！`);
  console.log(`   - RSS 2.0: ${seoConfig.site.url}/rss.xml`);
  console.log(`   - Atom 1.0: ${seoConfig.site.url}/atom.xml`);
  console.log(`   - JSON Feed: ${seoConfig.site.url}/feed.json`);
  console.log(`   - 包含文章數: ${latestPosts.length}`);
}

// 執行
generateRSSFeed().catch(error => {
  console.error('❌ RSS Feed 生成失敗:', error);
  process.exit(1);
});
