import type {
  Colectivo,
  Indicador,
  ListasColectivos,
  ListasPublicaciones,
  LlavesColectivos,
  LlavesPA,
} from '@/tipos/compartidos';

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
  indicadoresColectivos: Indicador[] | null;
  cargandoColectivos: boolean;

  // PUBLICACIONES
  /** Datos de las publicaciones */
  publicaciones: Colectivo[] | null;
  /** Datos de los indicadores de publicaciones */
  indicadoresPublicaciones: Indicador[] | null;
  cargandoPublicaciones: boolean;
}

export type TiposDeVistas = 'mapa' | 'grafica';
