<script setup lang="ts"></script>

<template>
  <div>
    <div id="fichaPA">
      <div id="contenedorFicha">
        <div id="encabezado">
          <div id="superior">
            <div>#id</div>
            <div>tipo</div>
            <div id="cerrarFichaPA">X</div>
          </div>
          <div id="inferior">
            <h2>Título</h2>
          </div>
        </div>
        <div id="contenido">
          <p>
            Un instituto nacional de investigación, innovación y política educativa siendo un espacio colaborativo inter
            y transdisciplinar, desde el modelo intersedes, se concibe como interlocutor en materia de educación y en
            procesos internos de la universidad, y de ésta con los distintos actores de los territorios. Su existencia
            se constituye en una estrategia para las culturas en comunicación, lo cual rememora una propuesta del
            profesor Jesús Martín Barbero de un instituto de comunicación para la Universidad Nacional de Colombia, un
            espacio para el encuentro entre las culturas que dialogan con un propósito común: culturas en comunicación
            (CUENCO). Así, el Proyecto Instituto Nacional de Investigación, Innovación y Política Educativa, adopta
            culturas en comunicación como su lema y la sigla Cuenco como una manera contundente de aludir a su horizonte
            de sentido. Según el Dao, la utilidad de un recipiente reside en el vacío por su capacidad de albergar
            contenido . De allí la riqueza de cuenco como el espacio posible para dialogar sobre educación en los
            distintos territorios que conforman Colombia. Cuenco es una provocación a la academia a vaciarse de
            preconcepciones y de la presunción de poseer la verdad y el conocimiento, para dar cabida al diálogo de
            saberes fruto del encuentro con los territorios de la nación. Las culturas en comunicación representan la
            diversidad de los territorios colombianos, la posesión de saberes ancestrales y una interacción con la
            naturaleza derivada de su entrañable relación con ella, más allá de los intereses de usufructo.
          </p>
        </div>
      </div>
    </div>
    <ComponenteMapa />
  </div>
</template>

<style lang="scss">
#fichaPA {
  z-index: 99;
  width: 25vw;
  height: 70vh;
  background-color: var(--azulOscuroCuenco);
  display: block;
  position: absolute;
  right: 5vw;
  top: 100px;
  border-radius: 20px;
  padding: 1em;

  #contenedorFicha {
    border: 1px white solid;
    height: 100%;
  }

  #encabezado {
    background-color: var(--blanco);
    height: 25%;
    color: var(--magentaCuenco);
    padding: 0.5em 1em;

    #superior {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid var(--magentaCuenco);
    }

    #inferior {
    }
  }

  h2 {
    margin: 0;
  }

  #contenido {
    overflow-y: scroll;
    height: 70%;
    color: white;
    padding: 2em;
  }
}
</style>
