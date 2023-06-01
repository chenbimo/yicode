import { defineConfig } from 'vite';
import ReactivityTransform from '@vue-macros/reactivity-transform/vite';
import uni from '@dcloudio/vite-plugin-uni';
export default defineConfig({
    base: './',
    plugins: [
        //
        uni({}),
        ReactivityTransform()
    ]
});
