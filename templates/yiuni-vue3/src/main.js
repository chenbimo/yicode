import * as Pinia from 'pinia';
import App from './App';

// #ifdef H5
window.QQmap = null;
// #endif

import { createSSRApp } from 'vue';
export function createApp() {
    const app = createSSRApp(App);
    app.use(Pinia.createPinia());

    return {
        app,
        Pinia
    };
}
