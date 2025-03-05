import { getXlsxStream } from 'xlstream';
import slugificar from 'slug';
import { ordenarListaObjetos, guardarJSON, limpiarTextoSimple, aplanarDefinicionesASlugs } from './ayudas';
import type {
  DefinicionSimple,
  ElementoLista,
  EncuentroCaracterizacion,
  ListasCaracterizacion,
  LlavesCaracterizacion,
} from '@/tipos/compartidos';
import type { Errata, FilaCaracterizacion, FilaColectivos } from './tipos';

const encuentrosCaracterizacion: EncuentroCaracterizacion[] = [];
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

export default async (
  ruta: string,
  tabla: string
): Promise<{ datos: EncuentroCaracterizacion[]; errata: Errata[] }> => {
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
      const numero = limpiarTextoSimple(fila[1]);

      if (numero) {
        const encuentro: EncuentroCaracterizacion = { id: fila[0], numero: numero };

        /** Sedes */
        if (fila[3]) {
          const valorSedes = limpiarTextoSimple(fila[3]);
          const sedes: DefinicionSimple[] = [];

          // Las sedes no se separaron con ; sino con y. Ejemplo: "Bogotá y Medellin"
          if (valorSedes.includes(' y ')) {
            // En este caso separar primero las sedes y luego procesarlas.
            valorSedes.split(' y ').forEach((sede) => {
              const { nombre, slug } = procesarLista('sedes', sede);
              sedes.push({ nombre, slug });
            });
          } else {
            const { nombre, slug } = procesarLista('sedes', valorSedes);
            sedes.push({ nombre, slug });
          }

          encuentro.sedes = sedes;
        } else {
          errata.push({ fila: numeroFila, error: `No tiene SEDE.` });
        }

        /** tipo de sede */
        if (fila[4]) {
          const valorTipoSede = limpiarTextoSimple(fila[4]);
          const tiposSede: DefinicionSimple[] = [];
          const { nombre, slug } = procesarLista('sedes', valorTipoSede);
          tiposSede.push({ nombre, slug });

          encuentro.tiposSede = tiposSede;
        } else {
          errata.push({ fila: numeroFila, error: `No tiene SEDE.` });
        }

        /** rol */
        if (fila[5]) {
          const valorRol = limpiarTextoSimple(fila[5]);
          const roles: DefinicionSimple[] = [];
          const { nombre, slug } = procesarLista('roles', valorRol);
          roles.push({ nombre, slug });

          encuentro.roles = roles;
        } else {
          errata.push({ fila: numeroFila, error: `No tiene ROL.` });
        }

        /** cargo */
        if (fila[6]) {
          const valorCargo = limpiarTextoSimple(fila[6]);
          const cargos: DefinicionSimple[] = [];
          const { nombre, slug } = procesarLista('cargos', valorCargo);
          cargos.push({ nombre, slug });

          encuentro.cargos = cargos;
        } else {
          errata.push({ fila: numeroFila, error: `No tiene CARGO.` });
        }

        encuentrosCaracterizacion.push(encuentro);
      }

      numeroFila++;
    });

    flujo.on('close', () => {
      // Aquí ya terminó de leer toda la tabla
      construirRelacionesEncuentros();

      for (const lista in listas) {
        ordenarListaObjetos(listas[lista as keyof ListasCaracterizacion], 'slug', true);
      }

      /*   encuentrosCaracterizacion.sort((a, b) => {
        if (a.titulo.slug < b.titulo.slug) return -1;
        else if (a.titulo.slug > b.titulo.slug) return 1;
        return 0;
      }); */

      guardarJSON(listas, 'listasEncuentros');
      resolver({ datos: encuentrosCaracterizacion, errata });
    });

    flujo.on('error', (error) => {
      throw new Error(JSON.stringify(error, null, 2));
    });
  });

  function construirRelacionesEncuentros() {
    // Estos campos son los que se usan para crear relaciones
    const campos: LlavesCaracterizacion[] = ['sedes', 'tiposSede', 'roles', 'cargos'];

    encuentrosCaracterizacion.forEach((encuentro) => {
      // Pasar por cada campo sobre los que queremos construir relaciones
      campos.forEach((campoRelacion) => {
        const datosRelacion = encuentro[campoRelacion];

        if (datosRelacion) {
          const { id } = encuentro;

          campos.forEach((campo) => {
            // Agregar datos de cada campo en todos los otros, excepto en sí mismo.
            if (campoRelacion !== campo) {
              // Si no hay datos para llenar entonces podemos salir y continuar.
              if (!encuentro[campo]) return;

              const slugsCampoProyecto = aplanarDefinicionesASlugs(datosRelacion);

              slugsCampoProyecto.forEach((slug) => {
                const existe = listas[campoRelacion].find((obj) => obj.slug === slug);

                if (existe) {
                  if (!encuentro[campo]) return;

                  let datos = encuentro[campo];

                  const elementosDondeConectar = aplanarDefinicionesASlugs(datos);

                  llenarRelacion(elementosDondeConectar, listas[campo], existe.id, campoRelacion, `${id}`);
                } else {
                  console.log('Esto no puede pasar');
                }
              });
            }
            // }
          });
        }
      });
    });
  }

  function llenarRelacion(
    slugsHacia: string[],
    lista: ElementoLista[],
    idDesde: string,
    tipoRelacion: LlavesCaracterizacion,
    idCaracterizacion: string
  ) {
    slugsHacia.forEach((slugHacia) => {
      const elementoALlenar = lista.find((obj) => obj.slug === slugHacia);

      if (elementoALlenar) {
        const existe = elementoALlenar.relaciones.find((obj) => obj.id === idDesde && obj.tipo === tipoRelacion);

        if (!existe) {
          elementoALlenar.relaciones.push({ conteo: 1, id: idDesde, tipo: tipoRelacion });
        } else {
          existe.conteo++;
        }

        if (!elementoALlenar.encuentrosCaracterizacion?.includes(idCaracterizacion)) {
          elementoALlenar.encuentrosCaracterizacion?.push(idCaracterizacion);
        }
      }
    });
  }

  /* function llenarRelacion(
    elementosDondeConectar: string[],
    elementoLista: ElementoLista[],
    indice: string,
    campoRelacion: LlavesCaracterizacion,
    id: string,
    nombre: string
  ) {
    elementosDondeConectar.forEach((elementoConector) => {
      const elementoALlenar = elementoLista.find((obj) => obj.slug === elementoConector);

      if (elementoALlenar) {
        const existe = elementoALlenar.relaciones.find((obj) => obj.id === indice);

        if (!existe) {
          elementoALlenar.relaciones.push({ conteo: 1, id: indice, tipo: campoRelacion });
        } else {
          existe.conteo++;
        }

        if (!elementoALlenar.colectivos?.includes(id)) {
          elementoALlenar.colectivos?.push(id);
        }
      }

      // console.log('poner', campoRelacion, 'como relacion en lista', elementoConector);
    });
  } */
};
