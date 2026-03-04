# 文章列表功能增強計劃

## 問題陳述
目前文章列表缺少留言數量資訊，且 "blog" label 雖已過濾但需確認。需要改善資訊呈現，讓讀者更容易了解文章的討論熱度。

## 需求

### 1. 留言數量顯示
- 在所有文章列表中增加留言數量資訊
- 格式：`💬 N 則留言`
- **若留言數為 0，則不顯示此資訊**
- 資料來源：sync-log.json 中的 `comments_count` 欄位

### 2. Label 顯示優化
- 過濾掉預設的 "blog" label（所有文章都有，顯示無意義）
- 其他 label 正常顯示
- ✅ 目前程式碼已實作（build-posts.js 359行、443行）

## 影響範圍

### 文章列表位置

1. **首頁 (docs/index.md)** - "最新文章" 區塊
   - 顯示：最新 5 篇
   - 函數：`updateHomePage()` (414-477行)
   - 狀態：✅ 已過濾 Publishing / ❌ 缺留言數

2. **文章列表頁 (docs/posts/index.md)** - 完整清單
   - 顯示：所有文章（依更新時間排序）
   - 函數：`generatePostsList()` (336-381行)
   - 狀態：✅ 已過濾  / ❌ 缺留言數

## 實作任務

### sync-log.json 格式
```json
{
  "issue-N": {
    "comments_count": 2,  // 留言數
    "updated_at": "...",
    "comments_updated_at": "..."
  }
}
```

---

# ~~Node 與依賴套件升級計劃~~ (已完成)

### 升級結果

**Node.js 升級**
- ✅ Node: v20.19.2 → v24.14.0 (Latest LTS: Krypton)
- ✅ npm: 10.8.2 → 11.9.0
- ✅ 建立 .nvmrc 指定 Node 24.14.0

**依賴套件升級**
- ✅ @octokit/rest: 22.0.1（保持最新）
- ✅ sitemap: 8.0.3 → 9.0.1（主要版本升級）
- ✅ terser: 5.46.0（保持最新）
- ✅ vitepress: 1.6.4（保持最新）

**配置與文件更新**
- ✅ GitHub Actions workflow 改用 Node 24
- ✅ README 增加 Node 版本要求說明
- ✅ 備份 package-lock.json.backup

**測試驗證**
- ✅ 本地建置測試成功
- ✅ 開發伺服器測試成功
- ✅ Issue 擷取功能正常
- ✅ 已推送到 GitHub
- ✅ GitHub Actions 已觸發（使用 Node 24）

**任務完成度**: 10/10 ✅

### 已知問題

開發環境依賴漏洞（moderate）：
- esbuild <=0.24.2
- vite 0.11.0 - 6.1.6
- vitepress 0.2.0 - 1.6.4

**評估**: 這些漏洞僅影響開發環境（`npm run blog:dev`），不影響生產環境建置結果。等待 VitePress 官方更新修復。

### 使用說明

```bash
# 使用專案指定的 Node 版本
nvm use

# 安裝依賴
npm install

# 開發
npm run blog:dev

# 建置
npm run build
```

---

# ~~GitHub Issues 轉 VitePress Blog 實作計劃~~ (已完成)

## 專案概述
將 GitHub Issues 轉換為 VitePress 靜態網站，部署至 GitHub Pages。使用者可透過 GitHub Issues 撰寫文章並讓讀者留言討論。

## 技術架構
- **前端框架**: VitePress (Vue 生態，簡約現代)
- **內容來源**: GitHub Issues (label: Publishing, status: closed)
- **部署平台**: GitHub Pages
- **自動化**: GitHub Actions
- **URL 結構**: `https://cscolabear.github.io/{issue_id}`

## 核心需求確認
1. ✅ 使用 VitePress 內建主題（簡約現代風格）
2. ✅ 只轉換有 `blog` label 且狀態為 `closed` 的 issues
3. ✅ 支援 SEO 優化（sitemap、meta tags）
4. ✅ 每日定時建置 + 支援手動觸發
5. ✅ Issue 留言功能透過 GitHub 原生 issue 系統
6. ✅ 保留 issue 編輯時間作為更新時間

## 實作待辦清單

### Phase 1: 專案初始化
- **init-vitepress**: 初始化 VitePress 專案
  - 清理現有檔案（保留 .git）
  - 安裝 VitePress 及相關依賴
  - 設定基本的 VitePress 配置
  - 配置 base path 為 `/`

- **config-github**: 配置 GitHub 相關設定
  - 設定 GitHub Pages 發佈來源（gh-pages 分支）
  - 確認 repository 設定正確

### Phase 2: Issue 轉換系統
- **fetch-issues-script**: 建立 Issue 擷取腳本
  - 使用 GitHub API 獲取 issues（篩選 label:blog, state:closed）
  - 處理分頁（確保獲取所有符合條件的 issues）
  - 儲存 issue 元數據（id, title, body, created_at, updated_at）

- **markdown-converter**: Issue 轉 Markdown 轉換器
  - 將 issue body 轉換為 VitePress markdown 格式
  - 添加 frontmatter（title, date, updated, description）
  - 處理圖片連結（確保相對路徑正確）
  - 儲存至 `docs/posts/{issue_id}.md`
  - **詳細轉換流程說明**：
    1. **取得 Issue 內容**: 透過 GitHub API 取得 issue.body（原始 Markdown）
    2. **Markdown 預處理**:
       - 檢查並修正圖片路徑（GitHub 上傳的圖片使用 `https://user-images.githubusercontent.com/...`）
       - 處理程式碼區塊（保留語法高亮標記）
       - 轉換 GitHub 特殊語法（如 @mention、#issue 連結）
    3. **生成 Frontmatter**:
       ```yaml
       ---
       title: "從 issue.title 取得"
       date: "從 issue.created_at 格式化為 YYYY-MM-DD"
       updated: "從 issue.updated_at 格式化為 YYYY-MM-DD"
       description: "從 issue.body 前 150 字元擷取作為摘要"
       issueId: issue.number
       githubUrl: "https://github.com/cscolabear/cscolabear.github.io/issues/{issue.number}"
       labels: ["從 issue.labels 取得標籤陣列"]
       ---
       ```
    4. **Markdown 轉 HTML 過程**（VitePress 建置階段）:
       - VitePress 使用 **markdown-it** 作為 Markdown 解析器
       - 支援 **GitHub Flavored Markdown (GFM)** 語法
       - 程式碼區塊使用 **Shiki** 進行語法高亮
       - 自動生成目錄（Table of Contents）
       - 支援 Vue 元件嵌入（可在 Markdown 中使用 Vue）
    5. **HTML 輸出最佳化**:
       - 自動添加錨點連結到標題
       - 圖片 lazy loading
       - 程式碼區塊複製按鈕
       - 連結外部網站自動添加 `target="_blank"`
    6. **元數據注入 HTML**:
       - Open Graph meta tags（社群分享預覽）
       - Twitter Card meta tags
       - Canonical URL
       - 結構化資料（JSON-LD for SEO）

- **post-list-generator**: 文章列表頁面生成器
  - 建立文章索引（依更新時間排序）
  - 生成首頁文章列表
  - 顯示標題、日期、摘要
  - **列表頁面 HTML 生成**:
    1. 讀取所有 `docs/posts/*.md` 檔案的 frontmatter
    2. 排序文章（依 updated 時間降序）
    3. 生成動態列表組件（使用 Vue）
    4. 建置時產生靜態 HTML（SSG - Static Site Generation）

### Phase 3: VitePress 配置與優化
- **vitepress-config**: VitePress 進階配置
  - 設定網站 meta 資訊（title, description）
  - 配置導航選單（首頁、文章列表、關於）
  - 設定主題顏色與樣式變數

- **seo-optimization**: SEO 優化設定
  - 安裝並配置 sitemap 插件
  - 添加 meta tags（og:image, twitter:card）
  - 設定 robots.txt
  - 配置 Google Analytics（可選）

- **custom-layout**: 自定義頁面佈局
  - 建立文章頁面模板（顯示更新時間）
  - 添加「在 GitHub 討論」連結（指向原 issue）
  - 顯示文章元數據

### Phase 4: GitHub Actions 自動化
- **build-workflow**: 建置與部署 Workflow
  - 觸發條件：每日定時（cron）+ 手動觸發（workflow_dispatch）
  - 步驟 1: Checkout repository
  - 步驟 2: 設定 Node.js 環境
  - 步驟 3: 安裝依賴
  - 步驟 4: 執行 issue 擷取與轉換腳本
  - 步驟 5: 建置 VitePress
  - 步驟 6: 部署至 gh-pages 分支

- **issue-sync-workflow**: Issue 同步檢查機制
  - 比對 issue updated_at 與已轉換內容的時間戳
  - 只更新有變更的文章
  - 記錄轉換日誌

### Phase 5: 測試與部署
- **local-testing**: 本地測試
  - 測試 issue 擷取腳本
  - 測試 markdown 轉換功能
  - 本地預覽網站（`npm run dev`）
  - 驗證文章列表與內容顯示

- **deploy-test**: 部署測試
  - 建立測試 issue（label: Publishing, closed）
  - 手動觸發 GitHub Actions
  - 驗證部署結果
  - 測試自定義 domain（如需要）

- **documentation**: 建立使用文件
  - README.md（專案說明、使用方式）
  - 撰寫發佈文章流程（如何建立 issue、添加 label）
  - Workflow 說明文件

## 技術細節

### Issue 擷取 API
```javascript
// 使用 Octokit 擷取 issues
const issues = await octokit.rest.issues.listForRepo({
  owner: 'cscolabear',
  repo: 'cscolabear.github.io',
  state: 'closed',
  labels: 'blog',
  sort: 'updated',
  direction: 'desc',
  per_page: 100
});
```

### Markdown 到 HTML 的完整轉換流程

#### 1. Issue Markdown 原始格式（GitHub Issue Body）
```markdown
# 我的第一篇文章

這是一段介紹文字，包含**粗體**和*斜體*。

## 程式碼範例

​```javascript
function hello() {
  console.log('Hello World');
}
​```

## 圖片展示
![示意圖](https://user-images.githubusercontent.com/123456/image.png)

- 列表項目 1
- 列表項目 2
```

#### 2. 轉換後的 VitePress Markdown（docs/posts/1.md）
```markdown
---
title: "我的第一篇文章"
date: 2026-03-01
updated: 2026-03-01
description: "這是一段介紹文字，包含粗體和斜體。"
issueId: 1
githubUrl: "https://github.com/cscolabear/cscolabear.github.io/issues/1"
labels: ["blog", "技術"]
---

# 我的第一篇文章

這是一段介紹文字，包含**粗體**和*斜體*。

## 程式碼範例

​```javascript
function hello() {
  console.log('Hello World');
}
​```

## 圖片展示
![示意圖](https://user-images.githubusercontent.com/123456/image.png)

- 列表項目 1
- 列表項目 2

---

<ClientOnly>
  <GithubDiscussion :issue-url="$frontmatter.githubUrl" />
</ClientOnly>
```

#### 3. VitePress 建置時的 HTML 轉換

**使用的解析器與工具**：
- **markdown-it**: Markdown 轉 HTML 核心引擎
- **markdown-it-anchor**: 自動生成標題錨點
- **markdown-it-attrs**: 支援屬性擴展
- **Shiki**: 程式碼語法高亮（支援 100+ 語言）
- **Vue 3**: 動態元件渲染

**轉換過程**：
```
Issue Markdown
    ↓ (GitHub API 擷取)
VitePress Markdown (含 frontmatter)
    ↓ (markdown-it 解析)
AST (Abstract Syntax Tree)
    ↓ (Shiki 語法高亮 + Vue 元件處理)
HTML + CSS + JS
    ↓ (Vite 打包優化)
最終靜態 HTML 檔案
```

#### 4. 最終輸出的 HTML 結構（簡化版）
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的第一篇文章 | Cola's Blog</title>

  <!-- SEO Meta Tags -->
  <meta name="description" content="這是一段介紹文字，包含粗體和斜體。">
  <link rel="canonical" href="https://cscolabear.github.io/posts/1">

  <!-- Open Graph (社群分享) -->
  <meta property="og:title" content="我的第一篇文章">
  <meta property="og:description" content="這是一段介紹文字...">
  <meta property="og:url" content="https://cscolabear.github.io/posts/1">
  <meta property="og:type" content="article">
  <meta property="article:published_time" content="2026-03-01T00:00:00Z">
  <meta property="article:modified_time" content="2026-03-01T00:00:00Z">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="我的第一篇文章">

  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "我的第一篇文章",
    "datePublished": "2026-03-01",
    "dateModified": "2026-03-01",
    "author": {
      "@type": "Person",
      "name": "Cola"
    }
  }
  </script>

  <!-- VitePress 樣式與腳本 -->
  <link rel="stylesheet" href="/assets/style.css">
</head>
<body>
  <div id="app">
    <div class="VPDoc">
      <div class="container">
        <div class="content">
          <article class="vp-doc">
            <!-- 文章元數據 -->
            <div class="post-meta">
              <time datetime="2026-03-01">發布於 2026-03-01</time>
              <time datetime="2026-03-01">更新於 2026-03-01</time>
            </div>

            <!-- Markdown 轉換後的 HTML -->
            <h1 id="我的第一篇文章">
              我的第一篇文章
              <a class="header-anchor" href="#我的第一篇文章" aria-label="Permalink to &quot;我的第一篇文章&quot;">​</a>
            </h1>

            <p>這是一段介紹文字，包含<strong>粗體</strong>和<em>斜體</em>。</p>

            <h2 id="程式碼範例">
              程式碼範例
              <a class="header-anchor" href="#程式碼範例">​</a>
            </h2>

            <div class="language-javascript vp-adaptive-theme">
              <button class="copy"></button>
              <span class="lang">javascript</span>
              <pre class="shiki" style="background-color:#1e1e1e"><code>
                <span class="line"><span style="color:#DCDCAA">function</span><span style="color:#D4D4D4"> </span><span style="color:#DCDCAA">hello</span><span style="color:#D4D4D4">() {</span></span>
                <span class="line"><span style="color:#D4D4D4">  console.</span><span style="color:#DCDCAA">log</span><span style="color:#D4D4D4">(</span><span style="color:#CE9178">'Hello World'</span><span style="color:#D4D4D4">);</span></span>
                <span class="line"><span style="color:#D4D4D4">}</span></span>
              </code></pre>
            </div>

            <h2 id="圖片展示">圖片展示</h2>
            <p><img src="https://user-images.githubusercontent.com/123456/image.png" alt="示意圖" loading="lazy"></p>

            <ul>
              <li>列表項目 1</li>
              <li>列表項目 2</li>
            </ul>

            <hr>

            <!-- GitHub 討論連結元件 -->
            <div class="github-discussion">
              <a href="https://github.com/cscolabear/cscolabear.github.io/issues/1"
                 target="_blank"
                 rel="noopener noreferrer">
                💬 在 GitHub 上討論這篇文章
              </a>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>

  <script type="module" src="/assets/app.js"></script>
</body>
</html>
```

#### 5. HTML 優化特性

**效能優化**：
- 圖片 lazy loading（延遲載入）
- CSS 關鍵路徑優化（Critical CSS）
- JavaScript 程式碼分割（Code Splitting）
- 預載入關鍵資源（Preload）
- Gzip / Brotli 壓縮

**互動性增強**：
- 程式碼區塊一鍵複製
- 平滑錨點滾動
- 深色/淺色模式切換
- 目錄導航（Table of Contents）
- 返回頂部按鈕

**SEO 最佳化**：
- 語意化 HTML5 標籤（article, section, time）
- Meta description 自動截取
- Canonical URL 避免重複內容
- Sitemap.xml 自動生成
- robots.txt 設定爬蟲規則
- 結構化資料（Schema.org）支援 Google Rich Results

### Markdown Frontmatter 格式
```yaml
---
title: "文章標題"
date: 2026-03-01
updated: 2026-03-01
description: "文章摘要"
issueId: 1
githubUrl: "https://github.com/cscolabear/cscolabear.github.io/issues/1"
---
```

### URL 重寫策略
- VitePress 檔案路徑: `docs/posts/{issue_id}.md`
- 產生的 URL: `https://cscolabear.github.io/posts/{issue_id}`
- 可透過 VitePress 的 rewrites 功能調整為 `/{issue_id}`

## 預期檔案結構
```
cscolabear.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # 部署 workflow
├── docs/
│   ├── .vitepress/
│   │   ├── config.js          # VitePress 配置
│   │   ├── theme/
│   │   │   ├── index.js       # 自定義主題進入點
│   │   │   ├── components/
│   │   │   │   ├── GithubDiscussion.vue  # GitHub 討論連結元件
│   │   │   │   └── PostList.vue          # 文章列表元件
│   │   │   └── styles/
│   │   │       └── custom.css # 自定義樣式
│   │   └── dist/              # 建置輸出目錄（HTML/CSS/JS）
│   ├── posts/
│   │   ├── 1.md              # Issue #1 轉換的文章
│   │   ├── 2.md              # Issue #2 轉換的文章
│   │   └── ...
│   ├── public/               # 靜態資源
│   │   ├── CNAME            # 自定義 domain 設定
│   │   ├── favicon.ico      # 網站圖示
│   │   └── robots.txt       # 爬蟲規則
│   ├── index.md              # 首頁（文章列表）
│   └── about.md              # 關於頁面
├── scripts/
│   ├── fetch-issues.js       # Issue 擷取腳本
│   ├── convert-to-markdown.js # Markdown 轉換腳本
│   ├── build-posts.js        # 文章建置腳本（整合）
│   └── generate-sitemap.js   # Sitemap 生成腳本
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

### 建置後的輸出結構（docs/.vitepress/dist/）
```
dist/
├── index.html                # 首頁
├── about.html                # 關於頁面
├── posts/
│   ├── 1.html               # 文章 #1 的 HTML
│   ├── 2.html               # 文章 #2 的 HTML
│   └── ...
├── assets/
│   ├── app.{hash}.js        # 主應用程式 JS
│   ├── style.{hash}.css     # 主樣式檔
│   ├── chunks/              # 程式碼分割區塊
│   └── ...
├── sitemap.xml              # SEO sitemap
├── robots.txt               # 爬蟲規則
└── CNAME                    # 自定義 domain
```

## 注意事項與限制
1. **GitHub API 限制**: 未認證每小時 60 次，認證後 5000 次（需使用 GITHUB_TOKEN）
2. **Issue 更新延遲**: 定時建置每日執行一次，若需即時更新需手動觸發
3. **圖片處理**: Issue 中的圖片使用 GitHub CDN，確保連結有效
4. **留言功能**: 讀者需前往 GitHub issue 頁面留言（非即時顯示在網站上）
5. **自定義 Domain**: 需在 repository settings 中設定，並在 docs/public 添加 CNAME 檔案

## 後續優化建議
- [ ] 添加標籤分類系統（依 issue labels）
- [ ] 實作全文搜尋功能（VitePress 內建）
- [ ] 支援草稿功能（open 狀態的 issue）
- [ ] 添加 RSS feed
- [ ] 整合評論系統（Giscus - 使用 GitHub Discussions）
- [ ] 支援深色模式（VitePress 內建）
- [ ] 添加閱讀時間估算
- [ ] 社群分享按鈕

## 時程安排
依照 todos 順序執行，預計分階段完成：
- Phase 1-2: 核心功能（專案初始化、Issue 轉換）
- Phase 3: 優化與美化（SEO、自定義佈局）
- Phase 4: 自動化（GitHub Actions）
- Phase 5: 測試與上線

---

**計劃建立時間**: 2026-03-01
**目標**: 建立一個以 GitHub Issues 為內容管理系統的個人 Blog，透過 VitePress 提供優質閱讀體驗
