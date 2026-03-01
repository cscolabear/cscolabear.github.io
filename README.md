# Cola's Blog

基於 GitHub Issues 和 VitePress 的個人技術 Blog。

## 🚀 特色

- ✅ 使用 **GitHub Issues** 作為內容管理系統
- ✅ 基於 **VitePress** 建置，簡約現代的閱讀體驗
- ✅ **GitHub Actions** 自動同步與部署
- ✅ 支援 **SEO 優化**（sitemap、meta tags）
- ✅ 讀者可透過 GitHub Issues 留言討論

## 📝 如何發佈文章

1. 在此 repository 建立新的 Issue
2. 使用 Markdown 格式撰寫內容
3. 添加 `blog` label
4. 完成後將 Issue 設為 `closed` 狀態
5. GitHub Actions 會自動將文章同步到網站

## 🛠️ 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run docs:dev

# 擷取 Issues 並轉換為文章
npm run fetch:issues

# 建置靜態網站
npm run build

# 預覽建置結果
npm run docs:preview
```

## 🏗️ 技術架構

- **前端框架**: VitePress (Vue 生態)
- **內容來源**: GitHub Issues API
- **部署平台**: GitHub Pages
- **自動化**: GitHub Actions
- **程式語言**: JavaScript (Node.js)

## 📁 專案結構

```
├── docs/                    # VitePress 文檔目錄
│   ├── .vitepress/         # VitePress 配置
│   │   ├── config.js       # 主配置檔
│   │   └── theme/          # 自定義主題
│   ├── posts/              # 文章目錄（自動生成）
│   └── public/             # 靜態資源
├── scripts/                # 建置腳本
│   └── build-posts.js      # Issue 轉換腳本
└── .github/workflows/      # GitHub Actions
```

## 📄 License

MIT License
