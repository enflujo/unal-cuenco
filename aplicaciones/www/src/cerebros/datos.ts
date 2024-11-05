import { defineStore } from 'pinia';
import { pedirDatos } from '@/utilidades/ayudas';
import type { CerebroDatos, TiposNodo } from '@/tipos';
import type { Colectivo, Indicador, ListasColectivos, ListasPublicaciones, Publicacion } from '@/tipos/compartidos';

export const usarCerebroDatos = defineStore('cerebroDatos', {
  state: (): CerebroDatos => {
    return {
      listaElegida: null,
      extremosFechasPublicaciones: null,

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

    async cargarDatosListaPublicaciones() {
      if (this.listasPublicaciones || this.cargandoListasPublicaciones) return;
      this.cargandoListasPublicaciones = true;

      try {
        const lista = await pedirDatos<ListasPublicaciones>('datos/listasPublicaciones.json');
        const { años } = lista;
        let añoMin = Infinity;
        let añoMax = 0;

        // Extraer los extremos de fecha mínima y máxima
        años.forEach((año) => {
          const valorAño = +año.nombre;
          if (añoMin > valorAño) añoMin = valorAño;
          if (añoMax < valorAño) añoMax = valorAño;
        });
        const valores = { min: añoMin, max: añoMax };
        this.extremosFechasPublicaciones = { ...valores, total: añoMax - añoMin };

        this.listasPublicaciones = lista;
        this.cargandoListasPublicaciones = false;
      } catch (error) {
        console.error('Problema cargando datos de listasPublicaciones', JSON.stringify(error));
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
  },
});
