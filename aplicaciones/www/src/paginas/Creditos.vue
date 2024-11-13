<script setup lang="ts">
import { usarCerebroFicha } from '@/cerebros/ficha';
import { usarCerebroGeneral } from '@/cerebros/general';
import { onMounted, onUnmounted } from 'vue';

const cerebroGeneral = usarCerebroGeneral();
const cerebroFicha = usarCerebroFicha();

onMounted(() => {
  cerebroGeneral.paginaActual = 'creditos';
});

onUnmounted(() => {
  cerebroFicha.fichaVisible = false;
});
</script>

<template>
  <main>
    <div id="contenedorCreditos">
      <h1>Créditos</h1>
    </div>
  </main>
</template>

<style lang="scss" scoped>
#contenedorCreditos {
  width: 70vw;
  margin-left: 10vw;
  margin-top: 5vw;
}
</style>
