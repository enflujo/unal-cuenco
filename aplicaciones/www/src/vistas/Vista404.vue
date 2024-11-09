<template>
  <main class="pagina-404">
    <div class="error">
      <h1>404 - La página no existe</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <p><router-link class="enlace" to="/">Volver al inicio</router-link></p>

      <img class="invertido" src="/icono_cuenco.webp" alt="Error 404" />
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
  margin-top: $altoMenu;
  width: 100vw;
  display: block;
  min-height: 100vh;
  @include gradienteAzulCircular;
  color: white;
  padding-top: 3em;
}

.invertido {
  transform: scaleY(-1);
  display: block;
  margin: 1em auto;
}
</style>
