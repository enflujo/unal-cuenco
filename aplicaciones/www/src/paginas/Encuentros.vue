<script setup lang="ts">
import { usarCerebroFicha } from '@/cerebros/ficha';
import { usarCerebroGeneral } from '@/cerebros/general';
import { usarCerebroDatos } from '@/cerebros/datos';
import { onMounted, onUnmounted, watch } from 'vue';
import { storeToRefs } from 'pinia';

const cerebroGeneral = usarCerebroGeneral();
const cerebroFicha = usarCerebroFicha();
const cerebroDatos = usarCerebroDatos();

const { listasCaracterizacion, encuentroCaracterizacion } = storeToRefs(cerebroDatos);

onMounted(async () => {
  cerebroGeneral.paginaActual = 'encuentros';
  await cerebroDatos.cargarListasCaracterizacion();
  await cerebroDatos.cargarDatosCaracterizacion();
  console.log(encuentroCaracterizacion.value);
});

onUnmounted(() => {
  cerebroFicha.fichaVisible = false;
});
</script>

<template>
  <main>
    <diV id="contenedorEncuentros">
      <h1>Encuentros</h1>

      <div>
        <h2>Caracterización por encuentro</h2>
        <h3></h3>
        <li v-for="encuentro in encuentroCaracterizacion">
          {{ encuentro?.numero }}:
          <p v-for="sede in encuentro?.sedes">{{ sede.slug }}: {{ sede.conteo }}</p>
        </li>
      </div>
      <div>
        <h2>Caracterización total</h2>
        <h3>Asistencia total por sede:</h3>
        <li v-for="lista in listasCaracterizacion?.sedes">{{ lista.nombre }}: {{ lista.conteo }}</li>

        <h3>Asistencia total por roles:</h3>
        <li v-for="lista in listasCaracterizacion?.roles">{{ lista.nombre }}: {{ lista.conteo }}</li>

        <h3>Asistencia total por cargo:</h3>
        <li v-for="lista in listasCaracterizacion?.cargos">{{ lista.nombre }}: {{ lista.conteo }}</li>
      </div>
    </diV>
  </main>
</template>

<style lang="scss" scoped>
#contenedorEncuentros {
  width: 70vw;
  margin-left: 10vw;
  margin-top: 5vw;
}
</style>
