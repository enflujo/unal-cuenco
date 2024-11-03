import { defineStore } from 'pinia';
import { pedirDatos } from '@/utilidades/ayudas';
import type { CerebroDatos, TiposNodo } from '@/tipos';
import type { Colectivo, Indicador, ListasColectivos, ListasPublicaciones, Publicacion } from '@/tipos/compartidos';

export const usarCerebroDatos = defineStore('cerebroDatos', {
  state: (): CerebroDatos => {
    return {
      listaElegida: null,

      // COLECTIVOS
      colectivos: null,
      indicadoresColectivos: null,
      cargandoColectivos: false,

      listasColectivos: null,
      cargandoListasColectivos: false,

      // PUBLICACIONES
      publicaciones: null,
      indicadoresPublicaciones: null,
      cargandoPublicaciones: false,

      listasPublicaciones: null,
      cargandoListasPublicaciones: false,
    };
  },

  actions: {
    cambiarLista(llaveLista: TiposNodo) {
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

      await this.cargarDatosListaColectivos();
    },

    async cargarDatosPublicaciones() {
      if (this.publicaciones || this.cargandoPublicaciones) return;
      this.cargandoPublicaciones = true;

      try {
        this.publicaciones = await pedirDatos<Publicacion[]>('datos/publicaciones.json');
        this.indicadoresPublicaciones = await pedirDatos<Indicador[]>('datos/indicadores-publicaciones.json');
        this.cargandoPublicaciones = false;
      } catch (error) {
        console.error('Problema cargando datos de publicaciones', JSON.stringify(error));
      }

      await this.cargarDatosListaPublicaciones();
    },
  },
});
