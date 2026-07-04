# /pipeline — 启动自动工作循环（告别手动切换 session）

<!-- ┌─ 给人看的说明（AI 执行时会忽略，你可以放心读）─
这一步做什么：检查 pipeline.py 是否就绪，告诉你如何启动自动循环。
启动后：/work 和 /verify 自动链式执行，你不用手动切换 session。
为什么不会上下文爆炸：每个 /work 和 /verify 都是独立子进程（全新上下文），
做完退出。进度靠 feature_list.json 传递，不靠 AI 记忆。
└────────────────────────────────────────────────────────── -->

你的唯一任务：检查环境，然后告诉用户如何启动。不需要执行任何 AI 任务。

## 步骤

1. 确认 `pipeline.py` 存在于项目根目录。不存在则告知用户：
   "pipeline.py 不存在，请先运行 /init-harness 生成它，
   或者把模板里的 pipeline.py 复制到项目根目录。"

2. 确认 `feature_list.json` 存在且有待做的功能（passes: false 的条目）。

3. 向用户展示启动方式：

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Pipeline 启动方式（在终端运行）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

标准启动（推荐）：
  python pipeline.py

去吃饭/睡觉前：
  python pipeline.py --max 10   ← 最多做 10 个功能（设上限防意外）

只想看计划不执行：
  python pipeline.py --dry-run

只跑一次质检：
  python pipeline.py --verify-only

换便宜模型运行（降本）：
  编辑 pipeline.py 顶部的 CLAUDE_MODEL = "claude-haiku-4-5"
  然后正常运行

运行后你会看到：
  [████████████░░░░░░░░░░░░░░░░░░] 8/18 (44%)  本次已做 3 个
  ⚡ F009：用户能搜索历史记录...
  ✅ F009 完成
  ...

中途暂停：Ctrl+C（当前功能完成后退出，进度不丢）
继续：重新运行 python pipeline.py（自动从断点接着来）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

4. 提醒用户：
   "pipeline.py 需要在终端里运行（不是在 Claude Code 对话框里）。
   在项目目录打开终端，运行上面的命令即可。
   你可以在另一个窗口继续用 Claude Code 做其他事。"
