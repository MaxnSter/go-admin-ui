import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router', 'pinia'],
        dts: true
      }),
      Components({
        resolvers: [ElementPlusResolver({ importStyle: false })],
        dts: true
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        'vuex': resolve(__dirname, 'src/vuex.ts')
      }
    },
    define: {
      // 正确定义环境变量
      'process.env.VUE_APP_BASE_API': JSON.stringify(env.VUE_APP_BASE_API || '/api'),
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    server: {
      port: 9527,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // 将 node_modules 中的包分组
            if (id.includes('node_modules')) {
              if (id.includes('element-plus')) {
                return 'element-plus'
              }
              if (id.includes('vue') || id.includes('@vue')) {
                return 'vue-vendor'
              }
              if (id.includes('lodash') || id.includes('axios') || id.includes('echarts')) {
                return 'vendor'
              }
            }
            
            // 将工具函数分组
            if (id.includes('src/utils') || id.includes('src/api')) {
              return 'utils'
            }
            
            // 将所有 store 模块放在同一个 chunk 中
            if (id.includes('src/stores')) {
              return 'app-stores'
            }
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 移除 additionalData 以避免循环导入
          // additionalData: `@import "@/styles/variables.scss";`
        }
      }
    }
  }
}) 