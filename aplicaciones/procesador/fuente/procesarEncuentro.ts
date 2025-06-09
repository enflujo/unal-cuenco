// UA01B

import { getXlsxStream } from 'xlstream';
import slugificar from 'slug';
import { ordenarListaObjetos, limpiarTextoSimple, esNumero, aplanarDefinicionesASlugs } from './ayudas';
import type { ElementoLista, Encuentro, Indicador, ListasEncuentros, LlavesEncuentros } from '@/tipos/compartidos';
import type { Errata, FilaCategoriasEncuentro, FilaEncuentro } from './tipos';

function procesarLista(llaveLista: LlavesEncuentros, valor: string, listas: ListasEncuentros) {
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
      encuentros: [],
    });
  } else {
    existe.conteo++;
  }

  return { nombre, slug };
}

async function procesarCategorias(ruta: string, tabla: string, categorias: Indicador[]) {
  const flujo = await getXlsxStream({
    filePath: ruta,
    sheet: tabla,
    withHeader: true,
    ignoreEmpty: true,
  });

  return new Promise((resolver) => {
    flujo.on('data', ({ raw }) => {
      const fila = raw.arr as FilaCategoriasEncuentro;
      const nombre = limpiarTextoSimple(fila[0]);
      const slug = slugificar(nombre);
      const existe = categorias.find((categoria) => categoria.slug === slug);

      if (!existe && nombre !== 'TOTAL FRAGMENTOS') {
        categorias.push({
          id: categorias.length + 1,
          nombre,
          slug,
          definicion: fila[2] ? limpiarTextoSimple(fila[2]) : '',
        });
      }
    });

    flujo.on('close', () => {
      resolver(categorias);
    });

    flujo.on('error', (error) => {
      throw new Error(JSON.stringify(error, null, 2));
    });
  });
}

export default async (
  ruta: string,
  tabla: string,
  tablaCategorias: string,
  categorias: Indicador[],
  encuentros: Encuentro[],
  listas: ListasEncuentros
): Promise<{ datos: Encuentro[]; errata: Errata[]; listas: ListasEncuentros; categorias: Indicador[] }> => {
  await procesarCategorias(ruta, tablaCategorias, categorias);
  // console.log(ruta, tabla, tablaCategorias);
  const flujo = await getXlsxStream({
    filePath: ruta,
    sheet: tabla,
    withHeader: false,
    ignoreEmpty: true,
  });
  const errata: Errata[] = [];
  let numeroFila = 1;
  let idFragmentoAnterior: string | null = null;

  return new Promise((resolver) => {
    flujo.on('data', async ({ raw }) => {
      if (numeroFila < 3) {
        numeroFila++;
        return;
      }
      const fila = raw.arr as FilaEncuentro;

      const idEncuentro = esNumero(fila[1]);

      if (idEncuentro) {
        // Buscarlo a ver si existe
        let encuentro = encuentros.find((encuentro) => encuentro.id === `${fila[1]}`);
        // console.log('buscando encuentro', idEncuentro, encuentro, encuentros.length);
        let nuevoEncuentro = false;
        // Si no existe, crearlo antes de continuar
        if (!encuentro) {
          encuentro = { id: `${fila[1]}`, fragmentos: [] };
          console.log('creando encuentro', encuentro.id);
          nuevoEncuentro = true;
        }

        let idFragmento = fila[0] ? `${fila[0]}` : null;

        if (!idFragmento) {
          if (!idFragmentoAnterior) {
            errata.push({ fila: numeroFila, error: `No hay id de fragmento: ${fila[0]} del encuentro ${fila[1]}` });
            console.log(ruta, tabla, numeroFila, fila, idFragmentoAnterior);
            throw new Error(`No hay id de fragmento: ${fila[0]} del encuentro ${fila[1]}`);
          }

          idFragmento = `${idFragmentoAnterior}_`;
        }

        idFragmentoAnterior = idFragmento;

        const fragmento = limpiarTextoSimple(fila[7]);

        if (fragmento) {
          encuentro.fragmentos.push({ id: idFragmento, fragmento });
        } else {
          errata.push({ fila: numeroFila, error: `No hay fragmento: ${fila[7]}` });
        }

        /** Categoria */
        if (fila[6]) {
          const { nombre, slug } = procesarLista('categorias', fila[6], listas);
          if (!encuentro.categorias) encuentro.categorias = [];

          const existe = encuentro.categorias.find((categoria) => categoria.slug === slug);

          if (!existe) {
            encuentro.categorias.push({ nombre, slug, idFragmento: [idFragmento] });
          } else {
            existe.idFragmento.push(idFragmento);
          }
        } else {
          errata.push({ fila: numeroFila, error: `No hay categoría: ${fila[6]}` });
        }

        type llavesSede = 'amz' | 'crb' | 'mzl' | 'orq' | 'tmc' | 'vrt';

        const nombresSedes: {[llave in llavesSede]: string}  = {
          amz: 'Amazonas',
          crb: 'Caribe',
          mzl: 'Manizales',
          orq: 'Orinoquia',
          tmc: 'Tumaco',
          vrt: 'Virtual'
        }

        /** Sedes */
        if (fila[2] && nombresSedes[fila[2].toLowerCase() as llavesSede]) {
          const { nombre, slug } = procesarLista('sedes', nombresSedes[fila[2].toLowerCase() as llavesSede], listas);
         // const { nombre, slug } = procesarLista('sedes', fila[2], listas); 
         encuentro.sedes = { nombre, slug };
        } else {
          errata.push({ fila: numeroFila, error: `No hay sede: ${fila[2]}` });
        }

        /** Técnicas */
        if (fila[4]) {
          const { nombre, slug } = procesarLista('tecnicas', fila[4], listas);
          encuentro.tecnicas = { nombre, slug };
        } else {
          errata.push({ fila: numeroFila, error: `No hay técnica: ${fila[4]}` });
        }

        /** Temática */
        if (fila[5]) {
          const { nombre, slug } = procesarLista('tematicas', fila[5], listas);
          if (!encuentro.tematicas) encuentro.tematicas = [];

          const existe = encuentro.tematicas.find((tematica) => tematica.slug === slug);

          if (!existe) {
            encuentro.tematicas.push({ nombre, slug, idFragmento: [idFragmento] });
          } else {
            existe.idFragmento.push(idFragmento);
          }
        } else {
          errata.push({ fila: numeroFila, error: `No hay temática: ${fila[5]}` });
        }

        /** Participantes */
        if (fila[8]) {
          const partes = fila[8].split(';');

          partes.forEach((participante) => {
            const { nombre, slug } = procesarLista('participantes', participante, listas);

            if (!encuentro.participantes) {
              encuentro.participantes = [];
            }

            const existe = encuentro.participantes.find((participante) => participante.slug === slug);

            if (!existe) {
              encuentro.participantes.push({ nombre, slug, idFragmento: [idFragmento] });
            } else {
              existe.idFragmento.push(idFragmento);
            }
          });
        } else {
          errata.push({ fila: numeroFila, error: `No hay participantes: ${fila[8]}` });
        }

        if (nuevoEncuentro) encuentros.push(encuentro);
      } else {
        errata.push({ fila: numeroFila, error: `No hay id de encuentro: ${fila[1]}` });
      }

      numeroFila++;
    });

    flujo.on('close', () => {
      // Aquí ya terminó de leer toda la tabla
      construirRelacionesDeEncuentros();

      for (const lista in listas) {
        ordenarListaObjetos(listas[lista as keyof ListasEncuentros], 'slug', true);
      }

      // entradas.sort((a, b) => {
      //   if (a.titulo.slug < b.titulo.slug) return -1;
      //   else if (a.titulo.slug > b.titulo.slug) return 1;
      //   return 0;
      // });

      resolver({ datos: encuentros, errata, listas, categorias });
    });

    flujo.on('error', (error) => {
      throw new Error(JSON.stringify(error, null, 2));
    });
  });

  function construirRelacionesDeEncuentros() {
    // Estos campos son los que se usan para crear relaciones
    const campos: LlavesEncuentros[] = [
      'sedes',
      'tecnicas',
      'categorias',
      'tematicas',
      'participantes',
      'indicadores',
      'tipos',
    ];

    encuentros.forEach((entrada) => {
      // Pasar por cada campo sobre los que queremos construir relaciones
      campos.forEach((campoRelacionDesde) => {
        // Datos que queremos llenar como relación en los otros campos
        const datosRelacionDesde = entrada[campoRelacionDesde];

        if (datosRelacionDesde) {
          const slugsDesde = aplanarDefinicionesASlugs(datosRelacionDesde);

          campos.forEach((campoRelacionHacia) => {
            // Agregar datos de cada campo en todos los otros, excepto en sí mismo.
            if (campoRelacionDesde !== campoRelacionHacia) {
              // Si no hay datos para llenar entonces podemos salir y continuar.
              if (!entrada[campoRelacionHacia]) return;

              slugsDesde.forEach((slugDesde) => {
                // Primero: extraer la lista donde van a crearse las relaciones.
                const listaHacia = listas[campoRelacionHacia];
                const desde = listas[campoRelacionDesde].find((obj) => obj.slug === slugDesde);

                if (listaHacia && desde) {
                  // Extraer los slugs de los campos donde se van a crear relaciones para buscarlos en la lista y agregar la relación.
                  const slugsHacia = aplanarDefinicionesASlugs(entrada[campoRelacionHacia]);
                  llenarRelacion(slugsHacia, listaHacia, desde.id, campoRelacionDesde, entrada.id);
                } else {
                  console.log('Esto no puede pasar');
                }
              });
            }
          });
        }
      });
    });
  }

  function llenarRelacion(
    slugsHacia: string[],
    lista: ElementoLista[],
    idDesde: string,
    tipoRelacion: LlavesEncuentros,
    idEncuentro: string
  ) {
    slugsHacia.forEach((slugHacia) => {
      const elementoALlenar = lista.find((obj) => obj.slug === slugHacia);

      if (elementoALlenar) {
        const existe = elementoALlenar.relaciones?.find((obj) => obj.id === idDesde && obj.tipo === tipoRelacion);

        if (!existe) {
          elementoALlenar.relaciones?.push({ conteo: 1, id: idDesde, tipo: tipoRelacion });
        } else {
          existe.conteo++;
        }

        if (!elementoALlenar.encuentros?.includes(idEncuentro)) {
          elementoALlenar.encuentros?.push(idEncuentro);
        }
      }
    });
  }
};
