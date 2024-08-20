import { writeFileSync } from 'fs';
import colores from 'cli-color';
import { emojify } from 'node-emoji';
import { ElementoLista } from 'tipos';
import slugificar from 'slug';

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

export const guardarJSON = (json: any, nombre: string) => {
  writeFileSync(`../www/estaticos/datos/${nombre}.json`, JSON.stringify(json));
};

export function procesarLista(valor: string, lista: ElementoLista[]) {
  if (!valor) return;
  const slug = valor ? slugificar(`${valor}`) : '';
  const existe = lista.find((obj) => obj.slug === slug);
  if (!valor || valor === 'No aplica' || valor === 'undefined' || valor === 'Sin Información' || valor === '(s.f)')
    return;
  const nombre = `${valor}`.trim();

  if (!existe) {
    const objeto: ElementoLista = {
      nombre: nombre,
      conteo: 1,
      slug: slug,
      relaciones: [],
      publicaciones: [],
    };
    lista.push(objeto);
  } else {
    existe.conteo++;
  }
}

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
