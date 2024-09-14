<script setup lang="ts">
import type { ElementoLista, Listas } from '../tipos'
import { nombresListas } from '../utilidades/cerebro'

defineProps<{
  id: keyof Listas
  lista: ElementoLista[]
}>()
</script>

<template>
  <section id="{id}" class="lista">
    <h2 class="titulo">{{ nombresListas[id] }}</h2>
    <ul class="contenedorElementos" :class="id">
      <li
        v-for="(elemento, i) in lista"
        :key="elemento.slug"
        :id="elemento.slug"
        class="nodo"
        :data-tipo="id"
        :data-indice="i"
        :data-proyectos="elemento.publicaciones"
      >
        <h3 class="nombre">{{ elemento.nombre }}</h3>
        <div class="barra">
          <span class="linea" :style="'width: ' + elemento.conteo + '%'"></span>
          <span class="conteo">{{ elemento.conteo }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped></style>
