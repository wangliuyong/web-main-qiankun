#!/usr/bin/env bash
# 在本地（开发机）预编译 Qiankun 子应用与便民 H5，避免 2GB 轻量服务器 Docker 内 Vite 编译 OOM。
# 由 deploy.sh 在打包上传前调用。
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# 从 nest-server/.env 读取高德 Key（便民 H5 可选）
read_local_env() {
  local key="$1"
  local file="${ROOT}/nest-server/.env"
  [[ -f "$file" ]] || return 1
  local line
  line=$(grep -E "^${key}=" "$file" | tail -1 || true)
  [[ -n "$line" ]] || return 1
  local val="${line#*=}"
  val="${val%\"}"; val="${val#\"}"
  val="${val%\'}"; val="${val#\'}"
  [[ -n "$val" ]] || return 1
  printf '%s' "$val"
}

echo "==> [prebuild] 检查 Node 版本..."
if command -v node >/dev/null 2>&1; then
  node_major="$(node -p "process.versions.node.split('.')[0]")"
  if [[ "${node_major}" -lt 20 ]]; then
    echo "错误: Node 需 >= 20，当前 $(node -v)。请执行: nvm use 20"
    exit 1
  fi
fi

echo "==> [prebuild] 安装子应用依赖..."
pnpm run install:subapps
pnpm run install:convenience
pnpm run install:kids-drawing

echo "==> [prebuild] 编译 app-web (/micro/web/)..."
(
  cd qiankun-subapps/app-web
  VITE_BASE=/micro/web/ NODE_ENV=production pnpm run build
  node ../_shared/fixQiankunHtml.mjs dist
)

echo "==> [prebuild] 编译 app-admin (/micro/admin/)..."
(
  cd qiankun-subapps/app-admin
  # 本地 Mac 内存充足，仍限制堆避免极端情况；Docker 内 768MB 不够编译此项目
  export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=2048}"
  VITE_BASE=/micro/admin/ NODE_ENV=production pnpm run build
  node ../_shared/fixQiankunHtml.mjs dist
)

echo "==> [prebuild] 编译便民 H5 (/convenience/)..."
(
  cd convenience-client
  export VITE_H5_BASE=/convenience/
  export AMAP_KEY_WEB="$(read_local_env AMAP_KEY_WEB 2>/dev/null || true)"
  export AMAP_SECURITY_CODE="$(read_local_env AMAP_SECURITY_CODE 2>/dev/null || true)"
  export AMAP_KEY_ANDROID="$(read_local_env AMAP_KEY_ANDROID 2>/dev/null || true)"
  export AMAP_KEY_IOS="$(read_local_env AMAP_KEY_IOS 2>/dev/null || true)"
  node scripts/apply-manifest-env.mjs
  NODE_ENV=production pnpm run build:h5
)

echo "==> [prebuild] 编译小画家启蒙 H5 (/kids-drawing/)..."
(
  cd kids-drawing-client
  export VITE_H5_BASE=/kids-drawing/
  node scripts/apply-manifest-env.mjs
  NODE_ENV=production pnpm run build:h5
)

echo "==> [prebuild] 子应用静态资源已就绪："
echo "    - qiankun-subapps/app-web/dist"
echo "    - qiankun-subapps/app-admin/dist"
echo "    - convenience-client/dist/build/h5"
echo "    - kids-drawing-client/dist/build/h5"
