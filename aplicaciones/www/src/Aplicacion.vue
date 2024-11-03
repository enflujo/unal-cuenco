<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import Ficha from './componentes/Ficha.vue';
</script>

<template>
  <header>
    <nav id="menu">
      <RouterLink class="elementoMenu" to="/">Inicio</RouterLink>
      <RouterLink class="elementoMenu" to="/colectivos-ambitos">Colectivos y Ámbitos</RouterLink>
      <RouterLink class="elementoMenu" to="/publicaciones">Producción Académica</RouterLink>
      <RouterLink class="elementoMenu" to="/encuentros">Encuentros</RouterLink>
    </nav>
  </header>

  <Ficha />

  <RouterView />
</template>

<style lang="scss">
@use '@/scss/estilos.scss';

header {
  line-height: 1.5;
}

#menu {
  width: 100vw;
  display: flex;
  justify-content: space-evenly;
  padding: 1em 20em;
  position: relative;
  z-index: 9;

  .elementoMenu {
    padding: 0.5em 0.7em;
    color: var(--magentaCuenco);
    display: inline-block;
    padding: 0 1rem;

    &:hover {
      color: var(--azulClaroCuenco);
    }
  }

  .router-link-exact-active {
    border-bottom: 1px solid;
    pointer-events: none;
  }
}
</style>
