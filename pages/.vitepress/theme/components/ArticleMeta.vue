<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="article-meta">
    <div class="meta-item" v-if="frontmatter.author">
      <span class="meta-icon">👤</span>
      <span class="meta-text">{{ frontmatter.author }}</span>
    </div>
    
    <div class="meta-item" v-if="frontmatter.date">
      <span class="meta-icon">📅</span>
      <span class="meta-text">{{ formatDate(frontmatter.date) }}</span>
    </div>
    
    <div class="meta-item" v-if="frontmatter.updated && frontmatter.updated !== frontmatter.date">
      <span class="meta-icon">🔄</span>
      <span class="meta-text">更新於 {{ formatDate(frontmatter.updated) }}</span>
    </div>
    
    <div class="meta-item" v-if="frontmatter.readingTime">
      <span class="meta-icon">⏱️</span>
      <span class="meta-text">{{ frontmatter.readingTime }}</span>
    </div>
    
    <div class="meta-tags" v-if="frontmatter.tags && frontmatter.tags.length > 0">
      <span class="meta-icon">🏷️</span>
      <span 
        v-for="tag in frontmatter.tags" 
        :key="tag"
        class="tag"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.meta-icon {
  font-size: 1rem;
}

.meta-text {
  line-height: 1.4;
}

.meta-tags {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 0.25rem;
  font-size: 0.85rem;
  transition: background-color 0.2s;
}

.tag:hover {
  background-color: var(--vp-c-bg-mute);
}

@media (max-width: 768px) {
  .article-meta {
    font-size: 0.85rem;
  }
  
  .meta-icon {
    font-size: 0.9rem;
  }
}
</style>
