import { ElementoLista } from '@/tipos/compartidos';

export async function pedirDatos<Esquema>(ruta: string) {
  const peticion = await fetch(`${import.meta.env.BASE_URL}${ruta}`).then((res) => res.json());

  if (peticion.errors) {
    throw new Error(JSON.stringify(peticion.errors, null, 2));
  }

  return peticion as Esquema;
}

export const extraerUrls = (texto: string) => {
  const expresion = /(?:https?:\/\/.)[^\s/$.?#].[^\s]*/g;
  const urls = texto.match(expresion);
  return urls ? urls : [];
};

export const crearUrlsEnTexto = (texto?: string) => {
  if (!texto) return '';

  const urls = extraerUrls(texto);
  let textoProcesado = texto;

  if (urls.length) {
    urls.forEach((url) => {
      textoProcesado = textoProcesado.replace(
        url,
        `<a class="enlace externo" href="${url}" target="_blank">${url}</a>`
      );
    });
  }

  return textoProcesado;
};

export const redondearDecimal = (num: number): number => +(Math.round(+(num + 'e+2')) + 'e-2');

export function ordenarRapido(lista: ElementoLista[], posIzq: number, posDer: number, largoLista: number) {
  let posicionIzqInicial = posIzq;
  let posicionDerInicial = posDer;
  let direccion = true;
  let pivote = posDer;
  while (posIzq - posDer < 0) {
    if (direccion) {
      if (lista[pivote].conteo > lista[posIzq].conteo) {
        ordenarRapido.intercambiar(lista, pivote, posIzq);
        pivote = posIzq;
        posDer--;
        direccion = !direccion;
      } else posIzq++;
    } else {
      if (lista[pivote].conteo >= lista[posDer].conteo) {
        posDer--;
      } else {
        ordenarRapido.intercambiar(lista, pivote, posDer);
        posIzq++;
        pivote = posDer;
        direccion = !direccion;
      }
    }
  }
  if (pivote - 1 > posicionIzqInicial) {
    ordenarRapido(lista, posicionIzqInicial, pivote - 1, largoLista);
  }
  if (pivote + 1 < posicionDerInicial) {
    ordenarRapido(lista, pivote + 1, posicionDerInicial, largoLista);
  }
}
ordenarRapido.intercambiar = (lista: ElementoLista[], el1: number, el2: number) => {
  let elemCambiado = lista[el1];
  lista[el1] = lista[el2];
  lista[el2] = elemCambiado;
};

export function primeraMayuscula(texto: string | undefined) {
  return String(texto).charAt(0).toUpperCase() + String(texto).slice(1);
}
