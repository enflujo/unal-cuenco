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
import { crearUrlsEnTexto } from '@/utilidades/ayudas';
import { nombresListas } from '@/utilidades/constantes';

export const usarCerebroFicha = defineStore('cerebroFichas', {
  state: (): CerebroFicha => {
    return {
      fichaVisible: false,
      datosFicha: null,
      idActual: '',
      totalNodos: 0,
      llaveLista: 'autores',
    };
  },

  actions: {
    cerrarFicha() {
      this.fichaVisible = false;
      this.idActual = '';
    },

    cambiarFicha(id: string, tipo: TiposNodo, direccion: 'adelante' | 'atras' = 'adelante') {
      const { colectivos, listasColectivos, publicaciones, listasPublicaciones } = usarCerebroDatos();
      const { paginaActual } = usarCerebroGeneral();
      let lista: ElementoLista[] | Colectivo[] | Publicacion[] | null = null;

      if (paginaActual === 'colectivos') {
        if (tipo === 'colectivos') {
          lista = colectivos;
        } else {
          lista = listasColectivos ? listasColectivos[tipo as LlavesColectivos] : null;
        }
      } else if (paginaActual === 'publicaciones') {
        if (tipo === 'publicaciones') {
          lista = publicaciones;
        } else {
          lista = listasPublicaciones ? listasPublicaciones[tipo as LlavesPublicaciones] : null;
        }
      }

      if (lista) {
        const indice = lista.findIndex((obj) => obj.id === id);
        let nuevoId = '';

        if (direccion === 'atras') {
          if (indice >= 0) {
            if (indice === 0) {
              nuevoId = lista[this.totalNodos - 1].id;
            } else {
              nuevoId = lista[indice - 1].id;
            }
          }
        } else if (direccion === 'adelante') {
          if (indice >= this.totalNodos - 1) {
            nuevoId = lista[0].id;
          } else {
            nuevoId = lista[indice + 1].id;
          }
        }

        this.seleccionarNodo(nuevoId, this.llaveLista);
      }
    },

    seleccionarNodo(id: string, tipo: TiposNodo) {
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
        id,
        tipo,
        nombreTipo: nombresListas[tipo],
        titulo: '',
        resumen: '',
      };

      if (paginaActual === 'colectivos') {
        if (tipo === 'colectivos' && colectivos) {
          const colectivo = colectivos.find((obj) => obj.id === id);
          if (colectivo) llenarDatosFichaColectivo(colectivo);
          this.totalNodos = colectivos.length;
        } else if (listasColectivos) {
          const datos = listasColectivos[tipo as LlavesColectivos].find((obj) => obj.id === id);
          if (datos) llenarDatosFicha(datos);
          this.totalNodos = listasColectivos[tipo as LlavesColectivos].length;
        }
      } else if (paginaActual === 'publicaciones') {
        if (tipo === 'publicaciones' && publicaciones) {
          const publicacion = publicaciones.find((obj) => obj.id === id);
          if (publicacion) llenarDatosFichaPublicacion(publicacion);
          this.totalNodos = publicaciones.length;
        } else if (listasPublicaciones) {
          const datos = listasPublicaciones[tipo as LlavesPublicaciones].find((obj) => obj.id === id);
          if (datos) llenarDatosFicha(datos);
          this.totalNodos = listasPublicaciones[tipo as LlavesPublicaciones].length;
        }
      }

      this.idActual = id;
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
            const existe = listasColectivos?.dependencias.find((dep) => dep.slug === obj.slug);
            if (existe) {
              datosFicha.dependencias?.push({ nombre: obj.nombre, conteo: 1, id: existe.id });
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
            const existe = lista.indicadores.find((obj) => obj.slug === datos.indicadores?.slug);
            if (existe) {
              datosFicha.indicadores.push({ nombre: datos.indicadores.nombre, conteo: 1, id: existe.id });
            }
          }
        }

        if (datos.tipos) {
          const lista = listaActual();

          if (lista) {
            datosFicha.tipos = [];
            const existe = lista.tipos.find((obj) => obj.slug === datos.tipos?.slug);
            if (existe) {
              datosFicha.tipos.push({ nombre: datos.tipos.nombre, conteo: 1, id: existe.id });
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
              datosFicha.colectivos.push({ nombre: colectivo.titulo.nombre, conteo: 1, id });
            }
          });
        }

        if (datos.publicaciones && publicaciones) {
          datosFicha.publicaciones = [];

          datos.publicaciones.forEach((id) => {
            const publicacion = publicaciones.find((obj) => obj.id === id);

            if (publicacion && datosFicha.publicaciones) {
              datosFicha.publicaciones.push({ nombre: publicacion.titulo.nombre, conteo: 1, id });
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
            const datos = listasColectivos[obj.tipo as LlavesColectivos].find((c) => c.id === obj.id);
            if (datos) nombre = datos.nombre;
          } else if (paginaActual === 'publicaciones' && listasPublicaciones) {
            const datos = listasPublicaciones[obj.tipo as LlavesPublicaciones].find((p) => p.id === obj.id);
            if (datos) nombre = datos.nombre;
          }

          if (!datosFicha[obj.tipo]) {
            datosFicha[obj.tipo] = [];
          }

          datosFicha[obj.tipo]?.push({ nombre, conteo: obj.conteo, id: obj.id });
        });
      }
    },
  },
});
