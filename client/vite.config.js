import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  // load env variables
  const env = loadEnv(mode, process.cwd())
  console.log('target: ', env.VITE_BASE_URI)
  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BASE_URI,
          changeOrigin: true,
        },
      },
    },
  })
}
