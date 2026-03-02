# GitHub Actions Workflow 說明

## 觸發條件

本 Blog 使用以下三種方式觸發自動建置與部署：

### 1. 每日定時建置
- **時間**: 每天 UTC 00:00（台灣時間 08:00）
- **用途**: 自動同步最新的 Issues 內容
- **適合**: 定期更新，節省 Actions 使用額度

### 2. 手動觸發
- **位置**: GitHub Repository → Actions → "建置並部署至 GitHub Pages" → Run workflow
- **用途**: 立即部署最新文章
- **適合**: 發佈文章後想要立即看到結果

### 3. Push 到 main 分支
- **觸發時機**: 當程式碼有變更並 push 到 main 分支時
- **用途**: 自動部署最新的程式碼變更
- **適合**: 開發階段測試

## 工作流程

```
1. Checkout repository
   ↓
2. 設定 Node.js 20 環境
   ↓
3. 安裝 npm 依賴
   ↓
4. 擷取 GitHub Issues（label: Publishing, state: closed）
   ↓
5. 轉換為 Markdown 文章 (docs/posts/*.md)
   ↓
6. 建置 VitePress 靜態網站 (docs/.vitepress/dist)
   ↓
7. 部署至 gh-pages 分支
   ↓
8. GitHub Pages 自動發佈網站
```

## 權限說明

Workflow 需要以下權限：
- `contents: write` - 寫入 gh-pages 分支
- `pages: write` - 部署至 GitHub Pages
- `id-token: write` - 身份驗證

這些權限已在 workflow 檔案中設定，使用 `GITHUB_TOKEN` 自動授權。

## 如何手動觸發

1. 前往 https://github.com/cscolabear/cscolabear.github.io/actions
2. 點選左側 "建置並部署至 GitHub Pages"
3. 點選右上角 "Run workflow" 按鈕
4. 選擇 `main` 分支
5. 點選綠色的 "Run workflow" 按鈕

## 查看執行結果

在 Actions 頁面可以看到：
- ✅ 成功的建置（綠色勾勾）
- ❌ 失敗的建置（紅色叉叉）
- ⏳ 正在執行的建置（黃色圓圈）

點進去可以查看詳細的執行日誌。

## 疑難排解

### 問題：Actions 執行失敗
- 檢查 Actions 日誌，查看錯誤訊息
- 確認 repository 的 Settings → Actions → General → Workflow permissions 設定為 "Read and write permissions"

### 問題：網站沒有更新
- 確認 gh-pages 分支已經更新
- 等待 1-2 分鐘，GitHub Pages 需要一些時間部署
- 檢查 Settings → Pages 設定是否正確（Source: Deploy from a branch, Branch: gh-pages）

### 問題：沒有擷取到 Issues
- 確認 Issues 有添加 `blog` label
- 確認 Issues 狀態為 `closed`
- 檢查 Actions 日誌中的擷取結果
