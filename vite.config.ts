import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    ...(mode !== 'lib' ? [vueDevTools()] : []),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  ...(mode === 'lib' && {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'UiVueLiveness',
        fileName: (format) => `ui-vue-liveness.${format === 'es' ? 'js' : format === 'cjs' ? 'umd.cjs' : format}`
      },
      rollupOptions: {
        external: ['vue', '@aws-amplify/ui-vue', '@aws-amplify/ui'],
        output: {
          globals: {
            vue: 'Vue',
            '@aws-amplify/ui-vue': 'AmplifyUiVue',
            '@aws-amplify/ui': 'AmplifyUi'
          }
        }
      }
    }
  })
}))
