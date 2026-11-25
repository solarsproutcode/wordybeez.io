import { defineConfig } from "vite";

export default defineConfig({
    // index.html out file will start with a relative path for script
    base: "./",
    server: {
        port: 3001,
        // send /api requests to the express server (server.js) during dev
        proxy: { "/api": "http://localhost:3000" },
    },
    build: {
        // disable this for low bundle sizes
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules/kaplay")) {
                        return "kaplay";
                    }
                },
            },
        },
    },
    plugins: [
        
    ],
});