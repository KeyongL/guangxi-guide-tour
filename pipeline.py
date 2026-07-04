#!/usr/bin/env python3
"""
pipeline.py — 自动工作循环
替代手动切换 session，让 /work 和 /verify 自动链式执行。

工作原理：
  这个脚本本身极瘦——只读 JSON 文件、做决策、启动子进程。
  真正的 AI 工作在每个子进程里进行，每个子进程有全新的独立上下文。
  子进程做完退出，上下文销毁。下一个子进程从文件读取进度接力。
  → 上下文永远不会积累，不会偏移。

用法：
  python pipeline.py              # 自动做完所有待做功能
  python pipeline.py --dry-run    # 预览计划，不实际执行
  python pipeline.py --verify-only # 只跑一次质检
  python pipeline.py --max 5      # 最多做 5 个功能后停下

前提：
  1. 已安装 Claude Code CLI（命令行能跑 claude）
  2. 已完成 /init-harness，feature_list.json 存在
  3. 在项目根目录运行
"""

import subprocess
import json
import time
import sys
import argparse
from pathlib import Path


# ── 配置（可按项目调整）──────────────────────────────────────
VERIFY_INTERVAL = 3      # 每做 N 个功能插一次质检
WORK_TIMEOUT    = 900    # 单个 /work 子进程最长等待秒数（15分钟：内容攻略写作+渲染较慢）
VERIFY_TIMEOUT  = 300    # /verify 子进程最长等待秒数（5分钟）
RETRY_TIMES     = 2      # 单个功能失败后最多重试次数
SLEEP_BETWEEN   = 3      # 两次 claude 调用之间间隔秒数（避免限速）
CLAUDE_MODEL    = ""     # 留空则用 claude 默认模型；填入如 "claude-haiku-4-5" 换便宜模型


def run_claude(command_name: str, extra_context: str = "",
               timeout: int = WORK_TIMEOUT) -> tuple[bool, str]:
    """
    在独立子进程中运行一个命令文件。
    关键：每次调用都是全新进程、全新上下文，做完即退出。
    """
    cmd_path = Path(f".claude/commands/{command_name}.md")
    if not cmd_path.exists():
        # 兜底：尝试 setup-commands 目录（安装前的位置）
        cmd_path = Path(f"setup-commands/{command_name}.md")
    if not cmd_path.exists():
        print(f"  ❌ 找不到命令文件：{command_name}.md")
        return False, ""

    prompt = cmd_path.read_text(encoding="utf-8")
    if extra_context:
        prompt = f"【本次任务专注范围】{extra_context}\n\n{prompt}"

    cmd = [
        "claude", "-p", prompt,
        "--permission-mode", "acceptEdits",   # 自动接受文件编辑，不弹确认框
        "--max-turns", "20",                  # 防止单个任务无限跑偏
    ]
    if CLAUDE_MODEL:
        cmd += ["--model", CLAUDE_MODEL]

    try:
        result = subprocess.run(
            cmd,
            capture_output=True, text=True,
            timeout=timeout, cwd=Path.cwd()
        )
        return result.returncode == 0, result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        print(f"  ⏰ 超时（{timeout}s），视为失败")
        return False, "timeout"
    except FileNotFoundError:
        print("  ❌ 找不到 claude 命令。请确认 Claude Code CLI 已安装：")
        print("     https://code.claude.com")
        sys.exit(1)


def load_features() -> list:
    with open("feature_list.json", encoding="utf-8") as f:
        return json.load(f)


def get_pending(features: list) -> list:
    return [f for f in features if not f.get("passes") and not f.get("deprecated")]


def get_progress(features: list) -> tuple[int, int]:
    active = [f for f in features if not f.get("deprecated")]
    done   = sum(1 for f in active if f.get("passes"))
    return done, len(active)


def print_banner(done: int, total: int, work_count: int):
    bar_len = 30
    filled  = int(bar_len * done / total) if total else 0
    bar     = "█" * filled + "░" * (bar_len - filled)
    pct     = int(done / total * 100) if total else 0
    print(f"\n  [{bar}] {done}/{total} ({pct}%)  本次已做 {work_count} 个")


def main():
    parser = argparse.ArgumentParser(description="自动工作循环")
    parser.add_argument("--dry-run",     action="store_true", help="预览计划不执行")
    parser.add_argument("--verify-only", action="store_true", help="只跑一次质检")
    parser.add_argument("--max",         type=int, default=999, help="最多做几个功能")
    args = parser.parse_args()

    print("\n" + "─" * 50)
    print("  🚀  Pipeline 启动")
    print(f"  质检间隔：每 {VERIFY_INTERVAL} 个    最多做：{args.max} 个")
    if CLAUDE_MODEL:
        print(f"  模型：{CLAUDE_MODEL}")
    print("  按 Ctrl+C 随时暂停（当前功能完成后退出）")
    print("─" * 50)

    # ── 只跑 verify 模式 ──
    if args.verify_only:
        print("\n🔍 运行质检...")
        ok, _ = run_claude("verify", timeout=VERIFY_TIMEOUT)
        print("✅ 质检完成" if ok else "⚠️  质检有问题，查看上方输出")
        return

    work_count = 0

    try:
        while work_count < args.max:
            features = load_features()
            pending  = get_pending(features)
            done, total = get_progress(features)
            print_banner(done, total, work_count)

            if not pending:
                print("\n  🎉 所有功能完成！运行最终质检...\n")
                if not args.dry_run:
                    run_claude("verify", timeout=VERIFY_TIMEOUT)
                print("  ✅ Pipeline 完成！打开 feature_list.json 确认结果")
                break

            # ── 到达质检间隔 ──
            if work_count > 0 and work_count % VERIFY_INTERVAL == 0:
                print(f"\n  🔍 已做 {work_count} 个，插入质检...")
                if not args.dry_run:
                    ok, _ = run_claude("verify", timeout=VERIFY_TIMEOUT)
                    if not ok:
                        print("  ⚠️  质检失败，暂停等你处理")
                        print("     处理完后重新运行 python pipeline.py 继续")
                        sys.exit(1)
                print("  ✅ 质检通过，继续\n")

            # ── 做下一个功能 ──
            f = pending[0]
            fid  = f["id"]
            desc = f["description"][:55]
            print(f"  ⚡ {fid}：{desc}...")

            if args.dry_run:
                print("     [dry-run，跳过实际执行]")
                work_count += 1
                time.sleep(0.5)
                continue

            # 带重试
            succeeded = False
            for attempt in range(1, RETRY_TIMES + 2):
                if attempt > 1:
                    print(f"     第 {attempt} 次重试...")
                ok, output = run_claude(
                    "work",
                    f"只做功能 {fid}（{f['description']}），其他功能跳过。",
                )
                if ok:
                    succeeded = True
                    break
                print(f"     ⚠️  第 {attempt} 次失败")
                time.sleep(SLEEP_BETWEEN)

            if not succeeded:
                print(f"  ❌ {fid} 多次重试仍失败，暂停")
                print("     查看 claude-progress.txt 了解卡点")
                print("     修复后重新运行 python pipeline.py 继续")
                sys.exit(1)

            print(f"  ✅ {fid} 完成")
            work_count += 1
            time.sleep(SLEEP_BETWEEN)

        if work_count >= args.max:
            print(f"\n  ⏸️  已达 --max {args.max} 个限制，停止")
            print("     继续请重新运行 python pipeline.py")

    except KeyboardInterrupt:
        print("\n\n  ⏸️  已暂停（当前功能已完成，进度已保存）")
        print("     重新运行 python pipeline.py 从断点继续")


if __name__ == "__main__":
    main()
