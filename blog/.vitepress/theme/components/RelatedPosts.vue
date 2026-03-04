<script setup>
import { data as posts } from '../composables/posts.data.js'
import { useData } from 'vitepress'
import seoConfig from '../../../../seo.config.js'

const { page, frontmatter } = useData()
const { posts: postsConfig } = seoConfig

// 計算標籤相似度
function calculateSimilarity(tags1, tags2) {
  if (!tags1 || !tags2 || tags1.length === 0 || tags2.length === 0) {
    return 0
  }
  
  const set1 = new Set(tags1)
  const set2 = new Set(tags2)
  const intersection = new Set([...set1].filter(x => set2.has(x)))
  const union = new Set([...set1, ...set2])
  
  // Jaccard 相似度
  return intersection.size / union.size
}

// 獲取相關文章
function getRelatedPosts() {
  // 只在文章頁面顯示
  if (!page.value.relativePath.startsWith('posts/') || 
      page.value.relativePath.endsWith('index.md')) {
    return []
  }
  
  const currentTags = frontmatter.value.tags || []
  const currentIssueId = frontmatter.value.issueId
  
  if (currentTags.length === 0) {
    return []
  }
  
  // 計算所有文章的相似度
  const scored = posts
    .filter(post => post.issueId !== currentIssueId) // 排除當前文章
    .map(post => ({
      ...post,
      similarity: calculateSimilarity(currentTags, post.tags || [])
    }))
    .filter(post => post.similarity > 0) // 至少有一個共同標籤
    .sort((a, b) => b.similarity - a.similarity) // 按相似度排序
    .slice(0, postsConfig.relatedPostsCount) // 取前 N 篇
  
  return scored
}

const relatedPosts = getRelatedPosts()
</script>

<template>
  <div v-if="relatedPosts.length > 0" class="related-posts">
    <h2 class="related-title">📚 相關文章</h2>
    <ul class="related-list">
      <li
        v-for="post in relatedPosts"
        :key="post.url"
        class="related-item"
      >
        <a :href="post.url" class="related-link">
          <span class="related-post-title">{{ post.title }}</span>
          <span v-if="post.tags && post.tags.length > 0" class="related-tags">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="related-tag"
            >
              {{ tag }}
            </span>
          </span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.related-posts {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.related-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.related-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.related-item {
  margin: 0;
}

.related-link {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.2s;
  border: 1px solid var(--vp-c-divider);
}

.related-link:hover {
  background-color: var(--vp-c-bg-soft);
}

.related-post-title {
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.related-link:hover .related-post-title {
  color: var(--vp-c-brand-2);
}

.related-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.related-tag {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  border-radius: 4px;
  font-size: 0.85rem;
}
</style>
