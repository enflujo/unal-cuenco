<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import { convertirEscala } from '@enflujo/alquimia';
import type {
  ElementoLista,
  ListasColectivos,
  ListasPublicaciones,
  LlavesColectivos,
  LlavesPublicaciones,
  Relacion,
} from '@/tipos/compartidos';
import { storeToRefs } from 'pinia';
import { usarCerebroDatos } from '@/cerebros/datos';
import { usarCerebroGeneral } from '@/cerebros/general';
import { nombresListas } from '@/utilidades/constantes';
import { colores } from '@/utilidades/constantes';
import { TiposNodo } from '@/tipos';

// Pasarle como prop en qué página estamos (colectivos o publicaciones) para que cargue los datos de las listas correspondientes
const cerebroDatos = usarCerebroDatos();
const { paginaActual } = usarCerebroGeneral();
const { listaElegida } = storeToRefs(cerebroDatos);
const listaVisible: Ref<ElementoLista[] | null> = ref(null);
const valorMaximo = ref(0);
const listas: Ref<ListasColectivos | ListasPublicaciones | null> = ref(null);
const listaActual: Ref<LlavesColectivos | LlavesPublicaciones | null> = ref(null);
const etiquetaCortada: Ref<HTMLDivElement | null> = ref(null);
const listaFiltros = computed<{ llave: LlavesColectivos | LlavesPublicaciones; nombre: string }[] | null>(() => {
  if (listas.value) {
    return (Object.keys(listas.value) as (LlavesColectivos | LlavesPublicaciones)[])
      .sort()
      .map((llave) => ({ llave, nombre: nombresListas[llave] }));
  }
  return null;
});

const filtrados: Ref<Relacion[][]> = ref([]);

const filtroElegido: Ref<string> = ref('sedes');
let posicionIzq = 0;

watch(listaElegida, (llaveLista) => {
  if (!llaveLista || llaveLista === listaActual.value) return;
  listaActual.value = llaveLista;

  // Cambiar lista elegida al hacer click en una lista del menú
  if (listas.value) {
    if (paginaActual === 'colectivos') {
      listaVisible.value = (listas.value as ListasColectivos)[llaveLista as LlavesColectivos];
    } else if (paginaActual === 'publicaciones') {
      listaVisible.value = (listas.value as ListasPublicaciones)[llaveLista as LlavesPublicaciones];
    }
  }

  if (listaVisible.value) {
    valorMaximo.value = Math.max(...listaVisible.value.map((o) => o.conteo));
  }

  filtroElegido.value = '';
  filtrados.value = [];
});

onMounted(async () => {
  if (paginaActual === 'colectivos') {
    if (!cerebroDatos.listasColectivosOrdenadas) return;
    listas.value = cerebroDatos.listasColectivosOrdenadas;
    listaElegida.value = Object.keys(cerebroDatos.listasColectivosOrdenadas)[0] as LlavesColectivos;
    filtroElegido.value = listaElegida.value;
  } else if (paginaActual === 'publicaciones') {
    if (!cerebroDatos.listasPublicacionesOrdenadas) return;
    listas.value = cerebroDatos.listasPublicacionesOrdenadas;
    listaElegida.value = Object.keys(cerebroDatos.listasPublicacionesOrdenadas)[0] as LlavesPublicaciones;
    filtroElegido.value = listaElegida.value;
  }
});

onUnmounted(() => {
  // Reiniciar variables al desmontar
  listaElegida.value = null;
});

function elegirFiltro(filtro: string) {
  filtroElegido.value = filtro;

  if (!listaVisible.value) return;
  filtrados.value = [];

  if (listaActual.value === filtro) {
    return;
  }

  listaVisible.value.forEach((elementoElegido) => {
    const filtrado = elementoElegido.relaciones.filter((relacion) => relacion.tipo === `${filtroElegido.value}`);
    filtrado.sort((a, b) => b.conteo - a.conteo);

    filtrados.value.push(filtrado);
  });
}

function ratonEntra({ target }: MouseEvent) {
  const elemento = target as HTMLElement;
  let resaltado;

  if (paginaActual === 'colectivos') {
    if (!cerebroDatos.listasColectivos) return;
    resaltado = cerebroDatos.listasColectivos[`${filtroElegido.value as LlavesColectivos}`].find(
      (e) => e.id === elemento.dataset.id
    );
  } else if (paginaActual === 'publicaciones') {
    if (!cerebroDatos.listasPublicaciones) return;
    resaltado = cerebroDatos.listasPublicaciones[`${filtroElegido.value as LlavesPublicaciones}`].find(
      (e) => e.id === elemento.dataset.id
    );
  }

  if (!etiquetaCortada.value || !elemento.dataset.conteo) return;

  etiquetaCortada.value.innerText = resaltado?.nombre ? `${resaltado.nombre}: ${elemento.dataset.conteo}` : '';
  // etiquetaCortada.value.style.left = `${clientX + 10}px`;
  // etiquetaCortada.value.style.top = `${clientY - 20}px`;
  etiquetaCortada.value.style.display = 'block';
}

function ratonFuera() {
  if (!etiquetaCortada.value) return;
  etiquetaCortada.value.innerText = '';
  etiquetaCortada.value.style.display = 'none';
}

function actualizarPosRaton({ clientX, clientY }: MouseEvent) {
  if (!etiquetaCortada.value) return;
  etiquetaCortada.value.style.left = `${clientX + 10}px`;
  etiquetaCortada.value.style.top = `${clientY - 20}px`;
}

const titulo = computed(() => {
  if (!listaActual.value) return;
  if (listaActual.value === filtroElegido.value || !filtroElegido.value.length) {
    return nombresListas[listaActual.value];
  }

  if (!listaActual.value || !filtroElegido.value) return;

  return `Relaciones entre "${nombresListas[filtroElegido.value as TiposNodo]}" y "${nombresListas[listaActual.value]}"`;
});
</script>

<template>
  <div id="contenedorVistaGraficas">
    <h2 v-if="listaActual">Vista por {{ titulo }}</h2>

    <div id="filtros">
      Filtrar:

      <div
        v-if="listas"
        v-for="obj in listaFiltros"
        class="botonFiltro"
        :class="filtroElegido === obj.llave ? 'seleccionado' : listaActual === obj.llave ? 'inactivo' : ''"
        @click="elegirFiltro(obj.llave)"
      >
        {{ obj.nombre }}
      </div>
    </div>

    <div id="contenedorGrafica" v-if="listaVisible">
      <!-- Mostrar filtrados -->
      <div
        class="contenedorElemFiltrados"
        v-if="listaVisible"
        v-for="(elementos, j) in filtrados"
        :v-on="(posicionIzq = 0)"
      >
        <p class="leyenda">{{ listaVisible[j].nombre }}</p>

        <div class="contenedorLineaCortada" @mousemove="actualizarPosRaton">
          <div
            v-for="(e, i) in elementos"
            @mouseenter="ratonEntra"
            @mouseout="ratonFuera"
            class="lineaCortada"
            :style="`width:${convertirEscala(e.conteo, 0, valorMaximo, 0, 70)}%; top: ${j * 4}%; left: ${i === 0 ? 0 : posicionIzq}%; background-color:${colores[+e.id] ? colores[+e.id] : 'pink'}`"
            :data-conteo="`${e.conteo}`"
            :data-id="`${e.id}`"
          ></div>
        </div>
      </div>
      <div class="etiquetaCortada" ref="etiquetaCortada"></div>

      <!--Líneas no filtradas-->
      <div v-if="!filtrados.length" class="contenedorElementos" v-for="(elem, i) in listaVisible">
        <p class="leyenda" :style="`top:${convertirEscala(i, 0, listaVisible.length, 0, 70)}%`">
          {{ elem.nombre }}
        </p>
        <div class="contenedorColombina">
          <div
            class="linea"
            :style="`width:${convertirEscala(+elem.conteo, 0, valorMaximo + 10, 0, 65)}%; top: ${convertirEscala(i, 0, listaVisible.length, 0, 70)}%`"
          ></div>
          <div class="colombino"></div>
          <p class="leyenda conteo">
            {{ elem.conteo }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/scss/constantes' as *;

#filtros {
  display: flex;
  align-items: center;
  opacity: 1;

  .botonFiltro {
    margin: 0.5em;
    padding: 0.5em;
    cursor: pointer;

    &.seleccionado {
      border: 1px black solid;
    }

    &.inactivo {
      opacity: 0.2;
    }
  }
}

#contenedorVistaGraficas {
  padding: 0 1em;
}

#contenedorGrafica {
  padding: 1em;
  position: relative;
}

.contenedorElementos {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 0.5em;
}

.contenedorColombina {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 0.5em;
  width: 80%;
}

.leyenda {
  margin: 0 1em 0 0;
  font-size: 0.7em;
  width: 5vw;
  line-height: 0.8em;
  height: fit-content;
}

.linea {
  height: 1px;
  background-color: var(--azulOscuroCuenco);
}

.contenedorElemFiltrados {
  display: flex;
  flex-direction: row;
  height: fit-content;
  margin-bottom: 0.7em;
  align-items: center;
}

.contenedorLineaCortada {
  display: flex;
  width: 50vw;
  margin-bottom: 0.5em;
}
.lineaCortada {
  height: 8px;
}

.etiquetaCortada {
  display: none;
  position: fixed;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid black;
  padding: 0.2em 0.5em;
}

.colombino {
  background-color: var(--azulOscuroCuenco);
  height: 7px;
  width: 7px;
  border-radius: 50%;
}

.conteo {
  color: var(--azulOscuroCuenco);
  margin-left: 0.5em;
}

svg {
  position: absolute;

  path {
    fill: black;
    stroke: black;
  }

  line {
    stroke: var(--azulOscuroCuenco);
    transform: translate(140px, -3px);
  }

  circle {
    fill: var(--azulOscuroCuenco);
    transform: translate(140px, -3px);
  }

  text {
    text-transform: lowercase;
    font-size: 0.6em;
    fill: var(--magentaCuenco);
  }

  .cantidad {
    transform: translate(143px, 0px);
  }
}
</style>
