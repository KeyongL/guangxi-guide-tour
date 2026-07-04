import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 内容集合 schema（F002）。Astro 构建期用它校验 frontmatter：
// 非法/缺失必填字段会让 `npm run build` 直接失败，而非静默通过。
// 站长只写 Markdown + frontmatter，不碰代码。

// 签证分区：twov = 240h 过境免签区内；non-twov = 崇左/百色等区外。
// F010 据此自动挂载 visa-alert 提醒框（不靠作者记忆）。
const VISA_ZONE = ['twov', 'non-twov'] as const;

// 攻略文章：标题/摘要/封面/区域/签证分区/实地核实日期（SPEC 输入定义 + F014）。
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/guides' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    region: z.string(),
    visa_zone: z.enum(VISA_ZONE),
    slug: z.string().optional(),
    cover: z.string().optional(),
    // 实地核实日期（"Last verified on the ground"）；无则不显示假日期（F014）。
    verified: z.coerce.date().optional(),
  }),
});

// 城市名片：SPEC「城市名片数据模型」（SPEC §交互增强与城市名片）+ F047。
const cities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/cities' }),
  schema: z.object({
    name_en: z.string(),
    name_local: z.string(),
    region: z.string(),
    visa_zone: z.enum(VISA_ZONE),
    days: z.number(),
    must_eat: z.array(z.string()),
    attractions: z.array(z.string()),
    // 活动强度评级（Chill ↔ Adventurous）+ 招牌硬核玩法。
    activity_level: z.string(),
    adventure_hook: z.string(),
    // 日预算区间 + 最后核实日期；缺核实日期即视为过期，走「未核实」态（F032）。
    daily_budget: z.string().optional(),
    budget_verified_on: z.coerce.date().optional(),
    // 指向经过本城市的流向攻略链接（可空，F047 空态）。
    flow_links: z.array(z.string()).optional(),
  }),
});

export const collections = { guides, cities };
