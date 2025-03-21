import { getXlsxStream } from 'xlstream';
import slugificar from 'slug';
import {
  ordenarListaObjetos,
  limpiarTextoSimple,
  esUrl,
  extraerUrls,
  esNumero,
  aplanarDefinicionesASlugs,
} from './ayudas';
import type {
  Colectivo,
  DefinicionSimple,
  ElementoLista,
  Indicador,
  ListasColectivos,
  LlavesColectivos,
} from '@/tipos/compartidos';
import type { Errata, FilaColectivos } from './tipos';
import { datosGeo } from '../datos/datosGeo';

const colectivos: Colectivo[] = [];
const listas: ListasColectivos = {
  tipos: [],
  estados: [],
  sedes: [],
  dependencias: [],
  modalidades: [],
  indicadores: [],
};

export default async (
  ruta: string,
  tabla: string,
  indicadores: Indicador[]
): Promise<{ datos: Colectivo[]; errata: Errata[]; listas: ListasColectivos }> => {
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
      const fila = raw.arr as FilaColectivos;
      const nombre = limpiarTextoSimple(fila[0]);

      if (nombre) {
        const colectivo: Colectivo = { id: `${numeroFila - 1}`, titulo: { nombre, slug: slugificar(nombre) } };

        /** Tipos de Ámbito */
        if (fila[1]) {
          const { nombre, slug } = procesarLista('tipos', fila[1]);
          colectivo.tipos = { nombre, slug };
        } else {
          errata.push({ fila: numeroFila, error: `No tiene TIPO DE ÁMBITO.` });
        }

        /** Descripción */
        if (fila[2]) {
          colectivo.resumen = limpiarTextoSimple(fila[2]);
        }

        /** Estado activo */
        if (fila[3]) {
          if (+fila[3] === 2024) {
            const { nombre, slug } = procesarLista('estados', 'Activo');
            colectivo.estados = { nombre, slug };
          } else {
            errata.push({ fila: numeroFila, error: `No se puede procesar el campo: Estado Activo.` });
          }
        }

        /** Estado inactivo */
        if (fila[4]) {
          const valor = limpiarTextoSimple(`${fila[4]}`);
          const año = +valor;
          const modosNombrar = ['Sin información', 'No activo', 'inactivo', 'Suspendido', 'Inactivo'];

          if (modosNombrar.includes(valor)) {
            const { nombre, slug } = procesarLista('estados', 'Inactivo');
            colectivo.estados = { nombre, slug };
          } else if (esNumero(año)) {
            const { nombre, slug } = procesarLista('estados', 'Inactivo');
            colectivo.estados = { nombre, slug };
            colectivo.fechaFin = +año;
          } else if (valor === 'Activo') {
            const { nombre, slug } = procesarLista('estados', 'Activo');
            colectivo.estados = { nombre, slug };
          } else if (valor === 'Terminado 2014') {
            const { nombre, slug } = procesarLista('estados', 'Inactivo');
            colectivo.estados = { nombre, slug };
            colectivo.fechaFin = 2014;
          } else {
            console.log('4', numeroFila, valor, año);
            errata.push({ fila: numeroFila, error: `No se puede procesar el campo: Estado Inactivo.` });
          }
        }

        /** Enlaces Fuentes */
        if (fila[6]) {
          let enlace = limpiarTextoSimple(fila[6]);

          if (enlace === 'www.telesion.unal.edu.co.') {
            enlace = 'https://television.unal.edu.co/';
          }

          const enlaces = extraerUrls(enlace);
          const enlacesValidados: string[] = [];

          enlaces.forEach((enlace) => {
            if (esUrl(enlace)) {
              enlacesValidados.push(enlace);
            } else {
              errata.push({ fila: numeroFila, error: `En ENLACE FUENTE hay algo que no es un enlace: ${enlace}` });
            }
          });

          if (enlacesValidados.length) {
            colectivo.enlaceFuente = enlacesValidados;
          } else {
            errata.push({ fila: numeroFila, error: `La URL en columna de ENLACE FUENTE no es una URL.` });
          }
        }

        /** Fuentes */
        if (fila[5]) {
          let fuente = limpiarTextoSimple(fila[5]);
          colectivo.fuente = fuente;
        }

        /**
         * Contacto colectivo
         * Esto va tocar procesarlo con REGEX en el sitio porque las formas de escribir los valores
         * de este campo no siguen una misma estructura.
         */
        if (fila[9]) {
          colectivo.contacto = limpiarTextoSimple(fila[9]);
        }

        /** Sedes */
        if (fila[10]) {
          const valorSedes = limpiarTextoSimple(fila[10]);
          const sedes: DefinicionSimple[] = [];

          // Las sedes no se separaron con ; sino con y. Ejemplo: "Bogotá y Medellin"
          if (valorSedes.includes(' y ')) {
            // En este caso separar primero las sedes y luego procesarlas.
            valorSedes.split(' y ').forEach((sede) => {
              const { nombre, slug } = procesarLista('sedes', sede);
              sedes.push({ nombre, slug });
            });
          } else {
            const { nombre, slug } = procesarLista('sedes', valorSedes);
            sedes.push({ nombre, slug });
          }

          colectivo.sedes = sedes;
        } else {
          errata.push({ fila: numeroFila, error: `No tiene SEDE.` });
        }

        /** Dependencia */
        if (fila[11]) {
          const partes = fila[11].split(';');

          partes.forEach((dependencia) => {
            const { nombre, slug } = procesarLista('dependencias', dependencia);

            if (!colectivo.dependencias) {
              colectivo.dependencias = [];
            }
            colectivo.dependencias.push({ nombre, slug });
          });
        } else {
          errata.push({ fila: numeroFila, error: 'No tiene DEPENDENCIA' });
        }

        /** Modalidad */
        if (fila[12]) {
          const { nombre, slug } = procesarLista('modalidades', fila[12]);
          colectivo.modalidades = { nombre, slug };
        } else {
          errata.push({ fila: numeroFila, error: `No tiene MODALIDAD.` });
        }

        /** Indicadores */
        if (fila[13]) {
          const { nombre, slug } = procesarLista('indicadores', fila[13]);
          const existe = indicadores.find((indicador) => indicador.slug === slug);
          let id = existe?.id;
          // Acá estoy agregando el indicador a la lista de indicadores si no existe, pero iría sin definición.
          if (!existe) {
            const anterior = indicadores[indicadores.length - 1];
            id = anterior.id + 1;
            indicadores.push({ id, nombre, slug, definicion: '' });
          }

          colectivo.indicadores = { nombre, slug }; // id
        }

        colectivos.push(colectivo);
      }

      numeroFila++;

      function procesarLista(llaveLista: LlavesColectivos, valor: string) {
        const nombre = limpiarTextoSimple(valor);
        const slug = slugificar(nombre);
        const objeto: ElementoLista = {
          id: `${listas[llaveLista].length + 1}`,
          nombre,
          slug,
          conteo: 1,
          relaciones: [],
          colectivos: [],
        };

        const existe = listas[llaveLista].find((obj) => obj.slug === slug);

        if (!existe) {
          if (llaveLista === 'sedes') {
            const coordenadas = datosGeo[slug];

            if (coordenadas) {
              objeto.coordenadas = coordenadas;
            } else {
              errata.push({ fila: numeroFila, error: `No se encontraron coordenadas para la sede: ${nombre}` });
            }
          }

          listas[llaveLista].push(objeto);
        } else {
          existe.conteo++;
        }

        return { nombre, slug };
      }
    });

    flujo.on('close', () => {
      // Aquí ya terminó de leer toda la tabla
      construirRelacionesColectivos();

      for (const lista in listas) {
        ordenarListaObjetos(listas[lista as keyof ListasColectivos], 'slug', true);
      }

      colectivos.sort((a, b) => {
        if (a.titulo.slug < b.titulo.slug) return -1;
        else if (a.titulo.slug > b.titulo.slug) return 1;
        return 0;
      });

      resolver({ datos: colectivos, errata, listas });
    });

    flujo.on('error', (error) => {
      throw new Error(JSON.stringify(error, null, 2));
    });
  });

  function construirRelacionesColectivos() {
    // Estos campos son los que se usan para crear relaciones
    const campos: LlavesColectivos[] = ['tipos', 'estados', 'sedes', 'dependencias', 'modalidades', 'indicadores'];

    colectivos.forEach((colectivo) => {
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
    tipoRelacion: LlavesColectivos,
    idColectivo: string
  ) {
    slugsHacia.forEach((slugHacia) => {
      const elementoALlenar = lista.find((obj) => obj.slug === slugHacia);

      if (elementoALlenar) {
        const existe = elementoALlenar.relaciones?.find((obj) => obj.id === idDesde && obj.tipo === tipoRelacion);

        if (!existe) {
          elementoALlenar.relaciones?.push({ conteo: 1, id: idDesde, tipo: tipoRelacion });
        } else {
          existe.conteo++;
        }

        if (!elementoALlenar.colectivos?.includes(idColectivo)) {
          elementoALlenar.colectivos?.push(idColectivo);
        }
      }
    });
  }
};
