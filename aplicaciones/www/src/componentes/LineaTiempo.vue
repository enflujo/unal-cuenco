<script setup lang="ts">
import { computed, onMounted, type Ref, ref } from 'vue';
import { convertirEscala } from '@enflujo/alquimia';
import { usarCerebro } from '@/utilidades/cerebro';
import { storeToRefs } from 'pinia';

const cerebro = usarCerebro();
const { listasPublicaciones } = storeToRefs(cerebro);
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

onMounted(async () => {
  await cerebro.cargarDatosListaPublicaciones();
});
</script>

<template>
  <div id="contenedorLineaTiempo">
    <div id="contenedorGrafica">
      <svg id="marcas" width="100%" height="100%">
        <g v-for="a in listasPublicaciones?.años">
          <circle
            r="20"
            :cx="`${convertirEscala(+a.nombre, fechas.min, fechas.max, 0, 90) + 2}%`"
            cy="50"
            stroke="white"
            stroke-width="1px"
          />
          <text class="fecha" :x="`${convertirEscala(+a.nombre, fechas.min, fechas.max, 0, 90)}%`" :y="70">
            {{ a.nombre }}: {{ a.conteo }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/scss/constantes';
#contenedorLineaTiempo {
  position: absolute;
  bottom: 0;
  width: 100vw;
  margin: 0 auto;
}

#contenedorGrafica {
  position: relative;
  height: 100px;
  background-color: rgb(255, 255, 255);
  z-index: 3;
  width: 100vw;
  overflow-y: clip;
  overflow-x: auto;
}

svg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;

  path {
    fill: black;
  }

  .punto {
    cursor: pointer;

    &.desactivado {
      opacity: 0.7;
      &:hover {
        opacity: 0.8;
        circle {
          opacity: 0.8;
        }
      }
    }
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
  text {
    //width: 10vw;
    transform: translate(20px, 20px);
    font-size: 0.6em;
    fill: var(--magentaCuenco);
  }

  circle {
    fill: var(--magentaCuenco);
    opacity: 0.7;
  }
}
</style>
