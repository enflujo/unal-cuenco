import './scss/estilos.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Aplicacion from './Aplicacion.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Inicio from '@/paginas/Inicio.vue';

const rutas = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: Inicio,
    },
    {
      path: '/colectivos',
      name: 'colectivos',
      component: () => import('@/paginas/Colectivos.vue'),
    },
    {
      path: '/colectivos/:vista',
      component: () => import('@/paginas/VistasColectivos.vue'),
    },

    {
      path: '/publicaciones',
      name: 'publicaciones',
      component: () => import('@/paginas/Publicaciones.vue'),
    },
    {
      path: '/encuentros',
      name: 'encuentros',
      component: () => import('@/paginas/Encuentros.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'creditos',
      component: import('@/paginas/Creditos.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'perdido',
      component: import('@/paginas/404.vue'),
    },
  ],
});

const app = createApp(Aplicacion);
app.use(createPinia());
app.use(rutas);
app.mount('#aplicacion');
