import { createI18n } from 'vue-i18n';
import messages from '@intlify/unplugin-vue-i18n/messages';

const i18n = createI18n({
    locale: 'zh',
    messages: messages
});

export { i18n };
