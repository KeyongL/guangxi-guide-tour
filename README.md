# Agent Harness Template

把本目录内容放进你的项目根目录。Claude Code 原生支持斜杠命令。

## 给你看的文件（3 个，按这个顺序读）

| 顺序 | 文件 | 用途 |
|------|------|------|
| 1 | 原理手册.md | AI 到底怎么工作、为什么这样设计（最底层，先读这个） |
| 2 | 学习手册.md | 14 个命令分别干什么、完整流程 |
| 3 | 照着做.md | 具体操作清单——照着按 |

第一次用：先读「原理手册」搞懂 AI 怎么运转，再读「学习手册」了解命令，
最后用「照着做」上手。
其他文件（CLAUDE.md、setup-commands/、docs/）都是给 AI 看的，你不用管。

## 20 条命令一览

| 命令 | 用途 | 何时用 |
|------|------|--------|
| /status | 看进度、告诉你下一步 | 不知道该做什么时 |
| /start-here | 锁定工作目录 | 每个项目的第一个命令 |
| /intake | 需求访谈 | 项目开始 |
| /research | 搜索最新技术栈 | 需求确认后（小工具可跳过） |
| /design | 设计 + 视觉原型 | 有 UI 的项目 |
| /prototype | 技术路线验证 | 市场化产品 |
| /init-harness | 建功能清单 + 骨架 | 正式开发前（自动识别 Boilerplate） |
| /work | 做一个功能 | 开发阶段（循环） |
| /pipeline | 启动自动循环（work+verify 自动链式） | 不想手动切 session 时 |
| /auto | 无人值守连做多个功能 | 离开电脑时（需自动化测试 + token 上限） |
| /verify | 独立质检 | 每 3-5 个功能 + 最终验收 |
| /change | 变更需求 | 中途想加/改/砍功能 |
| /checkpoint | 紧急叫停 | AI 卡住/绕圈时 |
| /adopt | 接管已有代码 | 成品项目入口 |
| /pivot | 方向纠偏（根基搞错了） | 技术栈/定位/整体设计需要推翻重来时 |
| /launch | 发布前核查 | 上线前 |
| /audit | 安全审计 + 健康检查 | 每月一次 + 上线前 + 大阶段后 |
| /cleanup | 清理冗余（删死代码） | 每月一次 |
| /reorganize | 重新规整文件结构（搬家归位） | 文件乱了 / 复用代码后 |
| /harden | 加硬护栏（格式/业务/确认/输入校验） | agent 上生产前 |

## 来源

1. Anthropic《Effective harnesses for long-running agents》
2. Boris Cherny（Claude Code 作者）公开工作流
3. obra/superpowers（170k+ stars，Anthropic 官方市场插件）
