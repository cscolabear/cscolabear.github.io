# 使用說明

## 📖 快速開始

### 發佈第一篇文章

1. **建立新 Issue**
   - 前往 [Issues 頁面](https://github.com/cscolabear/cscolabear.github.io/issues)
   - 點選「New issue」
   - 撰寫文章標題和內容（使用 Markdown 格式）

2. **添加標籤**
   - 在右側欄點選「Labels」
   - 添加 `Publishing` 標籤

3. **發佈文章**
   - 完成撰寫後，將 Issue 狀態設為 `Closed`
   - 這表示文章已準備好發佈

4. **等待部署**
   - GitHub Actions 會自動建置（每日 08:00 或手動觸發）
   - 約 1-2 分鐘後，文章會出現在網站上

### 更新文章

1. 重新開啟（Reopen）對應的 Issue
2. 編輯內容
3. 再次關閉（Close）Issue
4. 等待自動建置或手動觸發部署

### 刪除文章

1. 重新開啟 Issue
2. 移除 `blog` 標籤或保持 Issue 為 Open 狀態
3. 下次建置時，文章會自動從網站移除

## 💬 留言功能

### 讀者如何留言

讀者可以直接在 GitHub Issue 下方留言討論：

1. 點選文章底部的「💬 在 GitHub 上討論這篇文章」連結
2. 前往對應的 GitHub Issue 頁面
3. 在下方留言框輸入意見並送出

### 留言如何顯示在文章中

- 系統會**自動同步**所有留言到文章頁面
- 顯示**最新 10 則留言**（依建立時間降序）
- 留言包含：留言者名稱、更新時間、完整內容
- 位置：在文章內容之後、GitHub 討論連結之前

### 留言同步時機

留言會在以下情況觸發更新：

- **新增留言**：有人在 Issue 下方留言
- **編輯留言**：留言內容被修改
- **刪除留言**：留言被刪除
- **定時同步**：每日 08:00（台灣時間）自動檢查並更新

### 留言管理

作為文章作者，您可以：

- **回覆留言**：直接在 Issue 下方回覆
- **編輯留言**：修改自己的留言內容
- **刪除留言**：刪除不當留言（需有權限）
- **鎖定討論**：在 Issue 頁面鎖定討論（防止濫用）

> 💡 **提示**：留言使用 Markdown 格式，支援程式碼、圖片、連結等豐富內容。

## 🎨 Markdown 撰寫技巧

### 標題

```markdown
# 大標題（H1）
## 中標題（H2）
### 小標題（H3）
```

### 程式碼

使用三個反引號標記程式碼區塊，並指定語言：

\`\`\`javascript
function hello() {
  console.log('Hello World');
}
\`\`\`

### 圖片

直接在 Issue 中貼上圖片，GitHub 會自動上傳並生成 URL：

```markdown
![圖片說明](https://user-images.githubusercontent.com/...)
```

### 連結

```markdown
[連結文字](https://example.com)
```

### 列表

```markdown
- 無序列表項目 1
- 無序列表項目 2

1. 有序列表項目 1
2. 有序列表項目 2
```

### 表格

```markdown
| 標題 1 | 標題 2 |
|--------|--------|
| 內容 1 | 內容 2 |
```

## 🚀 手動觸發部署

如果不想等到每日定時建置，可以手動觸發：

1. 前往 [Actions 頁面](https://github.com/cscolabear/cscolabear.github.io/actions)
2. 點選左側「建置並部署至 GitHub Pages」
3. 點選右上角「Run workflow」
4. 選擇 `main` 分支
5. 點選綠色的「Run workflow」按鈕
6. 等待約 1-2 分鐘即可完成部署

## 📊 查看建置狀態

在 [Actions 頁面](https://github.com/cscolabear/cscolabear.github.io/actions)可以查看：

- ✅ 綠色勾勾：建置成功
- ❌ 紅色叉叉：建置失敗（點進去查看錯誤訊息）
- 🟡 黃色圓圈：正在建置中

## 💡 使用技巧

### 1. 使用草稿功能
- 建立 Issue 但保持 Open 狀態 = 草稿
- 只有 Closed 的 Issue 會被發佈

### 2. 文章分類
- 除了 `blog` 標籤外，可以添加其他標籤（如 `JavaScript`、`Vue`）
- 這些標籤會顯示在文章列表中

### 3. 討論功能
- 每篇文章底部都有「在 GitHub 上討論」按鈕
- 讀者點擊後會進入 Issue 頁面留言

### 4. 文章排序
- 文章列表依更新時間排序（最新的在前面）
- 修改 Issue 內容會更新「最後更新時間」

### 5. 自訂文章 URL

預設情況下，文章的 URL 使用 Issue 編號（例如：`/123`）。您可以在 Issue 內容開頭使用特殊標記來自訂 URL：

**使用方式：**

在 Issue 內容的**第一行**（或最開頭）添加：

```markdown
url: my-custom-article-slug

# 文章標題

文章內容...
```

**範例：**

```markdown
url: whats-seo

# What's SEO

這是一篇關於 SEO 的文章...
```

這會將文章 URL 從 `/5` 改為 `/whats-seo`。

**URL 格式規範：**

- ✅ 建議使用英文、數字、連字符（kebab-case）
- ✅ 範例：`my-article-2024`、`javascript-tips`、`react-hooks-guide`
- ⚠️ 中文、空格、特殊字符會自動轉為連字符
- ⚠️ 自動轉換為小寫

**注意事項：**

1. **`url:` 標記不會顯示在文章中**：系統會自動移除
2. **URL 變更影響 SEO**：修改 URL 會使舊連結失效，建議設定後不要更改
3. **避免 URL 衝突**：不同 Issue 使用相同 URL 會導致覆蓋（系統會發出警告）
4. **無標記時使用 Issue ID**：未設定 `url:` 時會自動使用 Issue 編號

**範例對比：**

| 設定 | 產生的 URL |
|------|-----------|
| 無 `url:` 標記 | `/123` |
| `url: my-article` | `/my-article` |
| `url: My Article!` | `/my-article` （自動清理） |
| `url: SEO 優化指南` | `/seo` （中文移除） |

**文章列表**：所有文章的列表頁面位於 `/articles`

## 🔧 本地開發

如果想在本地預覽網站：

```bash
# 安裝依賴
npm install

# 擷取 Issues 並轉換
npm run fetch:issues

# 啟動開發伺服器
npm run docs:dev

# 瀏覽器開啟 http://localhost:5173
```

## ❓ 常見問題

### Q: 為什麼文章沒有出現在網站上？

A: 檢查以下項目：
1. Issue 是否有 `blog` 標籤
2. Issue 是否為 `Closed` 狀態
3. GitHub Actions 是否執行成功
4. 是否已等待 1-2 分鐘讓 GitHub Pages 更新

### Q: 如何修改網站標題、描述等？

A: 修改 `docs/.vitepress/config.js` 檔案中的設定

### Q: 可以自訂網域嗎？

A: 可以，在 `docs/public/` 目錄建立 `CNAME` 檔案，內容為您的網域名稱

### Q: 如何添加 Google Analytics？

A: 參考 `docs/seo-guide.md` 中的說明

## 📚 相關文件

- [Workflow 說明](./workflow-guide.md)
- [SEO 優化指南](./seo-guide.md)
- [VitePress 官方文件](https://vitepress.dev/)
- [Markdown 語法](https://www.markdownguide.org/)

## 🆘 需要協助？

如有任何問題，歡迎在 [GitHub Issues](https://github.com/cscolabear/cscolabear.github.io/issues) 提出！
