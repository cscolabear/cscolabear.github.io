import { defineConfig } from 'vitepress'
import seoConfig from '../../seo.config.js'

const { site, seo, social } = seoConfig

export default defineConfig({
  title: site.name,
  description: site.description,

  // GitHub Pages 配置
  base: '/',

  // 語言設定
  lang: site.lang,

  // 清理 URL（移除 .html 後綴）
  cleanUrls: true,

  // URL 重寫規則（文章路徑）
  rewrites: {
    'posts/:slug.md': ':slug.md'
  },

  // Head 設定（SEO 優化）
  head: [
    // Favicon
    ['link', { rel: 'icon', href: '/favicon.ico' }],

    // 主題顏色
    ['meta', { name: 'theme-color', content: seo.themeColor }],

    // Open Graph（社群分享）
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: site.locale }],
    ['meta', { property: 'og:site_name', content: site.name }],
    ['meta', { property: 'og:image', content: `${site.url}${seo.defaultOgImage}` }],

    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: site.name }],
    ['meta', { name: 'twitter:description', content: site.description }],
    ['meta', { name: 'twitter:image', content: `${site.url}${seo.defaultOgImage}` }],
    ...(social.twitter ? [['meta', { name: 'twitter:site', content: social.twitter }]] : []),
    ...(social.twitter ? [['meta', { name: 'twitter:creator', content: social.twitter }]] : []),

    // 移動裝置優化
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0' }],

    // Google Search Console（如果有設定驗證碼）
    ...(seo.googleSiteVerification ? [['meta', { name: 'google-site-verification', content: seo.googleSiteVerification }]] : []),

    // Google Analytics 4（如果啟用）
    ...(seo.enableGA4 && seo.ga4MeasurementId ? [
      ['script', { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${seo.ga4MeasurementId}` }],
      ['script', {}, `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${seo.ga4MeasurementId}');`]
    ] : []),

    // RSS Feed alternate links
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'RSS 2.0', href: `${site.url}/rss.xml` }],
    ['link', { rel: 'alternate', type: 'application/atom+xml', title: 'Atom 1.0', href: `${site.url}/atom.xml` }],
    ['link', { rel: 'alternate', type: 'application/json', title: 'JSON Feed', href: `${site.url}/feed.json` }],
  ],

  // Markdown 配置
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    // 自訂標題錨點
    anchor: {
      permalink: true,
      permalinkBefore: false,
      permalinkSymbol: '#'
    }
  },

  // 主題配置
  themeConfig: {
    logo: '/favicon.ico',

    nav: [
      { text: '首頁', link: '/' },
      { text: '文章列表', link: '/articles' },
      { text: '關於', link: '/about' },
      {
        text: 'GitHub',
        link: `https://github.com/${social.github}/${seoConfig.github.repo}`
      }
    ],

    socialLinks: [
      { icon: 'github', link: `https://github.com/${social.github}` }
    ],

    footer: {
      message: '',
      copyright: site.copyright
    },

    // 本地搜尋功能
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜尋文章',
            buttonAriaLabel: '搜尋文章'
          },
          modal: {
            noResultsText: '找不到相關結果',
            resetButtonTitle: '清除查詢條件',
            footer: {
              selectText: '選擇',
              navigateText: '切換',
              closeText: '關閉'
            }
          }
        }
      }
    },

    // 最後更新時間
    lastUpdated: {
      text: '最後更新',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Taipei'
      }
    },

    // 文檔頁尾
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    // 大綱配置
    outline: {
      level: [2, 3],
      label: '本頁目錄'
    },

    // 返回頂部
    returnToTopLabel: '返回頂部',
    sidebarMenuLabel: '選單',
    darkModeSwitchLabel: '深色模式',
    lightModeSwitchTitle: '切換至淺色模式',
    darkModeSwitchTitle: '切換至深色模式'
  },

  // Sitemap 配置（SEO 重要）
  sitemap: {
    hostname: site.url
  },

  // transformHead - 為每個頁面動態添加 meta 標籤
  transformHead: ({ pageData }) => {
    const head = []

    // 添加 canonical URL（避免重複內容問題）
    const canonicalUrl = `${site.url}/${pageData.relativePath.replace(/\.md$/, '').replace(/index$/, '')}`
    head.push(['link', { rel: 'canonical', href: canonicalUrl }])

    // 為文章頁面添加特定的 meta 標籤（透過 frontmatter.issueId 判斷）
    const { frontmatter } = pageData
    
    // 為所有有 frontmatter.description 的頁面覆蓋 description
    if (frontmatter.description && !frontmatter.issueId) {
      head.push(['meta', { name: 'description', content: frontmatter.description }])
      head.push(['meta', { property: 'og:description', content: frontmatter.description }])
      head.push(['meta', { name: 'twitter:description', content: frontmatter.description }])
    }
    
    if (frontmatter.issueId) {
      // 文章專屬 OG 標籤
      if (frontmatter.title) {
        head.push(['meta', { property: 'og:title', content: frontmatter.title }])
        head.push(['meta', { property: 'og:url', content: canonicalUrl }])
      }

      if (frontmatter.description) {
        head.push(['meta', { property: 'og:description', content: frontmatter.description }])
        head.push(['meta', { name: 'description', content: frontmatter.description }])
      }

      // Keywords meta 標籤
      if (frontmatter.keywords && Array.isArray(frontmatter.keywords)) {
        head.push(['meta', { name: 'keywords', content: frontmatter.keywords.join(', ') }])
      }

      // Twitter Card 文章專屬標籤
      if (frontmatter.title) {
        head.push(['meta', { name: 'twitter:title', content: frontmatter.title }])
      }
      if (frontmatter.description) {
        head.push(['meta', { name: 'twitter:description', content: frontmatter.description }])
      }
      head.push(['meta', { name: 'twitter:image', content: `${site.url}${seo.defaultOgImage}` }])

      // 文章類型
      head.push(['meta', { property: 'og:type', content: 'article' }])

      // 文章發布和更新時間
      if (frontmatter.date) {
        head.push(['meta', { property: 'article:published_time', content: frontmatter.date }])
      }
      if (frontmatter.updated) {
        head.push(['meta', { property: 'article:modified_time', content: frontmatter.updated }])
      }

      // 文章作者
      if (frontmatter.author) {
        head.push(['meta', { property: 'article:author', content: frontmatter.author }])
      }

      // 文章標籤
      if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
        frontmatter.tags.forEach(tag => {
          head.push(['meta', { property: 'article:tag', content: tag }])
        })
      }
    }

    return head
  },

  // transformHtml - 在建置時處理 HTML（移除 generator meta tag）
  transformHtml: (html) => {
    return html.replace(/<meta name="generator" content="VitePress[^>]*>/g, '')
  },

  // 建置優化
  vite: {
    build: {
      // 移除 console
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  }
})

