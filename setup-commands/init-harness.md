# /init-harness — 初始化项目环境（只运行一次）

<!-- ┌─ 给人看的说明（AI 执行时会忽略，你可以放心读）─
这一步在做什么：把需求文档拆成一条条具体功能（比如 18 条），建好功能清单、
启动脚本、配置文件，全部存成文件。
为什么需要：把大目标切成小块，每块能单独验收。清单存在文件里，
所以你之后关掉对话也不会丢——这就是"换 session 不用衔接"的原理。
特殊情况：如果你 clone 了 Boilerplate（如 Makerkit），它会自动检测到，
在 Boilerplate 基础上工作，不会搭重复的骨架。
下一步：开新对话打 /work 开始干活。
└────────────────────────────────────────────────────────── -->

你是初始化代理。基于 docs/SPEC.md 为后续所有工作会话搭建环境。
**本命令不实现任何业务功能。**

## 步骤

0. **【目录锁定·最高优先级】** 运行 `pwd`，把完整路径报告给用户确认。
   **绝对禁止 cd 到其他目录、禁止因为别处存在同名项目就切换过去。**

1. 读取 `docs/SPEC.md`。不存在则停止，提示先运行 /intake。

2. **【Boilerplate 检测】** 检查当前目录：
   - 如果存在 `package.json` 且 `node_modules/` 或 `src/` 已有大量文件
     → 判定为"Boilerplate 模式"，告诉用户：
     "检测到已有代码基础（可能是 Boilerplate），将在它上面建功能清单，
     不会搭新骨架、不会覆盖已有文件。"
     → 跳过步骤 5（搭骨架），改为：读懂 Boilerplate 的目录结构和约定，
     把你的业务功能应该放在哪里的指引写进 CLAUDE.md。
   - 如果目录基本为空 → 正常模式，按步骤 5 搭骨架。

3. 如果存在 `docs/DESIGN.md`，读取它。功能清单必须包含 UI 条目
   （每个组件的渲染、交互、空状态、错误状态），category 增加 "ui" 类型。

4. 读取 SPEC 的"技术栈决策"节，**不得自行选择未在 SPEC 中指定的技术**。
   SPEC 中写"AI 推荐"的，列出选项请用户确认后再继续。

5. 生成 `feature_list.json`：把 SPEC 的验收标准展开成完整的功能清单。
   宁多勿少——展开隐含功能（错误处理、空输入、超时、边界、外部依赖失败）。
   如果 SPEC 引用了 `docs/saas-checklist.md`，逐项核对清单，
   把缺失的层（认证、计费、邮件、法律页面等）也加入功能清单。

   每条结构：
       {
         "id": "F001",
         "category": "functional",
         "description": "用户输入查询并按回车后，能在界面看到结果",
         "steps": ["启动应用", "输入合法查询", "按回车", "确认出现非空响应"],
         "passes": false
       }
   category 可取：functional / error-handling / boundary / ui / infra

6. 生成 `config.yaml`：
   - AI 模型配置：每个调用点的模型名、温度、max_tokens
   - API 集成配置：对照 SPEC 的 API 清单，写入 base_url/auth_type/rate_limit/retry/failure_strategy
   - 凭证位置：生成 `.env.example`，列出所有需要填写的 API Key 变量名

7. **仅正常模式（非 Boilerplate）**：搭最小可运行骨架（目录结构、依赖声明、空入口文件）。

7b. **文件规范建立**（此步在"搭骨架"之后立即执行）：
    - 检查根目录是否已有 `.gitignore` → 没有则从模板生成，有则检查是否包含 `.env`；
      如果没有 `.env` 条目立即追加，这是安全红线。
    - 检查根目录是否已有 `.claudeignore` → 没有则从模板生成。
    - 检查 `.claude/settings.json` 是否存在 → 没有则生成（含 deny 规则，
      特别是 `git push` 和 `rm -rf`）。
    - 生成 `CLAUDE.local.md`（空模板）并确认它已在 `.gitignore` 中。
    - 验证：运行 `git status --short` 确认 `.env` 不在追踪列表里。

8. 生成 `init.sh`，亲自运行确认能工作。

9. 创建 `claude-progress.txt`，写入首条记录。

10. 把常用命令补进 CLAUDE.md。

10b. 把 pipeline.py 复制到项目根目录（来自模板），并更新其中的
     VERIFY_INTERVAL（建议 3）和 WORK_TIMEOUT（按任务复杂度）。
     告诉用户："之后你可以在终端运行 python pipeline.py 让 /work 和
     /verify 自动链式执行，不需要手动切换 session。"

11. `git init`（如果还没有），首次提交。

12. 向用户汇报：功能清单共 N 条（按 category 分布）、init.sh 验证通过。

## 铁律
- feature_list.json 今后只许改 passes 字段（/change 除外）。
- 功能描述必须具体到"照着 steps 就能判断通过与否"。
- Boilerplate 模式下不得创建与 Boilerplate 已有文件同名的文件。
- 📍 下一步：开新对话，打 /work 开始第一个功能。共 N 个功能待完成。
