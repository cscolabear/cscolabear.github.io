<script setup>
import { useData } from 'vitepress'
import seoConfig from '../../../../seo.config.js'

const { page, frontmatter } = useData()
const { site } = seoConfig

// 判斷是否為文章頁面
const isArticle = page.value.relativePath.startsWith('posts/') && 
                  !page.value.relativePath.endsWith('index.md')

// 生成結構化資料
const getStructuredData = () => {
  if (isArticle) {
    // 文章頁面的 BlogPosting Schema（Article 的子類型，更適合 blog）
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: frontmatter.value.title || page.value.title,
      description: frontmatter.value.description || '',
      author: {
        '@type': 'Person',
        name: frontmatter.value.author || site.author,
        url: `${site.url}/about`
      },
      publisher: {
        '@type': 'Organization',
        name: site.name,
        logo: {
          '@type': 'ImageObject',
          url: `${site.url}${seoConfig.seo.defaultOgImage}`
        }
      },
      datePublished: frontmatter.value.date,
      dateModified: frontmatter.value.updated || frontmatter.value.date,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${site.url}/${page.value.relativePath.replace(/\.md$/, '')}`
      },
      ...(frontmatter.value.keywords && {
        keywords: Array.isArray(frontmatter.value.keywords) 
          ? frontmatter.value.keywords.join(', ')
          : frontmatter.value.keywords
      }),
      ...(frontmatter.value.readingTime && {
        timeRequired: `PT${frontmatter.value.readingMinutes || 1}M`
      }),
      ...(frontmatter.value.tags && {
        keywords: Array.isArray(frontmatter.value.tags)
          ? frontmatter.value.tags.join(', ')
          : frontmatter.value.tags
      }),
      inLanguage: site.locale.replace('_', '-'),
      // 添加文章 URL 作為 image（如有自訂圖片可覆蓋）
      image: frontmatter.value.image || `${site.url}${seoConfig.seo.defaultOgImage}`
    }
  } else if (page.value.relativePath === 'index.md') {
    // 首頁的 WebSite + Blog Schema
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: site.name,
        description: site.description,
        url: site.url,
        author: {
          '@type': 'Person',
          name: site.author
        },
        inLanguage: site.locale.replace('_', '-')
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: site.name,
        description: site.description,
        url: site.url,
        author: {
          '@type': 'Person',
          name: site.author
        },
        inLanguage: site.locale.replace('_', '-')
      }
    ]
  } else {
    // 其他頁面的 WebPage Schema
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: frontmatter.value.title || page.value.title,
      description: frontmatter.value.description || site.description,
      url: `${site.url}/${page.value.relativePath.replace(/\.md$/, '').replace(/index$/, '')}`,
      inLanguage: site.locale.replace('_', '-')
    }
  }
}
</script>

<template>
  <component :is="'script'" type="application/ld+json" v-if="Array.isArray(getStructuredData())">
    {{ JSON.stringify(getStructuredData()) }}
  </component>
  <component :is="'script'" type="application/ld+json" v-else>
    {{ JSON.stringify(getStructuredData()) }}
  </component>
</template>
