import { app } from '@/app.js';

import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';

import ArcoVueIcon from '@arco-design/web-vue/es/icon';

import { router } from '@/router/index.js';

app.use(router);
app.use(ArcoVueIcon);
app.use(ArcoVue);

app.mount('#app');
