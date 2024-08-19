import { getXlsxStream } from 'xlstream';
import slugificar from 'slug';
//import { emojify } from 'node-emoji';
import { separarPartes, ordenarListaObjetos, guardarJSON, logAviso, chulo } from './ayudas';
import {
  ElementoLista,
  ListasColectivos,
  Campos,
  DefinicionSimple,
  Colectivo,
  Indicador,
  Subindicador,
  ElementoListaIndicadores,
} from './tipos';
import { procesarIndicadores, procesarSubindicadores } from './indicadores';

const archivoColectivos = './datos/base_colectivos_y_ambitos_100724.xlsx';

// POR HACER: Cambiar
type FilaColectivos = [
  id: number,
  nombre: string,
  tipos: string,
  descripcion: string,
  estado: string,
  años: string,
  fuente: string,
  responsables: string,
  contacto: string,
  sedes: string,
  dependencia: string,
  modalidades: string,
  indicador: string,
  subindicador: string,
];

const listas: ListasColectivos = {
  años: [],
  tipos: [],
  responsables: [],
  sedes: [],
  dependencias: [],
  modalidades: [],
  indicadores: [],
  subindicadores: [],
};

export default async () => {};

async function procesarColectivo(): Promise<void> {
  const archivo = archivoColectivos;
  const flujo = await getXlsxStream({
    filePath: archivo,
    sheet: 'Colectivos y ámbitos (C.A)',
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
      conteoFilas++;

      if (numeroFila > datosEmpiezanEnFila) {
        /*  procesarFila(raw.arr, numeroFila);
        filasProcesadas++; */
      }
      // Llenar listas
      /* procesarLista(tipos, listas.tipos);
      procesarLista(años, listas.años);
      procesarLista(sedes, listas.sedes);
      procesarLista(subindicador, listas.subindicadores);
      procesarListaIndicadores(indicador); */

      /*   for (let fila in autores) {
        procesarLista(autores[fila]!, listas.autores); //¿Qué forma mejor hay de hacer esto sin forzar con '!'?
      } */

      for (const lista in listas) {
        ordenarListaObjetos(listas[lista as keyof ListasColectivos], 'slug', true);
      }

      //imprimirErratas(autores, años, tipos, titulo, dependencia, numeroFila);
      numeroFila++;
    });

    flujo.on('close', () => {
      // Aquí ya terminó de leer toda la tabla
      totalFilas = conteoFilas;

      if (!filasPreprocesadas && totalFilas === filasProcesadas) {
        filasPreprocesadas = true;
        //  construirRelacionesDeColectivos();
      }

      //  guardarJSON(colectivos, 'colectivos');
      // guardarJSON(listas, 'listasColectivos');
      resolver();
    });

    flujo.on('error', (error) => {
      throw new Error(JSON.stringify(error, null, 2));
    });
  });
}
