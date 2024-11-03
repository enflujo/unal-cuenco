import { defineStore } from 'pinia';
import { usarCerebroGeneral } from './general';
import { usarCerebroDatos } from './datos';
import type { CerebroFicha, DatosFicha, TiposNodo } from '@/tipos';
import type {
  Colectivo,
  ElementoLista,
  Indicador,
  LlavesColectivos,
  LlavesPublicaciones,
  Publicacion,
} from '@/tipos/compartidos';
import { nombresListas } from '@/utilidades/constantes';
import { crearUrlsEnTexto } from '@/utilidades/ayudas';

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

    seleccionarNodo(i: number, tipo: TiposNodo) {
      const {
        listasColectivos,
        listasPublicaciones,
        indicadoresColectivos,
        indicadoresPublicaciones,
        colectivos,
        publicaciones,
      } = usarCerebroDatos();
      const { paginaActual } = usarCerebroGeneral();

      const datosFicha: DatosFicha = {
        tipo: nombresListas[tipo],
        titulo: '',
        resumen: '',
      };

      if (paginaActual === 'colectivos') {
        if (tipo === 'colectivos' && colectivos) {
          llenarDatosFichaColectivo(colectivos[i]);
          this.totalNodos = colectivos.length;
        } else if (listasColectivos) {
          llenarDatosFicha(listasColectivos[tipo as LlavesColectivos][i]);
          this.totalNodos = listasColectivos[tipo as LlavesColectivos].length;
        }
      } else if (paginaActual === 'publicaciones') {
        if (tipo === 'publicaciones' && publicaciones) {
          llenarDatosFichaPublicacion(publicaciones[i]);
          this.totalNodos = publicaciones.length;
        } else if (listasPublicaciones) {
          llenarDatosFicha(listasPublicaciones[tipo as LlavesPublicaciones][i]);
          this.totalNodos = listasPublicaciones[tipo as LlavesPublicaciones].length;
        }
      }

      this.indiceActual = i;
      this.fichaVisible = true;
      this.llaveLista = tipo;
      this.datosFicha = datosFicha;

      function listaActual() {
        if (paginaActual === 'colectivos' && listasColectivos) return listasColectivos;
        else if (paginaActual === 'publicaciones') return listasPublicaciones;
        return null;
      }

      function llenarCamposCompartidos(datos: Colectivo | Publicacion) {
        datosFicha.titulo = datos.titulo.nombre;
        datosFicha.resumen = crearUrlsEnTexto(datos.resumen);

        if (datos.dependencias) {
          datosFicha.dependencias = [];
          datos.dependencias.forEach((obj) => {
            const indice = listasColectivos?.dependencias.findIndex((dep) => dep.slug === obj.slug);
            if (indice && indice >= 0) {
              datosFicha.dependencias?.push({ nombre: obj.nombre, conteo: 1, indice });
            }
          });
        }

        if (datos.fuente) {
          datosFicha.fuente = crearUrlsEnTexto(datos.fuente);
        }

        if (datos.indicadores) {
          const lista = listaActual();

          if (lista) {
            datosFicha.indicadores = [];
            const indice = lista.indicadores.findIndex((obj) => obj.slug === datos.indicadores?.slug);
            if (indice && indice >= 0) {
              datosFicha.indicadores.push({ nombre: datos.indicadores.nombre, conteo: 1, indice });
            }
          }
        }

        if (datos.tipos) {
          const lista = listaActual();

          if (lista) {
            datosFicha.tipos = [];
            const indice = lista.tipos.findIndex((obj) => obj.slug === datos.tipos?.slug);
            if (indice && indice >= 0) {
              datosFicha.tipos.push({ nombre: datos.tipos.nombre, conteo: 1, indice });
            }
          }
        }
      }

      function llenarDatosFichaColectivo(datos: Colectivo) {
        llenarCamposCompartidos(datos);
      }

      function llenarDatosFichaPublicacion(datos: Publicacion) {
        llenarCamposCompartidos(datos);
      }

      function llenarDatosFicha(datos: ElementoLista) {
        datosFicha.titulo = datos.nombre;

        if (datos.colectivos && colectivos) {
          datosFicha.colectivos = [];

          datos.colectivos.forEach((id) => {
            const colectivo = colectivos.find((obj) => obj.id === id);

            if (colectivo && datosFicha.colectivos) {
              datosFicha.colectivos.push({ nombre: colectivo.titulo.nombre, conteo: 1, indice: id });
            }
          });
        }

        if (datos.publicaciones && publicaciones) {
          datosFicha.publicaciones = [];

          datos.publicaciones.forEach((id) => {
            const publicacion = publicaciones.find((obj) => obj.id === id);

            if (publicacion && datosFicha.publicaciones) {
              datosFicha.publicaciones.push({ nombre: publicacion.titulo.nombre, conteo: 1, indice: id });
            }
          });
        }

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
    },
  },
});
