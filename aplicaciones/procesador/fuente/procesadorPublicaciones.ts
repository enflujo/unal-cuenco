import { getXlsxStream } from 'xlstream';
import slugificar from 'slug';
import {
  ordenarListaObjetos,
  guardarJSON,
  limpiarTextoSimple,
  esNumero,
  esUrl,
  aplanarDefinicionesASlugs,
} from './ayudas';
import type {
  ElementoLista,
  Indicador,
  ListasPublicaciones,
  LlavesPublicaciones,
  Publicacion,
} from '@/tipos/compartidos';
import type { Errata, FilaProduccionAcademica } from './tipos';

const publicaciones: Publicacion[] = [];
const listas: ListasPublicaciones = {
  autores: [],
  años: [],
  tipos: [],
  dependencias: [],
  indicadores: [],
};

function procesarLista(llaveLista: LlavesPublicaciones, valor: string) {
  const nombre = limpiarTextoSimple(valor);
  const slug = slugificar(nombre);
  const existe = listas[llaveLista].find((obj) => obj.slug === slug);
  if (!existe) {
    listas[llaveLista].push({
      id: `${listas[llaveLista].length + 1}`,
      nombre,
      slug,
      conteo: 1,
      relaciones: [],
      publicaciones: [],
    });
  } else {
    existe.conteo++;
  }

  return { nombre, slug };
}

export default async (
  ruta: string,
  tabla: string,
  indicadores: Indicador[]
): Promise<{ datos: Publicacion[]; errata: Errata[] }> => {
  const flujo = await getXlsxStream({
    filePath: ruta,
    sheet: tabla,
    withHeader: true,
    ignoreEmpty: true,
  });
  const errata: Errata[] = [];
  let numeroFila = 2;

  return new Promise((resolver) => {
    flujo.on('data', async ({ raw }) => {
      const fila = raw.arr as FilaProduccionAcademica;
      const titulo = limpiarTextoSimple(fila[4]);

      if (titulo) {
        const slug = slugificar(titulo);
        const publicacion: Publicacion = { id: `${numeroFila - 2}`, titulo: { nombre: titulo, slug } };

        /** Autores */
        if (fila[0]) {
          const autores = fila[0].split(';');

          autores.forEach((autor) => {
            const { nombre, slug } = procesarLista('autores', autor);

            if (!publicacion.autores) {
              publicacion.autores = [];
            }
            publicacion.autores.push({ nombre, slug });
          });
        } else {
          errata.push({
            fila: numeroFila,
            error: `No hay autores: ${fila[0]}`,
          });
        }

        /** Resumen */
        if (fila[1]) {
          publicacion.resumen = limpiarTextoSimple(fila[1]);
        }

        /** Fecha publicacion */
        if (fila[2]) {
          const valor = limpiarTextoSimple(`${fila[2]}`);

          if (esNumero(valor)) {
            const { nombre, slug } = procesarLista('años', valor);
            publicacion.años = { nombre, slug };
          } else {
            // Sólo registrar errata si la celda de fecha no tiene nada o es distinto a las convenciones que se usan para indicar que no hay fecha.
            if (fila[2] !== '(s.f)') {
              errata.push({
                fila: numeroFila,
                error: `No hay fecha para la publicación, el valor en la celda es: ${fila[2]}`,
              });
            }
          }
        }

        /** Tipo */
        if (fila[3]) {
          const { nombre, slug } = procesarLista('tipos', fila[3]);
          publicacion.tipos = { nombre, slug };
        } else {
          errata.push({ fila: numeroFila, error: `No se puede procesar el campo: Tipo de publicación.` });
        }

        /** Referencia */
        if (fila[5]) {
          const valor = limpiarTextoSimple(fila[5]);
          publicacion.referencia = valor;
        }

        /** Fuente */
        if (fila[7]) {
          const enlace = limpiarTextoSimple(fila[7]);
          if (esUrl(enlace)) {
            publicacion.fuente = enlace;
          } else {
            errata.push({ fila: numeroFila, error: `En ENLACE FUENTE hay algo que no es un enlace: ${enlace}` });
          }
        }

        /** Dependencia */
        if (fila[8]) {
          const partes = fila[8].split(';');

          partes.forEach((dependencia) => {
            const { nombre, slug } = procesarLista('dependencias', dependencia);

            if (!publicacion.dependencias) {
              publicacion.dependencias = [];
            }
            publicacion.dependencias.push({ nombre, slug });
          });
        } else {
          errata.push({ fila: numeroFila, error: 'No tiene DEPENDENCIA' });
        }

        /** Indicadores */
        if (fila[11]) {
          const { nombre, slug } = procesarLista('indicadores', fila[11]);
          const existe = indicadores.find((indicador) => indicador.slug === slug);
          let id = existe?.id;
          // Acá estoy agregando el indicador a la lista de indicadores si no existe, pero iría sin definición.
          if (!existe) {
            const anterior = indicadores[indicadores.length - 1];
            id = anterior.id + 1;
            indicadores.push({ id, nombre, slug, definicion: '' });
          }

          publicacion.indicadores = { nombre, slug };
        }

        publicaciones.push(publicacion);
      } else {
        errata.push({ fila: numeroFila, error: 'No hay título' });
      }

      numeroFila++;
    });

    flujo.on('close', () => {
      // Aquí ya terminó de leer toda la tabla
      construirRelacionesDePublicaciones();

      for (const lista in listas) {
        ordenarListaObjetos(listas[lista as keyof ListasPublicaciones], 'slug', true);
      }

      publicaciones.sort((a, b) => {
        if (a.titulo.slug < b.titulo.slug) return -1;
        else if (a.titulo.slug > b.titulo.slug) return 1;
        return 0;
      });

      guardarJSON(listas, 'listasPublicaciones');
      resolver({ datos: publicaciones, errata });
    });

    flujo.on('error', (error) => {
      throw new Error(JSON.stringify(error, null, 2));
    });
  });

  function construirRelacionesDePublicaciones() {
    // Estos campos son los que se usan para crear relaciones
    const campos: LlavesPublicaciones[] = ['autores', 'años', 'dependencias', 'indicadores', 'tipos'];

    publicaciones.forEach((colectivo) => {
      // Pasar por cada campo sobre los que queremos construir relaciones
      campos.forEach((campoRelacionDesde) => {
        // Datos que queremos llenar como relación en los otros campos
        const datosRelacionDesde = colectivo[campoRelacionDesde];

        if (datosRelacionDesde) {
          const slugsDesde = aplanarDefinicionesASlugs(datosRelacionDesde);

          campos.forEach((campoRelacionHacia) => {
            // Agregar datos de cada campo en todos los otros, excepto en sí mismo.
            if (campoRelacionDesde !== campoRelacionHacia) {
              // Si no hay datos para llenar entonces podemos salir y continuar.
              if (!colectivo[campoRelacionHacia]) return;

              slugsDesde.forEach((slugDesde) => {
                // Primero: extraer la lista donde van a crearse las relaciones.
                const listaHacia = listas[campoRelacionHacia];
                const desde = listas[campoRelacionDesde].find((obj) => obj.slug === slugDesde);

                if (listaHacia && desde) {
                  // Extraer los slugs de los campos donde se van a crear relaciones para buscarlos en la lista y agregar la relación.
                  const slugsHacia = aplanarDefinicionesASlugs(colectivo[campoRelacionHacia]);
                  llenarRelacion(slugsHacia, listaHacia, desde.id, campoRelacionDesde, colectivo.id);
                } else {
                  console.log('Esto no puede pasar');
                }
              });
            }
          });
        }
      });
    });
  }

  function llenarRelacion(
    slugsHacia: string[],
    lista: ElementoLista[],
    idDesde: string,
    tipoRelacion: LlavesPublicaciones,
    idPublicacion: string
  ) {
    slugsHacia.forEach((slugHacia) => {
      const elementoALlenar = lista.find((obj) => obj.slug === slugHacia);

      if (elementoALlenar) {
        const existe = elementoALlenar.relaciones.find((obj) => obj.id === idDesde && obj.tipo === tipoRelacion);

        if (!existe) {
          elementoALlenar.relaciones.push({ conteo: 1, id: idDesde, tipo: tipoRelacion });
        } else {
          existe.conteo++;
        }

        if (!elementoALlenar.publicaciones?.includes(idPublicacion)) {
          elementoALlenar.publicaciones?.push(idPublicacion);
        }
      }
    });
  }
};
