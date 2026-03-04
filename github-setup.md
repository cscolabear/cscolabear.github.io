# GitHub 設定指南

本文件說明如何配置 GitHub Repository 和 GitHub Pages。

## ⚙️ Repository 設定

### 1. Actions 權限設定

確保 GitHub Actions 有足夠的權限來部署：

1. 前往 Repository → **Settings** → **Actions** → **General**
2. 找到 **Workflow permissions** 區段
3. 選擇 **Read and write permissions**
4. 勾選 **Allow GitHub Actions to create and approve pull requests**（可選）
5. 點選 **Save**

### 2. GitHub Pages 設定

配置 GitHub Pages 發佈來源：

1. 前往 Repository → **Settings** → **Pages**
2. 在 **Source** 區段：
   - Source: 選擇 **Deploy from a branch**
   - Branch: 選擇 **gh-pages** 分支和 **/ (root)** 目錄
   - 點選 **Save**

> **注意**: 首次部署時，`gh-pages` 分支會由 GitHub Actions 自動建立

### 3. 自訂網域（可選）

如果您想使用自訂網域：

1. 在 **Custom domain** 欄位輸入您的網域（如 `blog.example.com`）
2. 點選 **Save**
3. 在 `blog/public/` 目錄建立 `CNAME` 檔案，內容為您的網域名稱
4. 在您的 DNS 提供商設定：
   ```
   類型: CNAME
   名稱: blog（或 www）
   值: <username>.github.io
   ```

### 4. HTTPS 設定

1. 等待 DNS 設定生效（可能需要幾分鐘到幾小時）
2. 在 Pages 設定頁面勾選 **Enforce HTTPS**

## 🚀 首次部署

### 方法 1: 透過 Git Push（推薦）

```bash
# 確認所有變更已提交
git add -A
git commit -m "Initial commit"

# 推送至 GitHub
git push origin main
```

GitHub Actions 會自動觸發並部署。

### 方法 2: 手動觸發 Workflow

1. 前往 **Actions** 頁面
2. 點選左側 "建置並部署至 GitHub Pages"
3. 點選右上角 **Run workflow**
4. 選擇 `main` 分支
5. 點選綠色的 **Run workflow** 按鈕

## ✅ 驗證部署

### 1. 檢查 Actions 執行狀態

1. 前往 **Actions** 頁面
2. 查看最新的 workflow run
3. 確認所有步驟都是綠色勾勾 ✅

### 2. 檢查 gh-pages 分支

1. 在 Repository 主頁切換到 `gh-pages` 分支
2. 應該會看到建置後的靜態檔案（HTML, CSS, JS）

### 3. 訪問網站

- 預設網址：`https://<username>.github.io`
- 自訂網域：`https://your-domain.com`

## 🔍 疑難排解

### 問題 1: Actions 執行失敗

**錯誤**: `Error: Resource not accessible by integration`

**解決方法**:
1. 檢查 Actions 權限設定（參考上方「Actions 權限設定」）
2. 確認已選擇 "Read and write permissions"

---

**錯誤**: `terser not found`

**解決方法**:
```bash
npm install -D terser
git add package.json package-lock.json
git commit -m "chore: add terser dependency"
git push
```

### 問題 2: GitHub Pages 顯示 404

**可能原因**:
1. `gh-pages` 分支尚未建立
2. Pages 設定選擇了錯誤的分支

**解決方法**:
1. 確認 Actions 已成功執行
2. 檢查 `gh-pages` 分支是否存在
3. 確認 Pages 設定中選擇的是 `gh-pages` 分支

### 問題 3: 網站內容未更新

**可能原因**:
- GitHub Pages 快取

**解決方法**:
1. 等待 1-2 分鐘
2. 清除瀏覽器快取（Ctrl/Cmd + Shift + R）
3. 使用無痕模式訪問

### 問題 4: 自訂網域無法訪問

**檢查清單**:
- [ ] DNS 設定正確（使用 `dig` 或 `nslookup` 檢查）
- [ ] CNAME 檔案存在於 `blog/public/` 目錄
- [ ] GitHub Pages 設定中已填入自訂網域
- [ ] 已等待足夠時間讓 DNS 生效（最多 48 小時）

## 📊 監控與維護

### Actions 使用額度

- GitHub Free: 每月 2,000 分鐘
- 本專案每次建置約 1-2 分鐘
- 每日一次 = 每月約 30-60 分鐘

### 查看使用狀況

1. 前往 **Settings** → **Billing and plans** → **Plans and usage**
2. 查看 Actions 使用時間

## 🔒 安全性建議

1. **不要在 Issues 中貼上敏感資訊**
   - Issues 是公開的，所有人都可以看到

2. **定期更新依賴**
   ```bash
   npm audit
   npm audit fix
   ```

3. **檢查 Actions 日誌**
   - 確保沒有意外洩漏的資訊（如 API keys）

## 📝 備份建議

雖然 GitHub 已經是很好的備份，但建議：

1. 定期匯出 Issues（GitHub 提供匯出功能）
2. 保留本地 repository 副本
3. 如果使用自訂網域，記錄 DNS 設定

## 🎉 完成！

設定完成後，您的 Blog 就可以正常運作了：

- ✅ 透過 Issues 撰寫文章
- ✅ 自動建置與部署
- ✅ SEO 優化
- ✅ 讀者可以留言討論

有任何問題，歡迎在 Issues 提出！
