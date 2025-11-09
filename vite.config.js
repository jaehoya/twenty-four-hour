import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), svgr({
            svgrOptions: {
                svgo: true,
                svgoConfig: { plugins: [{ name: "prefixIds" }] },
            },
        }),
        tailwindcss(),
    ],
    server: {
        host: 'localhost',
        port: 5173,
    },
});