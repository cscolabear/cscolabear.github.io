# Cola's Blog

基於 GitHub Issues 和 VitePress 的個人技術 Blog。

## 🚀 特色

- ✅ 使用 **GitHub Issues** 作為內容管理系統
- ✅ 基於 **VitePress** 建置，簡約現代的閱讀體驗
- ✅ **GitHub Actions** 自動同步與部署
- ✅ **增量更新機制**，只同步有變更的文章
- ✅ **留言自動同步**，Issue 留言整合至文章頁面
- ✅ 支援 **SEO 優化**（sitemap、meta tags、Open Graph）
- ✅ 讀者可透過 GitHub Issues 留言討論
- ✅ 完整的**繁體中文介面**

## 🌐 線上網站

訪問：https://cola.workxplay.net （或 https://cscolabear.github.io）

## 📝 如何發佈文章

1. 在此 repository [建立新的 Issue](https://github.com/cscolabear/cscolabear.github.io/issues/new)
2. 使用 Markdown 格式撰寫內容
3. 添加 `Publishing` label
4. 完成後將 Issue 設為 `closed` 狀態
5. GitHub Actions 會自動將文章同步到網站（每日 08:00 或手動觸發）

詳細說明請參考：[使用說明](./usage-guide.md)

## 💬 留言功能

- 讀者可在 GitHub Issue 下方留言討論
- 系統會**自動同步最新 10 則留言**到文章頁面
- 留言包含：留言者名稱、更新時間、完整內容
- 支援 Markdown 格式，可插入程式碼、圖片等

## 🛠️ 本地開發

**環境需求**
- Node.js 24.x (建議使用 [NVM](https://github.com/nvm-sh/nvm) 管理版本)
- npm 11.x（隨 Node.js 24 自動安裝）

```bash
# 使用 NVM 安裝並切換 Node 版本
nvm install 24
nvm use 24

# 或直接使用專案的 .nvmrc
nvm use

# 安裝依賴
npm install

# 啟動開發伺服器
npm run docs:dev

# 擷取 Issues 並轉換為文章（包含留言）
npm run fetch:issues

# 完整建置（擷取 + 建置）
npm run build

# 預覽建置結果
npm run docs:preview
```

## 🏗️ 技術架構

- **前端框架**: VitePress 1.6+ (Vue 3 + Vite)
- **內容來源**: GitHub Issues API (Octokit)
- **部署平台**: GitHub Pages
- **自動化**: GitHub Actions (每日定時 + 手動觸發)
- **程式語言**: JavaScript (Node.js 24+)
- **樣式**: 內建主題 + 自訂 CSS
- **環境管理**: NVM (.nvmrc)

## 📁 專案結構

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # 自動部署 workflow
├── blog/                       # VitePress 文檔目錄
│   ├── .vitepress/
│   │   ├── config.js          # VitePress 配置
│   │   ├── sync-log.json      # 同步日誌（記錄文章與留言更新時間）
│   │   └── theme/             # 自訂主題
│   │       ├── index.js       # 主題進入點
│   │       └── styles/        # 自訂樣式
│   ├── posts/                 # 文章目錄（自動生成）
│   │   ├── *.md              # Issue 轉換的文章
│   │   └── index.md          # 文章列表
│   ├── public/                # 靜態資源
│   │   ├── robots.txt        # SEO 設定
│   │   └── favicon.ico       # 網站圖示
│   ├── index.md              # 首頁
│   ├── about.md              # 關於頁面
│   ├── usage-guide.md        # 使用說明
│   ├── workflow-guide.md     # Workflow 說明
│   └── seo-guide.md          # SEO 指南
├── planning/                  # 開發計劃與記錄（詳見下方說明）
│   ├── README.md             # 計劃文件系統說明
│   ├── 000-*.md              # 各階段開發計劃
│   └── archive/              # 歷史文件
├── scripts/
│   └── build-posts.js        # Issue 轉換腳本
├── package.json              # 專案配置
└── README.md                 # 本文件
```

### 📋 開發計劃文件 (`planning/`)

`planning/` 資料夾存放專案的開發計劃、執行記錄與技術決策文件：

- **目的**：記錄開發歷程、提供上下文資訊、協助 AI 助手理解專案
- **內容**：問題陳述、需求分析、技術方案、實作記錄、測試驗證
- **命名**：`{編號}-{功能描述}.md`（如 `001-node-upgrade.md`）
- **狀態**：✅ 已完成、🚧 進行中、⏸️ 暫停、❌ 已取消

**現有計劃文件**：
- 000-initial-setup.md - 專案初始化與技術架構
- 001-node-upgrade.md - Node.js 24 升級記錄
- 002-homepage-article-list.md - 首頁文章列表實作
- 003-issue-comments-integration.md - Issue 留言整合功能
- 004-comments-newline-fix.md - 留言換行格式修復
- 005-article-list-enhancement.md - 文章列表功能增強

詳細說明請參考：[planning/README.md](./planning/README.md)

## ✨ 主要功能

### 增量更新機制
- 自動比對 Issue 更新時間
- 只轉換有變更的文章
- 智慧清理已刪除的文章

### SEO 優化
- 自動生成 sitemap.xml
- Open Graph & Twitter Card 支援
- 清理 URL（無 .html 後綴）
- 結構化資料標記

### 自動部署
- 每日定時建置（台灣時間 08:00）
- 支援手動觸發
- Push to main 時自動部署
- 完整的建置日誌

## 📚 文件

- [使用說明](./usage-guide.md) - 如何發佈和管理文章
- [Workflow 說明](./workflow-guide.md) - GitHub Actions 使用指南
- [SEO 指南](./seo-guide.md) - SEO 優化設定

## 🔧 配置說明

### 修改網站資訊

編輯 `blog/.vitepress/config.js`：

```javascript
export default defineConfig({
  title: "您的 Blog 標題",
  description: "您的 Blog 描述",
  // ...
})
```

### 自訂網域

1. 在 `blog/public/` 建立 `CNAME` 檔案
2. 內容填入您的網域名稱（如 `blog.example.com`）
3. 在網域 DNS 設定中添加 CNAME 記錄指向 `<username>.github.io`

### 修改配色

編輯 `blog/.vitepress/theme/styles/custom.css`：

```css
:root {
  --vp-c-brand: #your-color;
  /* ... */
}
```

## 🚦 部署狀態

[![部署狀態](https://github.com/cscolabear/cscolabear.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/cscolabear/cscolabear.github.io/actions/workflows/deploy.yml)

## 📄 License

MIT License

## 🙏 致謝

- [VitePress](https://vitepress.dev/) - 強大的靜態網站產生器
- [GitHub Pages](https://pages.github.com/) - 免費的網站託管服務
- [Octokit](https://github.com/octokit/octokit.js) - GitHub API 客戶端

