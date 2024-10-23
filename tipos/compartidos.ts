export interface ElementoLista {
  nombre: string;
  descripcion?: string;
  slug: string;
  conteo: number;
  relaciones?: {
    tipo: keyof ListasPublicaciones | keyof ListasColectivos | string;
    conteo: number;
    indice: number;
    slug: string;
  }[];
  publicaciones?: number[];
}

export interface ElementoListaIndicadores extends ElementoLista {
  //subindicadores: ElementoLista[];
}

export interface Indicador {
  id: number;
  nombre: string;
  slug: string;
  definicion?: string;
  subindicadores?: number[];
}

export interface Subindicador {
  id: number;
  nombre: string;
  slug: string;
  indicadorMadre: number;
}

export type DefinicionSimple = { nombre: string; slug: string };
export type Año = { año: number; valor: string };

/* export type ListasColectivos = {
  años: ElementoLista[];
  estados: ElementoLista[];
  tipos: ElementoLista[];
  responsables: ElementoLista[];
  sedes: ElementoLista[];
  dependencias: ElementoLista[];
  modalidades: ElementoLista[];
  indicadores: ElementoListaIndicadores[];
  subindicadores: ElementoLista[];
}; */

export type LlavesPA = 'autores' | 'años' | 'tipos' | 'dependencias' | 'indicadores' | 'subindicadores';

export type ListasPublicaciones = {
  [llave in LlavesPA]: ElementoLista[];
};

export type LlavesColectivos =
  | 'tipos'
  | 'años'
  | 'estados'
  | 'sedes'
  | 'dependencias'
  | 'modalidades'
  | 'indicadores'
  | 'subindicadores';

export type ListasColectivos = {
  [llave in LlavesColectivos]: ElementoLista[];
};

export type CamposPA = { llave: LlavesPA; indice: number }[];
export type CamposColectivos = { llave: LlavesColectivos; indice: number }[];

export type Publicacion = {
  id: number;
  titulo: DefinicionSimple;
  resumen?: string;
  autores?: DefinicionSimple[];
  años?: number;
  tipos?: DefinicionSimple;
  referencia?: string;
  fuente?: string;
  dependencias?: DefinicionSimple;
  indicadores?: Indicador;
  subindicadores?: Subindicador;
};

// POR HACER: Completar
export type Colectivo = {
  id: number;
  nombre: string;
  tipos?: DefinicionSimple;
  descripcion?: string;
  años?: Año;
  estados?: string;
  fuente?: string;
  enlaceFuente?: string[];
  responsables?: DefinicionSimple;
  contacto?: string;
  sedes?: DefinicionSimple[];
  dependencias?: DefinicionSimple;
  modalidades?: DefinicionSimple;
  indicadores?: Indicador;
  subindicadores?: Subindicador;
};
