# GitHub API 優化說明

## 問題分析

### 原始實作（REST API）

使用 REST API 時，需要多次 API 呼叫：

1. **取得 Issues 列表**：呼叫 `issues.listForRepo`
   - 每頁最多 100 筆
   - 可能需要多次分頁請求

2. **取得每個 Issue 的留言**：對每個 issue 呼叫 `issues.listComments`
   - 如果有 N 個 issues，需要額外 N 次 API 呼叫
   - 每個請求獨立進行

**總 API 呼叫次數**：`1 + N`（1 次取得 issues + N 次取得留言）

範例：如果有 50 篇文章，需要 **51 次 API 呼叫**

### 優化後實作（GraphQL API）

使用 GraphQL API，可以在單一請求中同時取得 issues 和留言：

1. **單一 GraphQL Query**：同時取得
   - Issues 列表
   - 每個 issue 的留言（預設為最新的 10 則，可由 `CONFIG.maxCommentsPerIssue` 調整，建議上限為 100 則）
   - 所有相關的 metadata

**總 API 呼叫次數**：`1`（或少數幾次用於分頁）

範例：如果有 50 篇文章，只需要 **1 次 API 呼叫**

## 效能比較

| 指標 | REST API | GraphQL API | 改善幅度 |
|------|----------|-------------|----------|
| API 呼叫次數（50 篇文章） | 51 | 1 | **98% ↓** |
| API 呼叫次數（100 篇文章） | 101 | 1-2 | **98% ↓** |
| Rate Limit 消耗 | 高 | 低 | **大幅降低** |
| 執行時間 | 長（串行請求） | 短（單次請求） | **顯著縮短** |

## 實作細節

### GraphQL Query 結構

```graphql
query($owner: String!, $repo: String!, $labels: [String!], $states: [IssueState!], $cursor: String) {
  repository(owner: $owner, name: $repo) {
    issues(
      first: 100,
      after: $cursor,
      labels: $labels,
      states: $states,
      orderBy: {field: UPDATED_AT, direction: DESC}
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        number
        title
        body
        createdAt
        updatedAt
        url
        labels(first: 20) {
          nodes {
            name
          }
        }
        comments(first: ${CONFIG.maxCommentsPerIssue}, orderBy: {field: UPDATED_AT, direction: DESC}) {
          nodes {
            body
            createdAt
            updatedAt
            author {
              login
            }
          }
        }
      }
    }
  }
}
```

### 資料轉換

GraphQL 回應會被轉換為與 REST API 相容的格式，確保：
- 下游程式碼無需修改
- 維持相同的資料結構
- 保留所有必要的欄位

## 優點總結

1. **效能提升**：減少 API 呼叫次數達 98%
2. **節省配額**：大幅降低 GitHub API rate limit 的消耗
3. **加快建置**：減少網路往返次數，縮短執行時間
4. **程式碼簡化**：移除 `fetchIssueComments` 函數，邏輯更清晰
5. **向後相容**：保持資料格式不變，無需修改其他程式碼

## 注意事項

- GraphQL API 每次請求最多可取得 100 個 issues
- 每個 issue 取得最新的 10 則留言（可透過 `CONFIG.maxCommentsPerIssue` 調整）
- 使用 cursor-based pagination 處理大量資料
- 需要 `@octokit/graphql` 套件（已加入 devDependencies）
- 已移除 `@octokit/rest` 套件（不再需要）
