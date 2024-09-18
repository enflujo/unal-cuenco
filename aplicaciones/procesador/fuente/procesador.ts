import { alerta, chulo, guardarJSON, logAviso, logNaranjaPulso } from './ayudas';
import { procesarIndicadores, procesarSubindicadores } from './indicadores';
import procesadorColectivos from './procesadorColectivos';
import procesadorPublicaciones from './procesadorPublicaciones';

async function inicio() {
  /** Extraer diccionario de indicadores */
  const indicadores = await procesarIndicadores();
  /** Extraer subindicadores y crear relaciones con indicadores */
  const subindicadores = await procesarSubindicadores(indicadores.datos);
  const publicaciones = await procesadorPublicaciones(indicadores.datos, subindicadores.datos);

  if (indicadores.errata.length) {
    guardarJSON(indicadores.datos, `indicadores-produccionAcademica`);
    console.log(
      alerta,
      logNaranjaPulso(
        `Procesados indicadores (con ${indicadores.errata.length} errores, ver archivo: errataIndicadores.json)`
      )
    );
    guardarJSON(indicadores.errata, 'errataIndicadores');
  } else {
    guardarJSON(indicadores.datos, `indicadores-produccionAcademica`);
    console.log(chulo, logAviso('Procesados indicadores'));
  }

  if (subindicadores.errata.length) {
    guardarJSON(subindicadores.datos, `subIndicadores-produccionAcademica`);
    console.log(
      alerta,
      logNaranjaPulso(
        `Procesados subindicadores (con ${subindicadores.errata.length} errores, ver archivo: errataSubIndicadores.json)`
      )
    );
    guardarJSON(subindicadores.errata, 'errataSubIndicadores');
  } else {
    guardarJSON(subindicadores.datos, `subIndicadores-produccionAcademica`);
    console.log(chulo, logAviso('Procesados subindicadores'));
  }
}

inicio().catch(console.error);
