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
  EncuentroCaracterizacion,
  EncuentroCaracterizacionConteo,
  Indicador,
  ListasCaracterizacion,
  ListasColectivos,
  LlavesCaracterizacion,
  LlavesColectivos,
} from '@/tipos/compartidos';
import type { Errata, FilaCaracterizacion, FilaCaracterizacionConteo, FilaColectivos } from './tipos';
import { conector } from './ayudas';

const encuentrosCaracterizacion: EncuentroCaracterizacionConteo[] = [];
const listas: ListasCaracterizacion = {
  sedes: [],
  tiposSede: [],
  roles: [],
  cargos: [],
};

function procesarLista(llaveLista: LlavesCaracterizacion, valor: string) {
  const nombre = limpiarTextoSimple(valor);
  const slug = slugificar(nombre);
  const existe = listas[llaveLista].find((obj) => obj.slug === slug);
  if (!existe) {
    listas[llaveLista].push({
      id: `${listas[llaveLista].length + 1}`,
      nombre,
      slug,
      conteo: 1,
      relaciones: [],
      encuentrosCaracterizacion: [],
    });
  } else {
    existe.conteo++;
  }

  return { nombre, slug };
}

function procesarEncuentro(id: number) {
  const idEncuentro = id;
}

export default async (
  ruta: string,
  tabla: string
): Promise<{ datos: EncuentroCaracterizacionConteo[]; errata: Errata[] }> => {
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
      const fila = raw.arr as FilaCaracterizacion;
      const id = fila[0];
      const numero = limpiarTextoSimple(fila[1]);
      let encuentro: EncuentroCaracterizacionConteo;

      if (numero) {
        const existeEncuentro = encuentrosCaracterizacion.find((encuentro) => encuentro.id === id);

        if (!existeEncuentro) {
          encuentro = { id: fila[0], numero: numero, sedes: [], tiposSede: [] };
          encuentrosCaracterizacion.push(encuentro);
        } else {
          encuentro = existeEncuentro;

          /**
           * Sedes: cantidad de participantes por sede por encuentro
           */
          if (fila[3]) {
            const nombreSede = slugificar(limpiarTextoSimple(fila[3]));

            const existeSede: { slug: string; conteo: number } | undefined = encuentro.sedes?.find((sede) => {
              return sede.slug === nombreSede;
            });

            if (!existeSede) {
              encuentro.sedes?.push({ slug: nombreSede, conteo: 1 });
            } else {
              existeSede.conteo++;
            }
          }

          /**
           * Tipos Sedes: cantidad de participantes por sede por encuentro
           */
          if (fila[4]) {
            const tipoSede = slugificar(limpiarTextoSimple(fila[4]));

            const existeTipo: { slug: string; conteo: number } | undefined = encuentro.tiposSede?.find((tipo) => {
              return tipo.slug === tipoSede;
            });

            if (!existeTipo) {
              encuentro.tiposSede?.push({ slug: tipoSede, conteo: 1 });
            } else {
              existeTipo.conteo++;
            }
          }
        }
        //   encuentrosCaracterizacion.push(encuentro);
      }

      numeroFila++;
    });

    flujo.on('close', () => {
      // Aquí ya terminó de leer toda la tabla

      for (const lista in listas) {
        ordenarListaObjetos(listas[lista as keyof ListasCaracterizacion], 'slug', true);
      }

      // guardar datos encuentros (no listas)
      guardarJSON(encuentrosCaracterizacion, 'encuentros');
      resolver({ datos: encuentrosCaracterizacion, errata });
    });

    flujo.on('error', (error) => {
      throw new Error(JSON.stringify(error, null, 2));
    });
  });
};
