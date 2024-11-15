<script setup lang="ts">
import { usarCerebroDatos } from '@/cerebros/datos';
import { usarCerebroGeneral } from '@/cerebros/general';
import Mapa from '@/componentes/Mapa.vue';
import { onMounted } from 'vue';
const cerebroGeneral = usarCerebroGeneral();
const cerebroDatos = usarCerebroDatos();

onMounted(async () => {
  cerebroGeneral.paginaActual = 'colectivos';
  await cerebroDatos.cargarDatosColectivos();
});
</script>

<template>
  <main>
    <div id="presentacion">
      <!-- <h1>Proyecto UNAL - CUENCO</h1> -->

      <img class="logo" src="/logo_cuenco.png" alt="Logo CUENCO: culturas en comunicación" />
      <img class="icono" src="/icono_cuenco.webp" alt="Icono CUENCO" />

      <p>
        Un instituto nacional de investigación, innovación y política educativa siendo un espacio colaborativo inter y
        transdisciplinar, desde el modelo intersedes, se concibe como interlocutor en materia de educación y en procesos
        internos de la universidad, y de ésta con los distintos actores de los territorios.
      </p>

      <p>
        Su existencia se constituye en una estrategia para las culturas en comunicación, lo cual rememora una propuesta
        del profesor Jesús Martín Barbero de un instituto de comunicación para la Universidad Nacional de Colombia, un
        espacio para el encuentro entre las culturas que dialogan con un propósito común:
        <span class="resaltar">culturas en comunicación (CUENCO)</span>.
      </p>

      <p>
        Así, el Proyecto Instituto Nacional de Investigación, Innovación y Política Educativa, adopta culturas en
        comunicación como su lema y la sigla <span class="resaltar">Cuenco</span> como una manera contundente de aludir
        a su horizonte de sentido. Según el Dao, la utilidad de un recipiente reside en el vacío por su capacidad de
        albergar contenido.
      </p>

      <p>
        De allí la riqueza de cuenco como el espacio posible para dialogar sobre educación en los distintos territorios
        que conforman Colombia. Cuenco es una provocación a la academia a vaciarse de preconcepciones y de la presunción
        de poseer la verdad y el conocimiento, para dar cabida al diálogo de saberes fruto del encuentro con los
        territorios de la nación. Las culturas en comunicación representan la diversidad de los territorios colombianos,
        la posesión de saberes ancestrales y una interacción con la naturaleza derivada de su entrañable relación con
        ella, más allá de los intereses de usufructo.
      </p>
    </div>

    <Mapa />
  </main>
</template>

<style lang="scss" scoped>
@use '@/scss/constantes' as *;

.icono,
.logo {
  height: auto;
  margin: 0 auto;
  display: block;
}

.logo {
  width: 60%;
}

.icono {
  margin-top: -20px;
  margin-bottom: 2em;
  // width: ;
}

h1 {
  text-align: center;
}

#presentacion {
  overflow: auto;
  margin: 0 10vw;
  padding-right: 1em;
  width: 80vw;
}

@media screen and (min-width: $minTablet) {
  #presentacion {
    margin: 0 2em;
    padding-right: 1em;
    width: 40vw;
  }
}

@media screen and (min-width: $minPantalla) {
  #presentacion {
    overflow: auto;
    margin-left: 4em;
    padding-right: 1em;
    width: 30vw;
  }
}
</style>
