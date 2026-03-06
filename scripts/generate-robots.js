#!/usr/bin/env node

/**
 * 生成 robots.txt
 * 
 * 從 SEO 配置檔讀取域名，生成正確的 robots.txt
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 載入 SEO 配置檔
const seoConfigPath = path.join(__dirname, '../seo.config.js');
const seoConfig = (await import(seoConfigPath)).default;

const robotsTxtPath = path.join(__dirname, '../pages/public/robots.txt');

const robotsContent = `# https://www.robotstxt.org/robotstxt.html
# WorkxPlay 個人技術 Blog - robots.txt

# 允許所有主要搜尋引擎爬蟲
User-agent: *
Allow: /
Disallow: /api/
Disallow: /.vitepress/
Crawl-delay: 1

# Google 爬蟲（優先）
User-agent: Googlebot
Allow: /
Disallow: /api/
Crawl-delay: 0

# Google 圖片爬蟲
User-agent: Googlebot-Image
Allow: /

# Bing 爬蟲
User-agent: Bingbot
Allow: /
Crawl-delay: 1

# 禁止惡意爬蟲
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

# Sitemap 位置
Sitemap: ${seoConfig.site.url}/sitemap.xml
Sitemap: ${seoConfig.site.url}/rss.xml
`;

try {
  await fs.writeFile(robotsTxtPath, robotsContent, 'utf-8');
  console.log('✅ robots.txt 已生成');
  console.log(`   Sitemap URL: ${seoConfig.site.url}/sitemap.xml`);
} catch (error) {
  console.error('❌ 生成 robots.txt 失敗:', error.message);
  process.exit(1);
}
