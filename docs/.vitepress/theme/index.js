// 使用預設主題
import DefaultTheme from 'vitepress/theme'
import './styles/custom.css'
import CustomHome from './components/CustomHome.vue'
import StructuredData from './components/StructuredData.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import RelatedPosts from './components/RelatedPosts.vue'
import ArticleMeta from './components/ArticleMeta.vue'
import CustomFooter from './components/CustomFooter.vue'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 在頁面內容前注入結構化資料、麵包屑和文章 meta 資訊
      'doc-before': () => [h(StructuredData), h(Breadcrumb), h(ArticleMeta)],
      // 在頁面內容後注入相關文章
      'doc-after': () => h(RelatedPosts),
      // 在頁尾前注入自訂頁尾
      'layout-bottom': () => h(CustomFooter)
    })
  },
  enhanceApp({ app }) {
    app.component('CustomHome', CustomHome)
  }
}
