<script setup lang="ts">
import ListaNodos from '../components/ListaNodos.vue'
import listasColectivos from '../../public/datos/listasColectivos.json'

defineProps<{}>()
</script>

<template>
  <div id="contenedorListas" class="todoVisible">
    <ListaNodos id="años" :lista="listasColectivos.años" />
    <ListaNodos id="estados" :lista="listasColectivos.estados" />
    <ListaNodos id="responsables" :lista="listasColectivos.responsables" />
    <ListaNodos id="sedes" :lista="listasColectivos.sedes" />
    <ListaNodos id="dependencias" :lista="listasColectivos.dependencias" />
    <ListaNodos id="modalidades" :lista="listasColectivos.modalidades" />
    <ListaNodos id="indicadores" :lista="listasColectivos.indicadores" />
    <ListaNodos id="tipos" :lista="listasColectivos.tipos" />
  </div>
</template>

<style scoped></style>
