import { createI18n } from 'vue-i18n';
import messages from '@intlify/unplugin-vue-i18n/messages';

import { app } from '@/app.js';

const i18n = createI18n({
    locale: 'zh',
    messages
});

export { i18n };
