export async function pedirDatos<Esquema>(ruta: string) {
  const peticion = await fetch(`${import.meta.env.BASE_URL}${ruta}`).then((res) => res.json());

  if (peticion.errors) {
    throw new Error(JSON.stringify(peticion.errors, null, 2));
  }

  return peticion as Esquema;
}

export const extraerUrls = (texto: string) => {
  const expresion = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/g;
  const urls = texto.match(expresion);
  return urls ? urls : [];
};

export const crearUrlsEnTexto = (texto?: string) => {
  if (!texto) return '';

  const urls = extraerUrls(texto);
  let textoProcesado = '';

  if (urls.length) {
    urls.forEach((url) => {
      textoProcesado = texto.replace(url, `<a class="enlace" href="${url}" target="_blank">${url}</a>`);
    });
  } else {
    textoProcesado = texto;
  }

  return textoProcesado;
};
