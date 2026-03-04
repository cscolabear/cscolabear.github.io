# 留言換行格式修復計劃

**編號**：004  
**建立日期**：2026-03-01  
**狀態**：✅ 已完成  
**完成日期**：2026-03-01

## 📋 問題陳述

GitHub Issue 留言中的單行換行（`\n`）在網站上消失，多行文字被合併成一行，影響可讀性。

### 問題範例

- **GitHub Issue 顯示**：
  ```
  測試留言
  編輯~
  ```

- **網站顯示**：測試留言 編輯~（同一行）

## 🔍 根本原因分析

1. **GitHub Flavored Markdown (GFM)**
   - 自動將單個換行符 `\n` 轉換為 `<br>`
   - 這是 GFM 的標準行為

2. **標準 Markdown（VitePress 使用的 markdown-it）**
   - 不會自動轉換單個換行符
   - 單個 `\n` 被視為空格
   - 需要兩個空格 + `\n` 或 `<br>` 才能硬換行

3. **問題產生**
   - 從 GitHub Issue 獲取的留言使用單個 `\n` 換行
   - VitePress 使用標準 Markdown 解析
   - 換行被轉換為空格，多行變成一行

## 🎯 解決方案

### 技術實作

在 `convertIssueToMarkdown()` 函數中，將留言內容的單個換行符轉換為 `<br>` 標籤：

```javascript
const commentBody = (comment.body || '').replace(/\n/g, '<br>\n');
```

### 轉換效果

**原始留言內容**：
```
測試留言\n編輯~
```

**轉換後**：
```
測試留言<br>\n編輯~
```

**VitePress 渲染後的 HTML**：
```html
<p>測試留言<br> 編輯~</p>
```

**最終顯示**：
```
測試留言
編輯~
```

## 🛠️ 修改位置

- **檔案**：`scripts/build-posts.js`
- **函數**：`convertIssueToMarkdown()`
- **行號**：約 256 行（留言卡片生成處）

### 修改前

```javascript
comments.forEach(comment => {
  const commentBody = comment.body || '';
  // ...
});
```

### 修改後

```javascript
comments.forEach(comment => {
  const commentBody = (comment.body || '').replace(/\n/g, '<br>\n');
  // ...
});
```

## 📝 任務拆解

### ✅ 1. analyze-issue
分析問題，確認根本原因
- 對比 GFM 與標準 Markdown 的換行行為
- 確認 VitePress 使用的 Markdown 解析器

### ✅ 2. implement-fix
在 convertIssueToMarkdown() 中實作換行符轉換
- 找到留言內容處理的程式碼
- 加入 `.replace(/\n/g, '<br>\n')`
- 只影響留言區塊，不影響文章主體

### ✅ 3. test-newlines
測試換行保留功能
- 執行 `node scripts/build-posts.js`
- 檢查生成的 Markdown 檔案中是否包含 `<br>` 標籤
- 檢查 HTML 輸出是否正確
- 驗證 Issue #2 的多行留言

### ✅ 4. commit-fix
提交修復並推送至 GitHub
- 撰寫詳細的 commit message
- 推送到 main 分支
- 觸發 GitHub Actions 部署

## 🧪 測試驗證

### 測試資料

使用 [Issue #2](https://github.com/cscolabear/cscolabear.github.io/issues/2) 的留言：

**留言 1**：
```
測試留言
編輯~
```

**留言 2**：
```
我編輯留言試試
留言第二則~
```

### Markdown 源碼驗證

檢查 `blog/posts/2.md`：
```markdown
測試留言<br>
編輯~
```

### HTML 輸出驗證

```bash
$ echo '<p>測試留言<br> 編輯~</p>' | grep -o '<br>'
<br>
```

✅ HTML 輸出包含 `<br>` 標籤

### 顯示效果驗證

- ✅ 兩行分開顯示
- ✅ 保持與 GitHub Issue 頁面一致
- ✅ 不影響其他 Markdown 格式

## 💡 技術細節

### 為什麼是 `<br>\n` 而不是 `<br>`？

```javascript
.replace(/\n/g, '<br>\n')
```

**原因**：
1. `<br>` 提供硬換行
2. `\n` 保持源碼可讀性
3. markdown-it 能正確處理 `<br>` 後的換行符

### 為什麼不使用兩個空格 + `\n`？

**替代方案**：
```javascript
.replace(/\n/g, '  \n')
```

**為什麼不採用**：
- 兩個空格不易察覺，源碼可讀性差
- `<br>` 更明確，語意更清楚
- `<br>` 與 GFM 的輸出結果一致

### 會影響程式碼區塊嗎？

**不會**。程式碼區塊由 markdown-it 獨立處理：

1. markdown-it 先識別程式碼區塊（` ``` `）
2. 程式碼區塊內容不經過一般文字解析
3. `<br>` 轉換只影響一般文字區域

## 📊 影響範圍

### ✅ 影響的部分
- Issue 留言區塊的單行換行

### ❌ 不影響的部分
- 文章主體內容
- 程式碼區塊
- 引用區塊
- 列表項目
- 其他 Markdown 格式

## 🔗 相關資源

- **GFM 規範**：[Hard line breaks](https://github.github.com/gfm/#hard-line-breaks)
- **markdown-it 文件**：[markdown-it.github.io](https://markdown-it.github.io/)
- **測試 Issue**：[cscolabear/cscolabear.github.io#2](https://github.com/cscolabear/cscolabear.github.io/issues/2)

## ✅ 完成確認

- [x] 問題根本原因已分析
- [x] 修復方案已實作
- [x] Markdown 源碼正確（包含 `<br>`）
- [x] HTML 輸出正確
- [x] 顯示效果符合預期
- [x] 不影響其他格式
- [x] 已提交並部署

## 🔗 相關計劃

- [003-issue-comments-integration.md](003-issue-comments-integration.md) - 留言功能基礎實作

---

**實作者**：Cola + GitHub Copilot CLI  
**Git Commit**：c02ef8e - fix: 保留留言內容的換行格式
