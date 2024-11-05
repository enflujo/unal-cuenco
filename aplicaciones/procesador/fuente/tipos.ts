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

export type FilaCaracterizacion = [
  id: number,
  encuentro: string,
  persona: string,
  sedes: string,
  tipoSede: string,
  rol: string,
  cargoArea: string,
];

export type FilaCaracterizacionConteo = [
  id: number,
  encuentro: string,
  personas: string[],
  sedes: { nombre: string; conteo: number }[],
  tipoSede: { nombre: string; conteo: number }[],
  roles: { nombre: string; conteo: number }[],
  cargoAreas: { nombre: string; conteo: number }[],
];
