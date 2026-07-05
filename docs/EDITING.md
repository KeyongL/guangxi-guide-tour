# 站长编辑手册 — 不碰代码改网站

> 这就是你的"管理后台"。全站内容 = 一堆 Markdown 文件，改完存盘，
> 跑一次 `npm run build` 没报错就是改对了。报错信息会告诉你哪个文件哪一行。

## 一、最常干的事

### 1. 改一篇攻略的内容
文件在 `content/guides/`，一篇文章 = 一个 `.md` 文件：

| 文件 | 文章 |
|---|---|
| fly-into-guangxi-exit-vietnam.md | 流向A旗舰（飞进来、陆路去越南） |
| vietnam-to-china-overland.md | 流向B旗舰（越南陆路进来） |
| foreign-card-wechat-alipay.md | 外卡绑微信/支付宝 |
| international-esim-china.md | 国际 eSIM |
| weizhou-island.md | 涠洲岛 |
| beihai-old-street.md | 北海老街 |
| beihai-seafood-market.md | 海鲜市场 |
| detian-chongzuo.md | 德天+友谊关（崇左） |
| leye-tiankeng.md | 乐业天坑（百色） |
| bama-longevity.md | 巴马 |

正文就是普通 Markdown：`## 标题` 会自动生成目录（TOC），改标题=改目录。

### 2. 核实一个价格后删标记
文中所有没核实的数字都跟着 `(not yet verified)`。你核实后：
- 数字对 → 删掉 `(not yet verified)` 几个字即可
- 数字错 → 改成对的数字，再删标记
- 全文都核实完 → 在文件顶部 frontmatter 加一行 `verified: 2026-07-15`（当天日期），
  页面会自动显示 "Last verified on the ground" 信任标

查还剩多少没核实：`grep -rn "not yet verified" content/guides/`

### 3. 写一篇新攻略
复制任何一篇现有 `.md`，改文件名（小写连字符），然后必改的头部字段：

```yaml
---
title: "英文标题"
summary: "一两句英文摘要（显示在列表和搜索结果里）"
region: "Beihai & Weizhou"        # 区域名
visa_zone: "twov"                  # 二选一：twov=240h过境免签区内；non-twov=崇左/百色
slug: "url-里的路径名"             # 可省略，省略则用文件名
---
```

⚠️ 两条机器强制的规则（写错 build 直接报错，不会静默放过）：
- 崇左/百色相关文章 **必须** `visa_zone: "non-twov"`（会自动挂签证警告框）
- 正文出现非法越境/翻墙类词汇会被合规门拦截

### 4. 改首页
文件：`src/pages/index.astro`（这个是代码文件，但你只需要动文字）：
- 大标题/副标题：搜 `<h1>` 和 `class="sub"`
- 你的身份信任线：搜 `class="trust"`（只改那一行文字）
- 城市卡片里的天数/预算/必吃：搜 `card-beihai` 等 id，就近改文字

### 5. 改 About 页（你的故事，信任核心）
文件：`src/pages/about.astro`，同样只动文字部分。

## 二、改完之后（每次必做）

```bash
npm run build        # 这就是"检查"：frontmatter 错、断链、违规词都会在这一步报出来
npm run dev          # 本地预览 http://127.0.0.1:4321
```

满意后提交：
```bash
git add content/ src/pages/
git commit -m "content: 核实涠洲岛船票价格"   # 写清楚改了什么
```

（上线 Cloudflare Pages 后，git push 即自动重新部署，无需其他操作。）

## 三、以后加图片（等你准备好了再看）

1. 图片文件放 `public/images/`（建议按城市建子目录，如 `public/images/weizhou/`）
2. 文章里插入：`![Ferry at Beihai port](/images/weizhou/ferry.jpg)`
3. 文件名小写连字符，单张 <300KB（手机拍的先压缩，否则拖慢 Lighthouse）

## 四、别碰的东西

- `feature_list.json` —— 只许改 `passes` 字段（true/false）
- `src/content.config.ts`、`scripts/`、`astro.config.*` —— 改坏了 build 全挂
- `.env` —— 凭证，永不进 git

哪里不确定，开个 Claude 会话问一句再动手。
