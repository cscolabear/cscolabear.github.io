<script setup>
import { useData } from 'vitepress'
import seoConfig from '../../../../seo.config.js'

const { page, frontmatter } = useData()
const { site } = seoConfig

// 生成麵包屑路徑
const getBreadcrumbItems = () => {
  const items = [
    {
      name: '首頁',
      url: site.url
    }
  ]
  
  const path = page.value.relativePath.replace(/\.md$/, '')
  const segments = path.split('/').filter(Boolean)
  
  if (segments.length > 0) {
    // 如果在 posts 目錄下
    if (segments[0] === 'posts') {
      items.push({
        name: '文章列表',
        url: `${site.url}/posts/`
      })
      
      // 如果是具體文章頁面
      if (segments.length > 1 && segments[1] !== 'index') {
        items.push({
          name: frontmatter.value.title || page.value.title,
          url: `${site.url}/${path}`
        })
      }
    } else if (path !== 'index') {
      // 其他頁面
      items.push({
        name: frontmatter.value.title || page.value.title,
        url: `${site.url}/${path}`
      })
    }
  }
  
  return items
}

// 生成 BreadcrumbList 結構化資料
const getBreadcrumbSchema = () => {
  const items = getBreadcrumbItems()
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

const breadcrumbItems = getBreadcrumbItems()
const showBreadcrumb = breadcrumbItems.length > 1
</script>

<template>
  <div v-if="showBreadcrumb" class="vp-breadcrumb">
    <!-- 結構化資料 -->
    <component :is="'script'" type="application/ld+json">
      {{ JSON.stringify(getBreadcrumbSchema()) }}
    </component>
    
    <!-- UI 顯示 -->
    <nav aria-label="麵包屑" class="breadcrumb-nav">
      <ol class="breadcrumb-list">
        <li
          v-for="(item, index) in breadcrumbItems"
          :key="index"
          class="breadcrumb-item"
        >
          <a
            v-if="index < breadcrumbItems.length - 1"
            :href="item.url"
            class="breadcrumb-link"
          >
            {{ item.name }}
          </a>
          <span v-else class="breadcrumb-current">
            {{ item.name }}
          </span>
          <span
            v-if="index < breadcrumbItems.length - 1"
            class="breadcrumb-separator"
            aria-hidden="true"
          >
            /
          </span>
        </li>
      </ol>
    </nav>
  </div>
</template>

<style scoped>
.vp-breadcrumb {
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;
}

.breadcrumb-nav {
  font-size: 0.9rem;
}

.breadcrumb-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

.breadcrumb-current {
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.breadcrumb-separator {
  color: var(--vp-c-text-3);
}
</style>
