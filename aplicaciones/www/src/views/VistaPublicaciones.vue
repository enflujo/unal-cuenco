<script setup lang="ts">
import ComponenteMapa from '@/components/ComponenteMapa.vue';
import LineaTiempo from '../components/LineaTiempo.vue';
import ListasPublicaciones from '../components/ListasPublicaciones.vue';
import FichaProduccionAcademica from '@/components/FichaProduccionAcademica.vue';
import VistaGraficas from '@/components/VistaGraficas.vue';
</script>

<template>
  <div>
    <h1>Producción Académica</h1>
    <ListasPublicaciones />
    <!--  <ComponenteMapa /> -->
    <VistaGraficas />
    <LineaTiempo />
    <!--  <FichaProduccionAcademica /> -->
  </div>
</template>

<style></style>
