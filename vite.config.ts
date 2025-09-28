import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Removed custom plugin - using Vite's built-in optimization instead

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    // Optimize build for production
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
      },
      mangle: {
        toplevel: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // More aggressive chunking
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('react-router')) {
              return 'router'
            }
            if (id.includes('react-icons') || id.includes('@heroicons') || id.includes('lucide-react')) {
              return 'ui-icons'
            }
            if (id.includes('recharts')) {
              return 'charts'
            }
            if (id.includes('i18next')) {
              return 'i18n'
            }
            if (id.includes('@supabase')) {
              return 'supabase'
            }
            if (id.includes('clsx')) {
              return 'utils'
            }
            return 'vendor'
          }
          // Split app code by feature
          if (id.includes('components/MantraPractice')) {
            return 'mantra-practice'
          }
          if (id.includes('components/EmotionSelector')) {
            return 'emotion-selector'
          }
          if (id.includes('pages/UserProfilePage')) {
            return 'user-profile'
          }
        },
        // Optimize chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            const name = facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
            return `assets/${name}-[hash].js`
          }
          return 'assets/[name]-[hash].js'
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 500,
    // Enable source maps for debugging
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'i18next',
      'react-i18next',
      '@supabase/supabase-js',
      'recharts',
      'es-toolkit',
    ],
    exclude: [
      // Exclude heavy dependencies that are lazy-loaded
      'react-icons',
      '@heroicons/react',
      'lucide-react',
      // 'recharts', // Removed - causing module resolution issues
    ],
  },
  // Enable tree shaking
  esbuild: {
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    // More aggressive tree shaking
    pure: ['console.log', 'console.info', 'console.debug'],
    drop: ['console', 'debugger'],
  },
  // Define global constants for better tree shaking
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
})
