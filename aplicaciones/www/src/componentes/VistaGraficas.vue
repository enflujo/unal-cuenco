<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import { convertirEscala } from '@enflujo/alquimia';
import type { ElementoLista, LlavesColectivos, LlavesPA } from '@/tipos/compartidos';
import { usarCerebro } from '@/utilidades/cerebro';
import { storeToRefs } from 'pinia';
import { TiposDePagina } from '@/tipos';

// Pasarle como prop en qué página estamos (colectivos o publicaciones) para que cargue los datos de las listas correspondientes
const { pagina } = defineProps<{ pagina: TiposDePagina }>();
const cerebro = usarCerebro();
const { listaElegida } = storeToRefs(cerebro);
const listaVisible: Ref<ElementoLista[]> = ref([]);
const valorMaximo = ref(0);
let listas: { [llave: string]: ElementoLista[] } = {};
let listaActual: LlavesColectivos | LlavesPA | '' = '';

watch(listaElegida, (llaveLista) => {
  if (!llaveLista || llaveLista === listaActual) return;
  listaActual = llaveLista;

  // Cambiar lista elegida al hacer click en una lista del menú
  listaVisible.value = listas[llaveLista].sort((a, b) => b.conteo - a.conteo);
  valorMaximo.value = Math.max(...listaVisible.value.map((o) => o.conteo));
});

onMounted(async () => {
  if (pagina === 'colectivos') {
    await cerebro.cargarDatosListaColectivos();
    if (!cerebro.listasColectivos) return;
    listas = cerebro.listasColectivos;
    listaElegida.value = Object.keys(cerebro.listasColectivos)[0] as LlavesColectivos;
  } else if (pagina === 'publicaciones') {
    await cerebro.cargarDatosListaPublicaciones();
    if (!cerebro.listasPublicaciones) return;
    listas = cerebro.listasPublicaciones;
    listaElegida.value = Object.keys(cerebro.listasPublicaciones)[0] as LlavesPA;
  }
});

onUnmounted(() => {
  // Reiniciar variables al desmontar
  listaElegida.value = null;
  listaActual = '';
});
</script>

<template>
  <div id="contenedorVistaGraficas">
    <h2>{{ listaActual }}</h2>
    <div id="contenedorGrafica" width="100%" height="100%">
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

<style scoped lang="scss">
@use '@/scss/constantes';

#contenedorVistaGraficas {
  max-height: 48vh;
  width: 80vw;
  left: 20vw;
  position: fixed;
  padding: 0 1em;
  overflow: auto;
}

#contenedorGrafica {
  background-color: rgb(255, 255, 255);
  z-index: 3;
  width: 100%;
  overflow-y: clip;
  overflow-x: auto;

  .contenedorElementos {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 0.5em;
  }
}

.leyenda {
  margin: 0 1em 0 0;
  //text-transform: capitalize;
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
