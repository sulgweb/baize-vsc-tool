import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import reactStylename from '@banshan-alec/vite-plugin-react-stylename';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), reactStylename()],
  base: './', // 设置打包路径
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import '@/assets/styles/theme.less';`,
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: '../out', // 输出到 VSCode 插件的 `out` 目录
  },
});
