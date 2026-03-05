import { defineConfig, defaultAllowedOrigins } from 'vite'
import shopify from 'vite-plugin-shopify'
import cleanup from '@by-association-only/vite-plugin-shopify-clean'

export default defineConfig({
  plugins: [
    cleanup(),
    shopify({ snippetFile: 'vite-tag.liquid', tunnel: true })
  ],
  server: {
    cors: {
      origin: [
        defaultAllowedOrigins,
        /.myshopify.com$/
      ],
    },
  },
  build: {
    emptyOutDir: false
  }
})
