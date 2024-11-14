<script setup lang="ts">
// import { usarCerebroDatos } from '@/cerebros/datos';
import { usarCerebroFicha } from '@/cerebros/ficha';
import { usarCerebroGeneral } from '@/cerebros/general';
import { llavesRelacionesColectivos } from '@/utilidades/constantes';
import { storeToRefs } from 'pinia';
import { type Ref, ref, watch } from 'vue';
import Dona from './Dona.vue';

const cerebroGeneral = usarCerebroGeneral();
const cerebroFicha = usarCerebroFicha();
const { datosFicha } = storeToRefs(cerebroFicha);
const total = ref(0);
const tituloTotal: Ref<string | null> = ref(null);

watch(datosFicha, (datos) => {
  if (!datos) return;

  tituloTotal.value = null;

  if (cerebroGeneral.paginaActual === 'colectivos') {
    llavesRelacionesColectivos.forEach((llave) => {
      console.log(llave, datos[llave]);
    });

    if (datos.tipo === 'colectivos') {
    } else {
      total.value = datos.colectivos ? datos.colectivos.length : 0;
      tituloTotal.value = 'Total colectivos: ';
    }
  } else if (cerebroGeneral.paginaActual === 'publicaciones') {
    if (datos.tipo === 'publicaciones') {
    } else {
      total.value = datos.publicaciones ? datos.publicaciones.length : 0;
      tituloTotal.value = 'Total publicaciones: ';
    }
  }
  console.log(datos);
});
</script>

<template>
  <div class="contenedorVisFicha">
    <div class="fichaConteo" v-if="tituloTotal">
      <p class="valorConteo">{{ tituloTotal }} {{ total }}</p>
    </div>

    <Dona :grosor="3" :secciones="[80, 10, 10]" />
  </div>
</template>

<style lang="scss" scoped>
.contenedorVisFicha {
  color: white;
  width: 50%;
}

.fichaConteo {
  padding: 1rem;
  border: 1px solid;
  border-radius: 0.5rem;
  margin: 0.5rem;
  font-weight: bold;
  display: inline-block;
}
</style>
