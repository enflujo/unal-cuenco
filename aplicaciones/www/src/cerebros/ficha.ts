import { defineStore } from 'pinia';
import { usarCerebroGeneral } from './general';
import { usarCerebroDatos } from './datos';
import type { CerebroFicha, DatosFicha, TiposNodo } from '@/tipos';
import type {
  Colectivo,
  ElementoLista,
  Encuentro,
  Indicador,
  ListasColectivos,
  ListasPublicaciones,
  LlavesColectivos,
  LlavesEncuentros,
  LlavesPublicaciones,
  Publicacion,
} from '@/tipos/compartidos';
import { crearUrlsEnTexto } from '@/utilidades/ayudas';
import { nombresListas, tematicasEncuentros } from '@/utilidades/constantes';

export const usarCerebroFicha = defineStore('cerebroFichas', {
  state: (): CerebroFicha => {
    return { fichaVisible: false, datosFicha: null, idActual: '', totalNodos: 0, llaveLista: 'autores' };
  },

  actions: {
    cerrarFicha() {
      this.fichaVisible = false;
      this.idActual = '';
    },

    cambiarFicha(id: string, tipo: TiposNodo, direccion: 'adelante' | 'atras' = 'adelante') {
      const { colectivos, listasColectivos, publicaciones, listasPublicaciones, encuentros, listasEncuentros } =
        usarCerebroDatos();
      const { paginaActual } = usarCerebroGeneral();
      let lista: ElementoLista[] | Colectivo[] | Publicacion[] | Encuentro[] | null = null;

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
      } else if (paginaActual === 'encuentros') {
        if (tipo === 'encuentros') {
          lista = encuentros;
        } else {
          lista = listasEncuentros ? listasEncuentros[tipo as LlavesEncuentros] : null;
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
        indicadoresEncuentros,
        colectivos,
        publicaciones,
        encuentros,
        listasEncuentros,
      } = usarCerebroDatos();
      const { paginaActual } = usarCerebroGeneral();
      const datosFicha: DatosFicha = { id, tipo, nombreTipo: nombresListas[tipo], titulo: '', resumen: '' };

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
      } else if (paginaActual === 'encuentros') {
        if (tipo === 'encuentros' && encuentros) {
          const encuentro = encuentros.find((obj) => obj.id === id);
          if (encuentro) llenarDatosFichaEncuentro(encuentro);
          this.totalNodos = encuentros.length;
        } else if (listasEncuentros) {
          const datos = listasEncuentros[tipo as LlavesEncuentros].find((obj) => obj.id === id);
          if (datos) {
            llenarDatosFicha(datos);

            if (encuentros) {
              datosFicha.fragmentos = [];

              encuentros.forEach((encuentro) => {
                const datosCampo = encuentro[tipo as LlavesEncuentros];

                if (datosCampo) {
                  if (Array.isArray(datosCampo)) {
                    const campo = datosCampo.find((obj) => obj.slug === datos.slug);

                    if (campo && campo.idFragmento) {
                      encuentro.fragmentos
                        .filter((f) => campo.idFragmento.includes(f.id))
                        .forEach((f) => {
                          datosFicha.fragmentos?.push({
                            fragmento: f.fragmento,
                            encuentro: `Encuentro ${encuentro.id}. ${tematicasEncuentros[+encuentro.id]}`,
                          });
                        });
                    }
                  } else if (typeof datosCampo === 'object') {
                    const slugCampo = datos.slug;
                    const slugCampoEncuentro = datosCampo.slug;

                    if (slugCampo === slugCampoEncuentro) {
                      encuentro.fragmentos.forEach((f) => {
                        datosFicha.fragmentos?.push({
                          fragmento: f.fragmento,
                          encuentro: `Encuentro ${encuentro.id}. ${tematicasEncuentros[+encuentro.id]}`,
                        });
                      });
                    }
                  }
                }
              });
            }
          }

          this.totalNodos = listasEncuentros[tipo as LlavesEncuentros].length;
        }
      }

      this.idActual = id;
      this.fichaVisible = true;
      this.llaveLista = tipo;
      this.datosFicha = datosFicha;

      function listaActual() {
        if (paginaActual === 'colectivos' && listasColectivos) return listasColectivos;
        else if (paginaActual === 'publicaciones') return listasPublicaciones;
        else if (paginaActual === 'encuentros') return listasEncuentros;
        return null;
      }

      function llenarCamposCompartidos(datos: Colectivo | Publicacion) {
        datosFicha.titulo = datos.titulo.nombre;
        datosFicha.resumen = crearUrlsEnTexto(datos.resumen);

        if (datos.dependencias) {
          let lista: ListasColectivos | ListasPublicaciones | null = null;
          if (paginaActual === 'colectivos') lista = listasColectivos;
          else if (paginaActual === 'publicaciones') lista = listasPublicaciones;

          datosFicha.dependencias = [];

          datos.dependencias.forEach((obj) => {
            const existe = lista?.dependencias.find((dep) => dep.slug === obj.slug);
            if (existe) {
              datosFicha.dependencias?.push({
                nombre: obj.nombre,
                conteo: 1,
                id: existe.id,
                color: existe.color || '#CCC',
              });
            }
          });
        }

        if (datos.fuente) {
          datosFicha.fuente = crearUrlsEnTexto(datos.fuente);
        }

        if (datos.indicadores) {
          const lista = listaActual();

          if (lista && lista.indicadores) {
            datosFicha.indicadores = [];
            const existe = lista.indicadores.find((obj) => obj.slug === datos.indicadores?.slug);

            if (existe) {
              datosFicha.indicadores.push({
                nombre: datos.indicadores.nombre,
                conteo: 1,
                id: existe.id,
                color: existe.color || '#CCC',
              });
            }
          }
        }

        if (datos.tipos) {
          const lista = listaActual();

          if (lista && lista.tipos) {
            datosFicha.tipos = [];
            const existe = lista.tipos.find((obj) => obj.slug === datos.tipos?.slug);
            if (existe) {
              datosFicha.tipos.push({
                nombre: datos.tipos.nombre,
                conteo: 1,
                id: existe.id,
                color: existe.color || '#CCC',
              });
            }
          }
        }
      }

      function llenarDatosFichaColectivo(datos: Colectivo) {
        llenarCamposCompartidos(datos);

        if (datos.contacto) {
          datosFicha.contacto = crearUrlsEnTexto(datos.contacto);
        }

        if (datos.enlaceFuente) {
          datosFicha.enlaceFuente = `<ul>${datos.enlaceFuente.map((enlace) => `<li>${crearUrlsEnTexto(enlace)}</li>`).join('')}</ul>`;
        }

        if (datos.fechaFin) {
          datosFicha.fechaFin = `${datos.fechaFin}`;
        }

        if (datos.estados) {
          const estado = listasColectivos?.estados.find((obj) => obj.slug === datos.estados?.slug);
          if (estado)
            datosFicha.estados = [
              { nombre: datos.estados.nombre, id: estado.id, conteo: 1, color: estado.color || '#CCC' },
            ];
        }

        if (datos.sedes) {
          datosFicha.sedes = [];

          datos.sedes.forEach((obj) => {
            const sede = listasColectivos?.sedes.find((s) => s.slug === obj.slug);
            if (sede)
              datosFicha.sedes?.push({ nombre: obj.nombre, conteo: 1, id: sede.id, color: sede.color || '#CCC' });
          });
        }

        if (datos.modalidades) {
          const modalidad = listasColectivos?.modalidades.find((obj) => obj.slug === datos.modalidades?.slug);
          if (modalidad)
            datosFicha.modalidades = [
              { nombre: datos.modalidades.nombre, id: modalidad.id, conteo: 1, color: modalidad.color || '#CCC' },
            ];
        }
      }

      function llenarDatosFichaPublicacion(datos: Publicacion) {
        llenarCamposCompartidos(datos);

        if (datos.autores) {
          datosFicha.autores = [];

          datos.autores.forEach((obj) => {
            const autor = listasPublicaciones?.autores.find((a) => a.slug === obj.slug);
            if (autor)
              datosFicha.autores?.push({ nombre: obj.nombre, conteo: 1, id: autor.id, color: autor.color || '#CCC' });
          });
        }

        if (datos.años) {
          const año = listasPublicaciones?.años.find((a) => a.slug === datos.años?.slug);
          if (año) datosFicha.años = [{ nombre: datos.años.nombre, conteo: 1, id: año.id, color: año.color || '#CCC' }];
        }

        if (datos.referencia) {
          datosFicha.referencia = crearUrlsEnTexto(datos.referencia);
        }
      }

      function llenarDatosFichaEncuentro(datos: Encuentro) {
        if (datos.id) {
          datosFicha.encuentros = [
            { nombre: `${datos.id}. ${tematicasEncuentros[+datos.id]}`, id: datos.id, conteo: 1, color: '#CCC' },
          ];
          datosFicha.titulo = `${datos.id}. ${tematicasEncuentros[+datos.id]}`;
        }

        if (datos.participantes) {
          datosFicha.participantes = [];

          datos.participantes.forEach((obj) => {
            const participante = listasEncuentros?.participantes.find((p) => p.slug === obj.slug);
            if (participante)
              datosFicha.participantes?.push({
                nombre: obj.nombre,
                conteo: 1,
                id: participante.id,
                color: participante.color || '#CCC',
              });
          });
        }

        if (datos.tematicas) {
          datosFicha.tematicas = [];

          datos.tematicas.forEach((obj) => {
            const tematica = listasEncuentros?.tematicas.find((t) => t.slug === obj.slug);
            if (tematica)
              datosFicha.tematicas?.push({
                nombre: obj.nombre,
                conteo: 1,
                id: tematica.id,
                color: tematica.color || '#CCC',
              });
          });
        }

        if (datos.tecnicas) {
          const tecnica = listasEncuentros?.tecnicas.find((t) => t.slug === datos.tecnicas?.slug);
          if (tecnica)
            datosFicha.tecnicas = [
              { nombre: datos.tecnicas.nombre, conteo: 1, id: tecnica.id, color: tecnica.color || '#CCC' },
            ];
        }

        if (datos.fragmentos) {
          datosFicha.fragmentos = datos.fragmentos.map((obj) => {
            return {
              fragmento: obj.fragmento,
              encuentro: `Encuentro ${datos.id}. ${tematicasEncuentros[+datos.id]}`,
            };
          });
        }

        if (datos.sedes) {
          const sede = listasEncuentros?.sedes.find((s) => s.slug === datos.sedes?.slug);
          if (sede)
            datosFicha.sedes = [{ nombre: datos.sedes.nombre, conteo: 1, id: sede.id, color: sede.color || '#CCC' }];
        }

        if (datos.categorias) {
          datos.categorias.forEach((obj) => {
            const categoria = listasEncuentros?.categorias.find((c) => c.slug === obj.slug);
            if (categoria) {
              if (!datosFicha.categorias) datosFicha.categorias = [];
              datosFicha.categorias.push({
                nombre: obj.nombre,
                conteo: 1,
                id: categoria.id,
                color: categoria.color || '#CCC',
              });
            }
          });
        }
      }

      function llenarDatosFicha(datos: ElementoLista) {
        datosFicha.titulo = datos.nombre;

        if (datos.colectivos && colectivos) {
          datosFicha.colectivos = [];

          datos.colectivos.forEach((id) => {
            const colectivo = colectivos.find((obj) => obj.id === id);

            if (colectivo && datosFicha.colectivos) {
              datosFicha.colectivos.push({ nombre: colectivo.titulo.nombre, conteo: 1, id, color: '' });
            }
          });
        }

        if (datos.publicaciones && publicaciones) {
          datosFicha.publicaciones = [];

          datos.publicaciones.forEach((id) => {
            const publicacion = publicaciones.find((obj) => obj.id === id);

            if (publicacion && datosFicha.publicaciones) {
              datosFicha.publicaciones.push({ nombre: publicacion.titulo.nombre, conteo: 1, id, color: '' });
            }
          });
        }

        if (datos.encuentros && encuentros) {
          datosFicha.encuentros = [];

          datos.encuentros.forEach((id) => {
            const encuentro = encuentros.find((obj) => obj.id === id);

            if (encuentro && datosFicha.encuentros) {
              datosFicha.encuentros.push({
                nombre: `${encuentro.id}. ${tematicasEncuentros[+encuentro.id]}`,
                conteo: 1,
                id,
                color: '',
              });
            }
          });
        }

        if (tipo === 'indicadores') {
          let indicador: Indicador | undefined;

          if (paginaActual === 'colectivos') {
            indicador = indicadoresColectivos?.find((obj) => obj.slug === datos?.slug);
          } else if (paginaActual === 'publicaciones') {
            indicador = indicadoresPublicaciones?.find((obj) => obj.slug === datos?.slug);
          } else if (paginaActual === 'encuentros') {
            indicador = indicadoresEncuentros?.find((obj) => obj.slug === datos?.slug);
          }

          if (indicador && indicador.definicion) {
            datosFicha.resumen = indicador.definicion;
          }
        } else if (datos.descripcion) {
          datosFicha.resumen = datos.descripcion;
        }

        datos.relaciones?.forEach((obj) => {
          let nombre = '';
          let color = '#CCC';

          if (paginaActual === 'colectivos' && listasColectivos) {
            const datos = listasColectivos[obj.tipo as LlavesColectivos].find((c) => c.id === obj.id);
            if (datos) {
              nombre = datos.nombre;
              color = datos.color || '#CCC';
            }
          } else if (paginaActual === 'publicaciones' && listasPublicaciones) {
            const datos = listasPublicaciones[obj.tipo as LlavesPublicaciones].find((p) => p.id === obj.id);
            if (datos) {
              nombre = datos.nombre;
              color = datos.color || '#CCC';
            }
          } else if (paginaActual === 'encuentros' && listasEncuentros) {
            const datos = listasEncuentros[obj.tipo as LlavesEncuentros].find((p) => p.id === obj.id);
            if (datos) {
              nombre = datos.nombre;
              color = datos.color || '#CCC';
            }
          }

          if (!datosFicha[obj.tipo]) {
            datosFicha[obj.tipo] = [];
          }

          datosFicha[obj.tipo]?.push({ nombre, conteo: obj.conteo, id: obj.id, color });
        });
      }
    },
  },
});
