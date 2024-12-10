<script setup lang="ts">
import { usarCerebroDatos } from '@/cerebros/datos';
import { usarCerebroFicha } from '@/cerebros/ficha';
import type { TiposNodo } from '@/tipos';
import type { Colectivo, ElementoLista, Publicacion } from '@/tipos/compartidos';
import { storeToRefs } from 'pinia';

interface Esquema {
  tipo: TiposNodo;
  lista: ElementoLista[] | Colectivo[] | Publicacion[];
  tipoLista: 'menu' | 'lista';
}

const cerebroDatos = usarCerebroDatos();
const { publicaciones } = storeToRefs(cerebroDatos);

defineProps<Esquema>();
const cerebroFicha = usarCerebroFicha();

function abrirElemento(evento: MouseEvent, i: string, id: TiposNodo) {
  evento.stopPropagation();
  cerebroFicha.seleccionarNodo(i, id);
}
</script>

<template>
  <section :id="tipo" class="lista" :class="`${tipoLista === 'menu' ? 'menu' : 'listaProyectos'}`">
    <slot />

    <ul v-if="cerebroDatos.listaElegida === tipo || tipoLista === 'lista'" class="contenedorElementos" :class="tipo">
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

<style lang="scss" global>
@use '@/scss/constantes' as *;
.lista {
  &.menu {
    max-height: 35vh;
  }
  &.listaProyectos {
    max-height: 70vh;
    padding-bottom: 2em;
  }
  overflow: auto;
  .titulo {
    cursor: pointer;
    margin: 0.5em 0 0em 0em;
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
@media screen and (min-width: $minTablet) {
  .lista {
    &.menu {
      max-height: 55vh;
    }
    &.listaProyectos {
      max-height: calc(90vh - $altoMenuPantalla);
      padding-bottom: 0;
      padding-right: 2em;
    }
  }
}
</style>
