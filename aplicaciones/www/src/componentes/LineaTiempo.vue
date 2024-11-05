<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { convertirEscala } from '@enflujo/alquimia';
import { storeToRefs } from 'pinia';
import { usarCerebroDatos } from '@/cerebros/datos';

const cerebroDatos = usarCerebroDatos();
const { listasPublicaciones, extremosFechasPublicaciones } = storeToRefs(cerebroDatos);
const dims = ref({ ancho: 0, alto: 100, pasoX: 0, r: 0, margenX: 0, margenIzq: 0, cortarFechas: false });

onMounted(() => {
  escalar();
  window.addEventListener('resize', escalar);
});

onUnmounted(() => {
  window.removeEventListener('resize', escalar);
});

watch(extremosFechasPublicaciones, escalar);

function escalar() {
  if (!extremosFechasPublicaciones.value) return;
  const { total } = extremosFechasPublicaciones.value;
  const ancho = window.innerWidth;
  const anchoColumna = (ancho / (total - 0)) | 0;
  const anchoMaxColumna = 20;
  const margenX = 4;
  const caben = anchoColumna > anchoMaxColumna; // Revisar si caben todos los puntos en la pantalla.
  let r = 0;

  if (caben) {
    dims.value.cortarFechas = false;
    r = anchoMaxColumna - margenX;
  } else {
    dims.value.cortarFechas = true;
    r = anchoColumna / 2;
  }
  dims.value.margenX = ((anchoColumna - r * 2) / 2) * 2;
  dims.value.pasoX = anchoColumna;
  dims.value.ancho = ancho;
  dims.value.r = r;
}

function posX(valor: number) {
  if (!extremosFechasPublicaciones.value) return 0;
  const { min, max } = extremosFechasPublicaciones.value;
  const { ancho, pasoX, margenX, r } = dims.value;
  const margenIzq = margenX / 2;
  return convertirEscala(valor, min, max, 0, ancho - pasoX) + margenIzq + r;
}
</script>

<template>
  <div id="contenedorLineaTiempo">
    <svg id="marcas" :width="`${dims.ancho}px`" height="100%">
      <g v-for="a in listasPublicaciones?.años" :style="{ transform: `translateX(${posX(+a.nombre)}px)` }">
        <circle class="punto" :r="dims.r" cx="0" cy="30" />
        <text class="fecha" x="0" y="60" text-anchor="middle">
          {{ dims.cortarFechas ? a.nombre.slice(2, 4) : a.nombre }}
        </text>
      </g>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
@use '@/scss/constantes' as *;

#contenedorLineaTiempo {
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: $altoLinea;
  background: rgb(41, 41, 41);
  background: radial-gradient(circle, rgba(41, 41, 41, 1) 0%, rgba(74, 74, 74, 1) 35%, rgba(41, 41, 41, 1) 100%);
}

svg {
  .punto {
    cursor: pointer;
    fill: #d2c2b3;
  }

  .punto,
  .punto circle {
    transition: all 0.8s ease-out;
  }

  .desactivado {
    opacity: 0.3;

    circle {
      fill: rgba(26, 42, 34, 0.8);
      opacity: 0.2;
    }
  }

  .fecha {
    font-weight: 100;
    font-size: 0.6em;
    fill: #faeddc;
  }
}
</style>
