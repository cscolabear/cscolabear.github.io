# 本地開發指南

本文件說明如何在本地環境設定和開發此 Blog 專案。

## 📋 環境需求

- **Node.js**: 24.x（建議使用 [NVM](https://github.com/nvm-sh/nvm) 管理版本）
- **npm**: 11.x（隨 Node.js 24 自動安裝）
- **Git**: 用於版本控制
- **GitHub Personal Access Token**: 用於存取 GitHub API

## 🚀 快速開始

### 1. Clone Repository

```bash
git clone https://github.com/cscolabear/cscolabear.github.io.git
cd cscolabear.github.io
```

### 2. 安裝 Node.js 24

使用 NVM（推薦）：

```bash
# 安裝 Node.js 24
nvm install 24

# 使用 Node.js 24
nvm use 24

# 或直接使用專案的 .nvmrc
nvm use
```

直接安裝：前往 [Node.js 官網](https://nodejs.org/) 下載 24.x 版本。

### 3. 安裝依賴

```bash
npm install
```

### 4. 設定環境變數

#### 4.1 複製範本檔案

```bash
cp .env.example .env
```

#### 4.2 取得 GitHub Personal Access Token

請參考下方「[如何取得 GitHub Token](#如何取得-github-token)」章節。

#### 4.3 編輯 .env 檔案

使用任何文字編輯器開啟 `.env` 檔案，並填入您的 token：

```bash
GITHUB_TOKEN=ghp_your_actual_token_here
```

⚠️ **重要**：`.env` 檔案已被 `.gitignore` 忽略，不會被提交到 Git。請勿將此檔案分享給他人。

### 5. 執行開發伺服器

```bash
# 僅啟動 VitePress 開發伺服器（不擷取 Issues）
npm run docs:dev

# 或先擷取 Issues 再啟動開發伺服器
npm run fetch:issues
npm run docs:dev
```

訪問 `http://localhost:5173` 查看網站。

### 6. 完整建置

```bash
# 執行完整建置流程：
# 1. 生成 robots.txt
# 2. 擷取 GitHub Issues 並轉換為文章
# 3. 生成 RSS feeds
# 4. 建置 VitePress 網站
npm run build

# 預覽建置結果
npm run docs:preview
```

## 🔑 如何取得 GitHub Token

GitHub Personal Access Token 用於讓本地開發環境存取 GitHub Issues API。

### 步驟 1：前往 GitHub Token 設定頁面

1. 登入 GitHub
2. 點擊右上角頭像 → **Settings**
3. 左側選單最下方 → **Developer settings**
4. 左側選單 → **Personal access tokens** → **Tokens (classic)**

或直接訪問：https://github.com/settings/tokens

### 步驟 2：建立新的 Token

1. 點擊 **Generate new token** → **Generate new token (classic)**

2. 填寫 Token 資訊：

   **Note（用途說明）**
   ```
   Local Blog Development
   ```
   或任何能讓您記住用途的名稱。

   **Expiration（過期時間）**
   - 建議選擇 **90 days**
   - 也可以選擇更長的時間，但需注意安全性
   - 避免選擇 "No expiration"（無過期時間）

   **Select scopes（權限範圍）**
   
   勾選以下權限：
   - ✅ **repo**（完整的 repository 存取權限）
     - 這會自動包含：
       - `repo:status`
       - `repo_deployment`
       - `public_repo`
       - `repo:invite`
       - `security_events`

   > **說明**：由於此專案的 repository 是公開的，理論上只需要 `public_repo` 權限，但為了確保功能完整運作，建議勾選完整的 `repo` 權限。

3. 滾動到頁面最下方，點擊 **Generate token**

### 步驟 3：複製 Token

1. Token 會以綠色背景顯示，格式類似：
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. **立即複製此 token**（使用右側的複製按鈕）

3. ⚠️ **重要警告**：
   - Token 只會顯示這一次
   - 離開此頁面後無法再次查看
   - 如果遺失，需要重新產生新的 token

### 步驟 4：設定到 .env 檔案

1. 在專案根目錄開啟 `.env` 檔案
2. 將複製的 token 貼上：

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. 儲存檔案

### 步驟 5：驗證設定

執行以下命令測試：

```bash
# 測試擷取 Issues
npm run fetch:issues
```

如果成功，應該會看到類似以下輸出：

```
✅ 成功擷取 X 篇文章
✅ 文章已同步至 docs/posts/
```

## 🛠️ 可用的 npm scripts

| 指令 | 說明 |
|------|------|
| `npm run docs:dev` | 啟動 VitePress 開發伺服器 |
| `npm run docs:build` | 建置 VitePress 網站 |
| `npm run docs:preview` | 預覽建置結果 |
| `npm run fetch:issues` | 擷取 GitHub Issues 並轉換為文章 |
| `npm run generate:robots` | 生成 robots.txt |
| `npm run generate:rss` | 生成 RSS feeds |
| `npm run build` | 執行完整建置流程（包含上述所有步驟） |

## 🔍 常見問題

### Q1: 執行 `npm run build` 時出現 "GitHub token is required" 錯誤

**原因**：`.env` 檔案不存在或 `GITHUB_TOKEN` 未設定。

**解決方法**：
1. 確認專案根目錄有 `.env` 檔案
2. 確認檔案內容格式正確：`GITHUB_TOKEN=ghp_xxxxx`
3. 確認沒有多餘的空格或引號
4. 重新執行命令

### Q2: Token 過期了怎麼辦？

**解決方法**：
1. 前往 https://github.com/settings/tokens
2. 找到舊的 token，點擊右側的 **Delete** 刪除
3. 重新按照上方步驟建立新的 token
4. 更新 `.env` 檔案中的 `GITHUB_TOKEN`

### Q3: 我不小心把 `.env` 檔案提交到 Git 了

**緊急處理**：
1. **立即前往 GitHub 刪除該 token**：https://github.com/settings/tokens
2. 重新產生新的 token
3. 從 Git 歷史移除 `.env` 檔案：
   ```bash
   git rm --cached .env
   git commit -m "Remove .env from git"
   git push
   ```
4. 確認 `.gitignore` 包含 `.env`

### Q4: 為什麼開發伺服器看不到文章？

**原因**：文章是從 GitHub Issues 動態擷取的，首次執行需要手動擷取。

**解決方法**：
```bash
npm run fetch:issues
npm run docs:dev
```

### Q5: Node.js 版本不正確

**錯誤訊息**：`Node.js version 24 is required`

**解決方法**：
```bash
# 使用 NVM
nvm install 24
nvm use 24

# 或下載正確版本
# https://nodejs.org/
```

### Q6: 本地環境和 GitHub Actions 有什麼差異？

| 環境 | Token 來源 | 設定方式 |
|------|-----------|---------|
| **本地開發** | `.env` 檔案 | 手動建立 Personal Access Token |
| **GitHub Actions** | 系統環境變數 | GitHub 自動提供 `secrets.GITHUB_TOKEN` |

兩個環境都執行相同的 `npm run build` 指令，差異僅在 token 的來源。

## 🔒 安全性最佳實踐

### ✅ 應該做的事

1. **使用 `.env` 檔案儲存 token**
   - 已被 `.gitignore` 保護
   - 不會意外提交到 Git

2. **設定 token 過期時間**
   - 建議 90 天
   - 定期更新

3. **最小權限原則**
   - 只勾選必要的權限（`repo`）

4. **定期檢查 token 使用狀況**
   - 前往 https://github.com/settings/tokens
   - 查看 token 的最後使用時間

### ❌ 不應該做的事

1. **不要將 token 寫死在程式碼中**
   ```javascript
   // ❌ 錯誤示範
   const token = 'ghp_xxxxx';
   ```

2. **不要將 `.env` 提交到 Git**
   - 已有 `.gitignore` 保護
   - 提交前請檢查

3. **不要在公開場合分享 token**
   - 聊天訊息
   - 截圖
   - 螢幕分享

4. **不要使用 "No expiration" 的 token**
   - 安全風險較高
   - 建議設定過期時間

## 📚 相關文件

- [README.md](../README.md) - 專案總覽
- [使用說明](./usage-guide.md) - 如何發佈文章
- [Workflow 說明](./workflow-guide.md) - GitHub Actions 使用指南
- [GitHub 設定指南](../github-setup.md) - Repository 和 Pages 設定

## 💡 開發建議

### 編輯器設定

推薦使用以下編輯器：
- **VS Code**（推薦）
  - 安裝 VitePress 擴充套件
  - 安裝 Vue Language Features (Volar)
- **WebStorm**
- **Sublime Text**

### 開發流程

1. **修改文章內容**：
   - 直接在 GitHub Issues 編輯
   - 執行 `npm run fetch:issues` 更新本地

2. **修改網站樣式/功能**：
   - 編輯 `docs/.vitepress/` 目錄下的檔案
   - 開發伺服器會自動熱重載

3. **測試建置**：
   ```bash
   npm run build
   npm run docs:preview
   ```

4. **提交變更**：
   ```bash
   git add .
   git commit -m "描述你的變更"
   git push
   ```

## 🎉 開始開發

現在您已經完成所有設定，可以開始開發了！

```bash
# 啟動開發伺服器
npm run docs:dev

# 在瀏覽器訪問
open http://localhost:5173
```

有任何問題，歡迎在 [GitHub Issues](https://github.com/cscolabear/cscolabear.github.io/issues) 提出！
