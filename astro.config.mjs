import { defineConfig } from 'astro/config';

// 站点 URL：Cloudflare Pages 默认子域（买自定义域名后替换此处与 config.yaml）。
// SEO 元信息 / sitemap（F004/F005）依赖 site 值。
export default defineConfig({
  site: 'https://guangxi-guide.pages.dev',
  // 默认纯静态输出；Cloudflare Pages 直接托管 dist/（无需 adapter）。
});
