import vuePlugin from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';


export default defineConfig({
    plugins: [vuePlugin()],
    test: {
        environment: "happy-dom",
    },
})