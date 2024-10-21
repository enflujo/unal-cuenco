import { alerta, chulo, guardarJSON, logAviso, logNaranjaPulso } from './ayudas';
import { procesarIndicadores, procesarSubindicadores } from './indicadores';
import procesadorColectivos from './procesadorColectivos';
import procesadorPublicaciones from './procesadorPublicaciones';
import type { Errata } from './tipos';

async function inicio() {
  // /** Extraer diccionario de indicadores */
  const indicadores = await procesarIndicadores();
  // /** Extraer subindicadores y crear relaciones con indicadores */
  const subindicadores = await procesarSubindicadores(indicadores.datos);

  const publicaciones = await procesadorPublicaciones(indicadores.datos, subindicadores.datos);
  const colectivos = await procesadorColectivos(indicadores.datos);

  guardar(colectivos.datos, colectivos.errata, 'colectivos', 'errataColectivos');
  guardar(indicadores.datos, indicadores.errata, 'indicadores-produccionAcademica', 'errataIndicadores');
  guardar(subindicadores.datos, subindicadores.errata, 'subIndicadores-produccionAcademica', 'errataSubIndicadores');
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
