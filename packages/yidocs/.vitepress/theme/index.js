import DefaultTheme from 'vitepress/theme';
import './style/custom.css';
import homeMore from './components/homeMore.vue';
export default {
    extends: DefaultTheme,
    enhanceApp({ app, router, siteData }) {
        app.component('homeMore', homeMore);
    }
};
