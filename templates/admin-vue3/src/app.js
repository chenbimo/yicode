import App from '@/App.vue';
import * as Pinia from 'pinia';

import { router } from '@/router/index.js';
import { i18n } from '@/plugins/i18n.js';
import 'uno.css';
// 创建实例
const app = createApp(App);

const pinia = Pinia.createPinia();

app.use(router);
app.use(pinia);
app.use(i18n);

export { app };
