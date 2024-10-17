<script setup lang="ts">
import ComponenteMapa from '@/components/ComponenteMapa.vue';
import FichaColectivosAmbitos from '@/components/FichaColectivosAmbitos.vue';
import ListasColectivos from '@/components/ListasColectivos.vue';
</script>

<template>
  <div>
    <h1>Colectivos y Ámbitos</h1>
    <ListasColectivos />
    <ComponenteMapa />
    <FichaColectivosAmbitos id="2" />
  </div>
</template>

<style></style>
