<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import Ficha from './componentes/Ficha.vue';
import { usarCerebroGeneral } from './cerebros/general';
import { storeToRefs } from 'pinia';
import { onMounted, Ref, ref } from 'vue';
const cerebroGeneral = usarCerebroGeneral();
const { paginaActual } = storeToRefs(cerebroGeneral);

const menu: Ref<HTMLElement | null> = ref(null);

function abrirCerrarMenu() {
  if (!menu.value?.classList.contains('abierto')) {
    menu.value?.classList.add('abierto');
  } else {
    menu.value?.classList.remove('abierto');
  }
}

function clicFuera(evento: MouseEvent) {
  if (!menu.value) return;
  const elemento = evento.target as HTMLElement;
  if (!(menu.value === elemento || menu.value.contains(elemento))) {
    menu.value?.classList.remove('abierto');
  }
}

onMounted(() => {
  document.body.addEventListener('click', clicFuera);
});
</script>

<template>
  <header>
    <nav id="menu" ref="menu">
      <div :onclick="abrirCerrarMenu" class="icono"><img src="/icono_cuenco.webp" /></div>
      <RouterLink class="elementoMenu" to="/">Inicio</RouterLink>
      <RouterLink class="elementoMenu" :class="paginaActual === 'colectivos' ? 'activo' : ''" to="/colectivos/mapa">
        Colectivos y Ámbitos
      </RouterLink>
      <RouterLink class="elementoMenu" to="/publicaciones">Producción Académica</RouterLink>
      <RouterLink class="elementoMenu" to="/encuentros">Encuentros</RouterLink>
      <RouterLink class="elementoMenu" to="/creditos">Créditos</RouterLink>
    </nav>
  </header>

  <Ficha />

  <RouterView />
</template>

<style lang="scss">
@use '@/scss/estilos.scss';
@use '@/scss/constantes' as *;

#menu {
  width: 100vw;
  height: $altoMenuCelular;
  display: flex;
  padding: 1em 1em;
  z-index: 9;
  line-height: 1.2;
  position: fixed;
  top: 0;
  z-index: 9;
  background-color: rgba(255, 255, 255, 0.9);
  flex-direction: column;
  overflow: hidden;

  &.abierto {
    height: 100vh;
    width: 40vw;
  }

  .elementoMenu {
    padding: 0.5em 0.7em;
    color: var(--magentaCuenco);
    display: inline-block;
    padding: 0.5rem 1rem;

    &.router-link-exact-active,
    &.activo {
      border-bottom: 1px solid;
      pointer-events: none;
    }

    &:hover {
      color: var(--azulClaroCuenco);
    }
  }
}

@media screen and (min-width: $minTablet) {
  #menu {
    max-width: 30vw;
  }
}

@media screen and (min-width: $minPantalla) {
  #menu {
    width: 100vw;
    max-width: 100vw;
    height: $altoMenuPantalla;
    justify-content: space-evenly;
    align-items: flex-start;
    padding: 1em 1em;
    flex-direction: row;
    line-height: 1.5;
    justify-content: space-around;
    align-items: center;

    &.abierto {
      height: $altoMenuPantalla;
      width: 100vw;
    }
  }
}
</style>
