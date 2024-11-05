import type {
  Colectivo,
  Indicador,
  ListasColectivos,
  ListasPublicaciones,
  LlavesColectivos,
  LlavesPublicaciones,
  Publicacion,
} from '@/tipos/compartidos';

export type TiposDePagina = 'inicio' | 'colectivos' | 'publicaciones' | 'encuentros';
export type TMinMax = { min: number; max: number; total: number };
export interface CerebroGeneral {
  paginaActual: TiposDePagina;
}
export interface CerebroDatos {
  listaElegida: TiposNodo | null;
  extremosFechasPublicaciones: TMinMax | null;
  // COLECTIVOS
  colectivos: Colectivo[] | null;
  indicadoresColectivos: Indicador[] | null;
  cargandoColectivos: boolean;
  listasColectivos: ListasColectivos | null;
  cargandoListasColectivos: boolean;

  // PUBLICACIONES
  /** Datos de las publicaciones */
  publicaciones: Publicacion[] | null;
  /** Datos de los indicadores de publicaciones */
  indicadoresPublicaciones: Indicador[] | null;
  cargandoPublicaciones: boolean;
  listasPublicaciones: ListasPublicaciones | null;
  cargandoListasPublicaciones: boolean;
}

export interface CerebroFicha {
  fichaVisible: boolean;
  datosFicha: DatosFicha | null;
  idActual: string;
  totalNodos: number;
  llaveLista: TiposNodo;
}

export type TiposDeVistas = 'mapa' | 'grafica';
export type TiposNodo =
  | LlavesColectivos
  | LlavesPublicaciones
  | 'publicaciones'
  | 'colectivos'
  | 'publicacion'
  | 'colectivo'
  | 'referencia'
  | 'fuente'
  | 'fechaFin'
  | 'enlaceFuente'
  | 'contacto';

export type ELementoFicha = { nombre: string; conteo: number; id: string };

export interface DatosFicha {
  id: string;
  tipo: TiposNodo;
  nombreTipo: string;
  titulo: string;
  resumen?: string;
  referencia?: string;
  fuente?: string;
  estados?: ELementoFicha[];
  fechaFin?: string;
  enlaceFuente?: string;
  contacto?: string;
  modalidades?: ELementoFicha[];
  publicacion?: ELementoFicha[];
  colectivo?: ELementoFicha[];
  dependencias?: ELementoFicha[];
  indicadores?: ELementoFicha[];
  sedes?: ELementoFicha[];
  tipos?: ELementoFicha[];
  autores?: ELementoFicha[];
  años?: ELementoFicha[];
  colectivos?: ELementoFicha[];
  publicaciones?: ELementoFicha[];
}
