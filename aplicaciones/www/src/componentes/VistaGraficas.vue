<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import { convertirEscala } from '@enflujo/alquimia';
import type { ElementoLista, LlavesColectivos, LlavesPublicaciones, Relacion } from '@/tipos/compartidos';
import { storeToRefs } from 'pinia';
import { TiposDePagina, TiposNodo } from '@/tipos';
import { usarCerebroDatos } from '@/cerebros/datos';

// Pasarle como prop en qué página estamos (colectivos o publicaciones) para que cargue los datos de las listas correspondientes
const { pagina } = defineProps<{ pagina: TiposDePagina }>();
const cerebroDatos = usarCerebroDatos();
const { listaElegida } = storeToRefs(cerebroDatos);
const listaVisible: Ref<ElementoLista[]> = ref([]);
const valorMaximo = ref(0);
let listas: { [llave: string]: ElementoLista[] } = {};
let listaActual: TiposNodo | '' = '';

let filtrados: Relacion[][] = [];

const filtroElegido: Ref<string> = ref('sedes');
const filtroEstados: Ref<string> = ref('filtroEstados');

watch(listaElegida, (llaveLista) => {
  if (!llaveLista || llaveLista === listaActual) return;
  listaActual = llaveLista;

  // Cambiar lista elegida al hacer click en una lista del menú
  listaVisible.value = listas[llaveLista]; //.sort((a, b) => b.conteo - a.conteo);
  valorMaximo.value = Math.max(...listaVisible.value.map((o) => o.conteo));
});

watch(filtroElegido, () => {
  if (!filtroElegido || listaActual === filtroElegido.value) return;
  // cambiar

  filtrados = [];
  listaVisible.value.forEach((elementoElegido) => {
    const filtrado = elementoElegido.relaciones.filter((relacion) => relacion.tipo === `${filtroElegido.value}`);
    filtrado.sort((a, b) => b.conteo - a.conteo);
    filtrados.push(filtrado);
  });

  //console.log(filtroElegido.value);
  //console.log(filtrados);
});

onMounted(async () => {
  if (pagina === 'colectivos') {
    if (!cerebroDatos.listasColectivos) return;
    listas = cerebroDatos.listasColectivos;
    listaElegida.value = Object.keys(cerebroDatos.listasColectivos)[0] as LlavesColectivos;
  } else if (pagina === 'publicaciones') {
    if (!cerebroDatos.listasPublicaciones) return;
    listas = cerebroDatos.listasPublicaciones;
    listaElegida.value = Object.keys(cerebroDatos.listasPublicaciones)[0] as LlavesPublicaciones;
  }
});

onUnmounted(() => {
  // Reiniciar variables al desmontar
  listaElegida.value = null;
  listaActual = '';
});

function elegirFiltro(filtro: string) {
  if (listaActual === filtro) return;
  filtroElegido.value = filtro;
}
</script>

<template>
  <div id="contenedorVistaGraficas">
    <h2>{{ listaActual }}</h2>
    <div id="filtros">
      Filtrar:
      <div
        ref="filtroEstados"
        class="botonFiltro"
        :class="filtroElegido === 'estados' ? 'seleccionado' : ''"
        @click="elegirFiltro('estados')"
      >
        estados
      </div>
      <div
        ref="filtroModalidades"
        class="botonFiltro"
        :class="filtroElegido === 'modalidades' ? 'seleccionado' : ''"
        @click="elegirFiltro('modalidades')"
      >
        modalidades
      </div>
      <div
        ref="filtroSedes"
        class="botonFiltro"
        :class="filtroElegido === 'sedes' ? 'seleccionado' : ''"
        @click="elegirFiltro('sedes')"
      >
        sedes
      </div>
      <div
        ref="filtroTipos"
        class="botonFiltro"
        :class="filtroElegido === 'tipos' ? 'seleccionado' : ''"
        @click="elegirFiltro('tipos')"
      >
        tipos
      </div>
    </div>

    <!-- Mostrar filtrados -->
    <div v-for="(elementos, i) in filtrados">
      {{ listaVisible[i].nombre }}
      <div v-for="e in elementos">{{ e.id }}: {{ e.conteo }}</div>
    </div>
    <div id="contenedorGrafica">
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
  height: 3px;
  //background-color: var(--azulOscuroCuenco);
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
