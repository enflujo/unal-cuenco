<script setup lang="ts">
import { usarCerebroDatos } from '@/cerebros/datos';
import { usarCerebroFicha } from '@/cerebros/ficha';
import type { ElementoLista, LlavesColectivos, LlavesPublicaciones } from '@/tipos/compartidos';
import { nombresListas } from '@/utilidades/constantes';

interface Esquema {
  id: LlavesPublicaciones | LlavesColectivos;
  lista: ElementoLista[];
}

defineProps<Esquema>();
const cerebroDatos = usarCerebroDatos();
const cerebroFicha = usarCerebroFicha();
</script>

<template>
  <section :id="id" class="lista">
    <h2 class="titulo" @click="cerebroDatos.cambiarLista(id)">{{ nombresListas[id] }}</h2>

    <ul class="contenedorElementos" :class="id">
      <li
        v-for="(elemento, i) in lista"
        :key="elemento.slug"
        :id="elemento.slug"
        @click="cerebroFicha.seleccionarNodo(i, id)"
        class="nodo"
        :class="cerebroFicha.llaveLista === id && i === cerebroFicha.indiceActual ? 'actual' : ''"
        :data-tipo="id"
        :data-indice="i"
        :data-publicaciones="elemento.publicaciones"
        :data-colectivos="elemento.colectivos"
      >
        {{ elemento.nombre }}
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.lista {
  padding: 0 1em 1em 1em;

  .titulo {
    cursor: pointer;
  }

  .nodo {
    margin: 0;
    font-size: 0.85em;
    line-height: 1.2;

    &.actual {
      background-color: var(--magentaCuenco);
      color: var(--blanco);
    }
  }
}
</style>
