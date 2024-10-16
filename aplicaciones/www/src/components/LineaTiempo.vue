<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { convertirEscala } from '@enflujo/alquimia';
import type { ElementoLista, Listas } from '../tipos';
import { nombresListas } from '../utilidades/cerebro';

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

    console.log(listaAños);

    //console.log(listaAños);
  } catch (error) {
    console.error('Problema descargando datos de listas de publicaciones', error);
  }
});

// "`${convertirEscala(a.año, 1987, 2024, 0, 100)}%`"
// :y="`${convertirEscala(+a.conteo, 0, 50, 0, 100)}%`"
//"`${convertirEscala(+a.conteo, 0, 50, 0, 70)}`"
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
          <text class="fecha" :x="`${convertirEscala(+a.nombre, 1987, 2024, 0, 90)}%`" :y="160">
            {{ a.nombre }}: {{ a.conteo }}
          </text>
        </g>

        <!--  { listaAños.map((obj) => (
        <g class="{`${tiempo.find((nombre)" ="">
          +nombre === obj.año) ? 'punto' : 'desactivado'}`} style={`transform:translate(${posX(obj.año)}%, 45%)`}
          data-año={obj.año} data-indice={obj.indice} >
          <circle r="4" cx="10" cy="0" stroke="#62e595" stroke-width="1px" />
          <text class="fecha" style="transform: translateY(25%)" x="0" y="0">{obj.año}</text>
          <rect x="0" y="-5" width="20" height="28" fill="transparent" />
        </g>
        )) } -->
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
  height: 200px;
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
