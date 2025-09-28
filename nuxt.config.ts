import { fileURLToPath } from 'url' // Importe isso no topo do arquivo

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Modules
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@nuxtjs/color-mode',
    'nuxt-security',
    '@nuxtjs/i18n'
  ],
  alias: {
    '@': fileURLToPath(new URL('./', import.meta.url))
  },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true
  },

  // CSS configuration
  css: [
    '@/assets/scss/main.scss',
    'vue-toastification/dist/index.css'
  ],

  // Runtime config
  runtimeConfig: {
    public: {
      // CORRIGIDO: O apiBase agora é um caminho relativo.
      // O Nuxt saberá que deve fazer a requisição para seu próprio backend.
      // Antes: 'http://localhost:3001/api'
      apiBase: '/api',
      siteName: 'Portal LATECE',
      siteDescription: 'Laboratório de Tecnologia Assistiva - UFRN'
    }
  },

  // App configuration
  app: {
    head: {
      title: 'Portal LATECE - Laboratório de Tecnologia Assistiva',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Portal do Laboratório de Tecnologia Assistiva da UFRN' },
        { name: 'keywords', content: 'tecnologia assistiva, acessibilidade, inclusão, UFRN' },
        { name: 'author', content: 'LATECE UFRN' },
        { property: 'og:title', content: 'Portal LATECE - Laboratório de Tecnologia Assistiva' },
        { property: 'og:description', content: 'Portal do Laboratório de Tecnologia Assistiva da UFRN' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
      ]
    }
  },

  // Google Fonts configuration
  googleFonts: {
    families: {
      'Montserrat': [400, 500, 600, 700, 800],
      'Open+Sans': [300, 400, 500, 600, 700]
    },
    display: 'swap'
  },

  // Color mode configuration
  colorMode: {
    preference: 'light',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },

  // Security configuration
  security: {
    headers: {
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
      contentSecurityPolicy: {
        'base-uri': ["'self'"],
        'font-src': ["'self'", 'https:', 'data:'],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        // CORRIGIDO: Removido o localhost:3001, pois as imagens virão da mesma origem agora
        'img-src': ["'self'", 'data:', 'https:'],
        'object-src': ["'none'"],
        'script-src-attr': ["'none'"],
        'worker-src': ["'self'", 'blob:'],
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        'script-src': ["'self'", 'https:', "'unsafe-inline'", "'unsafe-eval'"],
        
        // CORRIGIDO: Removida a necessidade de permitir a conexão com o localhost:3001
        'connect-src': [
          "'self'", 
          'https:', 
          'ws:', 
          'wss:'
        ]
      }
    }
  },

  // i18n configuration
  i18n: {
    // Ensure langDir resolves from project srcDir (not `i18n/`)
    restructureDir: '',
    locales: [
      { code: 'pt', name: 'Português', file: 'pt.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'pt',
    langDir: 'locales/',
    strategy: 'prefix_except_default'
  },

  // Build configuration
  build: {
    transpile: ['vue-toastification']
  },

  // Nitro configuration
  nitro: {
    experimental: {
      wasm: true
    }
  },

  // Vite configuration
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/variables.scss" as *;'
        }
      }
    }
  }
})
