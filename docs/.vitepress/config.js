import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Cola's Blog",
  description: '透過 GitHub Issues 管理的個人技術 Blog',
  
  // GitHub Pages 配置
  base: '/',
  
  // 語言設定
  lang: 'zh-TW',
  
  // 清理 URL（移除 .html 後綴）
  cleanUrls: true,
  
  // Head 設定（SEO 優化）
  head: [
    // Favicon
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    
    // 主題顏色
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    
    // Open Graph（社群分享）
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_TW' }],
    ['meta', { property: 'og:site_name', content: "Cola's Blog" }],
    ['meta', { property: 'og:image', content: 'https://cscolabear.github.io/og-image.png' }],
    
    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: "Cola's Blog" }],
    ['meta', { name: 'twitter:description', content: '透過 GitHub Issues 管理的個人技術 Blog' }],
    
    // 移動裝置優化
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0' }],
    
    // Google Search Console（需要時取消註解並替換 content）
    // ['meta', { name: 'google-site-verification', content: 'your-verification-code' }],
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
      { text: '文章列表', link: '/posts/' },
      { text: '關於', link: '/about' },
      { 
        text: 'GitHub', 
        link: 'https://github.com/cscolabear/cscolabear.github.io' 
      }
    ],
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cscolabear' }
    ],
    
    footer: {
      message: '基於 VitePress 建置，內容來自 GitHub Issues',
      copyright: 'Copyright © 2026 Cola'
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
    hostname: 'https://cscolabear.github.io'
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

