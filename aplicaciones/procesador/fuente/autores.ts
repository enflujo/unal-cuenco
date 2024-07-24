import slugificar from 'slug';
import { separarPartes } from './ayudas.js';
import { DefinicionSimple, ElementoLista } from '../../www/src/tipos';

export function procesarNombresAutores(
  apellidoNombreSinProcesar: string,
  nombrePublicacion: string,
  numeroFila: number,
  listaAutores: ElementoLista[]
) {
  const respuesta: DefinicionSimple[] = [];
  const autores: { nombre: string; slug: string; nombreCompleto?: string }[] = [];
}
