import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
export default defineConfig({
    base: './',
    plugins: [
        uni({
            vueOptions: {
                reactivityTransform: true
            }
        })
    ]
});
