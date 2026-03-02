<script setup>
import seoConfig from '../../../../seo.config.js'

const { site } = seoConfig
</script>

<template>
  <div class="custom-footer-links">
    <div class="footer-rss-section">
      <span class="footer-label">📡 訂閱更新：</span>
      <a :href="`${site.url}/rss.xml`" target="_blank" rel="noopener noreferrer" class="footer-link">
        RSS
      </a>
      <span class="separator">•</span>
      <a :href="`${site.url}/atom.xml`" target="_blank" rel="noopener noreferrer" class="footer-link">
        Atom
      </a>
      <span class="separator">•</span>
      <a :href="`${site.url}/feed.json`" target="_blank" rel="noopener noreferrer" class="footer-link">
        JSON
      </a>
    </div>
  </div>
</template>

<style scoped>
.custom-footer-links {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
}

.footer-rss-section {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.footer-label {
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.footer-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

.separator {
  color: var(--vp-c-text-3);
  padding: 0 0.25rem;
}

@media (max-width: 640px) {
  .footer-rss-section {
    font-size: 0.85rem;
  }
}
</style>
