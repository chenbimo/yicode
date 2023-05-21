import { createI18n } from 'vue-i18n';
import { yiteMessages } from 'virtual:yite-messages';

const i18n = createI18n({
    locale: 'zh',
    messages: await yiteMessages()
});

export { i18n };
