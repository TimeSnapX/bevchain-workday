import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Default base for GitHub Pages project site: https://USER.github.io/bevchain-workday/
// For a user/org site (root), set VITE_BASE=/ or change base here to '/'
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/bevchain-workday/',
})
