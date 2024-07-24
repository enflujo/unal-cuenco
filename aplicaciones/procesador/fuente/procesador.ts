import { getXlsxStream } from 'xlstream';
import slugificar from 'slug';

import { enMinusculas, guardarJSON, logBloque, mensajeExito, ordenarListaObjetos, separarPartes } from './ayudas.js';

import { emojify } from 'node-emoji';
import { procesarNombresAutores } from 'autores.js';

type FilaProduccionAcademica = [
  /** Nombre de los autores separados por ; y apellido nombre separado por , */
  autores: string | undefined,
  resumen: string,
  fecha: string | number | undefined,
  tipo: string,
  titulo: string,
  referencia: string,
  fuente: string,
  dependencia: string,
  indicador: string,
  subindicador: string,
];

async function procesarProduccion(): Promise<void> {
  const archivo = './datos/base_produccion_ academica_100724.xlsx';
  const flujo = await getXlsxStream({
    filePath: archivo,
    sheet: 'Producción académica (P.A.)',
    withHeader: true,
    ignoreEmpty: true,
  });

  let numeroFila = 2;

  return new Promise((resolver) => {
    flujo.on('data', async ({ raw }) => {
      const fila = raw.arr as FilaProduccionAcademica;
      const nombre = fila[0];
      const titulo = fila[4];
      console.log(numeroFila, nombre?.trim(), titulo);
      // const nombreProcesado = procesarNombresAutores(nombre, numeroFila);

      numeroFila++;
    });

    flujo.on('close', () => {
      // Aquí ya terminó de leer toda la tabla
      resolver();
    });

    flujo.on('error', (error) => {
      throw new Error(JSON.stringify(error, null, 2));
    });
  });
}

async function inicio() {
  await procesarProduccion();
}

inicio().catch(console.error);
