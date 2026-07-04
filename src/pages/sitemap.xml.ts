import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// 站点 URL 与 astro.config.mjs 保持一致（买自定义域名后一起替换）。
const SITE = 'https://guangxi-guide.pages.dev';

// 枚举 src/pages 下所有 .astro 静态页面；新增页面自动纳入 sitemap。
const pageFiles = import.meta.glob('./**/*.astro');

// 文件路径 → 站点路由：'./index.astro'→'/'，'./about.astro'→'/about'。
function toRoute(filePath: string): string {
  const path = filePath.replace(/^\.\//, '').replace(/\.astro$/, '');
  return '/' + path.replace(/(^|\/)index$/, '$1').replace(/\/$/, '');
}

// 路由 → 绝对 URL：与 Astro 目录式输出一致，非根路径带尾斜杠。
function toLoc(route: string): string {
  return route === '/' ? `${SITE}/` : `${SITE}${route}/`;
}

export const GET: APIRoute = async () => {
  // 动态路由文件（如 guides/[slug].astro）不映射固定 URL，排除字面 [slug]；
  // 其真实页面 URL 从内容集合枚举（F005 交接注记预留的补口，F021 落实）。
  const staticRoutes = Object.keys(pageFiles)
    .filter((p) => !p.includes('['))
    .map(toRoute);
  const guides = await getCollection('guides');
  const guideRoutes = guides.map((g) => `/guides/${g.data.slug ?? g.id}`);
  const locs = [...staticRoutes, ...guideRoutes].sort().map(toLoc);
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    locs.map((loc) => `  <url><loc>${loc}</loc></url>`).join('\n') +
    '\n</urlset>\n';

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
