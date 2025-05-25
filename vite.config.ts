import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue()
    // 暂时禁用自动导入，改用手动导入
    // AutoImport({
    //   resolvers: [ElementPlusResolver()],
    //   imports: ['vue', 'vue-router', 'pinia'],
    //   dts: true,
    //   eslintrc: {
    //     enabled: true
    //   }
    // }),
    // Components({
    //   resolvers: [ElementPlusResolver({
    //     importStyle: false // 禁用自动样式导入，使用手动导入
    //   })],
    //   dts: true
    // })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 9527,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'utils': ['axios', 'dayjs', 'lodash-es']
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false
      }
    }
  }
}) 