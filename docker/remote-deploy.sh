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
rm -rf 'next-host/app/(site)/[[...slug]]'
# 管理后台旧双 page 结构（page.tsx + [...slug]/page.tsx），已合并为 [[...slug]]
rm -f next-host/app/admin/page.tsx
rm -rf 'next-host/app/admin/[...slug]'
# react-markdown 迁移后移除 marked 相关旧文件，否则 Docker 构建仍会因找不到 marked 报错
rm -f next-host/lib/markdown.ts
rm -f next-host/components/blog/ArticleBodyClient.tsx

echo "==> [remote] 停止旧容器（保留卷 docker_api-data：SQLite + LanceDB 向量库，不使用 down -v）..."
${COMPOSE} down 2>/dev/null || true

# 轻量服务器（2GB 内存）并行跑 Next + Nest + Vite 会 OOM 假死，构建前确保有 swap
ensure_build_swap() {
  local mem_mb=0 swap_mb=0
  if [ -r /proc/meminfo ]; then
    mem_mb="$(awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo)"
    swap_mb="$(awk '/SwapTotal/ {print int($2/1024)}' /proc/meminfo)"
  fi
  echo "==> [remote] 系统内存 ${mem_mb}MB / Swap ${swap_mb}MB"

  # 物理内存 < 3.5GB 且 swap 不足 1.5GB 时自动补 2G swap
  if [ "${mem_mb}" -lt 3500 ] && [ "${swap_mb}" -lt 1500 ] && [ ! -f /swapfile ]; then
    echo "==> [remote] 内存偏小，创建 2G swap 防止 Docker 编译 OOM..."
    if fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048 status=progress; then
      chmod 600 /swapfile
      mkswap /swapfile >/dev/null
      swapon /swapfile
      grep -q '/swapfile' /etc/fstab 2>/dev/null || echo '/swapfile none swap sw 0 0' >> /etc/fstab
      echo "==> [remote] swap 已启用"
    else
      echo "==> [remote] 警告: swap 创建失败，构建可能因 OOM 卡住"
    fi
  fi
}
ensure_build_swap

# 分步构建：禁止 compose 并行 build，避免 web + api + nginx 同时编译占满内存
echo "==> [remote] 分步构建镜像（api → web → nginx，单步约 5–15 分钟）..."
export COMPOSE_PARALLEL_LIMIT=1
export DOCKER_BUILDKIT=1
export BUILDKIT_PROGRESS=plain

build_service() {
  local name="$1"
  echo ""
  echo "=========================================="
  echo "  开始构建: ${name}"
  echo "=========================================="
  ${COMPOSE} build --progress=plain "${name}"
  echo "==> [remote] ${name} 构建完成"
}

build_service api
build_service web
build_service nginx

echo "==> [remote] 启动容器..."
${COMPOSE} up -d

echo "==> [remote] 等待服务就绪..."
chmod +x docker/wait-healthy.sh
docker/wait-healthy.sh

echo "==> [remote] 初始化种子数据（仅空表写入演示数据，已有内容不覆盖）..."
${COMPOSE} exec -T api node dist/prisma/seed.js

echo "==> [remote] 容器状态："
${COMPOSE} ps

# 部署成功后释放磁盘：--build 会产生 dangling 镜像与大量 build cache，不清理会随部署次数占满系统盘
# 注意：不执行 volume prune / down -v，保留 docker_api-data（SQLite + LanceDB）
# docker system df 在轻量机上易长时间卡住，故不用；清理步骤均 best-effort，失败不阻断部署
cleanup_after_deploy() {
  echo "==> [remote] 清理无用 Docker 资源..."

  # 带超时执行，避免 docker 命令在资源紧张时无限阻塞 SSH 会话
  run_with_timeout() {
    local sec="$1"
    shift
    if command -v timeout >/dev/null 2>&1; then
      timeout "$sec" "$@" || {
        echo "    （超时 ${sec}s，已跳过: $*）"
        return 0
      }
    else
      "$@" || true
    fi
  }

  echo "    [1/4] 删除悬空镜像..."
  run_with_timeout 60 docker image prune -f

  echo "    [2/4] 删除已停止容器..."
  run_with_timeout 30 docker container prune -f

  echo "    [3/4] 删除未使用网络..."
  run_with_timeout 30 docker network prune -f

  echo "    [4/4] 清理构建缓存（可能需 1–3 分钟）..."
  # 优先保留 2GB 缓存；旧版 Docker 不支持 --keep-storage 时回退普通 prune
  run_with_timeout 300 docker builder prune -f --keep-storage 2GB \
    || run_with_timeout 300 docker builder prune -f \
    || true

  echo "    根分区磁盘："
  df -h / 2>/dev/null | tail -1 || true
}
cleanup_after_deploy || echo "==> [remote] 部分清理步骤未完成，不影响已启动的服务"

echo "==> [remote] 部署完成"
