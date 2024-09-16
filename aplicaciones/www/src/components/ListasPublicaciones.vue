<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import ListaNodos from './ListaNodos.vue';
import { Listas } from '@/tipos';

const listas: Ref<Listas | undefined> = ref();

onMounted(async () => {
  try {
    const datosListas = await fetch('datos/listas.json').then((res) => res.json());
    if (datosListas) listas.value = datosListas;
  } catch (error) {
    console.error('Problema descargando datos de listas de publicaciones', error);
  }
});

defineProps<{}>();
</script>

<template>
  <div id="contenedorListas" class="todoVisible" v-if="listas">
    <ListaNodos v-for="(lista, llave) in listas" :id="llave" :lista="lista" />
  </div>
</template>

<style scoped></style>
