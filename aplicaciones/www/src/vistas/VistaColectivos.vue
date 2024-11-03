<script setup lang="ts">
import Mapa from '@/componentes/Mapa.vue';
import ListasColectivos from '@/componentes/ListasColectivos.vue';
import VistaGraficas from '@/componentes/VistaGraficas.vue';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';
import { usarCerebroGeneral } from '@/cerebros/general';
import { usarCerebroFicha } from '@/cerebros/ficha';
import { usarCerebroDatos } from '@/cerebros/datos';

const vista: Ref<string> = ref('');
const botonGraficas: Ref<HTMLDivElement | undefined> = ref();
const botonMapa: Ref<HTMLDivElement | undefined> = ref();
const cerebroDatos = usarCerebroDatos();
const cerebroGeneral = usarCerebroGeneral();
const cerebroFicha = usarCerebroFicha();

onMounted(async () => {
  cerebroGeneral.paginaActual = 'colectivos';
  await cerebroDatos.cargarDatosColectivos();
});

onUnmounted(() => {
  cerebroFicha.fichaVisible = false;
});

function elegirVista(vistaElegida: string) {
  vista.value = vistaElegida;
}
</script>

<template>
  <div>
    <h1 class="tituloSeccion">Colectivos y Ámbitos</h1>

    <div class="botonesVista">
      <div class="botonVista" ref="botonGraficas" @click="elegirVista('grafica')">Gráficas</div>
      <div class="botonVista" ref="botonMapa" @click="elegirVista('mapa')">Mapa</div>
    </div>

    <ListasColectivos />

    <div v-if="vista === 'grafica'">
      <VistaGraficas pagina="colectivos" />
    </div>

    <div v-else="vista === 'mapa'">
      <Mapa />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.botonesVista {
  position: relative;
  left: 20vw;
  display: flex;
  justify-content: flex-start;
  width: 20vw;
}
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
}
</style>
