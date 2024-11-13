<script setup lang="ts"></script>

<template>
  <main class="pagina-404">
    <div class="error">
      <h1>404 - La página no existe</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <p><router-link to="/">Volver al inicio</router-link></p>

      <div class="hueco"><img class="invertido" src="/icono_cuenco.webp" alt="Error 404" /></div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'Vista404',
};
</script>

<style lang="scss" scoped>
@use '@/scss/constantes' as *;

.pagina-404 {
  text-align: center;
  margin-top: $altoMenuPantalla;
  width: 100vw;
  display: block;
  min-height: 100vh;
  padding-top: 3em;
  background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='scale(5) rotate(125)'><rect x='0' y='0' width='100%' height='100%' fill='%23eeeeeeff'/><path d='m25.57 20.66 13.77 13.77-4.91 4.91-13.77-13.77zm13.77 4.91L25.57 39.11l-4.91-4.91 13.77-13.54zm-20-11.14-4.91 4.91L.66 5.57 5.57.66zM5.57 19.34.66 14.43 14.43.66l4.91 4.91z'  stroke-width='8' stroke='none' fill='%23f2f2f2ff'/><path d='M34.43 19.34 20.66 5.57 25.57.66l13.77 13.77zm-13.77-4.91L34.43.66l4.91 4.91-13.77 13.77zm-1.32 20-4.91 4.91L.66 25.57l4.91-4.91zM5.57 39.34.66 34.43l13.77-13.77 4.91 4.91z'  stroke-width='8' stroke='none' fill='%23e9e9e9ff'/></pattern></defs><rect width='800%' height='800%' transform='translate(-225,-30)' fill='url(%23a)'/></svg>");
}

.invertido {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: rotar 5s linear infinite;
}

.hueco {
  display: block;
  margin: 0 auto;
  padding: 2em;
  border-radius: 50%;
  width: 200px;
  height: 200px;
  position: relative;
}

@keyframes rotar {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
