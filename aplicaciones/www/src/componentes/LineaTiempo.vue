<script setup lang="ts">
import { computed, type Ref, ref, watch } from 'vue';
import { convertirEscala } from '@enflujo/alquimia';
import { storeToRefs } from 'pinia';
import { usarCerebroDatos } from '@/cerebros/datos';

const cerebroDatos = usarCerebroDatos();
const { publicaciones, listasPublicaciones } = storeToRefs(cerebroDatos);
const extremosFechas: Ref<{ min: number; max: number } | null> = ref(null);
const fechas = computed(() => {
  if (!extremosFechas.value) {
    if (!listasPublicaciones.value) return { min: 0, max: 0 };
    const { años } = listasPublicaciones.value;
    let añoMin = Infinity;
    let añoMax = 0;

    años.forEach((año) => {
      const valorAño = +año.nombre;
      if (añoMin > valorAño) añoMin = valorAño;
      if (añoMax < valorAño) añoMax = valorAño;
    });
    const valores = { min: añoMin, max: añoMax };
    extremosFechas.value = valores;
    return valores;
  }

  return extremosFechas.value;
});

watch(listasPublicaciones, (lista) => {
  if (!lista) return;
  console.log(lista.años);
});

function posX(valor: number) {
  const { min, max } = fechas.value;
  return convertirEscala(valor, min, max, 0, 97);
}
</script>

<template>
  <div id="contenedorLineaTiempo">
    <div id="contenedorGrafica">
      <svg id="marcas" width="100%" height="100%">
        <g v-for="a in listasPublicaciones?.años" :style="{ transform: `translateX(${posX(+a.nombre)}%)` }">
          <circle class="punto" r="16" cx="25" cy="30" />
          <text class="fecha" x="15" y="60">{{ a.nombre }}</text>
        </g>
      </svg>
    </div>
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
  width: 100vw;

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
