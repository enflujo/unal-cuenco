import { guardarJSON } from './ayudas';
import slugificar from 'slug';
import { Indicador, Subindicador } from 'tipos.js';
import { getXlsxStream } from 'xlstream';

type FilaIdicador = [id: string, nombre: string, descripcion: string, subindicadores?: Subindicador[]];
type FilaSubindicador = [id: string, nombre: string, idIndicadorMadre: string];

let datosEmpiezanEnFila = 0;
let filasProcesadas = 0;
let conteoFilas = -datosEmpiezanEnFila;
let totalFilas = Infinity;
let filasPreprocesadas = false;

export async function procesarIndicadores(archivo: string, hoja: string, lista: Indicador[]): Promise<Indicador[]> {
  const flujo = await getXlsxStream({
    filePath: archivo,
    sheet: hoja,
    withHeader: true,
    ignoreEmpty: true,
  });

  return new Promise((resolver) => {
    let numeroFila = 1;

    flujo.on('data', async ({ raw }) => {
      const fila = raw.arr as FilaIdicador;
      const nombre = fila[1].trim();
      const slug = slugificar(nombre);

      const existe = lista.find((elemento) => elemento.slug === slug);

      if (!existe) {
        const respuesta: Indicador = {
          id: +fila[0], // revisar si es número
          nombre: nombre,
          slug: slug,
          descripcion: fila[2].trim(),
        };

        lista.push(respuesta);
      } else {
        console.log(`En fila ${numeroFila} hay indicador con nombre ${nombre} que ya existe con ID ${existe.id}`);
      }

      numeroFila++;
    });

    flujo.on('close', () => {
      // Aquí ya terminó de leer toda la tabla
      totalFilas = conteoFilas;

      if (!filasPreprocesadas && totalFilas === filasProcesadas) {
        filasPreprocesadas = true;
        // construirRelacionesDePublicaciones();
      }

      resolver(lista);
    });

    flujo.on('error', (error) => {
      throw new Error(JSON.stringify(error, null, 2));
    });
  });
}

export async function procesarSubindicadores(
  archivo: string,
  hoja: string,
  lista: Subindicador[],
  listaIndicadores: Indicador[]
): Promise<Subindicador[]> {
  const flujo = await getXlsxStream({
    filePath: archivo,
    sheet: hoja,
    withHeader: true,
    ignoreEmpty: true,
  });
  return new Promise((resolver) => {
    let numeroFila = 1;
    let contadorIds = 1;

    flujo.on('data', async ({ raw }) => {
      const fila = raw.arr as FilaSubindicador;

      if (fila[1]) {
        const nombre = fila[1].trim();
        const slug = slugificar(nombre);

        if (!fila[0] || !fila[0].length) {
          console.log(`En la fila ${numeroFila} no hay indicador`);
          return;
        }

        const indicadorMadre = slugificar(fila[0].trim());

        const existeIndicador = listaIndicadores.find((obj) => {
          return obj.slug === indicadorMadre;
        });

        if (existeIndicador) {
          const existeSubIndicador = lista.find((obj) => obj.slug === slug);

          if (!existeSubIndicador) {
            const respuesta: Subindicador = {
              id: contadorIds,
              nombre: nombre,
              slug: slug,
              indicadorMadre: existeIndicador.id,
            };
            contadorIds++;

            lista.push(respuesta);
          } else {
            console.log(
              `El subindicador ${nombre} con indicador ${existeIndicador.nombre} en fila ${numeroFila} ya existe con nombre ${existeSubIndicador.nombre} e indicador ${listaIndicadores.find((obj) => obj.id === existeSubIndicador.indicadorMadre)?.nombre}`
            );
          }
        } else {
          console.log(`No se puede encontrar el indicador ${indicadorMadre}`);
        }
      }

      numeroFila++;
    });

    flujo.on('close', () => {
      // Aquí ya terminó de leer toda la tabla
      totalFilas = conteoFilas;

      if (!filasPreprocesadas && totalFilas === filasProcesadas) {
        filasPreprocesadas = true;
        // construirRelacionesDePublicaciones();
      }

      resolver(lista);
    });

    flujo.on('error', (error) => {
      throw new Error(JSON.stringify(error, null, 2));
    });
  });
}
