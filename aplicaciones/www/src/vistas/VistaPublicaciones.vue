<script setup lang="ts">
import Mapa from '@/componentes/Mapa.vue';
import LineaTiempo from '@/componentes/LineaTiempo.vue';
import ListasPublicaciones from '@/componentes/ListasPublicaciones.vue';
import VistaGraficas from '@/componentes/VistaGraficas.vue';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';
import { usarCerebroGeneral } from '@/cerebros/general';
import { usarCerebroDatos } from '@/cerebros/datos';
import { usarCerebroFicha } from '@/cerebros/ficha';

const vista: Ref<string> = ref('');
const botonGraficas: Ref<HTMLDivElement | undefined> = ref();
const botonMapa: Ref<HTMLDivElement | undefined> = ref();
const cerebroDatos = usarCerebroDatos();
const cerebroGeneral = usarCerebroGeneral();
const cerebroFicha = usarCerebroFicha();

onMounted(async () => {
  cerebroGeneral.paginaActual = 'publicaciones';
  await cerebroDatos.cargarDatosPublicaciones();
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
      <Mapa />
    </div>

    <LineaTiempo />
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
  margin: 1em;
  cursor: pointer;
}
</style>
