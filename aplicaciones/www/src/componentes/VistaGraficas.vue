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

// Pasarle como prop en qué página estamos (colectivos o publicaciones) para que cargue los datos de las listas correspondientes
const cerebroDatos = usarCerebroDatos();
const { paginaActual } = usarCerebroGeneral();
const { listaElegida } = storeToRefs(cerebroDatos);
const listaVisible: Ref<ElementoLista[] | null> = ref(null);
const valorMaximo = ref(0);
const listas: Ref<ListasColectivos | ListasPublicaciones | null> = ref(null);
const listaActual: Ref<LlavesColectivos | LlavesPublicaciones | null> = ref(null);
const listaFiltros = computed<{ llave: LlavesColectivos | LlavesPublicaciones; nombre: string }[] | null>(() => {
  if (listas.value) {
    return (Object.keys(listas.value) as (LlavesColectivos | LlavesPublicaciones)[])
      .sort()
      .map((llave) => ({ llave, nombre: nombresListas[llave] }));
  }
  return null;
});

let filtrados: Relacion[][] = [];

const filtroElegido: Ref<string> = ref('sedes');

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
});

onMounted(async () => {
  if (paginaActual === 'colectivos') {
    if (!cerebroDatos.listasColectivosOrdenadas) return;
    listas.value = cerebroDatos.listasColectivosOrdenadas;
    listaElegida.value = Object.keys(cerebroDatos.listasColectivosOrdenadas)[0] as LlavesColectivos;
  } else if (paginaActual === 'publicaciones') {
    if (!cerebroDatos.listasPublicacionesOrdenadas) return;
    listas.value = cerebroDatos.listasPublicacionesOrdenadas;
    listaElegida.value = Object.keys(cerebroDatos.listasPublicacionesOrdenadas)[0] as LlavesPublicaciones;
  }
});

onUnmounted(() => {
  // Reiniciar variables al desmontar
  listaElegida.value = null;
});

function elegirFiltro(filtro: string) {
  if (listaActual.value === filtro || !listaVisible.value) return;
  filtrados = [];
  listaVisible.value.forEach((elementoElegido) => {
    const filtrado = elementoElegido.relaciones.filter((relacion) => relacion.tipo === `${filtroElegido.value}`);

    filtrado.sort((a, b) => b.conteo - a.conteo);
    filtrados.push(filtrado);
  });

  filtroElegido.value = filtro;
}
</script>

<template>
  <div id="contenedorVistaGraficas">
    <h2 v-if="listaActual">{{ nombresListas[listaActual] }}</h2>

    <div id="filtros">
      Filtrar:

      <div
        v-if="listas"
        v-for="obj in listaFiltros"
        class="botonFiltro"
        :class="filtroElegido === obj.llave ? 'seleccionado' : ''"
        @click="elegirFiltro(obj.llave)"
      >
        {{ obj.nombre }}
      </div>
    </div>

    <!-- Mostrar filtrados -->
    <div v-if="listaVisible" v-for="(elementos, i) in filtrados">
      {{ listaVisible[i].nombre }}
      <div v-for="e in elementos">{{ e.id }}: {{ e.conteo }}</div>
    </div>

    <div id="contenedorGrafica" v-if="listaVisible">
      <div class="contenedorElementos" v-for="(elem, i) in listaVisible">
        <p class="leyenda" :style="`top:${convertirEscala(i, 0, listaVisible.length, 0, 70)}%`">
          {{ elem.nombre }}
        </p>
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
</template>

<style lang="scss" scoped>
@use '@/scss/constantes' as *;

#filtros {
  display: flex;
  align-items: center;

  .botonFiltro {
    margin: 0.5em;
    padding: 0.5em;
    cursor: pointer;

    &.seleccionado {
      border: 1px black solid;
    }
  }
}

#contenedorVistaGraficas {
  padding: 0 1em;
}

#contenedorGrafica {
  background-color: rgb(255, 255, 255);
  width: 100%;
  content-visibility: auto;

  .contenedorElementos {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 0.5em;
  }
}

.leyenda {
  margin: 0 1em 0 0;
  font-size: 0.7em;
  width: 5vw;
}

.linea {
  height: 1px;
  background-color: var(--azulOscuroCuenco);
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
