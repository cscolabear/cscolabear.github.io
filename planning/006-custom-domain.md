# 自訂網域設定計劃

**編號**：006  
**建立日期**：2026-03-01  
**狀態**：🚧 進行中  
**目標網域**：cola.workxplay.net

## 📋 目標

將 GitHub Pages 網站從預設的 `cscolabear.github.io` 設定為自訂網域 `cola.workxplay.net`。

## 🎯 需求

1. 建立 CNAME 檔案指定自訂網域
2. 設定 DNS CNAME 記錄
3. 在 GitHub 設定中啟用自訂網域
4. 啟用 HTTPS（自動）
5. 測試網域解析與 HTTPS

## 📝 任務拆解

### 🤖 自動執行任務（系統可完成）

#### ✅ Task 1: 建立 CNAME 檔案
- **位置**：`docs/public/CNAME`
- **內容**：`cola.workxplay.net`
- **作用**：告訴 GitHub Pages 使用的自訂網域

#### ✅ Task 2: 更新文件
- 在 `planning/006-custom-domain.md` 記錄設定過程
- 更新 README.md 提及自訂網域

#### ✅ Task 3: 提交並推送
- Git commit 並 push 到 GitHub
- 觸發 GitHub Actions 重新部署

### 👤 需要手動執行的任務

#### ⏳ Task 4: DNS 設定（需手動）

**DNS 提供商**：workxplay.net 的 DNS 管理介面

**需要新增的記錄**：

| 類型 | 名稱 | 值 | TTL |
|------|------|-----|-----|
| CNAME | cola | cscolabear.github.io. | 3600 或預設 |

**注意事項**：
- CNAME 記錄的值需要加上結尾的 `.` （某些 DNS 提供商會自動加）
- 等待 DNS 傳播（通常 5-30 分鐘，最長可能需要 48 小時）

**驗證方式**：
```bash
# macOS/Linux
dig cola.workxplay.net

# Windows
nslookup cola.workxplay.net

# 或使用線上工具
# https://dnschecker.org/#CNAME/cola.workxplay.net
```

**預期結果**：
```
cola.workxplay.net.  3600  IN  CNAME  cscolabear.github.io.
```

#### ⏳ Task 5: GitHub Repository 設定（需手動）

**步驟**：

1. 前往 GitHub Repository 設定
   - URL: https://github.com/cscolabear/cscolabear.github.io/settings/pages

2. 在 "Custom domain" 區域
   - 輸入：`cola.workxplay.net`
   - 點擊 "Save"

3. 等待 DNS 檢查
   - GitHub 會自動檢查 DNS 記錄是否正確
   - 看到綠色勾勾表示設定成功

4. 啟用 "Enforce HTTPS"
   - 勾選 "Enforce HTTPS" 選項
   - GitHub 會自動申請並配置 Let's Encrypt SSL 憑證
   - 初次設定可能需要等待幾分鐘

**注意事項**：
- DNS 記錄必須先設定好，否則 GitHub 會顯示錯誤
- HTTPS 憑證申請可能需要 24 小時（通常幾分鐘內完成）

#### ⏳ Task 6: 測試驗證（需手動）

**測試項目**：

1. **HTTP 訪問測試**
   ```
   http://cola.workxplay.net
   ```
   - ✅ 應該自動重定向到 HTTPS（如果已啟用 Enforce HTTPS）
   - ✅ 網站正常顯示

2. **HTTPS 訪問測試**
   ```
   https://cola.workxplay.net
   ```
   - ✅ 使用 HTTPS 連線
   - ✅ SSL 憑證有效（綠色鎖頭）
   - ✅ 網站內容正常

3. **舊網址重定向測試**
   ```
   https://cscolabear.github.io
   ```
   - ✅ 應該自動重定向到 https://cola.workxplay.net
   - 或兩者皆可訪問

4. **功能測試**
   - ✅ 首頁顯示正常
   - ✅ 文章列表可訪問
   - ✅ 單篇文章可開啟
   - ✅ 留言顯示正常
   - ✅ GitHub 討論連結正確

## 🔧 技術細節

### CNAME 檔案格式

**檔案**：`docs/public/CNAME`

**內容**：
```
cola.workxplay.net
```

**注意**：
- 只包含網域名稱，不含 `http://` 或 `https://`
- 不含路徑或尾隨斜線
- 單行文字，無空行

### DNS 傳播時間

- **最快**：5-10 分鐘
- **一般**：30 分鐘 - 2 小時
- **最長**：24-48 小時（極少數情況）

### HTTPS 憑證

- **提供者**：Let's Encrypt
- **自動更新**：GitHub 會自動續期
- **有效期**：90 天（自動續期）
- **憑證申請時間**：幾分鐘到 24 小時

## 🐛 常見問題排除

### 問題 1：DNS 檢查失敗

**錯誤訊息**：
```
DNS check failed. cola.workxplay.net does not resolve to any GitHub Pages IP
```

**可能原因**：
1. DNS 記錄尚未設定
2. DNS 記錄設定錯誤（CNAME 指向錯誤）
3. DNS 尚未傳播完成

**解決方式**：
1. 確認 DNS 記錄設定正確
2. 等待 DNS 傳播（使用 `dig` 或線上工具檢查）
3. 清除 DNS 快取（如果需要）

### 問題 2：HTTPS 無法啟用

**錯誤訊息**：
```
Enforce HTTPS — Unavailable for your site because your domain is not properly configured to support HTTPS
```

**可能原因**：
1. **使用了 Cloudflare 代理（最常見）**
2. DNS 記錄尚未完全傳播
3. GitHub 正在申請憑證（需要時間）
4. 使用了 A 記錄而非 CNAME

**解決方式**：

**方案 A：關閉 Cloudflare 代理（推薦）**
1. 登入 Cloudflare DNS 管理介面
2. 找到 `cola` 的 CNAME 記錄
3. 點擊橘色雲朵 🟠 變成灰色雲朵 ⚪（DNS only）
4. 等待 DNS 傳播（5-30 分鐘）
5. 驗證：`dig cola.workxplay.net CNAME +short` 應該返回 `cscolabear.github.io.`
6. 回到 GitHub Settings 重新儲存自訂網域

**方案 B：使用 A 記錄（不推薦）**
如果必須使用 A 記錄，請設定為 GitHub Pages IP：
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**診斷指令**：
```bash
# 檢查 DNS 解析
dig cola.workxplay.net +short

# 檢查 CNAME 記錄
dig cola.workxplay.net CNAME +short

# 預期結果（CNAME）
cscolabear.github.io.

# 如果返回 IP（如 172.67.xxx.xxx）
# → 表示使用了 Cloudflare 代理或 A 記錄
```

**線上檢查工具**：
- https://www.whatsmydns.net/#CNAME/cola.workxplay.net
- https://dnschecker.org/#CNAME/cola.workxplay.net

### 問題 3：Certificate not yet created

**錯誤訊息**：
```
Certificate not yet created
```

**可能原因**：
1. DNS 記錄尚未完全傳播
2. GitHub 正在申請憑證（需要時間）

**解決方式**：
1. 等待 24 小時
2. 確認 DNS 記錄正確
3. 嘗試取消勾選再重新勾選 "Enforce HTTPS"

### 問題 3：網站無法訪問

**錯誤訊息**：
```
404 Not Found
```

**可能原因**：
1. GitHub Pages 尚未重新部署
2. CNAME 檔案位置錯誤

**解決方式**：
1. 確認 CNAME 檔案在 `docs/public/CNAME`
2. 手動觸發 GitHub Actions 重新部署
3. 檢查部署日誌是否有錯誤

## 📊 設定檢查清單

### 自動任務（系統完成）
- [ ] 建立 CNAME 檔案
- [ ] 提交到 Git
- [ ] 推送到 GitHub
- [ ] GitHub Actions 部署

### 手動任務（需要您執行）
- [ ] 設定 DNS CNAME 記錄
- [ ] 驗證 DNS 解析
- [ ] 在 GitHub Settings 設定自訂網域
- [ ] 啟用 Enforce HTTPS
- [ ] 測試 HTTP 訪問
- [ ] 測試 HTTPS 訪問
- [ ] 測試網站功能

## 📚 參考資料

- [GitHub Pages 自訂網域官方文件](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [DNS 檢查工具](https://dnschecker.org/)
- [SSL 測試工具](https://www.ssllabs.com/ssltest/)

## ⏱️ 預估時間

- **系統自動任務**：5 分鐘
- **DNS 設定**：5-10 分鐘（設定時間）+ 5-30 分鐘（傳播時間）
- **GitHub 設定**：5 分鐘
- **HTTPS 憑證**：幾分鐘到 24 小時
- **測試驗證**：10 分鐘

**總計**：約 30 分鐘 - 2 小時（不含等待 DNS 傳播）

---

**實作者**：Cola + GitHub Copilot CLI  
**目標網域**：cola.workxplay.net
