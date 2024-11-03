import { defineStore } from 'pinia';
import { usarCerebroGeneral } from './general';
import { usarCerebroDatos } from './datos';
import type { CerebroFicha, DatosFicha } from '@/tipos';
import type { ElementoLista, Indicador, LlavesColectivos, LlavesPublicaciones } from '@/tipos/compartidos';
import { nombresListas } from '@/utilidades/constantes';

export const usarCerebroFicha = defineStore('cerebroFichas', {
  state: (): CerebroFicha => {
    return {
      fichaVisible: false,
      datosFicha: null,
      indiceActual: -1,
      totalNodos: 0,
      llaveLista: 'autores',
    };
  },

  actions: {
    cerrarFicha() {
      this.fichaVisible = false;
      this.indiceActual = -1;
    },

    fichaAnterior() {
      if (this.indiceActual === 0) {
        this.seleccionarNodo(this.totalNodos - 1, this.llaveLista);
      } else {
        this.seleccionarNodo(this.indiceActual - 1, this.llaveLista);
      }
    },

    fichaSiguiente() {
      if (this.indiceActual >= this.totalNodos - 1) {
        this.seleccionarNodo(0, this.llaveLista);
      } else {
        this.seleccionarNodo(this.indiceActual + 1, this.llaveLista);
      }
    },

    seleccionarNodo(i: number, tipo: LlavesColectivos | LlavesPublicaciones) {
      const { listasColectivos, listasPublicaciones, indicadoresColectivos, indicadoresPublicaciones } =
        usarCerebroDatos();
      const { paginaActual } = usarCerebroGeneral();

      const datosFicha: DatosFicha = {
        tipo: nombresListas[tipo],
        titulo: '',
        resumen: '',
      };

      function llenarDatosFicha(datos: ElementoLista) {
        datosFicha.titulo = datos.nombre;

        if (tipo === 'indicadores') {
          let indicador: Indicador | undefined;

          if (paginaActual === 'colectivos') {
            indicador = indicadoresColectivos?.find((obj) => obj.slug === datos?.slug);
          } else if (paginaActual === 'publicaciones') {
            indicador = indicadoresPublicaciones?.find((obj) => obj.slug === datos?.slug);
          }

          if (indicador && indicador.definicion) {
            datosFicha.resumen = indicador.definicion;
          }
        } else if (datos.descripcion) {
          datosFicha.resumen = datos.descripcion;
        }

        datos.relaciones.forEach((obj) => {
          let nombre = '';

          if (paginaActual === 'colectivos' && listasColectivos) {
            nombre = listasColectivos[obj.tipo as LlavesColectivos][obj.indice].nombre;
          } else if (paginaActual === 'publicaciones' && listasPublicaciones) {
            nombre = listasPublicaciones[obj.tipo as LlavesPublicaciones][obj.indice].nombre;
          }

          if (!datosFicha[obj.tipo]) {
            datosFicha[obj.tipo] = [];
          }

          datosFicha[obj.tipo]?.push({ nombre, conteo: obj.conteo, indice: obj.indice });
        });
      }

      if (paginaActual === 'colectivos' && listasColectivos) {
        const datos = listasColectivos[tipo as LlavesColectivos][i];
        llenarDatosFicha(datos);
        this.totalNodos = listasColectivos[tipo as LlavesColectivos].length;
      } else if (paginaActual === 'publicaciones' && listasPublicaciones) {
        const datos = listasPublicaciones[tipo as LlavesPublicaciones][i];
        llenarDatosFicha(datos);
        this.totalNodos = listasPublicaciones[tipo as LlavesPublicaciones].length;
      }

      this.indiceActual = i;
      this.fichaVisible = true;
      this.llaveLista = tipo;
      this.datosFicha = datosFicha;
    },
  },
});
