<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { convertirEscala } from '@enflujo/alquimia';
import type { ElementoLista, Listas } from '../../../../tipos/compartidos';

defineProps<{
  id: keyof Listas;
  lista: ElementoLista[];
}>();

const listas: Ref<Listas | undefined> = ref();

onMounted(async () => {
  const listaAños: { año: number; conteo: number }[] = [];
  try {
    const datosListas = await fetch('datos/listas.json').then((res) => res.json());
    if (datosListas) listas.value = datosListas;

    function rango(min: number, max: number) {
      const lon = max - min + 1;
      const arr: { año: number; cantidad: number }[] = [];

      for (let i = 0; i < lon; i++) {
        const año = min + i;
        const cantidad = datosListas.años.findIndex((año) => {
          const valor = año === `${año}`;
        });
        arr.push({ año, cantidad });
      }

      return arr;
    }

    listas.value?.años?.forEach((año) => {
      listaAños.push({ año: +año.nombre, conteo: año.conteo });
    });
  } catch (error) {
    console.error('Problema descargando datos de listas de publicaciones', error);
  }
});
</script>

<template>
  <div id="contenedorLineaTiempo">
    <div id="contenedorGrafica">
      <svg height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"></svg>

      <svg id="marcas" width="100%" height="100%">
        <g v-for="(a, i) in listas?.años">
          <circle
            r="20"
            :cx="`${convertirEscala(+a.nombre, 1987, 2024, 0, 90) + 2}%`"
            cy="100"
            stroke="white"
            stroke-width="1px"
          />
          <text class="fecha" :x="`${convertirEscala(+a.nombre, 1987, 2024, 0, 90)}%`" :y="120">
            {{ a.nombre }}: {{ a.conteo }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/scss/constantes';
#contenedorLineaTiempo {
  position: absolute;
  bottom: 0;
  width: 100vw;
  margin: 0 auto;
}

#contenedorGrafica {
  position: relative;
  height: 150px;
  background-color: rgb(255, 255, 255);
  z-index: 3;
  width: 100vw;
  overflow-y: clip;
  overflow-x: auto;
}

#marcas {
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
