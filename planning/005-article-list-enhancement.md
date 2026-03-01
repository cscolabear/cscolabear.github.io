# 文章列表功能增強計劃

**編號**：005  
**建立日期**：2026-03-01  
**狀態**：✅ 已完成  
**完成日期**：2026-03-01

## 📋 問題陳述

目前文章列表缺少留言數量資訊，且 "blog" label 雖已過濾但需確認。需要改善資訊呈現，讓讀者更容易了解文章的討論熱度。

## 🎯 需求分析

### 1. 留言數量顯示
- 在所有文章列表中增加留言數量資訊
- 格式：`💬 N 則留言`
- **若留言數為 0，則不顯示此資訊**
- 資料來源：sync-log.json 中的 `comments_count` 欄位

### 2. Label 顯示優化  
- 過濾掉預設的 "blog" label（所有文章都有，顯示無意義）
- 其他 label 正常顯示
- 需確認所有列表位置都有套用過濾邏輯

## 🔍 影響範圍

### 文章列表位置

1. **首頁 (docs/index.md)** - "最新文章" 區塊
   - 顯示：最新 5 篇
   - 函數：`updateHomePage()` (build-posts.js 414-477行)
   - 狀態：✅ 已過濾 blog / ❌ 缺留言數

2. **文章列表頁 (docs/posts/index.md)** - 完整清單
   - 顯示：所有文章（依更新時間排序）
   - 函數：`generatePostsList()` (build-posts.js 336-381行)
   - 狀態：✅ 已過濾 blog / ❌ 缺留言數

## 🛠️ 技術方案

### 資料來源格式

sync-log.json 格式：
```json
{
  "issue-N": {
    "title": "文章標題",
    "updated_at": "ISO時間戳",
    "comments_updated_at": "ISO時間戳",
    "comments_count": 2,
    "synced_at": "ISO時間戳"
  }
}
```

### 實作方式

1. **讀取 sync-log.json**
   - 使用既有的 `readSyncLog()` 函數
   - 在 `generatePostsList()` 和 `updateHomePage()` 開始時讀取

2. **查找留言數量**
   - 使用 `issue-${issue.number}` 作為 key
   - 讀取 `syncLog[issueKey]?.comments_count`
   - 找不到資料時預設為 0

3. **條件顯示**
   - `commentsCount > 0` 時才顯示留言資訊
   - 避免顯示「0 則留言」造成視覺雜訊

4. **Label 過濾優化**
   - 從 `name !== 'blog'` 改為 `name.toLowerCase() !== 'blog'`
   - 確保大小寫不敏感的過濾（"Blog", "BLOG" 都會被過濾）

## 📝 任務拆解

### ✅ 1. load-sync-log
在函數中載入 sync-log.json
- 確認 `readSyncLog()` 函數存在且可用
- 在兩個函數開始時讀取

### ✅ 2. update-posts-list
修改 `generatePostsList()` 加入留言數
- 位置：build-posts.js 336-381行
- 讀取 comments_count
- 條件顯示留言資訊
- 優化 label 過濾（toLowerCase）

### ✅ 3. update-home-page
修改 `updateHomePage()` 加入留言數
- 位置：build-posts.js 414-477行
- 讀取 comments_count
- 條件顯示留言資訊
- 優化 label 過濾（toLowerCase）

### ✅ 4. test-build
測試建置與驗證結果
- 執行 `node scripts/build-posts.js`
- 檢查 docs/index.md（首頁）
- 檢查 docs/posts/index.md（列表頁）
- 驗證：有留言的顯示數量、無留言的不顯示
- 驗證："blog" label 已被過濾

### ✅ 5. commit-deploy
提交並部署變更
- git commit 並推送到 GitHub
- 觸發 GitHub Actions 自動部署

## 🎨 顯示效果

### 首頁 (docs/index.md)

```markdown
### [WIP 測試，這是一篇用於測試 blog 的標題 #1](/posts/2)
**更新時間**: 2026/3/1 | 💬 2 則留言 | **標籤**: `bug`

### [測試，這是一篇用於測試 blog 的標題](/posts/1)
**更新時間**: 2026/3/1 | 💬 1 則留言
```

### 文章列表頁 (docs/posts/index.md)

```markdown
## [WIP 測試，這是一篇用於測試 blog 的標題 #1](/posts/2)

**標籤**: `bug`

💬 2 則留言

**更新時間**: 2026/3/1

---

## [測試，這是一篇用於測試 blog 的標題](/posts/1)

💬 1 則留言

**更新時間**: 2026/3/1

---
```

## 🧪 測試結果

### 建置測試
```bash
$ node scripts/build-posts.js
🚀 開始建置文章...
📋 已載入同步日誌（2 筆記錄）
📥 正在擷取 GitHub Issues...
   ✓ 已擷取第 1 頁，共 2 篇
✅ 共擷取 2 篇文章
📥 正在擷取留言...
   ✓ Issue #2: 2 則留言
   ✓ Issue #1: 1 則留言
✅ 留言擷取完成
📝 正在生成文章列表頁面...
✅ 文章列表頁面生成完成
🏠 正在更新首頁文章列表...
✅ 首頁已更新（顯示 2 篇文章）
🎉 建置完成！
```

### 驗證項目

- ✅ Issue #2: 顯示「💬 2 則留言」
- ✅ Issue #1: 顯示「💬 1 則留言」
- ✅ "blog" label 已被過濾（不論大小寫）
- ✅ "Blog" label 已被過濾
- ✅ 其他 label（bug）正常顯示
- ✅ 首頁格式正確（inline 顯示）
- ✅ 列表頁格式正確（獨立行顯示）

## 💡 技術決策

### 為什麼使用 toLowerCase() 過濾 label？

**問題**：GitHub label 名稱可能有不同的大小寫形式（"blog", "Blog", "BLOG"）

**解決方案**：
```javascript
.filter(name => name.toLowerCase() !== 'blog')
```

**優點**：
- 大小寫不敏感，避免遺漏
- 更健壯的過濾邏輯
- 不影響其他 label 的顯示

### 為什麼條件顯示留言數量？

**問題**：所有文章都顯示留言數（包括「0 則留言」）會造成視覺雜訊

**解決方案**：
```javascript
const commentsInfo = commentsCount > 0 ? `💬 ${commentsCount} 則留言` : '';
```

**優點**：
- 只顯示有意義的資訊
- 減少視覺干擾
- 強調有討論的文章

### 為什麼首頁和列表頁格式不同？

**首頁**：`**更新時間**: 2026/3/1 | 💬 2 則留言 | **標籤**: \`bug\``
- inline 顯示，節省空間
- 首頁需要緊湊的呈現

**列表頁**：獨立行顯示標籤和留言
- 更清晰的視覺層次
- 列表頁有足夠空間

## 📦 相關檔案

- `scripts/build-posts.js` - 主要修改檔案
  - `generatePostsList()` 函數（336-385行）
  - `updateHomePage()` 函數（417-483行）
- `docs/index.md` - 首頁文章列表
- `docs/posts/index.md` - 完整文章列表
- `docs/.vitepress/sync-log.json` - 留言數據來源

## 📊 影響評估

### 使用者體驗
- ✅ 可快速了解文章討論熱度
- ✅ 資訊更清晰、更有意義
- ✅ 減少冗餘資訊（blog label）

### 效能影響
- ✅ 無額外 API 呼叫（使用既有的 sync-log.json）
- ✅ 建置時間無明顯增加
- ✅ 純靜態內容，不影響頁面載入速度

### 維護性
- ✅ 程式碼邏輯清晰
- ✅ 使用既有的資料結構
- ✅ 易於擴展（如未來加入其他資訊）

## ✅ 完成確認

- [x] 所有任務已完成
- [x] 建置測試通過
- [x] 首頁顯示正確
- [x] 列表頁顯示正確
- [x] 留言數量正確
- [x] Label 過濾正確
- [x] 已提交並推送到 GitHub
- [x] GitHub Actions 部署成功

## 🔗 相關計劃

- [003-issue-comments-integration.md](003-issue-comments-integration.md) - 留言功能基礎
- [002-homepage-article-list.md](002-homepage-article-list.md) - 首頁列表功能

---

**實作者**：Cola + GitHub Copilot CLI  
**Git Commit**：c1c7fc4 - feat: 在文章列表中顯示留言數量並優化 label 顯示
