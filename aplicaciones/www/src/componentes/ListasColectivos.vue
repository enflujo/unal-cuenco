<script setup lang="ts">
import { onMounted } from 'vue';
import ListaNodos from './ListaNodos.vue';
import { usarCerebro } from '@/utilidades/cerebro';
import { storeToRefs } from 'pinia';

const cerebro = usarCerebro();
const { listasColectivos } = storeToRefs(cerebro);

onMounted(async () => {
  await cerebro.cargarDatosListaColectivos();
});
</script>

<template>
  <div id="contenedorListas" class="todoVisible" v-if="listasColectivos">
    <ListaNodos v-for="(lista, llave) in listasColectivos" :id="llave" :lista="lista" />
  </div>
</template>

<style scoped></style>
