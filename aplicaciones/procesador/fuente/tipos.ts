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
