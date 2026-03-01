# 首頁布局調整

**編號**: 007
**建立日期**: 2026-03-01
**狀態**: ✅ 完成

## 📋 需求

1. 交換「最新文章」和「網站特色」位置
2. 調整「網站特色」樣式，降低視覺強度
3. 修復「最新文章」樣式
4. 添加分隔線

## 💡 技術方案

建立自訂首頁組件 `CustomHome.vue` 替代 VitePress 內建 home layout

## 📝 實作內容

### 檔案變更

1. **新增**: `docs/.vitepress/theme/components/CustomHome.vue`
   - 自訂首頁組件
   - 渲染順序: Hero → 最新文章 → 分隔線 → 網站特色

2. **修改**: `docs/.vitepress/theme/index.js`
   - 註冊 CustomHome 組件

3. **修改**: `docs/index.md`
   - layout 從 `home` 改為 `custom-home`

### 樣式調整

**最新文章區塊**：
- h2 標題: 32px, 底部邊框
- h3 標題: 20px, hover 變色
- 標籤 code: 背景色 + brand 顏色
- 「查看所有文章」hover 動畫

**分隔線**：
- 漸層效果，兩端透明
- margin: 48px 0

**網站特色區塊**：
- 移除灰色背景，改用透明背景 + 邊框
- hover 時才顯示淺灰背景
- 縮小字體 (title: 16px, details: 14px)
- 減少 padding 和間距

## ✅ 完成狀態

- [x] 分析首頁 layout 結構
- [x] 建立自訂首頁組件
- [x] 調整網站特色樣式
- [x] 修復最新文章樣式
- [x] 添加分隔線
- [x] 測試首頁顯示
- [x] 提交並部署

## 📊 測試結果

建置成功，首頁顯示順序正確：
1. Hero 橫幅
2. 最新文章（樣式正確）
3. 分隔線
4. 網站特色（已調整樣式）

## 🔗 相關 Commit

- 33ff0eb - feat: 調整首頁布局 - 交換最新文章與網站特色位置
- 9c3665d - fix: 修復最新文章區塊樣式並添加分隔線
