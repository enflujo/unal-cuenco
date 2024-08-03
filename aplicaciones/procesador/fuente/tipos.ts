// Este archivo debería estar en www, creo, pero no supe cómo importarlo hasta acá

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
  esIndicador?: boolean;
  subindicadores?: [];
}

export type DefinicionSimple = { nombre: string; slug: string };
export type Año = { año: number; valor: string };

export type Listas = {
  autores: ElementoLista[];
  años: ElementoLista[];
  tipos: ElementoLista[];
  dependencias: ElementoLista[];
  indicadores: ElementoLista[];
  subindicadores: ElementoLista[];
};

export type LlavesProdAcademica = 'autores' | 'años' | 'tipos' | 'dependencias' | 'indicadores' | 'subindicadores';

export type Campos = { llave: LlavesProdAcademica; indice: number }[];

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
  subindicadores?: Indicador;
};
