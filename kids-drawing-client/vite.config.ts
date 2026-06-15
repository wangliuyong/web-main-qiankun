import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

/** 儿童绘画 uni-app H5 开发端口（与 convenience-client 5175 错开） */
export default defineConfig({
  plugins: [uni()],
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: true,
      },
    },
  },
  server: {
    port: 5176,
  },
});
