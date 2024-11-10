import { defineStore } from 'pinia';
import type { CerebroGeneral } from '@/tipos';

export const usarCerebroGeneral = defineStore('cerebroGeneral', {
  state: (): CerebroGeneral => {
    return {
      paginaActual: 'inicio',
      vistaColectivos: 'mapa',
    };
  },
});
