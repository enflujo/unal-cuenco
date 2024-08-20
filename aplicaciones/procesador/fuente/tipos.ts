// Este archivo debería estar en www, creo, pero no supe cómo importarlo hasta acá

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
  descripcion?: string;
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

export type ListasPublicaciones = {
  autores: ElementoLista[];
  años: ElementoLista[];
  tipos: ElementoLista[];
  dependencias: ElementoLista[];
  indicadores: ElementoListaIndicadores[];
  subindicadores: ElementoLista[];
};

export type ListasColectivos = {
  años: ElementoLista[];
  estados: ElementoLista[];
  tipos: ElementoLista[];
  responsables: ElementoLista[];
  sedes: ElementoLista[];
  dependencias: ElementoLista[];
  modalidades: ElementoLista[];
  indicadores: ElementoListaIndicadores[];
  subindicadores: ElementoLista[];
};

export type LlavesPA = 'autores' | 'años' | 'tipos' | 'dependencias' | 'indicadores' | 'subindicadores';
export type LlavesColectivos =
  | 'responsables'
  | 'tipos'
  | 'años'
  | 'sedes'
  | 'dependencias'
  | 'modalidades'
  | 'indicadores'
  | 'subindicadores';

export type CamposPA = { llave: LlavesPA; indice: number }[];
export type CamposColectivos = { llave: LlavesColectivos; indice: number }[];

export type Publicacion = {
  id: number;
  titulo: DefinicionSimple;
  resumen?: string;
  autores?: DefinicionSimple[];
  años?: Año;
  tipos?: DefinicionSimple;
  referencia?: string;
  fuente?: string;
  dependencias?: DefinicionSimple;
  indicadores?: Indicador;
  subindicadores?: Subindicador;
};

// POR HACER: Completar
export type Colectivo = {
  nombre: DefinicionSimple;
  tipos?: DefinicionSimple;
  descripcion?: string;
  años?: Año;
  estados?: string;
  fuente?: string;
  enlaceFuente?: string;
  responsables?: DefinicionSimple;
  contacto?: string;
  sedes?: DefinicionSimple;
  dependencias?: DefinicionSimple;
  modalidades?: DefinicionSimple;
  indicadores?: Indicador;
  subindicadores?: Subindicador;
};
