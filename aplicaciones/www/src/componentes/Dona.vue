<script setup lang="ts">
import type { DonaProcesada, IDona } from '@/tipos';
import { onMounted, ref } from 'vue';

interface Esquema {
  secciones: IDona[];
  mostrarInfo: (trozo: DonaProcesada) => void;
}

const props = defineProps<Esquema>();
const valoresDona = ref<DonaProcesada[]>([]);
const colores = [
  '#ff9999',
  '#99ff99',
  '#9999ff',
  '#cc99ff',
  '#ff99cc',
  '#9999cc',
  '#ff9999',
  '#99ffcc',
  '#99ccff',
  '#cc99cc',
  '#ffccff',
  '#ccccff',
  '#ffcccc',
  '#ccffcc',
  '#ccccff',
  '#e6ccff',
  '#ffccf2',
  '#cccccc',
  '#ffcccc',
  '#ccffcc',
  '#99ccff',
  '#cc99ff',
  '#ffccff',
  '#ffcc99',
  '#ffcc66',
  '#ccffcc',
  '#ccccff',
  '#e6ccff',
  '#ffccf2',
  '#cccccc',
];

onMounted(() => {
  let ajusteAngulo = 0;
  valoresDona.value = props.secciones.map((seccion) => {
    return { ...seccion, ajuste: ajusteAngulo };
  });
});
</script>

<template>
  <svg class="dona" viewBox="0 0 50 50" :stroke-width="5">
    <g>
      <circle
        v-for="(trozo, i) in valoresDona"
        cx="25"
        cy="25"
        r="16"
        :stroke-dasharray="`${trozo.porcentaje} 100`"
        :stroke-dashoffset="trozo.ajuste"
        :stroke="colores[i]"
        @mouseenter="mostrarInfo(trozo)"
      ></circle>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.dona {
  width: 100px;
}

circle {
  fill: transparent;
}

.text {
  font-family: Roboto, sans-serif;
  fill: #fff;
  font-size: 2px;
  text-align: left;
}
</style>
