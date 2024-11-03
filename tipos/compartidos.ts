export interface ElementoLista {
  nombre: string;
  descripcion?: string;
  slug: string;
  conteo: number;
  relaciones: {
    tipo: keyof ListasPublicaciones | keyof ListasColectivos;
    conteo: number;
    indice: number;
  }[];
  publicaciones?: number[];
  colectivos?: number[];
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

export type ListasPublicaciones = {
  [llave in LlavesPublicaciones]: ElementoLista[];
};
export type ListasColectivos = {
  [llave in LlavesColectivos]: ElementoLista[];
};

export type CamposPA = { llave: LlavesPublicaciones; indice: number }[];
export type CamposColectivos = { llave: LlavesColectivos; indice: number }[];

export interface DatosGeneralesNodo {
  id: number;
  titulo: DefinicionSimple;
  resumen?: string;
  tipos?: DefinicionSimple;
  fuente?: string;
  indicadores?: DefinicionSimple;
}

export interface Publicacion extends DatosGeneralesNodo {
  autores?: DefinicionSimple[];
  años?: DefinicionSimple;
  referencia?: string;
  dependencias?: DefinicionSimple[];
}

export interface Colectivo extends DatosGeneralesNodo {
  estados?: DefinicionSimple;
  fechaFin?: number;
  enlaceFuente?: string[];
  contacto?: string;
  sedes?: DefinicionSimple[];
  dependencias?: DefinicionSimple;
  modalidades?: DefinicionSimple;
}
