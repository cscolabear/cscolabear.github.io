/**
 * SEO 配置檔
 *
 * 集中管理所有 SEO 相關配置，包含域名、網站資訊、社群媒體等
 * 所有需要使用網站 URL 或 SEO 資訊的地方都應從此檔案讀取
 */

export default {
  // 網站基本資訊
  site: {
    // 主域名（不含尾隨斜線）
    url: 'https://cola.workxplay.net',

    // 網站名稱
    name: 'WorkxPlay 工作與玩樂實驗室',

    // 網站描述
    description: 'Cola 的技術筆記與分享',

    // 語言設定
    locale: 'zh_TW',
    lang: 'zh-TW',

    // 作者資訊
    author: {
      name: 'Cola',
      email: '', // 可選填
    },

    // 版權資訊
    copyright: 'Copyright © 2026 Cola'
  },

  // 社群媒體帳號
  social: {
    // GitHub 使用者名稱
    github: 'cscolabear',

    // Twitter 帳號（可選，未來如有需要可填入）
    twitter: '', // 例如：'@your_handle'

    // Facebook 專頁（可選）
    facebook: '',

    // LinkedIn（可選）
    linkedin: ''
  },

  // GitHub 設定
  github: {
    owner: 'cscolabear',
    repo: 'cscolabear.github.io',
    publishLabel: 'Publishing',
    state: 'closed'
  },

  // SEO 特定設定
  seo: {
    // 預設 Open Graph 圖片（相對於 public 目錄）
    defaultOgImage: '/og-image.png',

    // 網站預設關鍵字
    keywords: ['php', 'seo', '技術 Blog', 'VitePress', 'GitHub Issues', '前端開發', '程式設計'],

    // Google Search Console 驗證碼（待填入）
    googleSiteVerification: '',

    // Google Analytics 4 測量 ID（待填入）
    // 格式：G-XXXXXXXXXX
    ga4MeasurementId: 'G-L02Y58BHWY',

    // 是否啟用 Google Analytics
    enableGA4: true,

    // 主題顏色
    themeColor: '#3c8772'
  },

  // 文章設定
  posts: {
    // 預設作者（如果文章沒有指定作者）
    defaultAuthor: 'Cola',

    // Meta description 最大長度
    metaDescriptionLength: 160,

    // 文章摘要最大長度
    excerptLength: 200,

    // 相關文章推薦數量
    relatedPostsCount: 3,

    // 顯示的留言數量
    commentsDisplayCount: 10
  },

  // RSS Feed 設定
  rss: {
    // Feed 標題
    title: 'WorkxPlay 工作與玩樂實驗室',

    // Feed 描述
    description: '透過 GitHub Issues 管理的個人技術 Blog - 最新文章訂閱',

    // Feed 檔案名稱
    filename: 'feed.xml',

    // Feed 語言
    language: 'zh-TW',

    // Feed 圖示
    image: '/favicon.ico',

    // 版權資訊
    copyright: 'Copyright © 2026 Cola',

    // Feed 中包含的文章數量（最多）
    itemCount: 20
  }
}
