<script setup lang="ts">
import ListaNodos from '../components/ListaNodos.vue'
import listas from '../../public/datos/listas.json'

defineProps<{}>()
</script>

<template>
  <div id="contenedorListas" class="todoVisible">
    <ListaNodos id="años" :lista="listas.años" />
    <ListaNodos id="autores" :lista="listas.autores" />
    <ListaNodos id="dependencias" :lista="listas.dependencias" />
    <ListaNodos id="indicadores" :lista="listas.indicadores" />
    <ListaNodos id="tipos" :lista="listas.tipos" />
  </div>
</template>

<style scoped></style>
