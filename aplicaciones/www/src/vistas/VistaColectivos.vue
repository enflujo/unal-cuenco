<script setup lang="ts">
import Mapa from '@/componentes/Mapa.vue';
import VistaGraficas from '@/componentes/VistaGraficas.vue';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';
import { usarCerebroGeneral } from '@/cerebros/general';
import { usarCerebroFicha } from '@/cerebros/ficha';
import { usarCerebroDatos } from '@/cerebros/datos';
import { storeToRefs } from 'pinia';
import ListaNodos from '@/componentes/ListaNodos.vue';
import { nombresListas } from '@/utilidades/constantes';

const vistaActual: Ref<string> = ref('mapa');
const cerebroDatos = usarCerebroDatos();
const cerebroGeneral = usarCerebroGeneral();
const cerebroFicha = usarCerebroFicha();
const { colectivos, listasColectivos } = storeToRefs(cerebroDatos);
const vistas = [
  { llave: 'mapa', nombre: 'Mapa' },
  { llave: 'grafica', nombre: 'Gráficas' },
];

onMounted(async () => {
  cerebroGeneral.paginaActual = 'colectivos';
  await cerebroDatos.cargarDatosColectivos();
});

onUnmounted(() => {
  cerebroFicha.fichaVisible = false;
});

function elegirVista(vistaElegida: string) {
  vistaActual.value = vistaElegida;
}
</script>

<template>
  <main>
    <nav class="columna columna1 contenedorListas" v-if="listasColectivos">
      <ListaNodos v-for="(lista, llave) in listasColectivos" :tipo="llave" :lista="lista">
        <h2 class="titulo" @click="cerebroDatos.cambiarLista(llave)">{{ nombresListas[llave] }}</h2>
      </ListaNodos>
    </nav>

    <div class="columna columna2">
      <ul class="botonesVista">
        <li
          v-for="vista in vistas"
          :key="`vista-${vista.llave}`"
          class="botonVista"
          :class="vista.llave === vistaActual ? 'activo' : ''"
          @click="elegirVista(vista.llave)"
        >
          {{ vista.nombre }}
        </li>
      </ul>

      <VistaGraficas pagina="colectivos" v-if="vistaActual === 'grafica'" />
      <Mapa v-else="vistaActual === 'mapa'" />
    </div>

    <div class="columna columna3 contenedorListas" v-if="colectivos">
      <ListaNodos tipo="colectivos" :lista="colectivos">
        <h1 class="titulo" @click="cerebroDatos.cambiarLista('colectivos')">Colectivos y Ámbitos</h1>
      </ListaNodos>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@use '@/scss/constantes' as *;

.botonesVista {
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

  &.activo {
    background-color: var(--azulClaroCuenco);
    color: var(--blanco);
  }
}
</style>
