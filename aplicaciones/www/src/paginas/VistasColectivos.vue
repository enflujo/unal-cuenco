<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usarCerebroGeneral } from '@/cerebros/general';
import { TiposDeVistas } from '@/tipos';
import Colectivos from './Colectivos.vue';

const ruta = useRoute();
const cerebroGeneral = usarCerebroGeneral();

onMounted(() => {
  cerebroGeneral.paginaActual = 'colectivos';
  cerebroGeneral.vistaColectivos = ruta.params.vista as TiposDeVistas;
});

watch(
  () => ruta.params.vista,
  (vistaActual, vistaAnterior) => {
    if (vistaAnterior === vistaActual) return;
    cerebroGeneral.vistaColectivos = vistaActual as TiposDeVistas;
  }
);
</script>

<template>
  <Colectivos />
</template>

<style lang="scss" scoped>
@use '@/scss/constantes' as *;

.tituloSeccion {
  text-align: center;
}

.botonVista {
  color: var(--magentaCuenco);
  margin: 1em;
  cursor: pointer;
  border: 1px solid var(--azulClaroCuenco);
  border-radius: 5px;
  padding: 0.3em;

  &:hover {
    color: var(--azulClaroCuenco);
  }

  &.activo {
    background-color: var(--azulClaroCuenco);
    color: var(--blanco);
  }
}
</style>
