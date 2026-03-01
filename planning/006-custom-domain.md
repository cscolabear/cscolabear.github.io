# 自訂網域設定計劃

**編號**：006  
**建立日期**：2026-03-01  
**狀態**：✅ 完成  
**目標網域**：cola.workxplay.net

## 📋 目標

將 GitHub Pages 網站從預設的 `cscolabear.github.io` 設定為自訂網域 `cola.workxplay.net`。

## 🎯 需求

1. 建立 CNAME 檔案指定自訂網域
2. 設定 DNS CNAME 記錄
3. 在 GitHub 設定中啟用自訂網域
4. 啟用 HTTPS（自動）
5. 測試網域解析與 HTTPS

## 🎯 SSL/HTTPS 方案

採用 **Cloudflare SSL**

**DNS 設定**：CNAME | cola | cscolabear.github.io | Proxied 🟠

**SSL 提供者**：Cloudflare Universal SSL

**優點**：CDN 加速、DDoS 防護、自動 HTTPS、HTTP/2/3、Brotli 壓縮

**⚠️ 重要設定**：
- SSL/TLS 模式：**Full** 或 **Full (strict)**
- 不要使用：Flexible（會造成重定向迴圈）

---

## 🚀 設定步驟

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

#### ⏳ Task 1: Cloudflare DNS 設定（需手動）

**在 Cloudflare DNS 管理介面設定**：

| 類型 | 名稱 | 值 | 代理狀態 | TTL |
|------|------|-----|----------|-----|
| CNAME | cola | cscolabear.github.io | Proxied 🟠 | Auto |

**重點**：
- 類型：CNAME（不是 A）
- 代理狀態：**Proxied**（橘色雲朵 🟠，不是灰色）
- 值：cscolabear.github.io（可以不加結尾的點）

**驗證方式**：
```bash
# DNS 解析應該返回 Cloudflare IP
dig cola.workxplay.net +short
# 預期結果：172.x.x.x 或 104.x.x.x (Cloudflare IP)
```

#### ⏳ Task 2: Cloudflare SSL/TLS 設定（需手動）

**步驟**：

1. 前往 Cloudflare Dashboard
   - 選擇 workxplay.net 網域

2. 前往 SSL/TLS → Overview

3. 選擇加密模式：
   - **Full** ✅（推薦）
   - Full (strict) ✅（如果 cscolabear.github.io 有有效憑證）

4. （可選）啟用額外功能：
   - SSL/TLS → Edge Certificates → Always Use HTTPS（強制 HTTPS）
   - SSL/TLS → Edge Certificates → Automatic HTTPS Rewrites（自動重寫）

**注意事項**：
- ❌ 不要選擇 "Flexible"（會造成重定向迴圈）
- GitHub Pages 有預設的 HTTPS，所以 Full 模式可正常運作

#### ⏳ Task 3: 測試驗證（需手動）

**測試項目**：

1. **HTTPS 訪問測試**
   ```
   https://cola.workxplay.net
   ```
   - ✅ 使用 HTTPS 連線
   - ✅ 瀏覽器顯示綠色鎖頭
   - ✅ 網站正常顯示

2. **檢查 SSL 憑證**
   - 點擊瀏覽器網址列的鎖頭圖示
   - 查看憑證資訊
   - ✅ 簽發者應該是 "Cloudflare"

3. **檢查 Cloudflare**
   ```bash
   curl -I https://cola.workxplay.net
   ```
   - ✅ 應該看到 "cf-ray" header
   - ✅ 應該看到 "server: cloudflare"

4. **功能測試**
   - ✅ 首頁顯示正常
   - ✅ 文章列表可訪問
   - ✅ 單篇文章可開啟
   - ✅ 留言顯示正常
   - ✅ GitHub 討論連結正確

5. **效能測試**（可選）
   - 使用 https://www.webpagetest.org/
   - 應該能看到 Cloudflare CDN 加速效果



---

**實作者**：Cola + GitHub Copilot CLI  
**目標網域**：cola.workxplay.net
