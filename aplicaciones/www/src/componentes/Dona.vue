<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface Esquema {
  secciones: number[];
  grosor: number;
}

const props = defineProps<Esquema>();
const valoresDona = ref<number[]>([]);
const colores = [
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
  '#aec7e8', // Brighter blue
  '#ffbb78',
  '#98df8a',
  '#ff9896',
  '#c5b0d5',
  '#c49c94',
  '#f7b6d2',
  '#c7c7c7',
  '#dbdb8d',
  '#9edae5',
  '#637939',
  '#8c6d31',
  '#843c39',
  '#7b4173',
  '#5254a3', // Brighter blue
  '#8ca252',
  '#bd9e39',
  '#ad494a',
  '#a55194',
];

onMounted(() => {
  valoresDona.value = props.secciones.map((seccion) => (seccion / 100) * 100);
});
</script>

<template>
  <svg class="dona" viewBox="0 0 50 50">
    <g :stroke-width="grosor">
      <circle
        v-for="(valor, i) in secciones"
        cx="20"
        cy="20"
        r="16"
        :stroke-dasharray="`${valor} 100`"
        :stroke-dashoffset="i > 0 ? -secciones[i - 1] : 0"
        :stroke="colores[i]"
      ></circle>
      <!-- <circle cx="20" cy="20" r="16" stroke-dasharray="30 100" stroke-dashoffset="0" stroke="#ff0000"></circle>
      <circle cx="20" cy="20" r="16" stroke-dasharray="15 100" stroke-dashoffset="-30" stroke="#eee"></circle>
      <circle cx="20" cy="20" r="16" stroke-dasharray="56 100" stroke-dashoffset="-45" stroke="#f1c40f"></circle> -->
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
