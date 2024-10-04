<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import ListaNodos from './ListaNodos.vue';
import { pedirDatos } from '@/utilidades/ayudas';
import { ListasPublicaciones } from '@/tipos/compartidos';

const listas: Ref<ListasPublicaciones | undefined> = ref();

onMounted(async () => {
  try {
    const datosListas = await pedirDatos<ListasPublicaciones>('datos/listas.json');

    if (datosListas) listas.value = datosListas;
  } catch (error) {
    console.error('Problema descargando datos de listas de publicaciones', error);
  }
});
</script>

<template>
  <div id="contenedorListas" class="todoVisible" v-if="listas">
    <ListaNodos v-for="(lista, llave) in listas" :id="llave" :lista="lista" />
  </div>
</template>

<style lang="scss" scoped>
#contenedorListas {
  display: flex;
  flex-wrap: wrap;
}
</style>
