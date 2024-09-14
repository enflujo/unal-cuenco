import { createRouter, createWebHistory } from 'vue-router'
import Inicio from '@/views/VistaInicio.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: Inicio
    },
    {
      path: '/colectivos-ambitos',
      name: 'colectivos-ambitos',
      // route level code-splitting
      // this generates a separate chunk (Colectivos.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/VistaColectivos.vue')
    },
    {
      path: '/publicaciones',
      name: 'publicaciones',
      component: () => import('../views/VistaPublicaciones.vue')
    },
    {
      path: '/encuentros',
      name: 'encuentros',
      component: () => import('../views/VistaEncuentros.vue')
    }
  ]
})

export default router
