# Issue 留言整合功能

**編號**：003  
**建立日期**：2026-03-01  
**狀態**：✅ 已完成  
**完成日期**：2026-03-01

## 📋 功能概述

將 GitHub Issue 的留言同步到文章頁面，讓讀者可以在網站上直接看到留言內容（最新 10 則），同時保留前往 GitHub 留言的功能。

## 🎯 核心需求

1. 顯示 Issue 的留言（最新 10 則）
2. 留言資訊包含：
   - 留言者名稱
   - 最後修改時間
   - 留言內容（支援 Markdown 格式）
3. 留言以卡片樣式呈現
4. 支援深色/淺色模式
5. 記錄留言更新時間，用於增量同步

## 🛠️ 技術實作

### 1. ✅ fetchIssueComments() - API 呼叫

**位置**：`scripts/build-posts.js`（76-93 行）

```javascript
async function fetchIssueComments(issueNumber) {
  try {
    const { data } = await octokit.rest.issues.listComments({
      owner: CONFIG.owner,
      repo: CONFIG.repo,
      issue_number: issueNumber,
      sort: 'created',
      direction: 'desc',
      per_page: 10
    });
    return data;
  } catch (error) {
    console.error(`⚠️  Issue #${issueNumber} 留言擷取失敗:`, error.message);
    return [];
  }
}
```

**特點**：
- 使用 Octokit REST API
- 最新 10 則留言（sorted by created, desc）
- 錯誤處理：失敗時返回空陣列，不中斷建置

### 2. ✅ fetchIssues() 整合留言

**修改**：在擷取 issues 後，迴圈擷取每個 issue 的留言

```javascript
console.log('📥 正在擷取留言...');
for (const issue of issues) {
  const comments = await fetchIssueComments(issue.number);
  issue.comments_data = comments;
  console.log(`   ✓ Issue #${issue.number}: ${comments.length} 則留言`);
}
```

### 3. ✅ needsUpdate() 留言檢查

**增強**：比對 issue 和留言的更新時間

```javascript
// 取得最新留言的更新時間
const latestCommentTime = issue.comments_data && issue.comments_data.length > 0
  ? Math.max(...issue.comments_data.map(c => new Date(c.updated_at).getTime()))
  : 0;

// 比對 sync-log 中的留言更新時間
if (syncLog[issueKey]?.comments_updated_at) {
  const syncedCommentTime = new Date(syncLog[issueKey].comments_updated_at).getTime();
  if (latestCommentTime > syncedCommentTime) {
    return true; // 留言有更新
  }
}
```

### 4. ✅ convertIssueToMarkdown() 留言卡片

**位置**：`scripts/build-posts.js`（256-285 行）

**生成的 Markdown**：
```markdown
## 💬 留言

<div class="comment-card">

**作者名稱** • 2026/3/1 下午4:38

留言內容（支援 Markdown）

</div>
```

**關鍵實作**：
- 留言內容直接放在 comment-card 中，不使用額外的 div wrapper
- VitePress/markdown-it 會自動解析 Markdown
- 使用空行確保 Markdown 正確解析

### 5. ✅ CSS 樣式

**位置**：`docs/.vitepress/theme/styles/custom.css`（24-82 行）

**卡片樣式**：
```css
.comment-card {
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
  font-size: 14px;
}

.comment-date {
  color: var(--vp-c-text-2);
  font-size: 13px;
}
```

**支援深色模式**：
- 使用 VitePress CSS 變數（`--vp-c-*`）
- 自動適應主題切換

**響應式設計**：
```css
@media (max-width: 768px) {
  .comment-header {
    flex-direction: column;
    gap: 4px;
  }
}
```

### 6. ✅ sync-log.json 格式更新

**新增欄位**：
```json
{
  "issue-N": {
    "title": "文章標題",
    "updated_at": "2026-03-01T08:43:47Z",
    "comments_updated_at": "2026-03-01T08:43:47.000Z",  // 新增
    "comments_count": 2,                                 // 新增
    "synced_at": "2026-03-01T08:52:16.281Z"
  }
}
```

**向後相容**：
- 舊記錄沒有這些欄位時，視為需要更新
- 不影響既有功能

## 🎨 顯示效果

### 文章頁面範例

```
---文章內容---

## 💬 留言

┌─────────────────────────────────┐
│ cscolabear • 2026/3/1 下午4:38  │
│                                  │
│ 測試留言                         │
│ 編輯~                            │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ cscolabear • 2026/3/1 下午4:43  │
│                                  │
│ 我編輯留言試試                   │
│ 留言第二則~                      │
└─────────────────────────────────┘

💬 在 GitHub 上討論這篇文章
```

## 🐛 問題修復歷程

### 問題 1：Markdown 格式未保留

**現象**：留言中的列表、粗體等格式消失

**原因**：留言內容被包在 `<div class="comment-body">` 中
- VitePress/markdown-it 預設不解析 HTML 標籤內的 Markdown

**解決**：移除 wrapper div，直接放內容
```markdown
<div class="comment-card">

**作者** • 時間

留言內容（Markdown 會被解析）

</div>
```

**關鍵**：空行讓 markdown-it 正確解析 Markdown

### 問題 2：換行未保留

詳見 [004-comments-newline-fix.md](004-comments-newline-fix.md)

## 🧪 測試驗證

### 測試資料

- Issue #1: 1 則留言
- Issue #2: 2 則留言

### 驗證項目

- ✅ 留言正確擷取
- ✅ 留言卡片樣式正確
- ✅ 作者名稱顯示正確
- ✅ 時間格式正確（中文）
- ✅ Markdown 格式保留（列表、粗體、連結等）
- ✅ 換行格式保留
- ✅ 深色/淺色模式正常
- ✅ 響應式設計正常
- ✅ sync-log 正確記錄留言狀態

## 💡 技術決策

### 為什麼最多 10 則留言？

- 避免頁面過長
- API 效能考量
- 10 則足以展示最新討論
- 使用者可前往 GitHub 查看完整留言

### 為什麼使用卡片樣式？

- 視覺層次清晰
- 區分不同留言
- 符合現代 UI 設計慣例

### 為什麼不使用 Giscus 等評論系統？

- 需求：讀者透過 GitHub Issues 留言
- 保持簡單：不引入額外依賴
- GitHub Issues 功能完整（通知、編輯、刪除等）

## 📦 相關檔案

- `scripts/build-posts.js`
  - `fetchIssueComments()` (76-93)
  - `fetchIssues()` (95-174)
  - `needsUpdate()` (59-101)
  - `convertIssueToMarkdown()` (176-295)
- `docs/.vitepress/theme/styles/custom.css` (24-82)
- `docs/.vitepress/sync-log.json` - 留言狀態記錄

## ✅ 完成確認

- [x] API 呼叫功能完成
- [x] 留言卡片樣式完成
- [x] Markdown 格式保留
- [x] 換行格式保留
- [x] 深色/淺色模式支援
- [x] 響應式設計
- [x] sync-log 更新邏輯
- [x] 增量同步機制
- [x] 已測試並部署

## 🔗 相關計劃

- [000-initial-setup.md](000-initial-setup.md) - 專案初始架構
- [004-comments-newline-fix.md](004-comments-newline-fix.md) - 換行格式修復
- [005-article-list-enhancement.md](005-article-list-enhancement.md) - 列表顯示留言數

---

**實作者**：Cola + GitHub Copilot CLI  
**Git Commit**：feat: 整合 GitHub Issue 留言到文章頁面
