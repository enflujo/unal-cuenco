<script setup lang="ts">
import { onMounted } from 'vue';
import ListaNodos from './ListaNodos.vue';
import { storeToRefs } from 'pinia';
import { usarCerebroDatos } from '@/cerebros/datos';

const cerebroDatos = usarCerebroDatos();
const { listasColectivos } = storeToRefs(cerebroDatos);

onMounted(async () => {
  await cerebroDatos.cargarDatosListaColectivos();
});
</script>

<template>
  <div id="contenedorListas" v-if="listasColectivos">
    <ListaNodos v-for="(lista, llave) in listasColectivos" :id="llave" :lista="lista" />
  </div>
</template>

<style lang="scss" scoped></style>
