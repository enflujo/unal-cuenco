export interface ElementoLista {
  nombre: string;
  descripcion?: string;
  slug: string;
  conteo: number;
  relaciones: { tipo: keyof Listas | string; conteo: number; indice: number; slug: string }[];
  publicaciones?: number[];
}

export interface Indicador {
  nombre: string;
  descripcion?: string;
  slug: string;
  subindicadores?: [];
}

export type DefinicionSimple = { nombre: string; slug: string };

// Listas Producción Académica
export type Listas = {
  autores: ElementoLista[];
  años: ElementoLista[];
  tipos: ElementoLista[];
  dependencias: ElementoLista[];
  indicadores: ElementoLista[];
  subindicadores: ElementoLista[];
};
