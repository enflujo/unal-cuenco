import { getXlsxStream } from 'xlstream';
//import slugificar from 'slug';

//import { separarPartes } from './ayudas.ts';

//import { emojify } from 'node-emoji';

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
      const autores = fila[0] ? separarPartes(fila[0].trim(), ';') : [];
      const fecha = fila[2];
      const tipo = fila[3].trim();
      const titulo = fila[4];
      const dependencia = fila[7];

      console.log(
        numeroFila,
        'autor: ',
        autores,
        '| año: ',
        fecha,
        ' | ',
        titulo,
        '| tipo: ',
        tipo,
        '| dependencia: ',
        dependencia
      );
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

// Pasar a ayudas
function separarPartes(entrada: string, separador?: string) {
  const valores = entrada.trim();
  const partes = separador ? valores.trim().split(separador) : valores.trim().split(',');
  return partes.map((p) => p.trim());
}

async function inicio() {
  await procesarProduccion();
}

inicio().catch(console.error);
