import { getXlsxStream } from 'xlstream';
import slugificar from 'slug';
//import { emojify } from 'node-emoji';
import { ordenarListaObjetos, guardarJSON, logAviso, chulo, procesarLista } from './ayudas';
import type {
  CamposColectivos,
  Colectivo,
  DefinicionSimple,
  ElementoListaIndicadores,
  Indicador,
  ListasColectivos,
  Subindicador,
} from '@/tipos/compartidos';

const archivoColectivos = './datos/base_colectivos_y_ambitos_anonimizado20240902.xlsx';
const hojaCol = 'Diccionario Indicadores';
const hojaSubindicadoresCol = 'Contenidos P.A';

type FilaColectivos = [
  id: number,
  nombre: string,
  tipos: string,
  descripcion: string,
  estado: string,
  años: string,
  fuente: string,
  enlaceFuente: string,
  responsables: string,
  contacto: string,
  sedes: string,
  dependencias: string,
  modalidades: string,
  indicador: string,
  subindicador: string,
];

const campos: CamposColectivos = [
  { llave: 'tipos', indice: 1 },
  { llave: 'años', indice: 3 ? 3 : 4 },
  { llave: 'responsables', indice: 7 },
  { llave: 'sedes', indice: 9 },
  { llave: 'dependencias', indice: 10 },
  { llave: 'modalidades', indice: 11 },
  { llave: 'indicadores', indice: 12 },
  { llave: 'subindicadores', indice: 13 },
];

const colectivos: Colectivo[] = [];
const indicadoresCol: Indicador[] = [];
const subindicadoresCol: Subindicador[] = [];
let indicadoresProcesados: Indicador[] = [];
let subindicadoresProcesados: Subindicador[] = [];

const listas: ListasColectivos = {
  tipos: [],
  años: [],
  estados: [],
  responsables: [],
  sedes: [],
  dependencias: [],
  modalidades: [],
  indicadores: [],
  subindicadores: [],
};

export default async () => {
  /*   subindicadoresProcesados = await procesarSubindicadores(
    archivoColectivos,
    hojaSubindicadoresCol,
    subindicadoresCol,
    indicadoresProcesados
  ); */

  await procesarColectivo();

  /*   subindicadoresProcesados.forEach((subI) => {
    const indicadorId = subI.indicadorMadre;
    const indicadorI = indicadoresProcesados.findIndex((obj) => obj.id === indicadorId);

    if (indicadorI >= 0) {
      if (!indicadoresProcesados[indicadorI].subindicadores) {
        indicadoresProcesados[indicadorI].subindicadores = [];
      }

      indicadoresProcesados[indicadorI].subindicadores?.push(subI.id);
    } else {
      console.log(`No existe el indicador con ID ${subI.indicadorMadre}!`);
    }
  }); */

  guardarJSON(indicadoresProcesados, `indicadores-colectivos`);

  console.log(chulo, logAviso('Procesados indicadores'));
  // guardarJSON(subindicadoresProcesados, `subIndicadores-colectivos`);
  console.log(chulo, logAviso('Procesados subindicadores'));
};

async function procesarColectivo(): Promise<void> {
  const archivo = archivoColectivos;
  const flujo = await getXlsxStream({
    filePath: archivo,
    sheet: 'Colectivos y ámbitos CUANTIFICA',
    withHeader: true,
    ignoreEmpty: true,
  });

  let numeroFila = 2;
  let datosEmpiezanEnFila = 0;
  let filasProcesadas = 0;
  let conteoFilas = -datosEmpiezanEnFila;
  let totalFilas = Infinity;
  let filasPreprocesadas = false;

  return new Promise((resolver) => {
    flujo.on('data', async ({ raw }) => {
      try {
        const fila = raw.arr as FilaColectivos;

        const tipos = fila[1] ? fila[1].trim() : 'no hay tipo';
        const años = fila[3] ? fila[3] : fila[4];
        const estados = fila[3] ? 'activo' : 'inactivo';
        const responsables = fila[7] ? fila[7].trim() : 'no hay responsables';
        const sedes = fila[9] ? fila[9].trim() : 'no hay sede';
        const dependencias = fila[10] ? fila[10].trim() : 'no hay dependencia';
        const modalidades = fila[11] ? fila[11].trim() : 'no hay modalidades';

        const indicador = fila[12] ? fila[12].trim() : 'no hay indicador asociado';
        const subindicador = fila[13] ? fila[13].trim() : 'no hay subindicador asociado';

        conteoFilas++;

        if (numeroFila > datosEmpiezanEnFila) {
          procesarFila(raw.arr, numeroFila);
          filasProcesadas++;
        }
        // Llenar listas
        procesarLista(tipos, listas.tipos);
        procesarLista(años, listas.años);
        procesarLista(estados, listas.estados);
        procesarLista(responsables, listas.responsables);
        procesarLista(sedes, listas.sedes);
        procesarLista(dependencias, listas.dependencias);
        procesarLista(modalidades, listas.modalidades);
        procesarLista(subindicador, listas.subindicadores);
        procesarListaIndicadores(indicador);

        /*   for (let fila in autores) {
        procesarLista(autores[fila]!, listas.autores); //¿Qué forma mejor hay de hacer esto sin forzar con '!'?
      } */

        for (const lista in listas) {
          ordenarListaObjetos(listas[lista as keyof ListasColectivos], 'slug', true);
        }

        //imprimirErratas(autores, años, tipos, titulo, dependencia, numeroFila);
        numeroFila++;
      } catch (error) {
        console.error(error);
      }
    });

    flujo.on('close', () => {
      // Aquí ya terminó de leer toda la tabla
      totalFilas = conteoFilas;

      if (!filasPreprocesadas && totalFilas === filasProcesadas) {
        filasPreprocesadas = true;
        construirRelacionesColectivos();
      }

      guardarJSON(colectivos, 'colectivos');
      guardarJSON(listas, 'listasColectivos');
      resolver();
    });

    flujo.on('error', (error) => {
      throw new Error(JSON.stringify(error, null, 2));
    });
  });
}

function procesarFila(fila: string[], numeroFila: number) {
  const nombreColectivo = fila[0].trim();
  const subindicador = fila[13]?.trim();

  if (!subindicador) {
    console.log(`En Colectivos y Ámbitos no hay subindicador en ${numeroFila}`);
    return;
  }

  /*   const subindicadorProcesado = subindicadoresProcesados.find((obj) => {
    return obj.slug === slugificar(subindicador);
  });

  if (!subindicadorProcesado) {
    console.log(
      `En Colectivos y Ámbitos no existe el subindicador ${subindicador} en la lista de subindicadores procesados`
    );
  } */

  const indicador = indicadoresProcesados.find((obj) => {
    return slugificar(fila[12].trim()) === obj.slug;
  });

  // En la tabla todas las publicaciones parecen tener subindicador pero muchos son el mismo indicador repetido.
  // Aquí estoy borrando el campo subindicador si es el mismo indicador y no un subindicador
  const respuesta: Colectivo = {
    id: numeroFila,
    nombre: { nombre: nombreColectivo, slug: slugificar(nombreColectivo) },
    tipos: { nombre: fila[1].trim(), slug: slugificar(fila[1].trim()) },
    descripcion: fila[2] ? fila[2].trim() : 'No hay descripción',
    años: fila[3] ? { año: +fila[3], valor: fila[3] } : { año: +fila[4], valor: fila[4] },
    estados: fila[3] ? 'activo' : 'inactivo',
    fuente: fila[5],
    enlaceFuente: fila[6],
    responsables: fila[7]
      ? { nombre: fila[7].trim(), slug: slugificar(fila[7].trim()) }
      : { nombre: 'sin información', slug: '' },
    contacto: fila[8],
    sedes: { nombre: fila[9].trim(), slug: slugificar(fila[9].trim()) },
    dependencias: fila[10]
      ? { nombre: fila[10].trim(), slug: slugificar(fila[10].trim()) }
      : { nombre: 'sin información', slug: '' },
    indicadores: indicador,
    /* subindicadores: subindicadorProcesado
      ? {
          id: subindicadorProcesado.id,
          nombre: subindicadorProcesado.nombre,
          slug: subindicadorProcesado.slug,
          indicadorMadre: subindicadorProcesado.indicadorMadre,
        }
      : undefined, */
  };

  // ¿Esto qué hace?
  /*  campos.forEach((campo) => {
      const validacion = validarValorMultiple(fila[campo.indice], listas[campo.llave], campo.llave);
      if (validacion) respuesta[campo.llave] = validacion;
  }); */

  colectivos.push(respuesta);
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

function construirRelacionesColectivos() {
  for (const lista in listas) {
    ordenarListaObjetos(listas[lista as keyof ListasColectivos], 'slug', true);
  }
  colectivos.forEach((colectivo, i) => {
    const id = i;

    campos.forEach((campoRelacion) => {
      const datosRelacion = colectivo[campoRelacion.llave];
      campos.forEach((campo) => {
        // Agregar datos de cada campo en todos los otros, excepto en sí mismo.
        if (campoRelacion.llave !== campo.llave && datosRelacion) {
          const llaveALlenar = campo.llave;
          const llaveDondeLlenar = campoRelacion.llave;
          const datosPublicacion = colectivo[llaveALlenar];

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

    colectivos.sort((a, b) => {
      if (a.nombre.slug < b.nombre.slug) return -1;
      else if (a.nombre.slug > b.nombre.slug) return 1;
      return 0;
    });
  });
}
