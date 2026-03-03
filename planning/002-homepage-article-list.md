# 首頁文章列表實作

**編號**：002
**建立日期**：2026-03-01
**狀態**：✅ 已完成
**完成日期**：2026-03-01

## 📋 問題陳述

首頁（docs/index.md）的「最新文章」區域只有佔位文字「文章列表將自動從 GitHub Issues 生成...」，沒有顯示實際的文章列表。

## 🎯 解決方案

修改 `scripts/build-posts.js`，新增 `updateHomePage()` 函數，自動更新首頁的文章列表。

## 📝 功能需求

1. 顯示最新 5 篇文章（依更新時間排序）
2. 顯示文章標題、更新日期、標籤
3. 提供「查看所有文章」連結
4. 自動更新（每次執行 build-posts.js 時）

## 🛠️ 技術實作

### 1. ✅ 新增 updateHomePage() 函數

**位置**：`scripts/build-posts.js`（414-477 行）

**功能**：
- 讀取首頁內容（docs/index.md）
- 取得最新 5 篇文章
- 生成 Markdown 格式的文章列表
- 替換「最新文章」區域的內容
- 寫回首頁檔案

### 2. ✅ 排序邏輯

```javascript
const latestIssues = [...issues]
  .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
  .slice(0, 5);
```

- 依 `updated_at` 降序排序（最新的在前）
- 取前 5 篇文章

### 3. ✅ Label 過濾

```javascript
const labels = issue.labels
  .map(label => typeof label === 'string' ? label : label.name)
  .filter(name => name !== 'Publishing')  // 過濾掉預設的 Publishing label
  .map(name => `\`${name}\``)
  .join(' ');
```

- 過濾掉 "blog" label（所有文章都有）
- 只顯示有意義的額外 label

### 4. ✅ 正則替換邏輯

```javascript
const articlesSectionRegex = /(## 最新文章\s*\n)([\s\S]*)$/;

if (articlesSectionRegex.test(homeContent)) {
  homeContent = homeContent.replace(
    articlesSectionRegex,
    `$1\n${articlesContent}`
  );
}
```

**演進過程**：

**第一版**（有問題）：
```javascript
/(## 最新文章\n\n)([\s\S]*?)(\n##|$)/
```
- 問題：複雜的正則導致重複替換
- 結果：文章列表出現兩次

**最終版**（正確）：
```javascript
/(## 最新文章\s*\n)([\s\S]*)$/
```
- 改進：匹配「最新文章」之後到檔案結尾的所有內容
- 優點：簡單明確，避免重複

### 5. ✅ 整合到 main() 函數

```javascript
async function main() {
  // ...
  await generatePostsList(issues);
  await updateHomePage(issues);  // 新增這行
  // ...
}
```

## 🎨 顯示效果

### 生成的 Markdown

```markdown
## 最新文章

### [WIP 測試，這是一篇用於測試 blog 的標題 #1](/posts/2)
**更新時間**: 2026/3/1 | **標籤**: `bug`

### [測試，這是一篇用於測試 blog 的標題](/posts/1)
**更新時間**: 2026/3/1

[查看所有文章 →](/posts/)
```

### 網頁顯示

- 標題為連結，點擊進入文章頁面
- 顯示更新時間（中文格式）
- 顯示額外的 label（如果有）
- 底部有「查看所有文章」連結

## 🐛 問題修復：重複文章列表

### 問題描述

首次實作後，首頁出現重複的文章列表：

```markdown
### [文章標題](/posts/2)
**更新時間**: 2026/3/1

### [文章標題](/posts/2)
**更新時間**: 2026/3/1
```

### 根本原因

複雜的正則表達式 `/(## 最新文章\n\n)([\s\S]*?)(\n##|$)/` 導致：
- 匹配範圍不精確
- 替換時保留了舊內容
- 新內容附加在舊內容後

### 解決方案

簡化正則為 `/(## 最新文章\s*\n)([\s\S]*)$/`：
- `\s*` 匹配任意空白字元（包括換行）
- `[\s\S]*` 匹配所有內容
- `$` 匹配到檔案結尾
- 完全替換「最新文章」之後的所有內容

## 🧪 測試驗證

### 建置測試

```bash
$ node scripts/build-posts.js
🚀 開始建置文章...
📥 正在擷取 GitHub Issues...
✅ 共擷取 2 篇文章
📝 正在生成文章列表頁面...
✅ 文章列表頁面生成完成
🏠 正在更新首頁文章列表...
✅ 首頁已更新（顯示 2 篇文章）
🎉 建置完成！
```

### 驗證項目

- ✅ 首頁顯示最新文章列表
- ✅ 文章數量正確（最多 5 篇）
- ✅ 排序正確（最新的在前）
- ✅ 標題連結正確
- ✅ 日期格式正確（中文）
- ✅ Label 顯示正確（過濾 Publishing）
- ✅ 無重複文章

## 💡 技術決策

### 為什麼最多 5 篇？

- 首頁應保持簡潔
- 5 篇足以展示最新內容
- 使用者可點擊「查看所有文章」查看完整列表

### 為什麼過濾 "Publishing" label？

- 所有文章都有 "Publishing" label（篩選條件）
- 顯示此 label 無意義
- 只顯示額外的、有意義的 label

### 為什麼使用正則替換而非重寫整個檔案？

- 保留首頁其他區域的內容（hero, features）
- 只更新「最新文章」區域
- 更安全，不會破壞其他內容

## 📦 相關檔案

- `scripts/build-posts.js` - 主要實作檔案
  - `updateHomePage()` 函數（414-477 行）
- `docs/index.md` - 首頁檔案
  - 「最新文章」區塊會被自動更新

## ✅ 完成確認

- [x] updateHomePage() 函數實作完成
- [x] 整合到 main() 函數
- [x] 排序邏輯正確
- [x] Label 過濾正確
- [x] 正則替換問題已修復
- [x] 本地測試通過
- [x] 已提交並部署
- [x] 無重複文章問題

## 🔗 相關計劃

- [000-initial-setup.md](000-initial-setup.md) - 專案初始架構
- [005-article-list-enhancement.md](005-article-list-enhancement.md) - 文章列表功能增強（加入留言數）

---

**實作者**：Cola + GitHub Copilot CLI
**Git Commit**：feat: 首頁自動顯示最新 5 篇文章
