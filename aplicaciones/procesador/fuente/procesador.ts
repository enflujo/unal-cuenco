import type {
  Colectivo,
  ListasColectivos,
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
      tipo: 'publicacion',
      id: publicacion.id,
      vista: 'publicaciones',
    });
  });

  colectivos.forEach((colectivo, i) => {
    opciones.push({ nombre: colectivo.titulo.nombre, tipo: 'colectivo', id: colectivo.id, vista: 'colectivos' });
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
