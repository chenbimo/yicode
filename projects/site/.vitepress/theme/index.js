import DefaultTheme from 'vitepress/theme';
import './style/custom.css';
import homeMore from './components/homeMore.vue';
export default {
    extends: DefaultTheme,
    enhanceApp(ctx) {
        ctx.app.component('homeMore', homeMore);
    }
};
