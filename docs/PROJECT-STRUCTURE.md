# 项目结构规范标准（PROJECT-STRUCTURE）
# 这是你项目的"文件宪法"——所有文件该放哪，由这份文件定义。
# /reorganize 命令会照着这份标准把乱掉的项目重新规整。
# 你可以按自己的技术栈修改这份标准，改完它就是你的强制规范。

## 核心原则（工程化思维）

1. 一个文件只做一件事（单一职责）
2. 同类东西放一起（按功能分目录，不按文件类型）
3. 命名一眼能看懂用途（不用 a.py、temp2.js 这种）
4. 深度不超过 4 层（找文件不用翻太深）
5. 每个目录有明确归属（不出现"杂项"垃圾桶目录）

## 标准目录结构（按你的技术栈调整）

```
项目根/
├── docs/                    # 所有文档
│   ├── SPEC.md              # 需求规格
│   ├── DESIGN.md            # 设计决策
│   ├── PROJECT-STRUCTURE.md # 本文件
│   └── decisions/           # 重大决策记录（每个决策一个文件）
│
├── src/                     # 所有源代码
│   ├── features/            # 按业务功能分（不按文件类型！）
│   │   ├── auth/            # 认证功能：相关的所有代码都在这
│   │   ├── billing/         # 计费功能
│   │   └── search/          # 搜索功能
│   ├── shared/              # 多个功能共用的代码
│   │   ├── utils/           # 工具函数
│   │   ├── types/           # 类型定义
│   │   └── components/      # 共用 UI 组件（如有前端）
│   └── config/              # 配置加载逻辑
│
├── tests/                   # 测试，目录结构镜像 src/
│   ├── features/
│   └── shared/
│
├── scripts/                 # 一次性脚本、工具脚本
├── .claude/                 # Claude Code 配置
│   ├── commands/
│   └── settings.json
│
├── feature_list.json        # 进度真相源
├── claude-progress.txt      # 会话日志
├── config.yaml              # 模型与 API 配置
├── pipeline.py              # 自动循环脚本
├── CLAUDE.md                # 项目宪法
├── .gitignore
├── .claudeignore
└── .env.example
```

## 关键规则："按功能分"而不是"按类型分"

❌ 错误（按文件类型分，功能一乱就找不到）：
```
src/
├── controllers/   (所有控制器堆一起)
├── models/        (所有模型堆一起)
├── views/         (所有视图堆一起)
└── utils/
```
改一个"登录功能"要在 4 个目录之间跳来跳去。

✅ 正确（按业务功能分，一个功能的东西都在一处）：
```
src/features/
├── auth/          (登录功能的控制器+模型+视图+测试都在这)
├── billing/
└── search/
```
改"登录功能"只看 auth/ 一个目录。这是 2026 年主流做法，
也让 AI 更容易理解和准确修改。

## 命名规范

- 文件：kebab-case（user-profile.ts）
- 目录：小写单数（feature/ 不是 features/ 里再嵌 feature）
- 测试文件：原名 + .test（user-profile.test.ts）
- 一个功能的入口文件统一叫 index（auth/index.ts）

## 什么算"乱"（触发 /reorganize 的信号）

出现以下任一情况，就该运行 /reorganize：
- 出现了 misc/、temp/、new/、old/、untitled 这类目录或文件
- 同一类功能的文件散落在多个不相关的地方
- 根目录堆了超过 15 个文件
- 出现 utils2.py、final-final.js 这种命名
- 复用别的项目代码后，两套不同风格混在一起
- 单个文件超过 500 行
- 找一个功能的代码要翻 3 个以上目录

## 复用项目时的规范

从项目 A 复用代码到项目 B 时：
1. 不要整个目录拷过来——只拷需要的功能模块
2. 拷过来的代码必须改成符合 B 项目的命名规范
3. 拷过来后立即运行 /reorganize 把它归位
4. 在 claude-progress.txt 记录：从哪个项目复用了什么
```
