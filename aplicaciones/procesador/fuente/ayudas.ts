import { writeFileSync } from 'fs';
import colores from 'cli-color';
import { emojify } from 'node-emoji';
import type { DefinicionSimple } from '@/tipos/compartidos';
import { LlavesSede } from './tipos';

export const logError = colores.red.bold;
export const logAviso = colores.bold.xterm(214);
export const logBloque = colores.bgCyan.black;
export const logCyan = colores.cyan.bold;
export const logVerde = colores.greenBright;
export const logNaranjaPulso = colores.xterm(214).blink;

// https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json
export const cadena = emojify(':link:');
export const conector = emojify(':electric_plug:');
export const gorila = emojify(':gorilla:');
export const chulo = emojify(':white_check_mark:');
export const alerta = emojify(':warning:');

export const guardarJSON = (json: any, nombre: string) => {
  writeFileSync(`../www/estaticos/datos/${nombre}.json`, JSON.stringify(json));
};

/**
 * Limpia un texto para borrar espacio al principio y final, le quita cortes de línea como `\n`.
 *
 * @param texto Texto que se quiere limpiar
 * @returns texto procesado
 */
export const limpiarTextoSimple = (texto: string) => {
  return texto.trim().replace(/[\n\r\s\t]+/g, ' ');
};

export function ordenarListaObjetos(lista: any[], llave: string, descendente = false) {
  lista.sort((a, b) => {
    if (a[llave] < b[llave]) return descendente ? -1 : 1;
    else if (a[llave] > b[llave]) return descendente ? 1 : -1;
    return 0;
  });
}

export const normalizar = (texto: string): string => {
  return texto
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const enMinusculas = (texto: string) => texto === texto.toLowerCase();

export function separarPartes(entrada: string, separador?: string) {
  const valores = entrada.trim();
  const partes = separador ? valores.trim().split(separador) : valores.trim().split(',');
  return partes.map((p) => p.trim());
}

export function mensajeExito(mensaje: string) {
  console.log(chulo, logAviso(mensaje));
}

export const esNumero = (valor: string | number): boolean => !isNaN(parseInt(`${valor}`));
export const esFecha = (valor: string) => !isNaN(new Date(valor).getTime());

export const esUrl = (texto: string) => {
  try {
    const url = new URL(texto);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

export const extraerUrls = (texto: string) => {
  const expresion = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/g;
  const urls = texto.match(expresion);
  return urls ? urls : [];
};

export function aplanarDefinicionesASlugs(datos: DefinicionSimple | DefinicionSimple[] | undefined) {
  if (datos) {
    return Array.isArray(datos)
      ? (datos as DefinicionSimple[]).map(({ slug }) => slug)
      : [(datos as DefinicionSimple).slug];
  }

  throw new Error(
    `Los datos no son de tipo DefinicionSimple o DefinicionSimple[], el dato es: ${JSON.stringify(datos)}`
  );
}

export const nombresSedes: { [llave in LlavesSede]: string } = {
  amz: 'Amazonas',
  crb: 'Caribe',
  mzl: 'Manizales',
  orq: 'Orinoquia',
  tmc: 'Tumaco',
  vrt: 'Virtual',
};

export const tematicasEncuentros = [
  'Construcción colaborativa de un Instituto Nacional',
  'Construcción colaborativa misión, visión y objetivos',
  'Conformación espacio colaborativo inter y transdisciplinar',
  'Construcción colaborativa Cuenco y Pilares',
  'Gobernanza',
  'Inclusión',
  'Inclusión, equidad y diversidad',
  'Arte, Ciencias, Humanidades y Tecnologías',
  'Proceso de Creación',
  'Creación y visualización',
];
