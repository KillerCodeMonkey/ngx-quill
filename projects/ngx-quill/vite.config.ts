import angular from '@analogjs/vite-plugin-angular'
import { playwright } from '@vitest/browser-playwright'
import path from 'path'
import { defaultClientConditions, defaultServerConditions, defineConfig } from 'vite'
import { mergeConfig, defineConfig as testConfig } from 'vitest/config'

export default mergeConfig(defineConfig({
  resolve: {
    alias: {
      "ngx-quill/config": path.resolve(__dirname, "config/src/public_api.ts"),
      "ngx-quill": path.resolve(__dirname, "src/public_api.ts")
    },
  },
  plugins: [
    angular({ tsconfig: 'projects/ngx-quill/tsconfig.spec.json' }),
    {
      config: () => {
        return {
          resolve: { conditions: [...defaultClientConditions] },
          ssr: {
            resolve: {
              conditions: [...defaultServerConditions],
              externalConditions: [...defaultServerConditions]
            }
          }
        }
      },
      enforce: 'post',
      name: 'tslib-fix'
    }
  ],
}), testConfig({
  test: {
    browser: {
      provider: playwright(),
      enabled: true,
      headless: true,
      instances: [{
        browser: 'chromium'
      }]
    },
    reporters: process.env.GITHUB_ACTIONS
      ? [
          'dot',
          'github-actions'
        ]
      : ['dot'],
    globals: true,
    pool: 'threads',
    css: false,
    environment: 'jsdom',
    include: ['projects/ngx-quill/**/*.spec.ts'],
    setupFiles: ['projects/ngx-quill/test-setup.ts'],
    deps: { optimizer: { web: { enabled: true } } }
  }
}))
