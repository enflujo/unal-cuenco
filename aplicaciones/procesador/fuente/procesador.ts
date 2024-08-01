import { getXlsxStream } from 'xlstream';
import slugificar from 'slug';
//import { emojify } from 'node-emoji';
import { separarPartes, ordenarListaObjetos } from './ayudas';
import { ElementoLista, Listas } from './tipos';

type FilaProduccionAcademica = [
  id: number,
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

const listas: Listas = {
  autores: [],
  años: [],
  tipos: [],
  dependencias: [],
  indicadores: [],
  subdindicadores: [],
};

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
      const id = fila[0];
      const autores = fila[1] ? separarPartes(fila[1].trim(), ';') : null;
      const resumen = fila[2].trim();
      const fecha = fila[3];
      const tipo = fila[4].trim();
      const titulo = fila[5].trim();
      const referencia = fila[6].trim();
      const fuente = fila[7];
      const dependencia = fila[8].trim();
      // POR HACER: Procesar indicadores y subindicadores
      const indicador = fila[9].trim();
      const subindicador = fila[10];
      /* 
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
      ); */

      // Llenar listas
      procesar(dependencia, listas.dependencias);
      procesar(tipo, listas.tipos);
      procesar(`${fecha}`, listas.años);
      procesar(indicador, listas.indicadores);

      imprimirErratas(autores, fecha, tipo, titulo, dependencia, numeroFila);
      numeroFila++;
    });

    ordenarListaObjetos(listas.dependencias, 'slug', true);
    ordenarListaObjetos(listas.tipos, 'slug', true);
    ordenarListaObjetos(listas.años, 'slug', true);
    ordenarListaObjetos(listas.indicadores, 'slug', true);

    flujo.on('close', () => {
      // Aquí ya terminó de leer toda la tabla
      resolver();

      //console.log(listas);
    });

    flujo.on('error', (error) => {
      throw new Error(JSON.stringify(error, null, 2));
    });
  });
}

// Pasar a ayudas?
function procesar(elemento: string, lista: ElementoLista[]) {
  const slug = slugificar(elemento);
  const existe = lista.find((obj) => obj.slug === slug);
  if (!existe) {
    const objeto: ElementoLista = {
      nombre: elemento,
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

function imprimirErratas(
  autores: string[] | null,
  fecha: string | number | undefined,
  tipo: string,
  titulo: string,
  dependencia: string,
  numeroFila: number
) {
  // Imprimir datos que faltan
  if (!autores) {
    console.log('sin autor: ', numeroFila);
  }
  if (!fecha) {
    console.log('sin fecha: ', numeroFila);
  }
  if (!tipo) {
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
function construirRelacionesDePublicaciones() {}

async function inicio() {
  await procesarProduccion();
}

inicio().catch(console.error);
