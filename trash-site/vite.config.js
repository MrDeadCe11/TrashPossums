import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
  alias: {
    process: "process/browser",
    stream: "stream-browserify",
    zlib: "browserify-zlib",
    util: 'util'
  }
 }
})

//import nodePolyfills from 'rollup-plugin-polyfill-node';
const production = process.env.NODE_ENV === 'production';

// export default {

//   plugins: [
//     // ↓ Needed for development mode
//     !production && nodePolyfills({
//         include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')]
//       })
//   ],

//   build: {
//     rollupOptions: {
//       plugins: [
//         // ↓ Needed for build
//         nodePolyfills()
//       ]
//     },
//     // ↓ Needed for build if using WalletConnect and other providers
//     commonjsOptions: {
//       transformMixedEsModules: true
//     }
//   }
// }