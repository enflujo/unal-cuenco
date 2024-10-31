import type { Cerebro } from '@/tipos';
import { defineStore } from 'pinia';
import { pedirDatos } from './ayudas';
import type {
  Colectivo,
  Indicador,
  ListasColectivos,
  ListasPublicaciones,
  LlavesColectivos,
  LlavesPA,
} from '@/tipos/compartidos';

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
      indicadoresColectivos: null,
      cargandoColectivos: false,
      publicaciones: null,
      indicadoresPublicaciones: null,
      cargandoPublicaciones: false,
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
        this.listasPublicaciones = await pedirDatos<ListasPublicaciones>('datos/listasPublicaciones.json');
        this.cargandoListasPublicaciones = false;
      } catch (error) {
        console.error('Problema cargando datos de listasPublicaciones', JSON.stringify(error));
      }
    },

    async cargarDatosListaColectivos() {
      if (this.listasColectivos || this.cargandoListasColectivos) return;
      this.cargandoListasColectivos = true;

      try {
        this.listasColectivos = await pedirDatos<ListasColectivos>('datos/listasColectivos.json');
        this.cargandoListasColectivos = false;
      } catch (error) {
        console.error('Problema cargando datos de listasColectivos', JSON.stringify(error));
      }
    },

    async cargarDatosColectivos() {
      if (this.colectivos || this.cargandoColectivos) return;
      this.cargandoColectivos = true;

      try {
        this.colectivos = await pedirDatos<Colectivo[]>('datos/colectivos.json');
        this.indicadoresColectivos = await pedirDatos<Indicador[]>('datos/indicadores-colectivos.json');
        this.cargandoColectivos = false;
      } catch (error) {
        console.error('Problema cargando datos de colectivos', JSON.stringify(error));
      }
    },

    async cargarDatosPublicaciones() {
      if (this.publicaciones || this.cargandoPublicaciones) return;
      this.cargandoPublicaciones = true;

      try {
        this.publicaciones = await pedirDatos<Colectivo[]>('datos/publicaciones.json');
        this.indicadoresPublicaciones = await pedirDatos<Indicador[]>('datos/indicadores-publicaciones.json');
        this.cargandoPublicaciones = false;
      } catch (error) {
        console.error('Problema cargando datos de publicaciones', JSON.stringify(error));
      }
    },
  },
});
