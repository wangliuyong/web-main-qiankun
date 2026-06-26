#!/usr/bin/env bash
# 在服务器上执行：构建 Docker、等待就绪、初始化种子
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ENV_FILE="${ROOT}/.env"
COMPOSE="docker compose -f docker/docker-compose.yml --env-file ${ENV_FILE}"

echo "==> [remote] 清理旧路由与已删除文件（tar 解压不会移除服务器残留）..."
rm -rf next-host/app/about next-host/app/blog next-host/app/contact \
       next-host/app/links next-host/app/projects
rm -f next-host/app/page.tsx
# SSR 改造后路由结构调整，需删除服务器上 tar 不会覆盖的旧 catch-all 目录
rm -rf 'next-host/app/admin/[[...slug]]' 'next-host/app/(site)/[[...slug]]'
# react-markdown 迁移后移除 marked 相关旧文件，否则 Docker 构建仍会因找不到 marked 报错
rm -f next-host/lib/markdown.ts
rm -f next-host/components/blog/ArticleBodyClient.tsx

echo "==> [remote] 停止旧容器（保留卷 docker_api-data：SQLite + LanceDB 向量库，不使用 down -v）..."
${COMPOSE} down 2>/dev/null || true

echo "==> [remote] 构建并启动（可能 15–30 分钟）..."
${COMPOSE} up -d --build

echo "==> [remote] 等待服务就绪..."
chmod +x docker/wait-healthy.sh
docker/wait-healthy.sh

echo "==> [remote] 初始化种子数据（仅空表写入演示数据，已有内容不覆盖）..."
${COMPOSE} exec -T api node dist/prisma/seed.js

echo "==> [remote] 容器状态："
${COMPOSE} ps

echo "==> [remote] 部署完成"
