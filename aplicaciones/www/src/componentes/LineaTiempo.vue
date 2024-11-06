<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { convertirEscala } from '@enflujo/alquimia';
import { storeToRefs } from 'pinia';
import { usarCerebroDatos } from '@/cerebros/datos';
import { usarCerebroFicha } from '@/cerebros/ficha';

const cerebroDatos = usarCerebroDatos();
const cerebroFicha = usarCerebroFicha();
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

function abrirElemento(evento: MouseEvent, i: string) {
  evento.stopPropagation();
  cerebroFicha.seleccionarNodo(i, 'años');
}
</script>

<template>
  <div id="contenedorLineaTiempo">
    <svg id="marcas" :width="`${dims.ancho}px`" height="100%">
      <filter id="inset-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feComponentTransfer in="SourceAlpha">
          <feFuncA type="table" tableValues="1 0" />
        </feComponentTransfer>
        <feGaussianBlur stdDeviation="4" />
        <feOffset dx="0" dy="2" result="offsetblur" />
        <feFlood flood-color="rgb(0, 0, 0)" result="color" />
        <feComposite in2="offsetblur" operator="in" />
        <feComposite in2="SourceAlpha" operator="in" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode />
        </feMerge>
      </filter>
      <g
        v-for="a in listasPublicaciones?.años"
        :style="{ transform: `translateX(${posX(+a.nombre)}px)` }"
        @click="abrirElemento($event, a.id)"
        class="punto"
        :class="cerebroFicha.datosFicha?.id === a.id ? 'activo' : ''"
      >
        <circle :r="dims.r" cx="0" cy="30" filter="url(#inset-shadow)" />
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
  background: rgb(57, 73, 164);
  background: radial-gradient(circle, rgba(57, 73, 164, 1) 0%, rgb(75, 90, 177) 25%, rgba(57, 73, 164, 1) 100%);
}

svg {
  .punto {
    cursor: pointer;

    &.activo circle {
      fill: var(--magentaCuenco);
    }
  }

  .punto circle {
    fill: #d2c2b3;
    transition: all 0.8s ease-out;

    &:hover {
      fill: var(--verdeCuenco);
    }
  }

  .fecha {
    font-weight: 400;
    font-size: 0.6em;
    fill: #f0eeeb;
  }
}
</style>
