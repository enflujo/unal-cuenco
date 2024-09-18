import { getXlsxStream } from 'xlstream';
import slugificar from 'slug';
import { separarPartes, ordenarListaObjetos, guardarJSON, procesarLista } from './ayudas';
import type {
  CamposPA,
  DefinicionSimple,
  ElementoListaIndicadores,
  Indicador,
  ListasPublicaciones,
  Publicacion,
  Subindicador,
} from '@/tipos/compartidos';

type FilaProduccionAcademica = [
  id: number,
  /** Nombre de los autores separados por ; y apellido nombre separado por , */
  autores: string | undefined,
  resumen: string,
  años: string,
  tipos: string,
  titulo: string,
  referencia: string,
  fuente: string,
  dependencia: string,
  indicador: string,
  subindicador: string,
];

const campos: CamposPA = [
  { llave: 'autores', indice: 1 },
  { llave: 'años', indice: 3 },
  { llave: 'tipos', indice: 4 },
  { llave: 'dependencias', indice: 8 },
  { llave: 'indicadores', indice: 9 },
  { llave: 'subindicadores', indice: 10 },
];

let indicadoresProcesados: Indicador[] = [];
let subindicadoresProcesados: Subindicador[] = [];

const listas: ListasPublicaciones = {
  autores: [],
  años: [],
  tipos: [],
  dependencias: [],
  indicadores: [],
  subindicadores: [],
};

export default async (): Promise<void> => {
  const archivo = './datos/base_produccion_ academica_anonimizado_V25_090924.xlsx';
  const flujo = await getXlsxStream({
    filePath: archivo,
    sheet: 'Producción académica (P.A.)',
    withHeader: true,
    ignoreEmpty: true,
  });

  let numeroFila = 2;
  let datosEmpiezanEnFila = 0;

  return new Promise((resolver) => {
    const publicaciones: Publicacion[] = [];

    flujo.on('data', async ({ raw }) => {
      const fila = raw.arr as FilaProduccionAcademica;
      const id = fila[0];
      const autores = fila[1]?.includes(';') ? separarPartes(fila[1], ';') : [fila[1]?.trim()];
      const resumen = fila[2] ? fila[2].trim() : '';
      const años = fila[3] ? fila[3] : '';
      const tipos = fila[4] ? fila[4].trim() : '';
      const titulo = fila[5] ? fila[5].trim() : '';
      const referencia = fila[6] ? fila[6].trim() : '';
      const fuente = fila[7] ? fila[7] : '';
      const dependencia = fila[8] ? fila[8].trim() : '';
      // POR HACER: Procesar indicadores y subindicadores
      const indicador = fila[9] ? fila[9].trim() : '';
      const subindicador = fila[10] ? fila[10].trim() : '';

      const publicacion = procesarFila(raw.arr, numeroFila);
      publicaciones.push(publicacion);

      // Llenar listas
      procesarLista(dependencia, listas.dependencias);
      procesarLista(tipos, listas.tipos);
      procesarLista(años, listas.años);
      procesarLista(subindicador, listas.subindicadores);
      procesarListaIndicadores(indicador);

      for (let fila in autores) {
        procesarLista(autores[fila]!, listas.autores); //¿Qué forma mejor hay de hacer esto sin forzar con '!'?
      }

      for (const lista in listas) {
        ordenarListaObjetos(listas[lista as keyof ListasPublicaciones], 'slug', true);
      }

      imprimirErratas(autores, años, tipos, titulo, dependencia, numeroFila);
      numeroFila++;
    });

    flujo.on('close', () => {
      // Aquí ya terminó de leer toda la tabla
      construirRelacionesDePublicaciones(publicaciones);

      guardarJSON(publicaciones, 'publicaciones');
      guardarJSON(listas, 'listas');
      resolver();
    });

    flujo.on('error', (error) => {
      throw new Error(JSON.stringify(error, null, 2));
    });
  });
};

function procesarFila(fila: FilaProduccionAcademica, numeroFila: number): Publicacion {
  const tituloPublicacion = fila[5] ? fila[5].trim() : '';
  const autores = fila[1]?.includes(';') ? separarPartes(fila[1], ';') : [fila[1]?.trim()];
  const subindicador = fila[10] ? fila[10].trim() : '';

  if (!subindicador) {
    console.log(`No hay subindicador en ${numeroFila}`);
  }

  const subindicadorProcesado = subindicadoresProcesados.find((obj) => {
    return obj.slug === slugificar(subindicador);
  });

  if (!subindicadorProcesado) {
    console.log(`No existe el subindicador ${subindicador} en la lista de subindicadores procesados`);
  }

  // Convertir autores en tipo DefinicionSimple
  const autoresProcesados = autores.map((autor) => {
    return { nombre: autor, slug: autor ? slugificar(autor) : '' };
  });

  const indicador = indicadoresProcesados.find((obj) => {
    return slugificar(fila[9].trim()) === obj.slug;
  });

  // En la tabla todas las publicaciones parecen tener subindicador pero muchos son el mismo indicador repetido.
  // Aquí estoy borrando el campo subindicador si es el mismo indicador y no un subindicador
  const respuesta: Publicacion = {
    id: +fila[0],
    titulo: { nombre: tituloPublicacion, slug: slugificar(tituloPublicacion) },
    resumen: fila[2] ? fila[2].trim() : '',
    autores: autoresProcesados,
    años: { año: +fila[3], valor: fila[3] },
    tipos: { nombre: fila[4].trim(), slug: slugificar(fila[4].trim()) },
    referencia: fila[6] ? fila[6].trim() : '',
    fuente: fila[7] ? fila[7] : '',
    dependencias: { nombre: fila[8] ? fila[8].trim() : '', slug: fila[8] ? slugificar(fila[8].trim()) : '' },
    indicadores: indicador,
    subindicadores: subindicadorProcesado
      ? {
          id: subindicadorProcesado.id,
          nombre: subindicadorProcesado.nombre,
          slug: subindicadorProcesado.slug,
          indicadorMadre: subindicadorProcesado.indicadorMadre,
        }
      : undefined,
  };

  // ¿Esto qué hace?
  /*  campos.forEach((campo) => {
      const validacion = validarValorMultiple(fila[campo.indice], listas[campo.llave], campo.llave);
      if (validacion) respuesta[campo.llave] = validacion;
  }); */
  return respuesta;
}

function procesarListaIndicadores(indicador: string) {
  const slug = indicador ? slugificar(indicador) : '';
  const existe = listas.indicadores.find((obj) => obj.slug === slug);

  if (!indicadoresProcesados.length) {
    console.log('No hay indicadores procesados');
  }
  const existeEnIndicadoresProcesados = indicadoresProcesados.find((obj) => obj.slug === slug);

  if (existeEnIndicadoresProcesados) {
    const nombre = existeEnIndicadoresProcesados.nombre;
    if (!existe) {
      const objeto: ElementoListaIndicadores = {
        nombre: nombre,
        conteo: 1,
        slug: slug,
        relaciones: [],
        publicaciones: [],
      };
      listas.indicadores.push(objeto);
    } else {
      existe.conteo++;
    }
  }
}

function imprimirErratas(
  autores: (string | undefined)[],
  años: string | number | undefined,
  tipos: string,
  titulo: string,
  dependencia: string,
  numeroFila: number
) {
  // Imprimir datos que faltan
  for (const fila in autores) {
    if (!autores[fila]) {
      console.log('sin autor: ', numeroFila);
    }
  }

  if (!años) {
    console.log('sin fecha: ', numeroFila);
  }
  if (!tipos) {
    console.log('sin tipo: ', numeroFila);
  }
  if (!titulo) {
    console.log('sin titulo: ', numeroFila);
  }
  if (!dependencia) {
    console.log('sin dependencia: ', numeroFila);
  }
}

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
