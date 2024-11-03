<script setup lang="ts">
import { usarCerebroFicha } from '@/cerebros/ficha';
import type { TiposNodo } from '@/tipos';
import type { Colectivo, ElementoLista, Publicacion } from '@/tipos/compartidos';

interface Esquema {
  id: TiposNodo;
  lista: ElementoLista[] | Colectivo[] | Publicacion[];
}

defineProps<Esquema>();
const cerebroFicha = usarCerebroFicha();

function abrirElemento(evento: MouseEvent, i: number, id: TiposNodo) {
  evento.stopPropagation();
  cerebroFicha.seleccionarNodo(i, id);
}
</script>

<template>
  <section :id="id" class="lista">
    <slot />

    <ul class="contenedorElementos" :class="id">
      <li
        v-for="(elemento, i) in lista"
        :key="`${id}-${i}`"
        @click="abrirElemento($event, i, id)"
        class="nodo"
        :class="cerebroFicha.llaveLista === id && i === cerebroFicha.indiceActual ? 'actual' : ''"
        :data-tipo="id"
        :data-indice="i"
        :data-publicaciones="'publicaciones' in elemento ? elemento.publicaciones : null"
        :data-colectivos="'colectivos' in elemento ? elemento.colectivos : null"
      >
        {{ 'nombre' in elemento ? elemento.nombre : elemento.titulo.nombre }}
      </li>
    </ul>
  </section>
</template>
