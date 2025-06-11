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

      <p>Página en construcción.</p>

      <!-- <p>Investigación</p>
      <p>Consolidación de datos</p>
      <p>...</p>

      <h2>Diseño y desarrollo</h2>
      <p>Juan Camilo González y Antonia Bustamante - <a href="https://enflujo.com/">Laboratorio EnFlujo</a></p> -->
    </div>
  </main>
</template>

<style lang="scss" scoped>
@use '@/scss/constantes' as *;

#contenedorCreditos {
  width: 70vw;
  margin-left: 10vw;
  margin-top: 5vw;
}

.logo {
  height: auto;
  margin: 0 auto;
  display: block;
  width: 50%;
}

@media screen and (min-width: $minPantalla) {
  #contenedorCreditos {
    width: 40vw;
  }
}
</style>
