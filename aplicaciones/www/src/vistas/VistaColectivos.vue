<script setup lang="ts">
import ComponenteMapa from '@/componentes/ComponenteMapa.vue';
import FichaColectivosAmbitos from '@/componentes/FichaColectivosAmbitos.vue';
import ListasColectivos from '@/componentes/ListasColectivos.vue';
import VistaGraficas from '@/componentes/VistaGraficas.vue';
import { ref, type Ref } from 'vue';

const vista: Ref<string> = ref('');
const botonGraficas: Ref<HTMLDivElement | undefined> = ref();
const botonMapa: Ref<HTMLDivElement | undefined> = ref();

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
      <ComponenteMapa />
    </div>

    <FichaColectivosAmbitos id="2" />
  </div>
</template>

<style>
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
