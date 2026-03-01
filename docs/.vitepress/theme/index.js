// 使用預設主題
import DefaultTheme from 'vitepress/theme'
import './styles/custom.css'
import CustomHome from './components/CustomHome.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('CustomHome', CustomHome)
  }
}
