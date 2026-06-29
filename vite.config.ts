import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@core": path.resolve(__dirname, "src/runtime/core"),
            "@dom": path.resolve(__dirname, "src/runtime/dom"),
            "@assets": path.resolve(__dirname, "src/assets")
        }
    }
});