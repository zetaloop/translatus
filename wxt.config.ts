import path from 'node:path'
import process from 'node:process'
import { defineConfig } from 'wxt'

const manifestKey = process.env.READ_FROG_EXTENSION_KEY?.trim()

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  imports: false,
  modules: ['@wxt-dev/module-react', '@wxt-dev/i18n/module'],
  manifestVersion: 3,

  // WXT 顶级 alias - 会自动同步到 tsconfig.json 的 paths 和 Vite 的 alias
  alias: process.env.USE_LOCAL_PACKAGES === 'true'
    ? {
        '@read-frog/definitions': path.resolve(__dirname, '../read-frog-monorepo/packages/definitions/src'),
        '@read-frog/ui': path.resolve(__dirname, '../read-frog-monorepo/packages/ui/src'),
        '@read-frog/api-contract': path.resolve(__dirname, '../read-frog-monorepo/packages/api-contract/src'),
      }
    : {},

  vite: () => {
    return {
      plugins: [],
      resolve: {
        alias: {
          // 保留 React 单例（Vite 专用配置，不影响 tsconfig.json 的 paths）
          'react': path.resolve(__dirname, './node_modules/react'),
          'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
        },
      },
    }
  },
  manifest: ({ mode, browser }) => ({
    ...(manifestKey ? { key: manifestKey } : {}),
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    icons: {
      16: 'icon/16.png',
      32: 'icon/32.png',
      48: 'icon/48.png',
      96: 'icon/96.png',
      128: 'icon/128.png',
    },
    action: {
      default_icon: {
        16: 'icon/light/16.png',
        32: 'icon/light/32.png',
        48: 'icon/light/48.png',
        96: 'icon/light/96.png',
        128: 'icon/light/128.png',
      },
      theme_icons: [
        { light: 'icon/light/16.png', dark: 'icon/dark/16.png', size: 16 },
        { light: 'icon/light/32.png', dark: 'icon/dark/32.png', size: 32 },
        { light: 'icon/light/48.png', dark: 'icon/dark/48.png', size: 48 },
        { light: 'icon/light/96.png', dark: 'icon/dark/96.png', size: 96 },
        { light: 'icon/light/128.png', dark: 'icon/dark/128.png', size: 128 },
      ],
    },
    permissions: ['storage', 'tabs', 'alarms', 'cookies'],
    host_permissions:
      mode === 'development'
        ? [
            'http://localhost:*/*',
          ]
        : [
            'https://*.readfrog.app/*',
            'https://readfrog.app/*', // Include both www and non-www versions
          ],
    // Firefox-specific settings for MV3
    ...(browser === 'firefox' && {
      browser_specific_settings: {
        gecko: {
          id: 'extension@readfrog.app',
          strict_min_version: '109.0',
          theme_icons: [
            { light: 'icon/light/16.png', dark: 'icon/dark/16.png', size: 16 },
            { light: 'icon/light/32.png', dark: 'icon/dark/32.png', size: 32 },
            { light: 'icon/light/48.png', dark: 'icon/dark/48.png', size: 48 },
            { light: 'icon/light/96.png', dark: 'icon/dark/96.png', size: 96 },
            { light: 'icon/light/128.png', dark: 'icon/dark/128.png', size: 128 },
          ],
        },
      },
    }),
  }),
  dev: {
    server: {
      port: 3333,
    },
  },
})
