import type {
  Colectivo,
  Indicador,
  ListasColectivos,
  ListasPublicaciones,
  LlavesColectivos,
  LlavesPublicaciones,
} from '@/tipos/compartidos';

export type TiposDePagina = 'inicio' | 'colectivos' | 'publicaciones' | 'encuentros';

export interface CerebroGeneral {
  paginaActual: TiposDePagina;
}
export interface CerebroDatos {
  listaElegida: LlavesColectivos | LlavesPublicaciones | null;
  // COLECTIVOS
  colectivos: Colectivo[] | null;
  indicadoresColectivos: Indicador[] | null;
  cargandoColectivos: boolean;
  listasColectivos: ListasColectivos | null;
  cargandoListasColectivos: boolean;

  // PUBLICACIONES
  /** Datos de las publicaciones */
  publicaciones: Colectivo[] | null;
  /** Datos de los indicadores de publicaciones */
  indicadoresPublicaciones: Indicador[] | null;
  cargandoPublicaciones: boolean;
  listasPublicaciones: ListasPublicaciones | null;
  cargandoListasPublicaciones: boolean;
}

export interface CerebroFicha {
  fichaVisible: boolean;
  datosFicha: DatosFicha | null;
  indiceActual: number;
  totalNodos: number;
  llaveLista: LlavesColectivos | LlavesPublicaciones;
}

export type TiposDeVistas = 'mapa' | 'grafica';

export type ELementoFicha = { nombre: string; conteo: number; indice: number };

export interface DatosFicha {
  tipo: string;
  titulo: string;
  resumen?: string;
  dependencias?: ELementoFicha[];
  estados?: ELementoFicha[];
  indicadores?: ELementoFicha[];
  modalidades?: ELementoFicha[];
  sedes?: ELementoFicha[];
  tipos?: ELementoFicha[];
  autores?: ELementoFicha[];
  años?: ELementoFicha[];
}
