#!/usr/bin/env bash
# 一键部署到阿里云轻量服务器
# 用法：
#   ./docker/deploy.sh [服务器IP]              # 推荐：SSH 密钥（ssh-copy-id root@IP）
#   ./docker/deploy.sh [服务器IP] [SSH密码]    # 需服务器开启 PasswordAuthentication

set -euo pipefail

SERVER_IP="${1:-47.116.30.137}"
SSH_PASS="${2:-}"
SSH_USER="${SSH_USER:-root}"
REMOTE_DIR="/opt/personal-site"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "==> 部署目标: ${SSH_USER}@${SERVER_IP}:${REMOTE_DIR}"

# 服务器重装后旧指纹仍在 known_hosts 时，OpenSSH 会禁用密码认证，expect 等不到 password 提示而一直卡住
SSH_OPTS=(
  -o StrictHostKeyChecking=accept-new
  -o ConnectTimeout=30
  -o ServerAliveInterval=30
  -o ServerAliveCountMax=6
)
# 可选：指定私钥，例如 SSH_IDENTITY_FILE=~/.ssh/id_ed25519 ./docker/deploy.sh IP
if [ -n "${SSH_IDENTITY_FILE:-}" ]; then
  SSH_OPTS+=(-i "${SSH_IDENTITY_FILE}")
fi
if grep -q "${SERVER_IP}" "${HOME}/.ssh/known_hosts" 2>/dev/null; then
  echo "==> 清除 ${SERVER_IP} 本地旧 SSH 主机指纹（避免 REMOTE HOST IDENTIFICATION HAS CHANGED）..."
  ssh-keygen -R "${SERVER_IP}" >/dev/null 2>&1 || true
fi

# SSH 连接复用：只认证一次，后续 ssh/scp 走同一隧道，减轻轻量服务器 sshd 压力
SSH_CONTROL_DIR="${TMPDIR:-/tmp}/deploy-ssh-${USER}"
mkdir -p "${SSH_CONTROL_DIR}"
SSH_CONTROL_PATH="${SSH_CONTROL_DIR}/cm-${SERVER_IP}-${SSH_USER}"
SSH_MUX_OPTS=(
  -o ControlMaster=auto
  -o ControlPath="${SSH_CONTROL_PATH}"
  -o ControlPersist=15m
)
SSH_ALL_OPTS=( "${SSH_OPTS[@]}" "${SSH_MUX_OPTS[@]}" )

close_ssh_mux() {
  ssh "${SSH_ALL_OPTS[@]}" -O exit "${SSH_USER}@${SERVER_IP}" 2>/dev/null || true
}
trap close_ssh_mux EXIT

print_ssh_timeout_help() {
  cat >&2 <<EOF

错误: SSH 连接超时（banner exchange / timed out）。
22 端口可达但 sshd 未及时响应，常见于：
  - Docker 构建/清理后 CPU 或内存打满
  - 同时存在多个 SSH 连接
  - sshd 进程异常

请用阿里云控制台「远程连接」登录后执行：
  free -h && uptime
  systemctl status sshd
  docker stats --no-stream
若负载过高： reboot
等待 1–2 分钟后再执行 ./docker/deploy.sh

EOF
}

# 密码登录时用 expect 执行一次 ssh/spawn 命令
ssh_expect_spawn() {
  local timeout="$1"
  local spawn_cmd="$2"
  export DEPLOY_SSH_PASS="$SSH_PASS"
  expect <<EOF
set timeout ${timeout}
spawn ${spawn_cmd}
expect {
  -re "continue connecting.*\\\\(yes/no" { send "yes\r"; exp_continue }
  -re "(?i)password:" { send "\$env(DEPLOY_SSH_PASS)\r"; exp_continue }
  "REMOTE HOST IDENTIFICATION HAS CHANGED" {
    puts stderr "错误: SSH 主机指纹冲突，请手动执行: ssh-keygen -R ${SERVER_IP}"
    exit 1
  }
  -re "banner exchange|Connection timed out|Connection refused" { exit 2 }
  "Permission denied" { exit 3 }
  eof
}
catch wait result
exit [lindex \$result 3]
EOF
}

# 建立可复用的 SSH 主连接（带重试，避免 preflight 通过后下一次握手又超时）
ssh_open_session() {
  if ssh "${SSH_ALL_OPTS[@]}" -O check "${SSH_USER}@${SERVER_IP}" >/dev/null 2>&1; then
    return 0
  fi

  local attempt rc=0 probe_out=""
  for attempt in 1 2 3 4 5; do
    echo "==> 建立 SSH 会话 (${attempt}/5)..."
    rc=0
    if [ -n "$SSH_PASS" ]; then
      probe_out="$(ssh_expect_spawn 45 "ssh ${SSH_ALL_OPTS[*]} -o PreferredAuthentications=password,keyboard-interactive -o PubkeyAuthentication=no ${SSH_USER}@${SERVER_IP} true" 2>&1)" || rc=$?
    else
      probe_out="$(ssh "${SSH_ALL_OPTS[@]}" "${SSH_USER}@${SERVER_IP}" "true" 2>&1)" || rc=$?
    fi

    if ssh "${SSH_ALL_OPTS[@]}" -O check "${SSH_USER}@${SERVER_IP}" >/dev/null 2>&1; then
      echo "==> SSH 会话已建立"
      return 0
    fi

    if [ -n "$SSH_PASS" ] && [ "$rc" -eq 3 ]; then
      if echo "$probe_out" | grep -qi "publickey" && ! echo "$probe_out" | grep -qi "password"; then
        cat >&2 <<EOF

错误: 服务器未开启 SSH 密码登录（仅 publickey）。
  方案 A: ssh-copy-id ${SSH_USER}@${SERVER_IP} 后执行 ./docker/deploy.sh ${SERVER_IP}
  方案 B: 在服务器开启 PasswordAuthentication yes 并 systemctl restart sshd

EOF
        exit 1
      fi
      echo >&2 "错误: SSH 密码认证失败，请确认密码正确。"
      exit 1
    fi

    if [ "$attempt" -lt 5 ]; then
      echo "    连接未就绪，$((attempt * 10)) 秒后重试..."
      sleep $((attempt * 10))
    fi
  done

  print_ssh_timeout_help
  exit 1
}

ssh_cmd() {
  shift # 兼容旧调用 ssh_cmd 60 cmd...，超时由 ServerAlive 与远程命令自身控制
  ssh_open_session
  ssh "${SSH_ALL_OPTS[@]}" "${SSH_USER}@${SERVER_IP}" "$@"
}

scp_cmd() {
  local src="$1"
  local dst="$2"
  ssh_open_session
  scp "${SSH_ALL_OPTS[@]}" -r "${src}" "${SSH_USER}@${SERVER_IP}:${dst}"
}

# 从本地 nest-server/.env 读取指定 key 的值（不含引号）
read_local_env() {
  local key="$1"
  local file="${PROJECT_ROOT}/nest-server/.env"
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

# 合并单个环境变量到服务器 ${REMOTE_DIR}/.env
merge_remote_env_key() {
  local key="$1"
  local val
  val="$(read_local_env "$key" || true)"
  [[ -n "$val" ]] || return 0
  echo "==> 同步 ${key} → 服务器 .env"
  ssh_cmd 30 "touch '${REMOTE_DIR}/.env' && (grep -v '^${key}=' '${REMOTE_DIR}/.env' 2>/dev/null || true) > '${REMOTE_DIR}/.env.tmp' && printf '%s=%s\n' '${key}' '${val}' >> '${REMOTE_DIR}/.env.tmp' && mv '${REMOTE_DIR}/.env.tmp' '${REMOTE_DIR}/.env'"
}

# 同步便民后端依赖的环境变量（高德逆地理等）
sync_convenience_env_to_server() {
  merge_remote_env_key "AMAP_WEB_SERVICE_KEY"
}

# 打包前先建立 SSH（失败则立即退出，避免浪费时间打包）
# 子应用在本地预编译，避免轻量服务器 Docker 内 Vite OOM
echo "==> 本地预编译子应用（app-web / app-admin / 便民 H5 / 小画家 H5）..."
chmod +x "${SCRIPT_DIR}/prebuild-subapps.sh"
"${SCRIPT_DIR}/prebuild-subapps.sh"

ssh_open_session

echo "==> 打包项目文件..."
TAR_FILE="/tmp/personal-site-deploy.tar.gz"
ENV_FILE="/tmp/personal-site.env"
cd "$PROJECT_ROOT"
# macOS 打包时跳过 xattr，避免 Linux 解压时出现大量 LIBARCHIVE 警告
# 保留 qiankun-subapps/*/dist 与 convenience-client/dist（prebuild 产物），排除其余 dist
COPYFILE_DISABLE=1 tar czf "$TAR_FILE" \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='nest-server/dist' \
  --exclude='*.db' \
  --exclude='*.db-journal' \
  --exclude='.git' \
  --exclude='.env.local' \
  --exclude='nest-server/.env' \
  .
printf 'PUBLIC_ORIGIN=http://%s\nHTTP_PORT=80\n' "$SERVER_IP" > "$ENV_FILE"

echo "==> 上传到服务器..."
ssh_cmd 60 mkdir -p "${REMOTE_DIR}"
scp_cmd "$TAR_FILE" "${REMOTE_DIR}/deploy.tar.gz"
# 仅首次部署写入 .env，避免覆盖服务器上已配置的密钥与密码
if ssh_cmd 30 "test -f '${REMOTE_DIR}/.env'"; then
  echo "==> 保留服务器已有 .env"
else
  scp_cmd "$ENV_FILE" "${REMOTE_DIR}/.env"
fi
ssh_cmd 120 tar -xzf "${REMOTE_DIR}/deploy.tar.gz" -C "${REMOTE_DIR}"
ssh_cmd 30 rm -f "${REMOTE_DIR}/deploy.tar.gz"
ssh_cmd 30 chmod +x "${REMOTE_DIR}/docker/remote-deploy.sh"

sync_convenience_env_to_server

echo "==> 远程构建并启动 Docker（api/web 在服务器编译，子应用已在本地预编译）..."
echo "    预计 api 5min + web 15min + nginx 1min；超过 20min 无日志请 Ctrl+C 后重试"
ssh_cmd 7200 "${REMOTE_DIR}/docker/remote-deploy.sh"

rm -f "$TAR_FILE" "$ENV_FILE"

echo ""
echo "=========================================="
echo "  部署完成！"
echo "  个人站点:   http://${SERVER_IP}"
echo "  便民 C 端:  http://${SERVER_IP}/convenience/"
echo "  小画家启蒙: http://${SERVER_IP}/kids-drawing/"
echo "  管理后台:   http://${SERVER_IP}/admin"
echo "  (便民管理:  登录后侧边栏「同城便民」)"
echo "=========================================="
