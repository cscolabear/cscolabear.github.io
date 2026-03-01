# Node.js 24 升級與依賴套件更新

**編號**：001  
**建立日期**：2026-03-01  
**狀態**：✅ 已完成  
**完成日期**：2026-03-01

## 📋 升級目標

將專案的 Node.js 版本從 v20.19.2 升級至 v24.14.0（Latest LTS: Krypton），並安全地升級所有依賴套件。

## 🎯 升級項目

### Node.js 升級

- **升級前**：v20.19.2
- **升級後**：v24.14.0 (LTS: Krypton)
- **npm 版本**：10.8.2 → 11.9.0

### 依賴套件升級

| 套件 | 升級前 | 升級後 | 類型 |
|------|--------|--------|------|
| @octokit/rest | 22.0.1 | 22.0.1 | 保持最新 |
| sitemap | 8.0.3 | 9.0.1 | 主要版本 ⬆️ |
| terser | 5.46.0 | 5.46.0 | 保持最新 |
| vitepress | 1.6.4 | 1.6.4 | 保持最新 |

## 📝 執行步驟

### 1. ✅ 建立 .nvmrc 檔案

```bash
echo "24.14.0" > .nvmrc
```

**目的**：
- 指定專案使用的 Node.js 版本
- 團隊成員可使用 `nvm use` 自動切換版本
- CI/CD 可讀取此檔案使用正確版本

### 2. ✅ 切換 Node.js 版本

```bash
nvm install 24.14.0
nvm use 24.14.0
node -v  # v24.14.0
npm -v   # 11.9.0
```

### 3. ✅ 備份 package-lock.json

```bash
cp package-lock.json package-lock.json.backup
```

**重要性**：
- 升級失敗時可快速回復
- 保留升級前的依賴樹記錄

### 4. ✅ 安全升級依賴套件

```bash
# 移除舊的 node_modules 和 lock file
rm -rf node_modules package-lock.json

# 重新安裝依賴（生成新的 lock file）
npm install

# 檢查可更新的套件
npm outdated

# 升級 sitemap 到最新主要版本
npm install sitemap@latest

# 重新安裝確保一致性
npm install
```

### 5. ✅ 測試驗證

```bash
# 測試 Issue 擷取腳本
node scripts/build-posts.js

# 測試開發伺服器
npm run docs:dev

# 測試建置
npm run docs:build
```

**驗證項目**：
- ✅ Issue 擷取功能正常
- ✅ Markdown 轉換正常
- ✅ VitePress 建置成功
- ✅ 開發伺服器運行正常

### 6. ✅ 更新 GitHub Actions

修改 `.github/workflows/deploy.yml`：

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '24'  # 從 '20' 改為 '24'
    cache: 'npm'
```

### 7. ✅ 更新文件

修改 `README.md` 加入版本要求：

```markdown
## 環境需求

- Node.js 24.14.0 或更高版本（建議使用 nvm 管理版本）
- npm 11.9.0 或更高版本

### 使用 nvm 安裝正確版本

\`\`\`bash
nvm use
\`\`\`

專案已包含 `.nvmrc` 檔案，會自動使用指定的 Node.js 版本。
```

## 🧪 測試結果

### 本地測試

```bash
$ node scripts/build-posts.js
🚀 開始建置文章...
📥 正在擷取 GitHub Issues...
✅ 共擷取 2 篇文章
📝 正在轉換文章...
✅ 文章列表頁面生成完成
🎉 建置完成！

$ npm run docs:dev
✅ VitePress dev server running at http://localhost:5173

$ npm run docs:build
✅ building client + server bundles...
✅ build complete in 3.45s
```

### GitHub Actions 測試

- ✅ Workflow 使用 Node 24 成功執行
- ✅ 依賴安裝成功
- ✅ 建置成功
- ✅ 部署到 GitHub Pages 成功

## ⚠️ 已知問題

### 開發環境依賴漏洞（moderate）

```
6 moderate severity vulnerabilities

Some issues need review, and may require choosing
a different dependency.
```

**受影響套件**：
- esbuild <=0.24.2
- vite 0.11.0 - 6.1.6
- vitepress 0.2.0 - 1.6.4

**評估**：
- ✅ 僅影響開發環境（`npm run docs:dev`）
- ✅ 不影響生產環境建置結果
- ✅ 等待 VitePress 官方更新修復
- ⚠️ 建議定期檢查 `npm audit` 和套件更新

## 💡 升級帶來的好處

### Node.js 24 新特性

1. **效能提升**
   - V8 JavaScript 引擎更新
   - 更快的啟動速度
   - 更好的記憶體管理

2. **安全性增強**
   - 最新的安全補丁
   - 修復已知漏洞

3. **LTS 支援**
   - 長期支援（至 2027 年 4 月）
   - 穩定可靠

### npm 11 改進

- 更快的套件安裝速度
- 更好的依賴解析
- 改進的快取機制

## 📋 維護建議

### 定期檢查更新

```bash
# 每月檢查一次
npm outdated

# 檢查安全漏洞
npm audit

# 自動修復低風險漏洞
npm audit fix
```

### 升級策略

1. **小版本更新**（patch/minor）
   - 定期更新，風險較低
   - 使用 `npm update`

2. **主要版本更新**（major）
   - 閱讀 CHANGELOG
   - 測試後再升級
   - 使用 `npm install <package>@latest`

3. **開發依賴更新**
   - 優先級較低
   - 等待官方修復再更新

## 🔗 相關資源

- [Node.js 24 Release Notes](https://nodejs.org/en/blog/release/)
- [npm 11 Changelog](https://github.com/npm/cli/releases)
- [VitePress Documentation](https://vitepress.dev/)

## ✅ 完成確認

- [x] Node.js 升級至 v24.14.0
- [x] npm 升級至 v11.9.0
- [x] .nvmrc 檔案建立
- [x] package-lock.json 備份
- [x] 依賴套件安全升級
- [x] 本地測試通過
- [x] GitHub Actions 更新
- [x] 文件更新
- [x] 已推送到 GitHub
- [x] CI/CD 測試通過

---

**實作者**：Cola + GitHub Copilot CLI  
**Git Commit**：升級 Node.js 至 24 並更新依賴套件
