import type {
  Colectivo,
  ListasColectivos,
  ListasEncuentros,
  ListasPublicaciones,
  OpcionBuscadorDatos,
  Publicacion,
} from '@/tipos/compartidos';
import { alerta, chulo, guardarJSON, logAviso, logNaranjaPulso } from './ayudas';
import { procesarIndicadores } from './indicadores';
import procesadorCaracterizacion from './procesadorCaracterizacion';
import procesadorColectivos from './procesadorColectivos';
import procesadorPublicaciones from './procesadorPublicaciones';
import type { Errata } from './tipos';
import procesarEncuentro from './procesarEncuentro';

async function inicio() {
  /**
   * PUBLICACIONES
   */
  const rutaPublicaciones = './datos/Base_Producción_ académica_anonimizado_V25.xlsx';
  // Extraer diccionario de indicadores
  const indicadoresPublicaciones = await procesarIndicadores(rutaPublicaciones, 'Diccionario de Indicadores');
  const publicaciones = await procesadorPublicaciones(
    rutaPublicaciones,
    'Producción académica (P.A.)',
    indicadoresPublicaciones.datos
  );
  guardar(
    indicadoresPublicaciones.datos,
    indicadoresPublicaciones.errata,
    'indicadores-publicaciones',
    'errataIndicadoresPublicaciones'
  );
  guardar(publicaciones.datos, publicaciones.errata, 'publicaciones', 'errataPublicaciones');
  guardarJSON(publicaciones.listas, 'listasPublicaciones');

  /**
   * COLECTIVOS
   */
  const rutaColectivos = './datos/Base_colectivos_y_ambitos_contactos_V26.xlsx';
  const indicadoresColectivos = await procesarIndicadores(rutaColectivos, 'Diccionario Indicadores');
  const colectivos = await procesadorColectivos(
    rutaColectivos,
    'Colectivos y ámbitos (C.A)',
    indicadoresColectivos.datos
  );
  guardar(
    indicadoresColectivos.datos,
    indicadoresColectivos.errata,
    'indicadores-colectivos',
    'errataIndicadoresColectivos'
  );
  guardar(colectivos.datos, colectivos.errata, 'colectivos', 'errataColectivos');
  guardarJSON(colectivos.listas, 'listasColectivos');

  /**
   * ENCUENTROS
   */
  const rutaCaracterizacion = './datos/Visualización_Caracterización_20240909.xlsx';
  const caracterizacion = await procesadorCaracterizacion(rutaCaracterizacion, 'Hoja1');
  guardar(caracterizacion.datos, caracterizacion.errata, 'encuentros', 'errataEncuentros');

  /**
   * DATOS BUSCADOR
   */
  const datosBuscador = procesarDatosBuscador(
    publicaciones.datos,
    colectivos.datos,
    publicaciones.listas,
    colectivos.listas
  );
  guardar(datosBuscador, [], 'buscador', 'errataBuscador');

  /**
   * DATOS ENCUENTROS
   */
  const listasEncuentros: ListasEncuentros = {
    sedes: [],
    tecnicas: [],
    categorias: [],
    tematicas: [],
    participantes: [],
  };
  const rutaEncuentro1 = './datos/1EncuentroIntersedesVrt_CategorizacionVisualizacionGraficasCSLMR_20240906.xlsx';
  const encuentro1 = await procesarEncuentro(rutaEncuentro1, 'UA01A', 'UA01B', [], [], listasEncuentros);
  const rutaEncuentro2 = './datos/2EncuentroIntersedesVrt_CategorizacionVisualizacionGraficasCSLMR_ 20240930.xlsx';
  const encuentro2A = await procesarEncuentro(
    rutaEncuentro2,
    'UA01A',
    'UA01B',
    encuentro1.categorias,
    encuentro1.datos,
    encuentro1.listas
  );
  const encuentro2B = await procesarEncuentro(
    rutaEncuentro2,
    'UA02A',
    'UA02B',
    encuentro2A.categorias,
    encuentro2A.datos,
    encuentro2A.listas
  );
  const encuentro2C = await procesarEncuentro(
    rutaEncuentro2,
    'UA03A',
    'UA03B',
    encuentro2B.categorias,
    encuentro2B.datos,
    encuentro2B.listas
  );
  const encuentro2D = await procesarEncuentro(
    rutaEncuentro2,
    'UA04A',
    'UA04B',
    encuentro2C.categorias,
    encuentro2C.datos,
    encuentro2C.listas
  );

  const rutaEncuentro3 = './datos/3EncuentroIntersedesMzl_CategorizacionVisualizacionGraficasCSLMR_ 20241031.xlsx';
  const encuentro3A = await procesarEncuentro(
    rutaEncuentro3,
    'UA01A',
    'UA01B',
    encuentro2D.categorias,
    encuentro2D.datos,
    encuentro2D.listas
  );
  const encuentro3B = await procesarEncuentro(
    rutaEncuentro3,
    'UA02A',
    'UA02B',
    encuentro3A.categorias,
    encuentro3A.datos,
    encuentro3A.listas
  );
  const encuentro3C = await procesarEncuentro(
    rutaEncuentro3,
    'UA03A',
    'UA03B',
    encuentro3B.categorias,
    encuentro3B.datos,
    encuentro3B.listas
  );
  const encuentro3D = await procesarEncuentro(
    rutaEncuentro3,
    'UA04A',
    'UA04B',
    encuentro3C.categorias,
    encuentro3C.datos,
    encuentro3C.listas
  );
  const encuentro3E = await procesarEncuentro(
    rutaEncuentro3,
    'UA05A',
    'UA05B',
    encuentro3D.categorias,
    encuentro3D.datos,
    encuentro3D.listas
  );
  const encuentro3F = await procesarEncuentro(
    rutaEncuentro3,
    'UA06A',
    'UA06B',
    encuentro3E.categorias,
    encuentro3E.datos,
    encuentro3E.listas
  );

  const rutaEncuentro5 = './datos/5EncuentroIntersedesCrb_CategorizacionVisualizacionCSLMR_20240206009.xlsx';
  const encuentro5A = await procesarEncuentro(
    rutaEncuentro5,
    'UA01A',
    'UA01B',
    encuentro3F.categorias,
    encuentro3F.datos,
    encuentro3F.listas
  );
  const encuentro5B = await procesarEncuentro(
    rutaEncuentro5,
    'UA02A',
    'UA02B',
    encuentro5A.categorias,
    encuentro5A.datos,
    encuentro5A.listas
  );
  const encuentro5C = await procesarEncuentro(
    rutaEncuentro5,
    'UA03A',
    'UA03B',
    encuentro5B.categorias,
    encuentro5B.datos,
    encuentro5B.listas
  );
  const encuentro5D = await procesarEncuentro(
    rutaEncuentro5,
    'UA04A',
    'UA04B',
    encuentro5C.categorias,
    encuentro5C.datos,
    encuentro5C.listas
  );
  const encuentro5E = await procesarEncuentro(
    rutaEncuentro5,
    'UA05A',
    'UA05B',
    encuentro5D.categorias,
    encuentro5D.datos,
    encuentro5D.listas
  );
  const encuentro5F = await procesarEncuentro(
    rutaEncuentro5,
    'UA06A',
    'UA06B',
    encuentro5E.categorias,
    encuentro5E.datos,
    encuentro5E.listas
  );
  const encuentro5G = await procesarEncuentro(
    rutaEncuentro5,
    'UA07A',
    'UA07B',
    encuentro5F.categorias,
    encuentro5F.datos,
    encuentro5F.listas
  );

  const rutaEncuentro6 = './datos/6EncuentroIntersedesVrt_CategorizacionVisualizacionMRT_ 20240321.xlsx';
  const encuentro6A = await procesarEncuentro(
    rutaEncuentro6,
    'UA01A',
    'UA01B',
    encuentro5G.categorias,
    encuentro5G.datos,
    encuentro5G.listas
  );
  const encuentro6B = await procesarEncuentro(
    rutaEncuentro6,
    'UA02A',
    'UA02B ',
    encuentro6A.categorias,
    encuentro6A.datos,
    encuentro6A.listas
  );
  const encuentro6C = await procesarEncuentro(
    rutaEncuentro6,
    'UA03A',
    'UA03B',
    encuentro6B.categorias,
    encuentro6B.datos,
    encuentro6B.listas
  );
  const encuentro6D = await procesarEncuentro(
    rutaEncuentro6,
    'UA04A',
    'UA04B ',
    encuentro6C.categorias,
    encuentro6C.datos,
    encuentro6C.listas
  );
  const encuentro6E = await procesarEncuentro(
    rutaEncuentro6,
    'UA05A',
    'UA05B',
    encuentro6D.categorias,
    encuentro6D.datos,
    encuentro6D.listas
  );

  const rutaEncuentro7 = './datos/7EncuentroIntersedesOrq_CategorizacionVisualizacionGraficasMRT_ 20241106.xlsx';
  const encuentro7A = await procesarEncuentro(
    rutaEncuentro7,
    'UA01A',
    'UA01B',
    encuentro6E.categorias,
    encuentro6E.datos,
    encuentro6E.listas
  );
  const encuentro7B = await procesarEncuentro(
    rutaEncuentro7,
    'UA02A',
    'UA02B ',
    encuentro7A.categorias,
    encuentro7A.datos,
    encuentro7A.listas
  );
  const encuentro7C = await procesarEncuentro(
    rutaEncuentro7,
    'UA03A',
    'UA03B',
    encuentro7B.categorias,
    encuentro7B.datos,
    encuentro7B.listas
  );
  const encuentro7D = await procesarEncuentro(
    rutaEncuentro7,
    'UA04A',
    'UA04B ',
    encuentro7C.categorias,
    encuentro7C.datos,
    encuentro7C.listas
  );
  const encuentro7E = await procesarEncuentro(
    rutaEncuentro7,
    'UA05A',
    'UA05B',
    encuentro7D.categorias,
    encuentro7D.datos,
    encuentro7D.listas
  );
  const encuentro7F = await procesarEncuentro(
    rutaEncuentro7,
    'UA06A',
    'UA06B ',
    encuentro7E.categorias,
    encuentro7E.datos,
    encuentro7E.listas
  );
  const encuentro7G = await procesarEncuentro(
    rutaEncuentro7,
    'UA07A',
    'UA07B',
    encuentro7F.categorias,
    encuentro7F.datos,
    encuentro7F.listas
  );
  const encuentro7H = await procesarEncuentro(
    rutaEncuentro7,
    'UA08A',
    'UA08B ',
    encuentro7G.categorias,
    encuentro7G.datos,
    encuentro7G.listas
  );
  const encuentro7I = await procesarEncuentro(
    rutaEncuentro7,
    'UA09A',
    'UA09B ',
    encuentro7H.categorias,
    encuentro7H.datos,
    encuentro7H.listas
  );
  const encuentro7J = await procesarEncuentro(
    rutaEncuentro7,
    'UA10A',
    'UA10B  ',
    encuentro7I.categorias,
    encuentro7I.datos,
    encuentro7I.listas
  );
  const encuentro7K = await procesarEncuentro(
    rutaEncuentro7,
    'UA11A',
    'UA11B ',
    encuentro7J.categorias,
    encuentro7J.datos,
    encuentro7J.listas
  );
  const encuentro7L = await procesarEncuentro(
    rutaEncuentro7,
    'UA12A',
    'UA12B',
    encuentro7K.categorias,
    encuentro7K.datos,
    encuentro7K.listas
  );
  const encuentro7M = await procesarEncuentro(
    rutaEncuentro7,
    'UA13A',
    'UA13B',
    encuentro7L.categorias,
    encuentro7L.datos,
    encuentro7L.listas
  );
  const encuentro7N = await procesarEncuentro(
    rutaEncuentro7,
    'UA14A',
    'UA14B',
    encuentro7M.categorias,
    encuentro7M.datos,
    encuentro7M.listas
  );
  const encuentro7O = await procesarEncuentro(
    rutaEncuentro7,
    'UA15A',
    'UA15B',
    encuentro7N.categorias,
    encuentro7N.datos,
    encuentro7N.listas
  );
  const encuentro7P = await procesarEncuentro(
    rutaEncuentro7,
    'UA16A',
    'UA16B',
    encuentro7O.categorias,
    encuentro7O.datos,
    encuentro7O.listas
  );

  const rutaEncuentro8 = './datos/8EncuentroIntersedesTmc_CategorizacionVisualizacionGraficasSHA_ 20241106.xlsx';
  const encuentro8A = await procesarEncuentro(
    rutaEncuentro8,
    'UA01A',
    'UA01B ',
    encuentro7P.categorias,
    encuentro7P.datos,
    encuentro7P.listas
  );
  const encuentro8B = await procesarEncuentro(
    rutaEncuentro8,
    'UA02A',
    'UA02B',
    encuentro8A.categorias,
    encuentro8A.datos,
    encuentro8A.listas
  );
  const encuentro8C = await procesarEncuentro(
    rutaEncuentro8,
    'UA03A ',
    'UA03B ',
    encuentro8B.categorias,
    encuentro8B.datos,
    encuentro8B.listas
  );
  const encuentro8D = await procesarEncuentro(
    rutaEncuentro8,
    'UA04A',
    'UA04B ',
    encuentro8C.categorias,
    encuentro8C.datos,
    encuentro8C.listas
  );
  const encuentro8E = await procesarEncuentro(
    rutaEncuentro8,
    'UA05A',
    'UA05B ',
    encuentro8D.categorias,
    encuentro8D.datos,
    encuentro8D.listas
  );
  const encuentro8F = await procesarEncuentro(
    rutaEncuentro8,
    'UA06A',
    'UA06B',
    encuentro8E.categorias,
    encuentro8E.datos,
    encuentro8E.listas
  );
  const encuentro8G = await procesarEncuentro(
    rutaEncuentro8,
    'UA07A',
    'UA07B ',
    encuentro8F.categorias,
    encuentro8F.datos,
    encuentro8F.listas
  );
  const encuentro8H = await procesarEncuentro(
    rutaEncuentro8,
    'UA08A',
    'UA08B ',
    encuentro8G.categorias,
    encuentro8G.datos,
    encuentro8G.listas
  );
  const encuentro8I = await procesarEncuentro(
    rutaEncuentro8,
    'UA09A',
    'UA09B',
    encuentro8H.categorias,
    encuentro8H.datos,
    encuentro8H.listas
  );
  const encuentro8J = await procesarEncuentro(
    rutaEncuentro8,
    'UA010A',
    'UA010B ',
    encuentro8I.categorias,
    encuentro8I.datos,
    encuentro8I.listas
  );
  const encuentro8K = await procesarEncuentro(
    rutaEncuentro8,
    'UA011A',
    'UA011B ',
    encuentro8J.categorias,
    encuentro8J.datos,
    encuentro8J.listas
  );
  const encuentro8L = await procesarEncuentro(
    rutaEncuentro8,
    'UA012A',
    'UA012B ',
    encuentro8K.categorias,
    encuentro8K.datos,
    encuentro8K.listas
  );
  const encuentro8M = await procesarEncuentro(
    rutaEncuentro8,
    'UA013A',
    'UA013B',
    encuentro8L.categorias,
    encuentro8L.datos,
    encuentro8L.listas
  );
  const encuentro8N = await procesarEncuentro(
    rutaEncuentro8,
    'UA014A',
    'UA014B',
    encuentro8M.categorias,
    encuentro8M.datos,
    encuentro8M.listas
  );
  const encuentro8O = await procesarEncuentro(
    rutaEncuentro8,
    'UA015A',
    'UA015B',
    encuentro8N.categorias,
    encuentro8N.datos,
    encuentro8N.listas
  );
  const encuentro8P = await procesarEncuentro(
    rutaEncuentro8,
    'UA016A ',
    'UA016B',
    encuentro8O.categorias,
    encuentro8O.datos,
    encuentro8O.listas
  );

  guardar(encuentro1.categorias, [], 'categoriasEncuentros', 'errataCategoriasEncuentros');
  guardar(encuentro1.listas, [], 'listasEncuentros2', 'errataCategoriasEncuentros2');
  guardar(encuentro1.datos, encuentro1.errata, 'encuentros2', 'errataEncuentros2');
}

inicio().catch(console.error);

function guardar(datos: any, errata: Errata[], nombre: string, nombreErrata = `errata${nombre}`) {
  if (errata.length) {
    guardarJSON(datos, nombre);
    console.log(
      alerta,
      logNaranjaPulso(
        `Procesados ${nombre} (con ${errata.length} error${errata.length > 1 ? 'es' : ''}, ver archivo: ${nombreErrata}.json)`
      )
    );
    guardarJSON(errata, nombreErrata);
  } else {
    guardarJSON(datos, nombre);
    console.log(chulo, logAviso(`Procesados ${nombre}`));
  }
}

function procesarDatosBuscador(
  publicaciones: Publicacion[],
  colectivos: Colectivo[],
  listaPublicaciones: ListasPublicaciones,
  listaColectivos: ListasColectivos
) {
  const opciones: OpcionBuscadorDatos[] = [];

  publicaciones.forEach((publicacion, i) => {
    opciones.push({
      nombre: publicacion.titulo.nombre,
      tipo: 'publicaciones',
      id: publicacion.id,
      vista: 'publicaciones',
    });
  });

  colectivos.forEach((colectivo, i) => {
    opciones.push({ nombre: colectivo.titulo.nombre, tipo: 'colectivos', id: colectivo.id, vista: 'colectivos' });
  });

  for (const llave in listaPublicaciones) {
    const lista = listaPublicaciones[llave as keyof ListasPublicaciones];
    lista.forEach((elemento, i) => {
      const elementoBuscador: OpcionBuscadorDatos = {
        nombre: elemento.nombre,
        tipo: llave,
        id: elemento.id,
        vista: 'publicaciones',
      };
      opciones.push(elementoBuscador);
    });
  }

  for (const llave in listaColectivos) {
    const lista = listaColectivos[llave as keyof ListasColectivos];
    lista.forEach((elemento, i) => {
      const elementoBuscador: OpcionBuscadorDatos = {
        nombre: elemento.nombre,
        tipo: llave,
        id: elemento.id,
        vista: 'colectivos',
      };

      opciones.push(elementoBuscador);
    });
  }

  return opciones;
}
