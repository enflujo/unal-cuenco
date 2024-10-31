<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
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

  <RouterView />
</template>

<style lang="scss">
@use '@/scss/_constantes.scss';
</style>
