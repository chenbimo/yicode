import App from '@/App.vue';
import 'virtual:uno.css';

console.log('环境变量');
console.log(import.meta.env.VITE_NAMESPACE);

const app = createApp(App);

const $Pinia = Pinia.createPinia();

app.use($Router);
app.use($Pinia);
app.use($I18n);

export { app };
