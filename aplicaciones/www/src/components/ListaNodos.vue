<script setup lang="ts">
import type { ElementoLista, LlavesColectivos, LlavesPA } from '@/tipos/compartidos';
import { nombresListas, usarCerebro } from '@/utilidades/cerebro';

interface Esquema {
  id: LlavesPA | LlavesColectivos;
  lista: ElementoLista[];
}

defineProps<Esquema>();

const cerebro = usarCerebro();
</script>

<template>
  <section :id="id" class="lista">
    <h2 class="titulo" @click="cerebro.cambiarLista(id)">{{ nombresListas[id] }}</h2>

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
          <span class="linea" :style="`width:${elemento.conteo}%`"></span>
          <span class="conteo">{{ elemento.conteo }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.lista {
  padding: 0 1em 1em 1em;
}
</style>
