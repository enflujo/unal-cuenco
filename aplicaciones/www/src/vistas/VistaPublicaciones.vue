<script setup lang="ts">
import ComponenteMapa from '@/componentes/ComponenteMapa.vue';
import LineaTiempo from '@/componentes/LineaTiempo.vue';
import ListasPublicaciones from '@/componentes/ListasPublicaciones.vue';
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
    <h1 class="tituloSeccion">Producción Académica</h1>
    <div class="botonesVista">
      <div class="botonVista" ref="botonGraficas" @click="elegirVista('grafica')">Gráficas</div>
      <div class="botonVista" ref="botonMapa" @click="elegirVista('mapa')">Mapa</div>
    </div>
    <ListasPublicaciones />

    <div v-if="vista === 'grafica'">
      <VistaGraficas pagina="publicaciones" />
    </div>

    <div v-else="vista === 'mapa'">
      <ComponenteMapa />
    </div>

    <LineaTiempo />
    <!--  <FichaProduccionAcademica /> -->
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
  margin: 1em;
  cursor: pointer;
}
</style>
