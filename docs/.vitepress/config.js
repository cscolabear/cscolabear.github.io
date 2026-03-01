import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Cola's Blog",
  description: '透過 GitHub Issues 管理的個人技術 Blog',
  
  // GitHub Pages 配置
  base: '/',
  
  // 語言設定
  lang: 'zh-TW',
  
  // Head 設定
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_TW' }],
    ['meta', { property: 'og:site_name', content: "Cola's Blog" }]
  ],
  
  // Markdown 配置
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
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
    
    // 搜尋功能
    search: {
      provider: 'local'
    },
    
    // 編輯連結
    editLink: {
      pattern: 'https://github.com/cscolabear/cscolabear.github.io/issues/:path',
      text: '在 GitHub 上編輯此頁'
    },
    
    // 最後更新時間
    lastUpdated: {
      text: '最後更新',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
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
    darkModeSwitchLabel: '深色模式'
  },
  
  // Sitemap 配置
  sitemap: {
    hostname: 'https://cscolabear.github.io'
  }
})
