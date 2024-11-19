import path from 'path'
import process from 'process'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
// import { viteBuildInfo } from "@bbk47/vite-plugin-buildinfo";

const isProd = process.env.NODE_ENV === "production";



// https://vitejs.dev/config/
export default defineConfig({
  base: isProd ? "https://asset.tuwan.com/diandianele/" : "./",
  plugins: [svelte()],
  resolve: {
    alias: {
      '@': path.resolve('src/renderer/src'),
    },
  },
  root: path.resolve(process.cwd(), 'src/renderer'),
})
