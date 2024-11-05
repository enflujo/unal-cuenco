import { alerta, chulo, guardarJSON, logAviso, logNaranjaPulso } from './ayudas';
import { procesarIndicadores } from './indicadores';
import procesadorCaracterizacion from './procesadorCaracterizacionCopy';
import procesadorColectivos from './procesadorColectivos';
import procesadorPublicaciones from './procesadorPublicaciones';
import type { Errata } from './tipos';

async function inicio() {
  /**
   * PUBLICACIONES
   */
  const rutaPublicaciones = './datos/Base_Producción_ academica_contactos_V25.xlsx';
  // Extraer diccionario de indicadores
  const indicadoresPublicaciones = await procesarIndicadores(rutaPublicaciones, 'Diccionario de Indicadores');
  // Extraer sub-indicadores y crear relaciones con indicadores
  // const subIndicadoresPublicaciones = await procesarSubIndicadores(
  //   rutaPublicaciones,
  //   'Contenidos P.A',
  //   indicadoresPublicaciones.datos
  // );

  const publicaciones = await procesadorPublicaciones(
    rutaPublicaciones,
    'Producción académica (P.A.)',
    indicadoresPublicaciones.datos
    // subIndicadoresPublicaciones.datos
  );

  /**
   * COLECTIVOS
   */
  const rutaColectivos = './datos/Base_colectivos_y_ambitos_contactos_V26.xlsx';
  const indicadoresColectivos = await procesarIndicadores(rutaColectivos, 'Diccionario Indicadores');
  // const subIndicadoresColectivos = await procesarSubIndicadores(
  //   rutaColectivos,
  //   'Contenido C.A',
  //   indicadoresColectivos.datos
  // );
  const colectivos = await procesadorColectivos(
    rutaColectivos,
    'Colectivos y ámbitos (C.A)',
    indicadoresColectivos.datos
  );

  /**
   * CARACTERIZACION
   */
  const rutaCaracterizacion = './datos/Visualización_Caracterización_20240909.xlsx';
  const caracterizacion = await procesadorCaracterizacion(rutaCaracterizacion, 'Hoja1');

  guardar(caracterizacion.datos, caracterizacion.errata, 'colectivos', 'errataColectivos');

  guardar(
    indicadoresColectivos.datos,
    indicadoresColectivos.errata,
    'indicadores-colectivos',
    'errataIndicadoresColectivos'
  );
  // guardar(
  //   subIndicadoresColectivos.datos,
  //   subIndicadoresColectivos.errata,
  //   'sub-indicadores-colectivos',
  //   'errataSubIndicadoresColectivos'
  // );
  guardar(colectivos.datos, colectivos.errata, 'colectivos', 'errataColectivos');

  guardar(
    indicadoresPublicaciones.datos,
    indicadoresPublicaciones.errata,
    'indicadores-publicaciones',
    'errataIndicadoresPublicaciones'
  );

  // guardar(
  //   subIndicadoresPublicaciones.datos,
  //   subIndicadoresPublicaciones.errata,
  //   'sub-indicadores-publicaciones',
  //   'errataSubIndicadoresPublicaciones'
  // );
  guardar(publicaciones.datos, publicaciones.errata, 'publicaciones', 'errataPublicaciones');
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
