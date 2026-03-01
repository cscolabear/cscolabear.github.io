<template>
  <div class="custom-home">
    <!-- Hero 區塊 -->
    <div class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="name">{{ heroName }}</h1>
          <p class="text">{{ heroText }}</p>
          <div class="actions" v-if="heroActions.length">
            <a
              v-for="(action, i) in heroActions"
              :key="i"
              :href="action.link"
              :class="['action-button', `action-${action.theme}`]"
            >
              {{ action.text }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 最新文章區塊 -->
    <div class="latest-posts-section vp-doc">
      <div class="container">
        <Content />
      </div>
    </div>

    <!-- 分隔線 -->
    <div class="section-divider"></div>

    <!-- 網站特色區塊 -->
    <div class="features-section">
      <div class="container">
        <h2>網站特色</h2>
        <div class="features-grid">
          <div
            v-for="(feature, i) in features"
            :key="i"
            class="feature-item"
          >
            <div class="icon">{{ feature.icon }}</div>
            <h3 class="title">{{ feature.title }}</h3>
            <p class="details">{{ feature.details }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
import { Content } from 'vitepress'

const { frontmatter } = useData()

const heroName = frontmatter.value.hero?.name || ''
const heroText = frontmatter.value.hero?.text || ''
const heroActions = frontmatter.value.hero?.actions || []
const features = frontmatter.value.features || []
</script>

<style scoped>
.custom-home {
  padding-bottom: 64px;
}

.container {
  margin: 0 auto;
  max-width: 1152px;
  padding: 0 24px;
}

/* Hero 區塊 */
.hero-section {
  padding: 48px 0 64px;
}

.hero-content {
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
}

.name {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  background: linear-gradient(120deg, var(--vp-c-brand-1) 30%, var(--vp-c-brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 16px;
}

.text {
  font-size: 20px;
  color: var(--vp-c-text-2);
  margin: 0 0 32px;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-button {
  display: inline-block;
  border-radius: 20px;
  padding: 0 20px;
  line-height: 38px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
}

.action-brand {
  background-color: var(--vp-c-brand-1);
  color: #fff;
}

.action-brand:hover {
  background-color: var(--vp-c-brand-2);
}

.action-alt {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.action-alt:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

/* 最新文章區塊樣式 */
.latest-posts-section {
  padding: 0 0 48px;
}

/* 確保使用 VitePress 預設樣式 */
.latest-posts-section.vp-doc h2 {
  margin: 20px 0;
  font-size: 28px;
  font-weight: 600;
  border-top: none;
  padding-top: 0;
}

/* 最新文章區塊的 H2 連結樣式 - 確保藍色 */
.latest-posts-section.vp-doc h2 a {
  color: var(--vp-c-brand-1) !important;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.25s;
}

.latest-posts-section.vp-doc h2 a:hover {
  border-bottom-color: var(--vp-c-brand-1);
}

/* 隱藏最新文章區塊的錨點符號 */
.latest-posts-section .header-anchor {
  display: none !important;
}

/* 查看所有文章連結 */
.latest-posts-section .view-all {
  margin-top: 16px;
  text-align: right !important;
}

.latest-posts-section.vp-doc .view-all {
  text-align: right !important;
}

.latest-posts-section.vp-doc p.view-all {
  text-align: right !important;
}

.latest-posts-section .container .view-all {
  text-align: right !important;
}

.latest-posts-section .view-all a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color 0.25s;
}

.latest-posts-section .view-all a:hover {
  color: var(--vp-c-brand-2);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .latest-posts-section.vp-doc h2 {
    margin: 16px 0;
    font-size: 24px;
  }
}

/* 分隔線樣式 */
.section-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, var(--vp-c-divider) 20%, var(--vp-c-divider) 80%, transparent);
  margin: 48px 0;
}

/* 網站特色區塊 - 降低視覺強度 */
.features-section {
  padding: 24px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.feature-item {
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  transition: all 0.3s;
  background-color: transparent;
}

.feature-item:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-soft);
  transform: translateY(-2px);
}

.icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
}

.details {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .name {
    font-size: 36px;
  }

  .text {
    font-size: 18px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
