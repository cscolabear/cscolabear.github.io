# SEO 優化說明

本 Blog 已實作以下 SEO 優化功能：

## ✅ 已實作功能

### 1. Meta Tags
- ✅ Title 和 Description
- ✅ Open Graph tags（社群分享預覽）
- ✅ Twitter Card
- ✅ Theme Color（移動裝置）
- ✅ Viewport（響應式設計）

### 2. Sitemap
- ✅ 自動生成 sitemap.xml
- ✅ 提交給搜尋引擎（透過 robots.txt）

### 3. Robots.txt
- ✅ 允許所有爬蟲索引
- ✅ 指定 sitemap 位置

### 4. URL 結構
- ✅ 清理 URL（移除 .html 後綴）
- ✅ 語意化 URL（/{slug}，例如：/whats-seo）
- ✅ 支援自訂 URL slug

### 5. 內容優化
- ✅ 語意化 HTML5 標籤
- ✅ 標題錨點（方便分享特定段落）
- ✅ 圖片 lazy loading
- ✅ 最後更新時間顯示

### 6. 效能優化
- ✅ 移除生產環境 console
- ✅ JavaScript 壓縮優化
- ✅ CSS 最佳化

## 📋 選用功能

### Google Search Console
如需使用 Google Search Console，請：
1. 前往 https://search.google.com/search-console
2. 添加網站並驗證
3. 取得驗證碼
4. 在 `blog/.vitepress/config.js` 中取消註解並填入驗證碼：
   ```javascript
   ['meta', { name: 'google-site-verification', content: 'your-verification-code' }],
   ```

### Google Analytics
如需添加 Google Analytics：
1. 建立 GA4 測量 ID
2. 在 `blog/.vitepress/config.js` 的 `head` 中添加：
   ```javascript
   ['script', { async: true, src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX' }],
   ['script', {}, `
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   `]
   ```

### 自訂 OG Image
建議建立 1200x630 的 og-image.png 並放在 `blog/public/` 目錄。

## 🔍 檢查工具

使用以下工具檢查 SEO 效果：
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [PageSpeed Insights](https://pagespeed.web.dev/)

## 📊 監控指標

建議追蹤以下指標：
- Google Search Console 中的曝光次數和點擊率
- Core Web Vitals（LCP, FID, CLS）
- 頁面載入速度
- 行動裝置友善度

## 💡 最佳實踐

1. **文章標題**: 使用清晰、描述性的標題（60 字元以內）
2. **文章描述**: 前 150 字元會自動作為摘要，請確保開頭吸引人
3. **圖片**: 使用描述性的 alt 文字
4. **連結**: 使用有意義的錨文字（避免「點擊這裡」）
5. **更新頻率**: 定期更新內容，保持新鮮度
