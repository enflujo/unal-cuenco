<script setup lang="ts">
import { onMounted } from 'vue';
import ListaNodos from './ListaNodos.vue';
import { usarCerebro } from '@/utilidades/cerebro';
import { storeToRefs } from 'pinia';

const cerebro = usarCerebro();
const { listasPublicaciones } = storeToRefs(cerebro);

onMounted(async () => {
  await cerebro.cargarDatosListaPublicaciones();
});
</script>

<template>
  <div id="contenedorListas" class="todoVisible" v-if="listasPublicaciones">
    <ListaNodos v-for="(lista, llave) in listasPublicaciones" :id="llave" :lista="lista" />
  </div>
</template>

<style lang="scss" scoped>
#contenedorListas {
  display: flex;
  flex-wrap: wrap;
}
</style>
