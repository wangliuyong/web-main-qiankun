import { defineConfig, loadEnv } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // 启动/构建前将 .env 中的高德地图 Key 写入 manifest.json
  // 使用 process.execPath 而非 shell 调用 node，兼容 HBuilderX 云打包环境（PATH 中无 node 命令）
  const scriptPath = path.resolve(process.cwd(), 'scripts/apply-manifest-env.mjs');
  const result = spawnSync(process.execPath, [scriptPath], {
    env: { ...process.env, ...env },
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    throw new Error('apply-manifest-env.mjs failed');
  }

  // uni-app 注入顺序：uni.scss → vite additionalData → 组件样式
  // 使用绝对路径 import，避免注入到 pages/* 或 node_modules/* 时相对路径 / @/ 解析失败
  const tokensScss = path.resolve(__dirname, 'src/styles/tokens.scss').replace(/\\/g, '/');

  return {
  plugins: [uni()],
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
@import "${tokensScss}";
@import "uview-plus/theme.scss";
$u-primary: $cv-primary;
$u-warning: $cv-accent;
$u-main-color: $cv-text;
$u-content-color: $cv-text-secondary;
$u-tips-color: $cv-text-muted;
$u-bg-color: $cv-bg;
`,
        api: 'modern-compiler',
        silenceDeprecations: true,
      },
    },
  },
  optimizeDeps: {
    include: ['uview-plus'],
  },
  server: {
    port: 5175,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  };
});
