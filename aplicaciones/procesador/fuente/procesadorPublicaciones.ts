import { getXlsxStream } from 'xlstream';
import slugificar from 'slug';
import { separarPartes, ordenarListaObjetos, guardarJSON, limpiarTextoSimple, esNumero } from './ayudas';
import type {
  CamposPA,
  DefinicionSimple,
  ElementoLista,
  Indicador,
  ListasPublicaciones,
  Publicacion,
} from '@/tipos/compartidos';
import type { Errata, FilaProduccionAcademica } from './tipos';

const campos: CamposPA = [
  { llave: 'autores', indice: 0 },
  { llave: 'años', indice: 2 },
  { llave: 'tipos', indice: 3 },
  { llave: 'dependencias', indice: 7 },
  { llave: 'indicadores', indice: 8 },
];

const listas: ListasPublicaciones = {
  autores: [],
  años: [],
  tipos: [],
  dependencias: [],
  indicadores: [],
};

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
    const publicaciones: Publicacion[] = [];

    flujo.on('data', async ({ raw }) => {
      const fila = raw.arr as FilaProduccionAcademica;
      const publicacion = procesarFila(raw.arr, numeroFila);

      if (publicacion) {
        publicaciones.push(publicacion);
        // Llenar listas
        procesarLista(fila[7], listas.dependencias);
        procesarLista(fila[3], listas.tipos);
        procesarLista(fila[2], listas.años);

        if (fila[0]) {
          const autores = fila[0].includes(';') ? separarPartes(fila[0], ';') : [fila[0].trim()];

          autores.forEach((autor) => {
            if (autor) {
              procesarLista(autor, listas.autores);
            } else {
              errata.push({
                fila: numeroFila,
                error: `No hay autor en la parte: ${autor} dentro del campo autores ${fila[0]}`,
              });
            }
          });
        }

        for (const lista in listas) {
          ordenarListaObjetos(listas[lista as keyof ListasPublicaciones], 'slug', true);
        }
      }

      numeroFila++;
    });

    flujo.on('close', () => {
      // Aquí ya terminó de leer toda la tabla
      construirRelacionesDePublicaciones(publicaciones);

      guardarJSON(listas, 'listasPublicaciones');
      resolver({ datos: publicaciones, errata });
    });

    flujo.on('error', (error) => {
      throw new Error(JSON.stringify(error, null, 2));
    });
  });

  function procesarFila(fila: FilaProduccionAcademica, numeroFila: number): Publicacion | undefined {
    if (!fila[4]) {
      errata.push({
        fila: numeroFila,
        error: `La fila no tiene titulo de publicación, el valor de la celda es ${fila[5]}`,
      });

      return;
    }

    const tituloPublicacion = limpiarTextoSimple(fila[4]);

    // const subindicador = fila[10] ? fila[10].trim() : '';

    // if (!subindicador) {
    //   console.log(`No hay subindicador en ${numeroFila}`);
    // }

    // const subindicadorProcesado = subindicadores.find((obj) => {
    //   return obj.slug === slugificar(subindicador);
    // });

    // if (!subindicadorProcesado) {
    //   console.log(`No existe el subindicador ${subindicador} en la lista de subindicadores procesados`);
    // }

    const autores: DefinicionSimple[] = [];

    if (fila[0]) {
      const partes = fila[0].includes(';') ? separarPartes(fila[0], ';') : [fila[0].trim()];
      // Convertir autores en tipo DefinicionSimple
      partes.forEach((nombreAutor) => {
        autores.push({ nombre: nombreAutor, slug: slugificar(nombreAutor) });
      });
    }

    const indicador = indicadores.find((obj) => slugificar(fila[8].trim()) === obj.slug);

    let años: number | undefined;

    if (fila[2] && esNumero(fila[2])) {
      años = +fila[2];
    } else {
      // Sólo registrar errata si la celda de fecha no tiene nada o es distinto a las convenciones que se usan para indicar que no hay fecha.
      if (fila[2] !== '(s.f)') {
        errata.push({
          fila: numeroFila,
          error: `No hay fecha para la publicación, el valor en la celda es: ${fila[2]}`,
        });
      }
    }

    // En la tabla todas las publicaciones parecen tener subindicador pero muchos son el mismo indicador repetido.
    // Aquí estoy borrando el campo subindicador si es el mismo indicador y no un subindicador
    const respuesta: Publicacion = {
      id: numeroFila - 2,
      titulo: { nombre: tituloPublicacion, slug: slugificar(tituloPublicacion) },
      resumen: fila[1] ? fila[1].trim() : '',
      autores,
      años,
      tipos: { nombre: fila[3].trim(), slug: slugificar(fila[3].trim()) },
      referencia: fila[5] ? fila[5].trim() : '',
      fuente: fila[6] ? fila[6] : '',
      dependencias: { nombre: fila[7] ? fila[7].trim() : '', slug: fila[7] ? slugificar(fila[7].trim()) : '' },
      indicadores: indicador,
      // subindicadores: subindicadorProcesado
      //   ? {
      //       id: subindicadorProcesado.id,
      //       nombre: subindicadorProcesado.nombre,
      //       slug: subindicadorProcesado.slug,
      //       indicadorMadre: subindicadorProcesado.indicadorMadre,
      //     }
      //   : undefined,
    };

    // ¿Esto qué hace?
    /*  campos.forEach((campo) => {
        const validacion = validarValorMultiple(fila[campo.indice], listas[campo.llave], campo.llave);
        if (validacion) respuesta[campo.llave] = validacion;
    }); */
    return respuesta;
  }
};

// Ver haciendocaminos procesador.ts 240
function construirRelacionesDePublicaciones(publicaciones: Publicacion[]) {
  for (const lista in listas) {
    ordenarListaObjetos(listas[lista as keyof ListasPublicaciones], 'slug', true);
  }
  publicaciones.forEach((publicacion) => {
    const id = publicacion.id;

    campos.forEach((campoRelacion) => {
      const datosRelacion = publicacion[campoRelacion.llave];
      campos.forEach((campo) => {
        // Agregar datos de cada campo en todos los otros, excepto en sí mismo.
        if (campoRelacion.llave !== campo.llave && datosRelacion) {
          const llaveALlenar = campo.llave;
          const llaveDondeLlenar = campoRelacion.llave;
          const datosPublicacion = publicacion[llaveALlenar];

          // Si la publicación tiene datos en este campo
          if (datosPublicacion) {
            // Sacar los slugs del campo
            const slugsCampoProyecto = Array.isArray(datosPublicacion)
              ? (datosPublicacion as DefinicionSimple[]).map(({ slug }) => slug)
              : [(datosPublicacion as DefinicionSimple).slug];

            slugsCampoProyecto.forEach((slug) => {
              const i = listas[llaveALlenar].findIndex((obj) => obj.slug === slug);
              const elementosDondeConectar = Array.isArray(datosRelacion)
                ? (datosRelacion as DefinicionSimple[]).map(({ slug }) => slug)
                : [(datosRelacion as DefinicionSimple).slug];
              elementosDondeConectar.forEach((elementoConector) => {
                const elementoALlenar = listas[llaveDondeLlenar].find((obj) => obj.slug === elementoConector);

                if (elementoALlenar) {
                  if (elementoALlenar.relaciones) {
                    const existe = elementoALlenar.relaciones.find((obj) => obj.slug === slug);

                    if (!elementoALlenar.publicaciones?.includes(id)) {
                      elementoALlenar.publicaciones?.push(id);
                    }

                    if (!existe) {
                      elementoALlenar.relaciones.push({
                        conteo: 1,
                        indice: i,
                        tipo: llaveALlenar,
                        slug,
                      });
                    } else {
                      existe.conteo++;
                    }
                  }
                }
              });
            });
          }
        }
      });
    });

    publicaciones.sort((a, b) => {
      if (a.titulo.slug < b.titulo.slug) return -1;
      else if (a.titulo.slug > b.titulo.slug) return 1;
      return 0;
    });
  });
}

export function procesarLista(valor: string, lista: ElementoLista[]) {
  if (!valor) return;
  const slug = valor ? slugificar(`${valor}`) : '';
  const existe = lista.find((obj) => obj.slug === slug);
  if (!valor || valor === 'No aplica' || valor === 'undefined' || valor === 'Sin Información' || valor === '(s.f)')
    return;
  const nombre = `${valor}`.trim();

  if (!existe) {
    const objeto: ElementoLista = {
      nombre: nombre,
      conteo: 1,
      slug: slug,
      relaciones: [],
      publicaciones: [],
    };
    lista.push(objeto);
  } else {
    existe.conteo++;
  }
}
