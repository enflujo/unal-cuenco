<script setup lang="ts">
import { usarCerebroFicha } from '@/cerebros/ficha';
import { usarCerebroGeneral } from '@/cerebros/general';
import { onMounted, onUnmounted } from 'vue';

const cerebroGeneral = usarCerebroGeneral();
const cerebroFicha = usarCerebroFicha();

onMounted(() => {
  cerebroGeneral.paginaActual = 'encuentros';
});

onUnmounted(() => {
  cerebroFicha.fichaVisible = false;
});
</script>

<template>
  <div>
    <h1>Encuentros</h1>
    <p></p>
  </div>
</template>

<style lang="scss" scoped></style>
