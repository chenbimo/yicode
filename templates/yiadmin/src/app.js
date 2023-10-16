import App from '@/App.vue';
import 'virtual:uno.css';

const app = createApp(App);

const $Pinia = Pinia.createPinia();

app.use($Router);
app.use($Pinia);
app.use($I18n);

export { app };
