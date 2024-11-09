<script setup lang="ts">
import Mapa from '@/componentes/Mapa.vue';
import LineaTiempo from '@/componentes/LineaTiempo.vue';
import VistaGraficas from '@/componentes/VistaGraficas.vue';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';
import { usarCerebroGeneral } from '@/cerebros/general';
import { usarCerebroDatos } from '@/cerebros/datos';
import { usarCerebroFicha } from '@/cerebros/ficha';
import { storeToRefs } from 'pinia';
import ListaNodos from '@/componentes/ListaNodos.vue';
import { nombresListas } from '@/utilidades/constantes';

const vista: Ref<string> = ref('');
const botonGraficas: Ref<HTMLDivElement | undefined> = ref();
const botonMapa: Ref<HTMLDivElement | undefined> = ref();
const cerebroDatos = usarCerebroDatos();
const cerebroGeneral = usarCerebroGeneral();
const cerebroFicha = usarCerebroFicha();
const { publicaciones, listasPublicaciones } = storeToRefs(cerebroDatos);

onMounted(async () => {
  cerebroGeneral.paginaActual = 'publicaciones';
  await cerebroDatos.cargarDatosPublicaciones();
  vista.value = 'grafica';
});

onUnmounted(() => {
  cerebroFicha.fichaVisible = false;
});
</script>

<template>
  <main>
    <nav class="columna columna1 contenedorListas" v-if="listasPublicaciones">
      <ListaNodos v-for="(lista, llave) in listasPublicaciones" :tipo="llave" :lista="lista">
        <h2 class="titulo" @click="cerebroDatos.cambiarLista(llave)">{{ nombresListas[llave] }}</h2>
      </ListaNodos>
    </nav>

    <div class="columna columna2">
      <VistaGraficas v-if="vista === 'grafica'" pagina="publicaciones" />
    </div>

    <div class="columna columna3 contenedorListas" v-if="publicaciones">
      <ListaNodos tipo="publicaciones" :lista="publicaciones">
        <h1 class="titulo" @click="cerebroDatos.cambiarLista('publicaciones')">Producción Académica</h1>
      </ListaNodos>
    </div>

    <LineaTiempo />
  </main>
</template>

<style lang="scss" scoped>
@use '@/scss/constantes' as *;

.columna {
  height: calc(100vh - $altoMenu - $altoLinea);
}

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
