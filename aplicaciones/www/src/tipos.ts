import type { Colectivo, ListasColectivos, ListasPublicaciones, LlavesColectivos, LlavesPA } from '@/tipos/compartidos';

export type TiposDePagina = 'colectivos' | 'publicaciones' | 'encuentros';
export interface Cerebro {
  publicacionElegida: number | null;
  colectivoElegido: number | null;
  listaElegida: LlavesColectivos | LlavesPA | null;
  listasPublicaciones: ListasPublicaciones | null;
  cargandoListasPublicaciones: boolean;
  listasColectivos: ListasColectivos | null;
  cargandoListasColectivos: boolean;
  colectivos: Colectivo[] | null;
  cargandoColectivos: boolean;
}

export type TiposDeVistas = 'mapa' | 'grafica';
