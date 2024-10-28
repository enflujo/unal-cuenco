import slugificar from 'slug';
import { getXlsxStream } from 'xlstream';
import type { Indicador, Subindicador } from '@/tipos/compartidos';
import type { Errata } from './tipos';
import { limpiarTextoSimple } from './ayudas';

type FilaIdicador = [id: string, nombre: string, descripcion: string, subindicadores?: Subindicador[]];
type FilaSubindicador = [id: string, nombre: string, idIndicadorMadre: string];

const archivo = './datos/Base_Producción_ academica_contactos_V25.xlsx';

export async function procesarIndicadores(): Promise<{ datos: Indicador[]; errata: Errata[] }> {
  const flujo = await getXlsxStream({
    filePath: archivo,
    sheet: 'Diccionario de Indicadores',
    withHeader: true,
    ignoreEmpty: true,
  });

  return new Promise((resolver) => {
    let numeroFila = 1;
    let contadorIds = 1;
    const lista: Indicador[] = [];
    const errata: Errata[] = [];

    flujo.on('data', async ({ raw }) => {
      const [nombre, definicion] = raw.arr as FilaIdicador;

      if (nombre) {
        const nombreProcesado = limpiarTextoSimple(nombre);
        const slug = slugificar(nombreProcesado);
        const existe = lista.find((elemento) => elemento.slug === slug);

        if (!existe) {
          lista.push({
            id: contadorIds,
            nombre: nombreProcesado,
            slug,
            definicion: definicion ? definicion.trim() : '',
          });

          contadorIds++;
        } else {
          errata.push({
            fila: numeroFila,
            error: `Hay indicador con nombre ${nombre} que ya existe con ID ${existe.id}`,
          });
        }
      }

      numeroFila++;
    });

    flujo.on('close', () => {
      resolver({ datos: lista, errata });
    });

    flujo.on('error', (error) => {
      throw new Error(JSON.stringify(error, null, 2));
    });
  });
}

export async function procesarSubindicadores(
  indicadores: Indicador[]
): Promise<{ datos: Subindicador[]; errata: Errata[] }> {
  const flujo = await getXlsxStream({
    filePath: archivo,
    sheet: 'Contenidos P.A',
    withHeader: true,
    ignoreEmpty: true,
  });

  return new Promise((resolver) => {
    let numeroFila = 1;
    let contadorIds = 1;
    const lista: Subindicador[] = [];
    const errata: Errata[] = [];

    flujo.on('data', async ({ raw }) => {
      const fila = raw.arr as FilaSubindicador;

      if (fila[1]) {
        const nombre = fila[1].trim();
        const slug = slugificar(nombre);

        if (!fila[0] || !fila[0].length) {
          errata.push({ fila: numeroFila, error: 'No hay indicador' });
          return;
        }

        const indicadorMadre = slugificar(fila[0].trim());

        const existeIndicador = indicadores.find((obj) => {
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
            errata.push({
              fila: numeroFila,
              error: `El subindicador ${nombre} con indicador ${existeIndicador.nombre} en fila ${numeroFila} ya existe con nombre ${existeSubIndicador.nombre} e indicador ${indicadores.find((obj) => obj.id === existeSubIndicador.indicadorMadre)?.nombre}`,
            });
          }
        } else {
          errata.push({ fila: numeroFila, error: `No se puede encontrar el indicador ${indicadorMadre}` });
        }
      }

      numeroFila++;
    });

    flujo.on('close', () => {
      lista.forEach((subI) => {
        const indicadorId = subI.indicadorMadre;
        const indicadorI = indicadores.findIndex((obj) => obj.id === indicadorId);

        if (indicadorI >= 0) {
          if (!indicadores[indicadorI].subindicadores) {
            indicadores[indicadorI].subindicadores = [];
          }

          indicadores[indicadorI].subindicadores?.push(subI.id);
        } else {
          errata.push({ fila: 0, error: `No existe el indicador con ID ${subI.indicadorMadre}!` });
        }
      });

      resolver({ datos: lista, errata });
    });

    flujo.on('error', (error) => {
      throw new Error(JSON.stringify(error, null, 2));
    });
  });
}
