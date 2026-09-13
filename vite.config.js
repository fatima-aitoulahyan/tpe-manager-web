import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // 🎯 Permet d'importer tes composants sans écrire l'extension .jsx ou .js à chaque fois !
    extensions: ['.js', '.jsx', '.json']
  },
  server: {
    host: true, // 🎯 INDISPENSABLE POUR DOCKER : rend l'application accessible depuis l'extérieur du conteneur
    port: 5173,
    watch: {
      usePolling: true, // 🎯 Force la détection des changements de code sur ta machine pour le Hot Reload
    },
  },
})