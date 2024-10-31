import type { Cerebro } from '@/tipos';
import { defineStore } from 'pinia';
import { pedirDatos } from './ayudas';
import { Colectivo, ListasColectivos, ListasPublicaciones, LlavesColectivos, LlavesPA } from '@/tipos/compartidos';

export const nombresListas = {
  publicacion: 'Publicacion',
  autores: 'Autores',
  tipos: 'Tipos',
  años: 'Años',
  dependencias: 'Dependencias',
  indicadores: 'Indicadores',
  subindicadores: 'Subindicadores',
  sedes: 'Sedes',
  modalidades: 'Modalidades',
  estados: 'Estado',
};

export const usarCerebro = defineStore('cerebro', {
  state: (): Cerebro => {
    return {
      publicacionElegida: null,
      colectivoElegido: null,
      listaElegida: null,
      listasPublicaciones: null,
      cargandoListasPublicaciones: false,
      listasColectivos: null,
      cargandoListasColectivos: false,
      colectivos: null,
      cargandoColectivos: false,
    };
  },

  actions: {
    cambiarLista(llaveLista: LlavesColectivos | LlavesPA) {
      this.listaElegida = llaveLista;
    },

    async cargarDatosListaPublicaciones() {
      if (this.listasPublicaciones || this.cargandoListasPublicaciones) return;
      this.cargandoListasPublicaciones = true;

      try {
        const respuesta = await pedirDatos<ListasPublicaciones>('datos/listasPublicaciones.json');
        this.listasPublicaciones = respuesta;
        this.cargandoListasPublicaciones = false;
      } catch (error) {
        console.error('Problema cargando datos de listasPublicaciones', JSON.stringify(error));
      }
    },

    async cargarDatosListaColectivos() {
      if (this.listasColectivos || this.cargandoListasColectivos) return;
      this.cargandoListasColectivos = true;

      try {
        const respuesta = await pedirDatos<ListasColectivos>('datos/listasColectivos.json');
        this.listasColectivos = respuesta;
        this.cargandoListasColectivos = false;
      } catch (error) {
        console.error('Problema cargando datos de listasColectivos', JSON.stringify(error));
      }
    },

    async cargarDatosColectivos() {
      if (this.colectivos || this.cargandoColectivos) return;
      this.cargandoColectivos = true;

      try {
        const respuesta = await pedirDatos<Colectivo[]>('datos/colectivos.json');
        this.colectivos = respuesta;
        this.cargandoColectivos = false;
      } catch (error) {
        console.error('Problema cargando datos de colectivos', JSON.stringify(error));
      }
    },
  },
});
