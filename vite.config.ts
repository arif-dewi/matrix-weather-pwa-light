import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
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
          // Small icons
          {
            src: 'ios/16.png',
            sizes: '16x16',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/20.png',
            sizes: '20x20',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/29.png',
            sizes: '29x29',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/32.png',
            sizes: '32x32',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/40.png',
            sizes: '40x40',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'android/android-launchericon-48-48.png',
            sizes: '48x48',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/50.png',
            sizes: '50x50',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/57.png',
            sizes: '57x57',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/58.png',
            sizes: '58x58',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/60.png',
            sizes: '60x60',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/64.png',
            sizes: '64x64',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'android/android-launchericon-72-72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/76.png',
            sizes: '76x76',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/80.png',
            sizes: '80x80',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/87.png',
            sizes: '87x87',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'android/android-launchericon-96-96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/100.png',
            sizes: '100x100',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/114.png',
            sizes: '114x114',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/120.png',
            sizes: '120x120',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'android/android-launchericon-144-144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/167.png',
            sizes: '167x167',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/180.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'android/android-launchericon-192-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'ios/256.png',
            sizes: '256x256',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'android/android-launchericon-512-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'ios/512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'ios/1024.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'any'
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
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
