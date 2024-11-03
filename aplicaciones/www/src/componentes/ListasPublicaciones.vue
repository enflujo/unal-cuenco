<script setup lang="ts">
import { onMounted } from 'vue';
import ListaNodos from './ListaNodos.vue';
import { storeToRefs } from 'pinia';
import { usarCerebroDatos } from '@/cerebros/datos';

const cerebroDatos = usarCerebroDatos();
const { listasPublicaciones } = storeToRefs(cerebroDatos);

onMounted(async () => {
  await cerebroDatos.cargarDatosListaPublicaciones();
});
</script>

<template>
  <div id="contenedorListas" v-if="listasPublicaciones">
    <ListaNodos v-for="(lista, llave) in listasPublicaciones" :id="llave" :lista="lista" />
  </div>
</template>

<style lang="scss" scoped>
#contenedorListas {
  display: flex;
  flex-wrap: wrap;
}
</style>
