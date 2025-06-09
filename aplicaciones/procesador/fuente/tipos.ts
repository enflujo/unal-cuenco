export interface Errata {
  fila: number;
  error: string;
}

export type FilaProduccionAcademica = [
  /** Nombre de los autores separados por ; y apellido nombre separado por , */
  autores: string | undefined,
  resumen: string,
  años: string,
  tipos: string,
  titulo: string,
  referencia: string,
  informacionDe: string,
  fuente: string,
  dependencia: string,
  sedeAutor: string,
  sedePrograma: string,
  indicador: string,
  subindicador: string,
];

export type FilaCategoriasEncuentro = [categoria: string, conteo: number, definicion: string];

export type FilaColectivos = [
  nombre: string,
  tipos: string,
  descripcion: string,
  /** Todos deben ser 2024 si está activo actualmente */
  estado: string,
  /** Estado inactivo, ¿? */
  años: string,
  fuente: string,
  enlaceFuente: string,
  responsables: string,
  contacto: string,
  contactoColectivo: string,
  sede: string,
  dependencia: string,
  modalidad: string,
  indicador: string,
  subindicador: string,
];

export type FilaCaracterizacion = [
  id: string,
  encuentro: string,
  persona: string,
  lugar: string,
  sede: string,
  rol: string,
  cargoArea: string,
  codigo: string,
];

export type FilaEncuentro = [
  codigo: number,
  numeroEncuentro: number,
  sede: string,
  dia: number,
  tecnica: string,
  tematica: string,
  categoria: string,
  fragmento: string,
  participantes: string,
];

export  type LlavesSede = 'amz' | 'crb' | 'mzl' | 'orq' | 'tmc' | 'vrt';