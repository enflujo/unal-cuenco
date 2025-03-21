import { getXlsxStream } from 'xlstream';
import slugificar from 'slug';
import { ordenarListaObjetos, limpiarTextoSimple } from './ayudas';
import type { ListasCaracterizacion, LlavesCaracterizacion } from '@/tipos/compartidos';
import type { Errata, FilaCaracterizacion } from './tipos';

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
    // llenar listas por categoría
    listas[llaveLista].push({
      id: `${listas[llaveLista].length + 1}`,
      nombre,
      slug,
      conteo: 1,
    });
  } else {
    existe.conteo++;
  }

  return { nombre, slug, conteo: existe?.conteo || 1 };
}

export default async (ruta: string, tabla: string): Promise<{ datos: ListasCaracterizacion; errata: Errata[] }> => {
  const flujo = await getXlsxStream({
    filePath: ruta,
    sheet: tabla,
    withHeader: true,
    ignoreEmpty: true,
  });
  const errata: Errata[] = [];
  let numeroFila = 2;
  let contador = 0;

  return new Promise((resolver) => {
    flujo.on('data', async ({ raw }) => {
      const fila = raw.arr as FilaCaracterizacion;
      const numero = limpiarTextoSimple(fila[1]);

      if (numero) {
        contador++;
        /**
         * Sedes: cantidad de participantes por sede por encuentro
         */
        if (fila[3]) {
          const { nombre, slug, conteo } = procesarLista('sedes', fila[3]);

          const existeSede = listas.sedes?.find((sede) => sede.slug === slug);

          if (!existeSede) {
            listas.sedes?.push({ id: `${contador}`, nombre, slug, conteo });
          } else {
            existeSede.conteo = conteo;
          }
        }

        /**
         * Tipos Sedes: cantidad de participantes por tipo de sede por encuentro
         */
        if (fila[4]) {
          const { nombre, slug, conteo } = procesarLista('tiposSede', fila[4]);
          const existeTipo = listas.tiposSede?.find((tipo) => tipo.slug === slug);

          if (!existeTipo) {
            listas.tiposSede?.push({ id: `${contador}`, nombre, slug, conteo });
          } else {
            existeTipo.conteo = conteo;
          }
        }

        /**
         * Roles: cantidad de participantes por rol por encuentro
         */
        if (fila[5]) {
          const { nombre, slug, conteo } = procesarLista('roles', fila[5]);
          const existeRol = listas.roles?.find((rol) => rol.slug === slug);

          if (!existeRol) {
            listas.roles?.push({ id: `${contador}`, nombre, slug, conteo });
          } else {
            existeRol.conteo = conteo;
          }
        }

        /**
         * Cargos/Áreas: cantidad de participantes por cargo o área por encuentro
         */
        if (fila[6]) {
          const { nombre, slug, conteo } = procesarLista('cargos', fila[6]);
          const existeCargo = listas.cargos?.find((cargo) => cargo.slug === slug);

          if (!existeCargo) {
            listas.cargos?.push({ id: `${contador}`, nombre, slug, conteo });
          } else {
            existeCargo.conteo = conteo;
          }
        }
      }

      numeroFila++;
    });

    flujo.on('close', () => {
      for (const lista in listas) {
        ordenarListaObjetos(listas[lista as keyof ListasCaracterizacion], 'slug', true);
      }
      resolver({ datos: listas, errata });
    });

    flujo.on('error', (error) => {
      throw new Error(JSON.stringify(error, null, 2));
    });
  });
};
