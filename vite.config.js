import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.tsx",
            refresh: true,
        }),
        react(),
    ],
    // server: {
    //     host: true, // listen semua host
    //     port: 5173,
    //     https: true, // pakai HTTPS agar browser tidak blokir
    //     hmr: {
    //         protocol: "wss", // secure WebSocket
    //         host: undefined, // autodetect domain dari request browser (ngrok)
    //     },
    // },
});
