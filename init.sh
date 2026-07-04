#!/usr/bin/env bash
# init.sh — 环境启动脚本（guangxi-guide · Astro 静态站）
set -euo pipefail
cd "$(dirname "$0")"

echo "▶ 1/4 检查 Node（需 ≥ 18）..."
node --version

echo "▶ 2/4 安装依赖..."
npm install

echo "▶ 3/4 校验 .env..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "   已从 .env.example 复制出 .env——记得填 Formspree / GA4 值（缺省不影响构建）"
fi

echo "▶ 4/4 构建冒烟测试..."
npm run build

echo ""
echo "✅ 就绪。"
echo "   本地预览： npm run dev   →  http://127.0.0.1:4321"
echo "   从本机开隧道预览： ssh -L 14321:127.0.0.1:4321 claude@<vps>  → 本地 http://127.0.0.1:14321"
