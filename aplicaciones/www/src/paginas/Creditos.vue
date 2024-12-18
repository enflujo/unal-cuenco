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

      <p>
        Diferentes Facultades, Dependencias y Unidades Académico Administrativas de las Sedes Andinas (Bogotá, Medellín,
        Manizales, Palmira y De La Paz) y de las Sedes de Presencia Nacional (Amazonía, Caribe, Orinoquia y Tumaco) de
        la Universidad Nacional de Colombia trabajan en Cuenco de manera independiente e inarticulada. Por esta razón,
        el Instituto Nacional es el llamado a liderar y promover las acciones pertinentes en las áreas de investigación,
        innovación y política educativa, bajo una propuesta integrativa y desde el modelo intersedes. Por ende, le
        concierne proyectar en el medio externo la labor institucional en las áreas del conocimiento que enuncia, siendo
        estratégicas para el desarrollo de las regiones, tanto de las de influencia actual de la universidad como de los
        territorios nacionales en general.
      </p>

      <h2>Créditos Cuenco</h2>

      <p>Investigación</p>
      <p>Consolidación de datos</p>
      <p>...</p>

      <h2>Diseño y desarrollo</h2>
      <p>Juan Camilo González y Antonia Bustamante - <a href="https://enflujo.com/">Laboratorio EnFlujo</a></p>
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
