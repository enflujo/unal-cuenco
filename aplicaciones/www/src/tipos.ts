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
  indiceActual: number;
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

export type ELementoFicha = { nombre: string; conteo: number; indice: number };

export interface DatosFicha {
  tipo: string;
  titulo: string;
  resumen?: string;
  referencia?: ELementoFicha[];
  id?: ELementoFicha[];
  fuente?: string;
  fechaFin?: ELementoFicha[];
  enlaceFuente?: ELementoFicha[];
  contacto?: ELementoFicha[];
  publicacion?: ELementoFicha[];
  colectivo?: ELementoFicha[];
  dependencias?: ELementoFicha[];
  estados?: ELementoFicha[];
  indicadores?: ELementoFicha[];
  modalidades?: ELementoFicha[];
  sedes?: ELementoFicha[];
  tipos?: ELementoFicha[];
  autores?: ELementoFicha[];
  años?: ELementoFicha[];
  colectivos?: ELementoFicha[];
  publicaciones?: ELementoFicha[];
}
