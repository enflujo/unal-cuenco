import type { Position } from 'geojson';
export interface ElementoLista {
  id: string;
  nombre: string;
  descripcion?: string;
  slug: string;
  coordenadas?: Position;
  conteo: number;
  relaciones?: Relacion[];
  publicaciones?: string[];
  colectivos?: string[];
  encuentrosCaracterizacion?: string[];
  encuentros?: string[];
  color?: string;
}

export interface Relacion {
  tipo: keyof ListasPublicaciones | keyof ListasColectivos | keyof ListasCaracterizacion | keyof ListasEncuentros;
  conteo: number;
  id: string;
}

export interface Indicador {
  id: number;
  nombre: string;
  slug: string;
  definicion?: string;
}

export interface Subindicador {
  id: number;
  nombre: string;
  slug: string;
  indicadorMadre: number;
}

export type DefinicionSimple = { nombre: string; slug: string };

export type LlavesPublicaciones = 'autores' | 'años' | 'tipos' | 'dependencias' | 'indicadores';
export type LlavesColectivos = 'tipos' | 'estados' | 'sedes' | 'dependencias' | 'modalidades' | 'indicadores';
export type LlavesCaracterizacion = 'sedes' | 'tiposSede' | 'roles' | 'cargos';
export type LlavesEncuentro = 'id' | 'numero' | 'cargos' | 'sedes' | 'tiposSede' | 'roles' | 'sedes';
export type LlavesEncuentros =
  | 'sedes'
  | 'tecnicas'
  | 'categorias'
  | 'tematicas'
  | 'participantes'
  | 'indicadores'
  | 'tipos';

export type ListasPublicaciones = {
  [llave in LlavesPublicaciones]: ElementoLista[];
};
export type ListasColectivos = {
  [llave in LlavesColectivos]: ElementoLista[];
};

export type ListasEncuentros = {
  [llave in LlavesEncuentros]: ElementoLista[];
};

export type ListasCaracterizacion = {
  [llave in LlavesCaracterizacion]: ElementoLista[];
};

export type CamposPA = { llave: LlavesPublicaciones; id: string }[];
export type CamposColectivos = { llave: LlavesColectivos; id: string }[];

export interface DatosGeneralesNodo {
  id: string;
  titulo: DefinicionSimple;
  resumen?: string;
  tipos?: DefinicionSimple;
  fuente?: string;
  indicadores?: DefinicionSimple;
  dependencias?: DefinicionSimple[];
}

export interface Publicacion extends DatosGeneralesNodo {
  autores?: DefinicionSimple[];
  años?: DefinicionSimple;
  referencia?: string;
}

export interface Colectivo extends DatosGeneralesNodo {
  estados?: DefinicionSimple;
  fechaFin?: number;
  enlaceFuente?: string[];
  contacto?: string;
  sedes?: DefinicionSimple[];
  modalidades?: DefinicionSimple;
}

export interface PersonaCaracterizacion {
  iniciales: string;
  sede: string;
  tipoSede: string;
  rol: string;
  cargoArea: string;
}

export interface EncuentroCaracterizacion {
  id: string;
  numero?: string;
  personas?: PersonaCaracterizacion[];
  sedes?: DefinicionSimple[];
  tiposSede?: DefinicionSimple[];
  roles?: DefinicionSimple[];
  cargos?: DefinicionSimple[];
}

export interface EncuentroCaracterizacionConteo {
  id: string;
  numero?: string;
  personas?: PersonaCaracterizacion[];
  sedes?: { slug: string; conteo: number; nombre: string }[];
  tiposSede?: { slug: string; conteo: number; nombre: string }[];
  roles?: { slug: string; conteo: number; nombre: string }[];
  cargos?: { slug: string; conteo: number; nombre: string }[];
}

export interface OpcionBuscadorDatos {
  nombre: string;
  tipo: string;
  id: string;
  vista: 'publicaciones' | 'colectivos' | 'encuentros';
}

export interface DefinicionConFragmentos extends DefinicionSimple {
  idFragmento: string[];
}

export interface Encuentro {
  id: string;
  sedes?: DefinicionSimple;
  tecnicas?: DefinicionSimple;
  categorias?: DefinicionConFragmentos[];
  tematicas?: DefinicionConFragmentos[];
  fragmentos: { id: string; fragmento: string }[];
  participantes?: DefinicionConFragmentos[];
  indicadores?: DefinicionConFragmentos[];
  tipos?: DefinicionConFragmentos[];
}
