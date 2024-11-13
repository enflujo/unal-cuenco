<script setup lang="ts">
import { onMounted, onUnmounted, type Ref, ref } from 'vue';

import fuzzysort from 'fuzzysort';
import { pedirDatos } from '@/utilidades/ayudas';
import { OpcionBuscadorDatos } from '@/tipos/compartidos';
import { nombresListas } from '@/utilidades/constantes';
import type { TiposNodo } from '@/tipos';
import { usarCerebroFicha } from '@/cerebros/ficha';
import { usarCerebroGeneral } from '@/cerebros/general';
import { useRouter } from 'vue-router';

const contenedorBuscador = ref<HTMLDivElement | null>(null);
const buscador: Ref<HTMLInputElement | null> = ref(null);
const botonBuscador: Ref<HTMLDivElement | null> = ref(null);
const sugerencias: Ref<HTMLDataListElement | null> = ref(null);
const resultados: Ref<{ [llave: string]: OpcionBuscadorDatos[] }> = ref({});
const sinResultadosPara = ref('');
const datos = ref<OpcionBuscadorDatos[]>([]);
const textoBusqueda = ref('');
const visible = ref(false);
const cerebroFicha = usarCerebroFicha();
const cerebroGeneral = usarCerebroGeneral();
const enrutador = useRouter();

onMounted(async () => {
  const respuesta = await pedirDatos<OpcionBuscadorDatos[]>('datos/buscador.json');
  if (!respuesta) return;

  document.body.addEventListener('click', clicFuera);

  datos.value = respuesta;

  if (botonBuscador.value) {
    botonBuscador.value.onclick = () => {
      if (!sugerencias.value || !buscador.value) return;
      visible.value = !visible.value;

      if (visible.value) {
        buscador.value.classList.add('visibleCelular');
      } else {
        buscador.value.classList.remove('visibleCelular');
      }
    };
  }

  if (buscador.value) {
    buscador.value.addEventListener('input', buscar);
    buscador.value.addEventListener('focusin', enModoBusqueda);
  }
});

onUnmounted(() => {
  document.body.removeEventListener('click', clicFuera);
  if (buscador.value) {
    buscador.value.removeEventListener('input', buscar);
    buscador.value.removeEventListener('focusin', enModoBusqueda);
  }
});

function buscar() {
  if (!buscador.value || !sugerencias.value) return;
  const texto = buscador.value.value.trim();
  sinResultadosPara.value = '';
  resultados.value = {};

  if (!texto || !texto.length) {
    visible.value = false;
    return;
  }

  const busqueda = fuzzysort.go<OpcionBuscadorDatos>(texto, datos.value, {
    key: 'nombre',
    threshold: 0.4,
    limit: 100,
  });

  if (busqueda.total > 0) {
    busqueda.forEach((resultado) => {
      const { tipo } = resultado.obj;

      if (!resultados.value[tipo]) resultados.value[tipo] = [];
      resultados.value[tipo].push(resultado.obj);
    });

    textoBusqueda.value = texto;
  } else {
    sinResultadosPara.value = texto;
  }

  visible.value = true;
}

function clicFuera(evento: MouseEvent) {
  evento.stopPropagation();
  if (!contenedorBuscador.value || !sugerencias.value) return;
  const elemento = evento.target as HTMLElement;
  if (!(contenedorBuscador.value === elemento || contenedorBuscador.value.contains(elemento))) {
    if (visible.value) {
      visible.value = false;
    }
  }
}

function enModoBusqueda() {
  if (buscador.value && buscador.value.value && sugerencias.value) {
    const texto = buscador.value.value.trim();
    if (texto && texto.length) sugerencias.value.classList.add('visible');
  }
}

function resaltarCoincidencia(texto: string) {
  const regex = new RegExp(`(${textoBusqueda.value})`, 'gi');
  return texto.replace(regex, (match) => `<span class="resaltado">${match}</span>`);
}

async function abrirElemento(evento: MouseEvent, resultado: OpcionBuscadorDatos) {
  evento.stopPropagation();
  // Navegar a página correspondiente si es diferente a la actual
  if (cerebroGeneral.paginaActual !== resultado.vista) {
    const navegacionDetenida = await enrutador.push({ path: `/${resultado.vista}` });
    if (navegacionDetenida) return;
  }

  cerebroFicha.seleccionarNodo(resultado.id, resultado.tipo as TiposNodo);
}
</script>

<template>
  <div id="contenedorBuscador" ref="contenedorBuscador">
    <img id="botonBuscador" ref="botonBuscador" src="/lupa.svg" alt="Buscador" />
    <input id="buscador" ref="buscador" type="search" placeholder="Buscar" />

    <div id="sugerencias" ref="sugerencias" :class="{ visible }">
      <div v-for="(resultados, llave) in resultados" class="cajaBuscador">
        <h4>{{ nombresListas[llave as TiposNodo] }}</h4>
        <ul class="subLista">
          <li
            v-for="resultado in resultados"
            v-html="resaltarCoincidencia(resultado.nombre)"
            @click="abrirElemento($event, resultado)"
            class="enlace"
          ></li>
        </ul>
      </div>

      <span id="sinResultados" :class="{ visible: sinResultadosPara.length }">
        No hay resultados para la busqueda:
        <span class="sinResultadoPara" ref="sinResultadoPara">{{ sinResultadosPara }}</span>
      </span>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/scss/constantes' as *;

#contenedorBuscador {
  z-index: 99;
  position: relative;
  background-color: var(--azulOscuroCuenco);
  display: flex;
  align-items: center;
  height: $altoMenuPantalla - 30px;
  margin: 10px 0 0 0;
  z-index: 9;
}

#botonBuscador {
  height: 18px;
  cursor: pointer;
  filter: invert(1);
  z-index: 2;
  padding: 0 0.3em;
}

#buscador {
  outline: none;
  border: none;
  padding: 0.5em;
  background-color: var(--azulOscuroCuenco);
  color: white;
  font-size: 0.85em;
  transition: all 0.25s ease-in-out;
  width: 30vw;
  z-index: 4;
  position: absolute;
  top: calc($altoMenuPantalla + 0.5em);
  left: 100vw;
  z-index: 1;

  &:focus {
    background-color: var(--verdeCuenco);
    color: black;

    &::placeholder {
      color: rgba(54, 43, 43, 0.452);
    }
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.959);
  }

  &.visibleCelular {
    top: 55px;
    color: black;
    left: 10px;
    width: 95%;
  }
}

#sinResultados {
  font-size: 1.6em;
  text-align: center;
  display: none;
  color: white;
  width: 100%;

  &.visible {
    display: block;
  }

  .sinResultadoPara {
    font-weight: bold;
  }
}

#sugerencias {
  @include gradienteAzulCircular;
  position: fixed;
  left: 50%;
  transform: translateX(200%);
  top: $altoMenuPantalla;
  padding: 3em 1.5em 1.5em 1.5em;
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  height: calc(100vh - $altoMenuPantalla - $altoLinea);
  text-transform: none;
  transition: transform 0.2s ease-out;

  &.visible {
    transform: translateX(-50%);
  }

  .resaltado {
    background-color: #f7e9b76e;
  }

  .cajaBuscador {
    width: 33%;
    border: 1px solid var(--fondoVerdeOscuro);
    color: white;
    // display: none;
    flex-direction: column;

    h4 {
      margin: 0;
      background-color: var(--fondoVerdeOscuro);
      padding: 0.6em 1em;
      font-size: 1.1em;
    }

    .subLista {
      padding: 0.6em 1em;
    }

    &.visible {
      display: flex;
    }
  }
}

.resultadoBusqueda {
  color: var(--textoOscuro);
  cursor: pointer;
  font-size: 1.2em;
  padding: 0.2em 0.4em;

  &:hover {
    background-color: var(--magenta);
    color: var(--textoClaro);
  }
}

// Cambiar estilos según tamaño de pantalla
@media screen and (min-width: $minCelular) {
  #buscador {
    width: 150px;
    display: block;
    position: relative;
    left: 0;
    top: 0;

    &.visibleCelular {
      top: 0;
    }
  }

  // #botonBuscador {
  //   display: none;
  // }
  #sugerencias {
    left: 50%;
    padding: 1.8em 1.5em 1.5em 2em;
    width: 80vw;
  }
}
</style>
