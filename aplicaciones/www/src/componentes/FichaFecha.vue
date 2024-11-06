<script setup lang="ts">
import { usarCerebroDatos } from '@/cerebros/datos';
import { storeToRefs } from 'pinia';
import { onMounted, watch } from 'vue';

const cerebroDatos = usarCerebroDatos();
const { listasPublicaciones } = storeToRefs(cerebroDatos);

onMounted(() => {
  console.log(cerebroDatos.listasPublicaciones?.años);
});

watch(listasPublicaciones, (lista) => {
  if (!lista) return;
  console.log(lista.años[26]);
});
</script>

<template>
  <div id="contenedorFichaFecha"></div>
</template>

<style lang="scss">
@use '@/scss/constantes' as *;

#contenedorFichaFecha {
  background: rgb(41, 41, 41);
  background: radial-gradient(circle, rgba(41, 41, 41, 1) 0%, rgba(74, 74, 74, 1) 35%, rgba(41, 41, 41, 1) 100%);
  position: fixed;
  top: $altoMenu;
  height: calc(100vh - $altoMenu - $altoLinea);
  width: 80vw;
  z-index: 9;
  left: 50%;
  transform: translateX(-50%);
}
</style>
