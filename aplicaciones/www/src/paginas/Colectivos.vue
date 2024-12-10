<script setup lang="ts">
import Mapa from '@/componentes/Mapa.vue';
import VistaGraficas from '@/componentes/VistaGraficas.vue';
import { onMounted, onUnmounted } from 'vue';
import { usarCerebroGeneral } from '@/cerebros/general';
import { usarCerebroFicha } from '@/cerebros/ficha';
import { usarCerebroDatos } from '@/cerebros/datos';
import { storeToRefs } from 'pinia';
import ListaNodos from '@/componentes/ListaNodos.vue';
import { nombresListas } from '@/utilidades/constantes';
import { RouterLink } from 'vue-router';

const cerebroDatos = usarCerebroDatos();
const cerebroGeneral = usarCerebroGeneral();
const cerebroFicha = usarCerebroFicha();
const { colectivos, listasColectivos } = storeToRefs(cerebroDatos);
const { vistaColectivos } = storeToRefs(cerebroGeneral);
const vistas = [
  { llave: 'mapa', nombre: 'Mapa' },
  { llave: 'graficas', nombre: 'Gráficas' },
];

onMounted(async () => {
  cerebroGeneral.paginaActual = 'colectivos';
  await cerebroDatos.cargarDatosColectivos();
});

onUnmounted(() => {
  cerebroFicha.fichaVisible = false;
});
</script>

<template>
  <main>
    <nav class="columna columna1 contenedorListas" v-if="listasColectivos">
      <ListaNodos v-for="(lista, llave) in listasColectivos" :tipo="llave" :lista="lista" tipoLista="menu">
        <h2 class="titulo" @click="cerebroDatos.cambiarLista(llave)">{{ nombresListas[llave] }}</h2>
      </ListaNodos>
    </nav>

    <div class="columna columna2">
      <div class="botonesVista">
        <RouterLink
          v-for="vista in vistas"
          :to="`/colectivos/${vista.llave}`"
          :key="`vista-${vista.llave}`"
          class="botonVista"
          :class="vista.llave === vistaColectivos ? 'activo' : ''"
        >
          {{ vista.nombre }}
        </RouterLink>
      </div>

      <VistaGraficas v-if="vistaColectivos === 'graficas'" />
      <Mapa v-else="vistaActual === 'mapa'" />
    </div>

    <div class="columna columna3 contenedorListas" v-if="colectivos">
      <ListaNodos tipo="colectivos" :lista="colectivos" tipoLista="lista">
        <h1 class="titulo">Colectivos y Ámbitos</h1>
      </ListaNodos>
    </div>
  </main>
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
