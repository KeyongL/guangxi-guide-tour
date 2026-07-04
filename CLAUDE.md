# 项目宪法（每个会话自动加载）
# ⚠️ 保持在 200 行以内——超出会消耗过多上下文

## 项目地图
- 规格说明:     docs/SPEC.md
- 设计文档:     docs/DESIGN.md（有 UI 时）
- SaaS 清单:    docs/saas-checklist.md（市场化产品）
- 功能锚点:     feature_list.json（唯一进度真相源）
- 进度日志:     claude-progress.txt
- 环境启动:     ./init.sh
- 模型与参数:   config.yaml（模型名只允许出现在这个文件里）
- 敏感凭证:     .env（本地，永远不进 git）

## 文件结构规范
```
项目根目录/
├── CLAUDE.md               ← AI 看的宪法（本文件，进 git）
├── CLAUDE.local.md         ← 你个人的本地笔记（不进 git）
├── .claudeignore           ← Claude 不读的文件（进 git）
├── .gitignore              ← git 不追踪的文件（进 git）
├── .env.example            ← 凭证变量名模板（进 git，不含真实值）
├── .env                    ← 真实凭证（不进 git，本地填写）
├── .claude/
│   ├── settings.json       ← Claude 权限设置（进 git）
│   └── commands/           ← 斜杠命令（进 git）
├── docs/                   ← 所有文档
├── src/                    ← 源代码
├── tests/                  ← 测试文件
├── config.yaml             ← AI 模型与 API 配置
├── feature_list.json       ← 功能清单
└── claude-progress.txt     ← 会话交接日志
```

## 命名规范
- 文件名：小写 + 连字符（kebab-case）。如：user-profile.ts
- 组件名：大驼峰（PascalCase）。如：UserProfile
- 函数/变量：小驼峰（camelCase）。如：getUserProfile
- 常量：全大写下划线。如：MAX_RETRY_COUNT
- 数据库表：小写下划线（snake_case）。如：user_profiles

## Git 提交规范
格式：`<类型>(<范围>): <描述>`
类型：
  feat     新功能（对应 feature_list 条目）
  fix      修复 bug
  style    UI/样式调整
  refactor 重构（不改功能）
  test     测试相关
  chore    杂项（依赖更新、配置）
  pivot    方向纠偏（/pivot 命令触发）
  change   需求变更（/change 命令触发）

示例：
  feat(auth): 完成用户注册功能 F003
  fix(payment): 修复 Stripe webhook 验签失败
  change: 增加用户导出功能，影响 F011-F013

## 分支策略
- main：只接受已通过 /verify 的代码
- feature/<功能ID>-<简述>：单个功能开发（如 feature/F003-user-auth）
- fix/<问题简述>：修复
- AI 禁止直接向 main 分支提交——必须通过分支

## 铁律（不可商量）
1. 最简单的可行方案。不做投机性抽象，不加没被要求的功能。
2. 一个会话只做一个功能，做完即停。
3. feature_list.json 只许改 passes 字段（/change 和 /pivot 除外）。
4. 没有端到端验证，不标 passing。单元测试通过 ≠ 功能完成。
5. 不修改与当前任务无关的代码。
6. 测试不过不提交。
7. 不执行 git push、不删分支、不操作远程——人来做。
8. 会话结束必须更新 claude-progress.txt。
9. .env 文件永远不进 git。不确定就停下来问。

## 英文文案铁律（F034–F045 内容文章及一切面向读者的文字）
1. 读者是英语母语者。短句、主动语态，无营销腔（禁 wonderful/amazing/enjoy your journey 类空词）。
2. 数字必须具体：写 "Ferry: 90 min, ¥150"，不写 "a short ferry ride"。查不到就标 not yet verified，不编。
3. 结论前置：每篇首屏先回答"你这护照行不行/值不值得去"，再展开。
4. 双语只留地名/菜名/地址（Weizhou 涠洲岛）；UI 与正文纯英文。
5. 每个事实带来源或核实日期；未实地核实的价格/班次一律挂 unverified 态。

## 常用命令
- 启动环境:   ./init.sh
- 本地预览:   npm run dev    # http://127.0.0.1:4321
- 跑测试:     npm run build  # Astro 构建即质检：校验内容 frontmatter schema + 捕获断链/坏页
- 构建预览:   npm run preview
- 建功能分支: git checkout -b feature/<ID>-<描述>

## 历史教训（复合工程：每次犯错追加一条）
<!-- 格式：日期 | 犯的错 | 新规则 -->
- 2026-07-03 | UI 验证先试 Playwright 截图，本环境无 Chrome（/opt/google/chrome 缺失）走弯路 | UI/页面验证优先 curl 抓 HTML 断言关键文案，需人眼时起 dev server 让用户确认；本环境浏览器截图自动化不可用，勿反复重试。npm run build 会自动清空 dist/，无需（且 settings 禁止）rm -rf dist。
