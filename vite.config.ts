import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three')) return 'vendor-three';
          if (id.includes('@react-three/fiber')) return 'vendor-r3f';
          if (id.includes('zustand')) return 'vendor-state';
          if (id.includes('@tanstack')) return 'vendor-query';
          if (id.includes('react-dom')) return 'vendor-react';
        }
      }
    }
  },
  plugins: [
    react(),
    visualizer({
      open: true,
      filename: 'bundle-report.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,woff,woff2}'
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          // Weather API caching
          {
            urlPattern: /^https:\/\/api\.openweathermap\.org\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'weather-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 30 // 30 minutes
              },
            },
          },
          // CDN resources (Three.js, etc.)
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-resources',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          // Images
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      },
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'android/*.png',
        'ios/*.png',
        'windows11/*.png'
      ],
      // VitePWA will generate manifest.json automatically from this config
      manifest: {
        name: 'Matrix Weather',
        short_name: 'Matrix Weather',
        description: 'Weather data displayed in Matrix-style visual effects',
        theme_color: '#00ff00',
        background_color: '#000000',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        categories: ['weather', 'utilities'],
        lang: 'en',
        icons: [
          // Essential icons (remove the rest to reduce clutter)
          {
            src: 'android/android-launchericon-192-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'android/android-launchericon-512-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Current Weather',
            short_name: 'Current',
            description: 'View current weather conditions',
            url: '/?shortcut=current',
            icons: [
              {
                src: 'android/android-launchericon-96-96.png',
                sizes: '96x96'
              }
            ]
          }
        ]
      },
      // Add dev options to ensure service worker works in development
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});