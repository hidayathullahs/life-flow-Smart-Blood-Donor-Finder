import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        // Raise chunk warning threshold — anything below 600KB is acceptable
        chunkSizeWarningLimit: 600,
        rollupOptions: {
            output: {
                // Split large vendors into separate cacheable chunks
                manualChunks: {
                    // Firebase SDK — largest dependency, cache separately
                    'firebase-core': ['firebase/app', 'firebase/auth'],
                    'firebase-firestore': ['firebase/firestore'],
                    'firebase-storage': ['firebase/storage'],
                    'firebase-messaging': ['firebase/messaging'],
                    // React runtime
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    // UI utilities
                    'ui-vendor': ['framer-motion', 'lucide-react', 'react-toastify'],
                },
            },
        },
    },
})
