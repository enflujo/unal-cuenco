<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav id="menu">
      <RouterLink to="/">Inicio</RouterLink>
      <RouterLink to="/colectivos-ambitos">Colectivos y Ámbitos</RouterLink>
      <RouterLink to="/publicaciones">Producción Académica</RouterLink>
      <RouterLink to="/encuentros">Encuentros</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
