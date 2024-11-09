import { createRouter, createWebHistory } from 'vue-router';
import Inicio from '@/vistas/VistaInicio.vue';
import Vista404 from '@/vistas/Vista404.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: Inicio,
    },
    {
      path: '/colectivos-ambitos',
      name: 'colectivos-ambitos',
      component: () => import('../vistas/VistaColectivos.vue'),
    },
    {
      path: '/publicaciones',
      name: 'publicaciones',
      component: () => import('../vistas/VistaPublicaciones.vue'),
    },
    {
      path: '/encuentros',
      name: 'encuentros',
      component: () => import('../vistas/VistaEncuentros.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'perdido',
      component: Vista404,
    },
  ],
});

export default router;
