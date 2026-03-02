import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/*.md', {
  includeSrc: false,
  render: false,
  excerpt: false,
  transform(rawData) {
    return rawData
      .filter(page => !page.url.endsWith('/posts/')) // 排除 index 頁面
      .map(page => ({
        title: page.frontmatter.title,
        url: page.url,
        date: page.frontmatter.date,
        updated: page.frontmatter.updated,
        description: page.frontmatter.description,
        tags: page.frontmatter.tags || [],
        category: page.frontmatter.category,
        issueId: page.frontmatter.issueId
      }))
      .sort((a, b) => {
        // 按更新時間倒序
        return new Date(b.updated || b.date) - new Date(a.updated || a.date)
      })
  }
})
