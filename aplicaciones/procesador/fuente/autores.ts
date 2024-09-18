import slugificar from 'slug';
import type { DefinicionSimple, ElementoLista } from '@/tipos/compartidos';

//import { separarPartes } from './ayudas.js';

export function procesarNombresAutores(
  apellidoNombreSinProcesar: string,
  nombrePublicacion: string,
  numeroFila: number,
  listaAutores: ElementoLista[]
) {
  const respuesta: DefinicionSimple[] = [];
  const autores: { nombre: string; slug: string; nombreCompleto?: string }[] = [];
}
