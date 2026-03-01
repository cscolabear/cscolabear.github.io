# GitHub Issues 轉 VitePress Blog 專案初始化

**編號**：000  
**建立日期**：2026-03-01  
**狀態**：✅ 已完成  
**完成日期**：2026-03-01

## 📋 專案概述

將 GitHub Issues 轉換為 VitePress 靜態網站，部署至 GitHub Pages。使用者可透過 GitHub Issues 撰寫文章並讓讀者留言討論。

## 🎯 核心需求

1. ✅ 使用 VitePress 內建主題（簡約現代風格）
2. ✅ 只轉換有 `blog` label 且狀態為 `closed` 的 issues
3. ✅ 支援 SEO 優化（sitemap、meta tags）
4. ✅ 每日定時建置 + 支援手動觸發
5. ✅ Issue 留言功能透過 GitHub 原生 issue 系統
6. ✅ 保留 issue 編輯時間作為更新時間

## 🏗️ 技術架構

- **前端框架**：VitePress (Vue 生態，簡約現代)
- **內容來源**：GitHub Issues (label: blog, status: closed)
- **部署平台**：GitHub Pages
- **自動化**：GitHub Actions
- **URL 結構**：`https://cscolabear.github.io/posts/{issue_id}`

## 📁 檔案結構

```
cscolabear.github.io/
├── .github/workflows/
│   └── deploy.yml              # 部署 workflow
├── docs/
│   ├── .vitepress/
│   │   ├── config.js           # VitePress 配置
│   │   ├── theme/              # 自定義主題
│   │   └── sync-log.json       # 同步日誌
│   ├── posts/
│   │   ├── 1.md               # 文章（從 Issue 轉換）
│   │   ├── 2.md
│   │   └── index.md           # 文章列表
│   ├── index.md               # 首頁
│   └── about.md               # 關於頁面
├── scripts/
│   └── build-posts.js         # Issue 轉換腳本
├── planning/                  # 開發計劃與記錄
└── package.json
```

## 🔄 Markdown 轉換流程

### 1. Issue Markdown → VitePress Markdown

**Issue 原始內容**（GitHub API 取得）：
```markdown
# 我的第一篇文章
這是內容...
```

**轉換後的 VitePress Markdown**（docs/posts/1.md）：
```markdown
---
title: "我的第一篇文章"
date: 2026-03-01
updated: 2026-03-01
description: "這是內容..."
issueId: 1
githubUrl: "https://github.com/..."
labels: ["blog", "技術"]
---

# 我的第一篇文章
這是內容...

---
💬 [在 GitHub 上討論這篇文章](https://github.com/...)
```

### 2. VitePress 建置流程

```
Issue Markdown (GitHub API)
    ↓
VitePress Markdown (含 frontmatter)
    ↓ (markdown-it 解析)
AST (Abstract Syntax Tree)
    ↓ (Shiki 語法高亮 + Vue 處理)
HTML + CSS + JS
    ↓ (Vite 打包優化)
靜態 HTML 檔案（部署到 GitHub Pages）
```

## 🚀 GitHub Actions 自動化

### 觸發條件
- 每日定時（cron）
- 手動觸發（workflow_dispatch）
- Push 到 main 分支

### 建置流程
1. Checkout repository
2. 設定 Node.js 環境（Node 24）
3. 安裝依賴
4. 執行 `node scripts/build-posts.js`
5. 建置 VitePress
6. 部署至 gh-pages 分支

## 🔧 核心腳本：build-posts.js

### 主要功能

1. **fetchIssues()**
   - 使用 Octokit API 擷取 issues
   - 篩選條件：label=blog, state=closed
   - 支援分頁（per_page=100）

2. **convertIssueToMarkdown()**
   - 轉換 issue 內容為 VitePress markdown
   - 生成 frontmatter
   - 添加 GitHub 討論連結

3. **generatePostsList()**
   - 生成文章列表頁面（docs/posts/index.md）
   - 依更新時間排序

4. **needsUpdate()**
   - 比對 issue updated_at 與 sync-log
   - 增量更新（只更新有變更的文章）

5. **readSyncLog() / writeSyncLog()**
   - 記錄同步狀態
   - 格式：`{ "issue-N": { title, updated_at, synced_at } }`

## 📊 SEO 優化

### Meta Tags
- Open Graph (社群分享預覽)
- Twitter Card
- Canonical URL
- Description（自動截取）

### 其他優化
- Sitemap.xml（自動生成）
- 語意化 HTML5 標籤
- 結構化資料（JSON-LD）

## 🎨 VitePress 配置

### 主題特性
- 內建深色/淺色模式
- 響應式設計
- 程式碼區塊複製按鈕
- 平滑錨點滾動
- 目錄導航（TOC）

### 自定義樣式
- `docs/.vitepress/theme/styles/custom.css`
- 使用 CSS 變數實現主題一致性

## 🔗 相關計劃

後續功能實作計劃：
- [001-node-upgrade.md](001-node-upgrade.md) - Node.js 24 升級
- [002-homepage-article-list.md](002-homepage-article-list.md) - 首頁文章列表
- [003-issue-comments-integration.md](003-issue-comments-integration.md) - Issue 留言整合
- [004-comments-newline-fix.md](004-comments-newline-fix.md) - 留言換行修復
- [005-article-list-enhancement.md](005-article-list-enhancement.md) - 文章列表增強

## 📝 注意事項

1. **GitHub API 限制**
   - 未認證：60 requests/hour
   - 認證後：5000 requests/hour
   - 使用 GITHUB_TOKEN 環境變數

2. **Issue 更新延遲**
   - 定時建置每日一次
   - 需即時更新可手動觸發 workflow

3. **圖片處理**
   - Issue 中的圖片使用 GitHub CDN
   - 連結格式：`https://user-images.githubusercontent.com/...`

4. **留言功能**
   - 讀者需前往 GitHub issue 留言
   - 留言不會即時顯示在網站（需等待下次建置）

## ✅ 完成確認

- [x] VitePress 專案初始化
- [x] Issue 轉換腳本完成
- [x] GitHub Actions 設定完成
- [x] 首次部署成功
- [x] 測試文章顯示正常
- [x] SEO 優化完成

## 📚 詳細技術文件

完整的技術細節和 Markdown 轉換流程，請參考：
- `planning/archive/full-plan-original.md` - 原始完整計劃文件
- 包含詳細的 HTML 轉換範例和 VitePress 建置流程

---

**實作者**：Cola + GitHub Copilot CLI  
**專案網址**：https://cscolabear.github.io
