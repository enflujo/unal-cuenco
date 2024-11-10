<script setup lang="ts">
import { usarCerebroFicha } from '@/cerebros/ficha';
import type { TiposNodo } from '@/tipos';
import type { Colectivo, ElementoLista, Publicacion } from '@/tipos/compartidos';

interface Esquema {
  tipo: TiposNodo;
  lista: ElementoLista[] | Colectivo[] | Publicacion[];
}

defineProps<Esquema>();
const cerebroFicha = usarCerebroFicha();

function abrirElemento(evento: MouseEvent, i: string, id: TiposNodo) {
  evento.stopPropagation();
  cerebroFicha.seleccionarNodo(i, id);
}
</script>

<template>
  <section :id="tipo" class="lista">
    <slot />

    <ul class="contenedorElementos" :class="tipo">
      <li
        v-for="elemento in lista"
        :key="`${tipo}-${elemento.id}`"
        @click="abrirElemento($event, elemento.id, tipo)"
        class="nodo"
        :class="cerebroFicha.llaveLista === tipo && elemento.id === cerebroFicha.idActual ? 'actual' : ''"
        :data-tipo="tipo"
        :data-id="elemento.id"
        :data-publicaciones="'publicaciones' in elemento ? elemento.publicaciones : null"
        :data-colectivos="'colectivos' in elemento ? elemento.colectivos : null"
      >
        {{ 'nombre' in elemento ? elemento.nombre : elemento.titulo.nombre }}
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.lista {
  .titulo {
    cursor: pointer;
  }

  .nodo {
    margin: 0;
    font-size: 0.85em;
    line-height: 1.1;
    cursor: pointer;
    padding: 0.3em 0;

    &:hover {
      background-color: var(--verdeCuenco);
    }

    &.actual {
      background-color: var(--magentaCuenco);
      color: var(--blanco);
    }
  }
}
</style>
