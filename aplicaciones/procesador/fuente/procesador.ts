import procesadorColectivos from './procesadorColectivos';
import procesadorPublicaciones from './procesadorPublicaciones';

async function inicio() {
  //await procesadorPublicaciones();
  await procesadorColectivos();
}

inicio().catch(console.error);
