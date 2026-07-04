import type { APIRoute } from 'astro';

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

export const GET: APIRoute = () => {
  const locs = Object.keys(pageFiles).map(toRoute).sort().map(toLoc);
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    locs.map((loc) => `  <url><loc>${loc}</loc></url>`).join('\n') +
    '\n</urlset>\n';

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
