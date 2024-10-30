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
  fuente: string,
  dependencia: string,
  indicador: string,
  subindicador: string,
];
