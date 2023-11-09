import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import ReactivityTransform from '@vue-macros/reactivity-transform/vite';
export default defineConfig({
    base: './',
    plugins: [
        uni({
            vueOptions: {}
        }),
        ReactivityTransform()
    ]
});
