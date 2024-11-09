<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import Ficha from './componentes/Ficha.vue';
</script>

<template>
  <header>
    <nav id="menu">
      <RouterLink class="icono" to="/"><img src="/icono_cuenco.webp" /></RouterLink>
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
@use '@/scss/constantes' as *;

#menu {
  width: 100vw;
  height: $altoMenu;
  display: flex;
  justify-content: space-evenly;
  padding: 1em 20em;
  z-index: 9;
  line-height: 1.5;
  position: fixed;
  top: 0;
  z-index: 9;
  background-color: rgba(255, 255, 255, 0.8);

  .elementoMenu {
    padding: 0.5em 0.7em;
    color: var(--magentaCuenco);
    display: inline-block;
    padding: 0 1rem;

    &.router-link-exact-active {
      border-bottom: 1px solid;
      pointer-events: none;
    }

    &:hover {
      color: var(--azulClaroCuenco);
    }
  }
}
</style>
