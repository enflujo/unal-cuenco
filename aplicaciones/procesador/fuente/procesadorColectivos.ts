import { getXlsxStream } from 'xlstream';
import slugificar from 'slug';
import {
  ordenarListaObjetos,
  guardarJSON,
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

const colectivos: Colectivo[] = [];
const listas: ListasColectivos = {
  tipos: [],
  estados: [],
  sedes: [],
  dependencias: [],
  modalidades: [],
  indicadores: [],
};

function procesarLista(llaveLista: LlavesColectivos, valor: string) {
  const nombre = limpiarTextoSimple(valor);
  const slug = slugificar(nombre);
  const existe = listas[llaveLista].find((obj) => obj.slug === slug);
  if (!existe) {
    listas[llaveLista].push({
      nombre,
      slug,
      conteo: 1,
      relaciones: [],
      colectivos: [],
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
): Promise<{ datos: Colectivo[]; errata: Errata[] }> => {
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
        const colectivo: Colectivo = { id: numeroFila - 1, titulo: { nombre, slug: slugificar(nombre) } };

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
          const { nombre, slug } = procesarLista('dependencias', fila[11]);
          colectivo.dependencias = { nombre, slug };
        } else {
          errata.push({ fila: numeroFila, error: `No tiene DEPENDENCIA.` });
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
    });

    flujo.on('close', () => {
      // Aquí ya terminó de leer toda la tabla
      construirRelacionesColectivos();

      for (const lista in listas) {
        ordenarListaObjetos(listas[lista as keyof ListasColectivos], 'slug', true);
      }

      guardarJSON(listas, 'listasColectivos');
      resolver({ datos: colectivos, errata });
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
      campos.forEach((campoRelacion) => {
        const datosRelacion = colectivo[campoRelacion];

        if (datosRelacion) {
          const { id } = colectivo;

          campos.forEach((campo) => {
            // Agregar datos de cada campo en todos los otros, excepto en sí mismo.
            if (campoRelacion !== campo) {
              // Si no hay datos para llenar entonces podemos salir y continuar.
              if (!colectivo[campo]) return;

              // // Los indicadores los procesamos distinto para mantener el json final más ligero usando solo ids
              // if (typeof datosRelacion === 'number') {
              //   if (campoRelacion === 'indicadores') {
              //     const indicador = indicadores.find((obj) => obj.id === datosRelacion);

              //     if (indicador) {
              //       const indice = listas.indicadores.findIndex((obj) => obj.slug === indicador.slug);

              //       if (indice >= 0) {
              //         const elementosDondeConectar = aplanarDefinicionesASlugs(colectivo[campo]);
              //         llenarRelacion(elementosDondeConectar, listas[campo], indice, campo, id);
              //       } else {
              //         console.log('Esto no puede pasar');
              //       }
              //     } else {
              //       console.log('Paso algo raro, no se encontró un indicador que ya se había registrado antes.');
              //     }
              //   } else {
              //     console.log('Falta definir que hacer con este dato que es número pero no tiene condición definida.');
              //   }
              // } else {
              // Sacar los slugs del campo
              const slugsCampoProyecto = aplanarDefinicionesASlugs(datosRelacion);

              slugsCampoProyecto.forEach((slug) => {
                const indice = listas[campoRelacion].findIndex((obj) => obj.slug === slug);

                if (indice >= 0) {
                  if (!colectivo[campo]) return;

                  let datos = colectivo[campo];

                  // if (typeof colectivo[campo] === 'number') {
                  //   if (campo === 'indicadores') {
                  //     const indicador = indicadores.find((obj) => obj.id === colectivo[campo]);
                  //     if (indicador) {
                  //       datos = { nombre: indicador.nombre, slug: indicador.slug };
                  //     } else {
                  //       console.log('Paso algo raro, no se encontró un indicador que ya se había registrado antes.');
                  //     }
                  //   } else {
                  //     console.log(
                  //       'Falta definir que hacer con este dato que es número pero no tiene condición definida.'
                  //     );
                  //   }
                  // }

                  const elementosDondeConectar = aplanarDefinicionesASlugs(datos);
                  // if (campoRelacion === 'indicadores') {
                  //   console.log(elementosDondeConectar, listas[campoRelacion], indice, campoRelacion, id);
                  // }
                  llenarRelacion(elementosDondeConectar, listas[campo], indice, campoRelacion, id);
                } else {
                  console.log('Esto no puede pasar');
                }
              });
            }
            // }
          });
        }
      });

      colectivos.sort((a, b) => {
        if (a.titulo.slug < b.titulo.slug) return -1;
        else if (a.titulo.slug > b.titulo.slug) return 1;
        return 0;
      });
    });
  }

  function llenarRelacion(
    elementosDondeConectar: string[],
    elementoLista: ElementoLista[],
    indice: number,
    campoRelacion: LlavesColectivos,
    id: number
  ) {
    elementosDondeConectar.forEach((elementoConector) => {
      const elementoALlenar = elementoLista.find((obj) => obj.slug === elementoConector);

      if (elementoALlenar) {
        const existe = elementoALlenar.relaciones.find((obj) => obj.indice === indice);

        if (!existe) {
          elementoALlenar.relaciones.push({ conteo: 1, indice, tipo: campoRelacion });
        } else {
          existe.conteo++;
        }

        if (!elementoALlenar.colectivos?.includes(id)) {
          elementoALlenar.colectivos?.push(id);
        }
      }

      // console.log('poner', campoRelacion, 'como relacion en lista', elementoConector);
    });
  }
};
