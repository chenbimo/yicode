import { app } from '@/app.js';

import { router } from '@/router/index.js';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';

import '@arco-design/web-vue/dist/arco.css';

app.use(router);
app.use(ArcoVueIcon);

app.mount('#app');
