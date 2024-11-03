export interface ElementoLista {
  id: string;
  nombre: string;
  descripcion?: string;
  slug: string;
  conteo: number;
  relaciones: {
    tipo: keyof ListasPublicaciones | keyof ListasColectivos;
    conteo: number;
    id: string;
  }[];
  publicaciones?: string[];
  colectivos?: string[];
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
