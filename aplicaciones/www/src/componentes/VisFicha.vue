<script setup lang="ts">
// import { usarCerebroDatos } from '@/cerebros/datos';
import { usarCerebroFicha } from '@/cerebros/ficha';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

// const cerebroDatos = usarCerebroDatos();
const cerebroFicha = usarCerebroFicha();
const { datosFicha } = storeToRefs(cerebroFicha);

watch(datosFicha, (datos) => {
  if (!datos) return;
  if (datos.tipo) {
  }
  console.log(datos);
});
</script>
<template>
  <div></div>
</template>
<style lang="scss" scoped></style>
