import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import polyfillNode from 'rollup-plugin-polyfill-node'

const MODE = process.env.NODE_ENV

// https://vitejs.dev/config/
export default defineConfig(({ command, mode })=>{
  // Load env file based on `mode` in the current working directory.
   // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
   const env = loadEnv(mode, process.cwd(), 'VITE_')
   return {
     // vite config
     define: {
       __APP_ENV__: env.APP_ENV
     }
   },
   {
    plugins: [vue(),   // ↓ Have to check the mode here because this cant run on build
    MODE === 'development'
      ? nodePolyfills({
          include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')]
        })
      : ''],
    build: {
      chunkSizeWarningLimit:8000,
      rollupOptions: {
  
        plugins: [ polyfillNode()],
        },      
        commonjsOptions: {
          transformMixedEsModules: true
        } 
      
    },
    optimizeDeps: {
      exclude: [] // <- modules that needs shimming have to be excluded from dep optimization
      },
  
    resolve: {
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: 'util',
      buffer: 'buffer',
         // ↓ see https://github.com/vitejs/vite/issues/6085
      '@ensdomains/address-encoder': '@ensdomains/address-encoder/lib/index.umd.js',
      web3: 'web3/dist/web3.min.js',
    }
   },
  }
 
 
})