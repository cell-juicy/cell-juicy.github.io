import vuePlugin from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';
import path from 'path';


export default defineConfig({
    plugins: [vuePlugin()],
    test: {
        environment: "happy-dom",
        coverage: {
            enabled: true,
            provider: "v8",
            reporter: ["text", "json", "html"],
            exclude: [
                'node_modules/**',
                '.vite/**',
                'docs/.vitepress/theme/test/**',
                'docs/.vitepress/theme/docs/**',
            ],
            include: [
                'docs/.vitepress/theme/components/*.vue',
                'docs/.vitepress/theme/utils/**/*.[jt]s',
                'docs/.vitepress/theme/layouts/**/*.vue',
                'docs/.vitepress/theme/composables/**/*.[jt]s'
            ],
            reportsDirectory: "docs/.vitepress/theme/test/coverage"
        }
    },
})