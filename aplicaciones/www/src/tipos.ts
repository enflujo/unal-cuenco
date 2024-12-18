import type {
  Colectivo,
  Indicador,
  ListasColectivos,
  ListasPublicaciones,
  LlavesColectivos,
  LlavesPublicaciones,
  Publicacion,
  ListasCaracterizacion,
  EncuentroCaracterizacionConteo,
} from '@/tipos/compartidos';
import type { FeatureCollection, Point } from 'geojson';

export type TiposDePagina = 'inicio' | 'colectivos' | 'publicaciones' | 'encuentros' | 'creditos';
export type TMinMax = { min: number; max: number; total: number };
export interface CerebroGeneral {
  paginaActual: TiposDePagina;
  vistaColectivos: TiposDeVistas;
  fragmentoDonaElegido: string;
}

export type PropiedadesGeoColectivos = {
  id: string;
  conteo: number;
  nombre: string;
};

export type GeoColectivos = FeatureCollection<Point, PropiedadesGeoColectivos>;

export interface CerebroDatos {
  listaElegida: LlavesColectivos | LlavesPublicaciones | null;
  extremosFechasPublicaciones: TMinMax | null;
  // COLECTIVOS
  colectivos: Colectivo[] | null;
  indicadoresColectivos: Indicador[] | null;
  cargandoColectivos: boolean;
  listasColectivos: ListasColectivos | null;
  listasColectivosOrdenadas: ListasColectivos | null;
  cargandoListasColectivos: boolean;
  geoColectivos: GeoColectivos | null;

  // PUBLICACIONES
  /** Datos de las publicaciones */
  publicaciones: Publicacion[] | null;
  /** Datos de los indicadores de publicaciones */
  indicadoresPublicaciones: Indicador[] | null;
  cargandoPublicaciones: boolean;
  listasPublicaciones: ListasPublicaciones | null;
  listasPublicacionesOrdenadas: ListasPublicaciones | null;
  cargandoListasPublicaciones: boolean;

  // ENCUENTROS
  encuentrosCaracterizacionConteo: EncuentroCaracterizacionConteo[] | null;
  cargandoEncuentroCaracterizacion: boolean;
  listasCaracterizacion: ListasCaracterizacion | null;
  cargandoCaracterizacionConteo: boolean;
}

export interface CerebroFicha {
  fichaVisible: boolean;
  datosFicha: DatosFicha | null;
  idActual: string;
  totalNodos: number;
  llaveLista: TiposNodo;
}

export type TiposDeVistas = 'mapa' | 'graficas';
export type TiposNodo = LlavesColectivos | LlavesPublicaciones | 'publicaciones' | 'colectivos';
export type TiposNodoSinRelaciones = 'referencia' | 'fuente' | 'fechaFin' | 'enlaceFuente' | 'contacto';
export type ELementoFicha = { nombre: string; conteo: number; id: string; color: string };

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
  dependencias?: ELementoFicha[];
  indicadores?: ELementoFicha[];
  sedes?: ELementoFicha[];
  tipos?: ELementoFicha[];
  tiposSede?: ELementoFicha[];
  roles?: ELementoFicha[];
  cargos?: ELementoFicha[];
  autores?: ELementoFicha[];
  años?: ELementoFicha[];
  colectivos?: ELementoFicha[];
  publicaciones?: ELementoFicha[];
  tecnicas?: ELementoFicha[];
  categorias?: ELementoFicha[];
  tematicas?: ELementoFicha[];
  fragmento?: string;
  participantes?: ELementoFicha[];
}

export interface IDona {
  nombre: string;
  valor: number;
  porcentaje: number;
  color: string;
}

export interface DonaProcesada extends IDona {
  ajuste: number;
  anguloFinal: number;
}
