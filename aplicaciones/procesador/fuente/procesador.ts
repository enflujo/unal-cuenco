import { chulo, guardarJSON, logAviso } from './ayudas';
import { procesarIndicadores, procesarSubindicadores } from './indicadores';
import procesadorColectivos from './procesadorColectivos';
import procesadorPublicaciones from './procesadorPublicaciones';

async function inicio() {
  /** Extraer diccionario de indicadores */
  const indicadores = await procesarIndicadores();
  /** Extraer subindicadores y crear relaciones con indicadores */
  const subindicadores = await procesarSubindicadores(indicadores);

  guardarJSON(indicadores, `indicadores-produccionAcademica`);
  console.log(chulo, logAviso('Procesados indicadores'));
  guardarJSON(subindicadores, `subIndicadores-produccionAcademica`);
  console.log(chulo, logAviso('Procesados subindicadores'));

  // const publicaciones = await procesadorPublicaciones();
  // await procesadorColectivos();
}

inicio().catch(console.error);
