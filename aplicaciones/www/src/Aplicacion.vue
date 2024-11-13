<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import Ficha from './componentes/Ficha.vue';
import { usarCerebroGeneral } from './cerebros/general';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, Ref, ref } from 'vue';
import Buscador from './componentes/Buscador.vue';
const cerebroGeneral = usarCerebroGeneral();
const { paginaActual } = storeToRefs(cerebroGeneral);

const abierto = ref(false);
const menu: Ref<HTMLDivElement | null> = ref(null);

function abrirCerrarMenu(evento: MouseEvent) {
  evento.stopPropagation();
  abierto.value = !abierto.value;
}

function clicFuera(evento: MouseEvent) {
  evento.stopPropagation();
  if (!menu.value) return;
  const elemento = evento.target as HTMLElement;
  const icono = elemento.classList.contains('icono');
  if (icono) return;
  if (!(menu.value === elemento || menu.value.contains(elemento))) {
    abierto.value = false;
  }
}

onMounted(() => {
  document.body.addEventListener('click', clicFuera);
});

onUnmounted(() => {
  document.body.removeEventListener('click', clicFuera);
});
</script>

<template>
  <header id="encabezado">
    <div :onclick="abrirCerrarMenu" class="icono"><img src="/icono_cuenco.webp" /></div>
    <nav id="menu" ref="menu" :class="abierto ? 'abierto' : ''">
      <RouterLink class="elementoMenu" to="/">Inicio</RouterLink>
      <RouterLink class="elementoMenu" :class="paginaActual === 'colectivos' ? 'activo' : ''" to="/colectivos/mapa">
        Colectivos y Ámbitos
      </RouterLink>
      <RouterLink class="elementoMenu" to="/publicaciones">Producción Académica</RouterLink>
      <RouterLink class="elementoMenu" to="/encuentros">Encuentros</RouterLink>
      <RouterLink class="elementoMenu" to="/creditos">Créditos</RouterLink>
    </nav>

    <Buscador />
  </header>

  <Ficha />

  <RouterView />
</template>

<style lang="scss">
@use '@/scss/estilos.scss';
@use '@/scss/constantes' as *;

#encabezado {
  height: $altoMenuCelular;
  display: flex;
  position: fixed;
  top: 0;
  z-index: 9;
  width: 100vw;
}

.icono {
  padding: 1em;
}

#menu {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  background-color: rgba(255, 255, 255, 0.9);
  position: fixed;
  top: $altoMenuCelular + 20;
  overflow: hidden;
  height: 0;
  transition: all 0.25s ease-in-out;

  &.abierto {
    height: 100vh;
    width: 70vw;
  }

  .elementoMenu {
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

@media screen and (min-width: $minPantalla) {
  #encabezado {
    height: $altoMenuPantalla;
    justify-content: space-between;
  }

  #menu {
    align-items: flex-start;
    flex-direction: row;
    line-height: 1.5;
    align-items: center;
    position: relative;
    height: $altoMenuPantalla;
    top: 0;

    &.abierto {
      height: $altoMenuPantalla;
      width: initial;
    }
  }
}
</style>
