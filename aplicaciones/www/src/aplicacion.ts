import './scss/estilos.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Aplicacion from './Aplicacion.vue';
import rutas from './rutas';

const app = createApp(Aplicacion);
app.use(createPinia());
app.use(rutas);
app.mount('#aplicacion');
