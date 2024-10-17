import type { Cerebro } from '@/tipos';
import { defineStore } from 'pinia';

export const nombresListas = {
  publicacion: 'Publicacion',
  autores: 'Autores',
  tipos: 'Tipos',
  años: 'Años',
  dependencias: 'Dependencias',
  indicadores: 'Indicadores',
  subindicadores: 'Subindicadores',
  responsables: 'Responsables',
  sedes: 'Sedes',
  modalidades: 'Modalidades',
  estados: 'Estado',
};

export const usarCerebro = defineStore('cerebro', {
  state: (): Cerebro => {
    return {
      publicacionElegida: null,
      colectivoElegido: null,
    };
  },

  actions: {},
});
