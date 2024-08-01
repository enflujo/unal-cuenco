import slugificar from 'slug';
//import { separarPartes } from './ayudas.js';
import { DefinicionSimple, ElementoLista } from 'tipos.js';

export function procesarNombresAutores(
  apellidoNombreSinProcesar: string,
  nombrePublicacion: string,
  numeroFila: number,
  listaAutores: ElementoLista[]
) {
  const respuesta: DefinicionSimple[] = [];
  const autores: { nombre: string; slug: string; nombreCompleto?: string }[] = [];
}
