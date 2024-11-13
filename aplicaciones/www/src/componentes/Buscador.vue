<script setup lang="ts">
import { onMounted, type Ref, ref } from 'vue';

import fuzzysort from 'fuzzysort';
import { pedirDatos } from '@/utilidades/ayudas';
import { OpcionBuscadorDatos } from '@/tipos/compartidos';
import { nombresListas } from '@/utilidades/constantes';
import type { TiposNodo } from '@/tipos';
// import { opcionesBuscador } from '@/utilidades/cerebro';

const buscador: Ref<HTMLInputElement | null> = ref(null);
const botonBuscador: Ref<HTMLDivElement | null> = ref(null);
const sugerencias: Ref<HTMLDataListElement | null> = ref(null);
const resultados: { [llave: string]: Fuzzysort.Result[] | null } = {
  publicaciones: null,
  colectivos: null,
  autores: null,
  tipos: null,
  años: null,
  dependencias: null,
  indicadores: null,
  sedes: null,
  modalidades: null,
  estado: null,
};
// const cajas = sugerencias.querySelectorAll<HTMLDivElement>('.cajaBuscador');
// const sinResultados = document.getElementById('sinResultados') as HTMLSpanElement;
const sinResultadosPara = ref('');
const listas = Object.keys(nombresListas);

interface ListasBuscador {
  tipo: string;
  puntaje: number;
  elementos: HTMLSpanElement[];
}

const datos = ref<OpcionBuscadorDatos[]>([]);
onMounted(async () => {
  const respuesta = await pedirDatos<OpcionBuscadorDatos[]>('datos/buscador.json');
  if (!respuesta) return;

  datos.value = respuesta;

  if (botonBuscador.value) {
    botonBuscador.value.onclick = () => {
      if (!sugerencias.value || !buscador.value) return;
      sugerencias.value.classList.toggle('visible');

      if (sugerencias.value.classList.contains('visible')) {
        buscador.value.classList.add('visibleCelular');
      } else {
        buscador.value.classList.remove('visibleCelular');
      }
    };
  }

  if (buscador.value) {
    buscador.value.oninput = buscar;
    buscador.value.addEventListener('focusin', (evento) => {
      console.log(evento, evento.target);
      if (buscador.value && sugerencias.value) {
        const texto = buscador.value.value.trim();
        if (texto && texto.length) sugerencias.value.classList.add('visible');
      }
    });
  }

  function buscar() {
    console.log('buscar');
    if (!buscador.value || !sugerencias.value) return;
    const texto = buscador.value.value.trim();
    console.log(texto);
    sinResultadosPara.value = '';
    // cajas.forEach((caja) => caja.classList.remove('visible'));

    // if (!texto || !texto.length) {
    //   sugerencias.classList.remove('visible');
    //   buscador.classList.remove('visibleCelular');
    //   return;
    // }

    const busqueda = fuzzysort.go<OpcionBuscadorDatos>(texto, respuesta, {
      key: 'nombre',
      threshold: -1000,
      limit: 100,
    });

    if (busqueda.total > 0) {
      console.log(busqueda);
      busqueda.forEach((resultado) => {
        const { tipo } = resultado.obj;

        if (!resultados[tipo]) resultados[tipo] = [];

        resultados[tipo].push(resultado);

        console.log();
      });
      // sugerencias.classList.add('visible');

      // const resultadoEnListas = busqueda.reduce((listas: ListasBuscador[], actual) => {
      //   const llave = actual.obj.tipo;
      //   const enLista = listas.find((lista: ListasBuscador) => lista.tipo === llave);

      //   if (!enLista) {
      //     listas.push({ puntaje: actual.score, tipo: llave, elementos: [actual.obj.opcion] });
      //   } else {
      //     if (enLista.puntaje < actual.score) enLista.puntaje = actual.score;
      //     enLista.elementos.push(actual.obj.opcion);
      //   }

      //   return listas;
      // }, []);

      // resultadoEnListas.forEach((obj) => {
      //   const contenedor = document.getElementById(`caja-${obj.tipo}`) as HTMLDivElement;
      //   const ul = contenedor.querySelector<HTMLUListElement>('.subLista') as HTMLUListElement;
      //   sugerencias.insertBefore(contenedor, sugerencias.lastChild);
      //   ul.innerHTML = '';
      //   contenedor.classList.add('visible');

      //   obj.elementos.forEach((elemento) => ul.appendChild(elemento));
      // });
    } else {
      sinResultadosPara.value = texto;
    }
  }
});

// opcionesBuscador.subscribe((opciones) => {
// if (!opciones) return;

// });

// import type { Listas } from '@/tipos';
// import { nombresListasEgresados, nombresListasProyectos } from '@/utilidades/cerebro';
// const listas = { ...nombresListasProyectos, ...nombresListasEgresados };
</script>

<template>
  <div id="contenedorBuscador">
    <img id="botonBuscador" ref="botonBuscador" src="/lupa.svg" alt="Buscador" />
    <input id="buscador" ref="buscador" type="search" placeholder="Buscar" />

    <div id="sugerencias" ref="sugerencias">
      <div v-for="(resultados, llave) in resultados" class="cajaBuscador">
        <h4>{{ nombresListas[llave as TiposNodo] }}</h4>
        <ul class="subLista" v-for="resultado in resultados">
          {{
            resultado
          }}
        </ul>
      </div>

      <span id="sinResultados" v-if="sinResultadosPara.length" :class="{ visible: sinResultadosPara }">
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
  color: black;
  display: none;
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
  transform: translateX(200%); // translateX(200%);
  top: $altoMenuPantalla;
  padding: 3em 1.5em 1.5em 1.5em;
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  height: calc(100vh - $altoMenuPantalla);
  text-transform: none;
  transition: transform 0.2s ease-out;

  &.visible {
    transform: translateX(-50%);
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
