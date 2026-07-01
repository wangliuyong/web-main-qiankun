import { defineConfig, loadEnv } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

/** 儿童绘画 uni-app H5 开发端口（与 convenience-client 5175 错开） */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // 构建前写入 manifest.json（H5 base 路径等）
  const scriptPath = path.resolve(process.cwd(), 'scripts/apply-manifest-env.mjs');
  const result = spawnSync(process.execPath, [scriptPath], {
    env: { ...process.env, ...env },
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    throw new Error('apply-manifest-env.mjs failed');
  }

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
          additionalData: `@import "${tokensScss}"; @import "@/styles/animations.scss"; @import "@/styles/mixins.scss";`,
          api: 'modern-compiler',
          silenceDeprecations: true,
        },
      },
    },
    server: {
      port: 5176,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  };
});
