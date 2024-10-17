<script setup lang="ts">
import { type Ref, ref } from 'vue';

// ¿Cómo se hace un custom element?
/*import { defineCustomElement } from 'vue';

const SeccionFicha = defineCustomElement({
  // opciones normales de los componentes de Vue
  props: {
    IdPublicacion: Number,
  },
  emits: {},
  template: `...`,

  // solo para defineCustomElement: CSS to be injected into shadow root (?)
  //styles: [` inlined css `]
});

// Registrar el elemento personalizado
customElements.define('seccion-ficha', SeccionFicha);*/

defineProps<{
  id: number;
}>();

const cerrarFichaPA: Ref<HTMLDivElement | undefined> = ref();

function cerrarFicha() {
  console.log('cerrar ficha');
}
</script>

<template>
  <div>
    <div id="fichaPA">
      <div id="contenedorFicha">
        <section id="encabezado">
          <div id="superior">
            <div class="negrita">#{{ id }}</div>
            <div class="negrita">Tesis de Maestría</div>
            <div class="boton" id="cerrarFichaPA" ref="cerrarFichaPA" @click="cerrarFicha">X</div>
          </div>
          <div id="inferior">
            <div class="boton" id="botonAnterior"><</div>
            <h3 id="tituloFicha">
              Una historia sin palabras: leyendo el mundo de la discapacidad desde el área de Educación Física
            </h3>
            <p class="negrita" id="año">2004</p>
            <div class="boton" id="botonSiguiente">></div>
          </div>
        </section>
        <section id="contenido">
          <p id="resumenFicha">
            Este proyecto de investigación pretende enriquecer los procesos de inclusión educativa de la población con
            discapacidad, mediante el diseño de una estrategia pedagógica en el área de educación física, que brinde los
            apoyos y fortalezca la articulación con las habilidades sociales, al favorecer el entretejido de estas
            competencias y aportar mayor solidez a los proyectos de vida de los estudiantes con discapacidad cognitiva.
            Uno de los hallazgos más interesantes de esta investigación fue el fortalecimiento desde el área de
            educación física, no solo de las habilidades sociales, si no, de las habilidades para la vida y la
            comunicación funcional, las cuales se ven reflejadas a la par en los resultados de cada momento de la
            estrategia pedagógica Es importante resaltar que en los estudiantes con discapacidad se identifica mayor
            necesidad en el desarrollo del pensamiento, la interpretación de acciones, el manejo de elementos del
            entorno y la comprensión del lenguaje en contexto. De aquí nace la necesidad de una flexibilización
            curricular, una articulación pedagógica de las competencias sociales, que permita transformar la experiencia
            académica de los estudiantes con discapacidad cognitiva de grado noveno, en el Colegio Bolivia. (Texto
            tomado de la fuente)
          </p>
          <div class="seccionFicha">
            <h4 class="tituloSeccion">Autores</h4>
            <ul class="contenidoSeccion">
              <li>Abella Niño, Arturo</li>
            </ul>
          </div>
          <div class="seccionFicha">
            <h4 class="tituloSeccion">Indicador temático</h4>
            <p class="contenidoSeccion">EDUCACIÓN</p>
          </div>
          <div class="seccionFicha">
            <h4 class="tituloSeccion">Dependencia</h4>
            <p class="contenidoSeccion">Maestría en educación</p>
          </div>
          <div class="seccionFicha">
            <h4 class="tituloSeccion">Referencia APA</h4>
            <p class="contenidoSeccion">
              Abella Niño, A. (2023). Tesis de Maestría: Una historia sin palabras: leyendo el mundo de la discapacidad
              desde el área de Educación Física. Recuperado el 20 de 05 de 2024, de Repositorio Institucional UN.
              Biblioteca Digital: https://repositorio.unal.edu.co/handle/unal/84058
            </p>
          </div>
          <div class="seccionFicha">
            <h4 class="tituloSeccion">Enlace a la fuente</h4>
            <a class="contenidoSeccion" href="https://repositorio.unal.edu.co/handle/unal/84058"
              >https://repositorio.unal.edu.co/handle/unal/84058</a
            >
          </div>
          <div class="seccionFicha">
            <h4 class="tituloSeccion">Contacto</h4>
            <p class="contenidoSeccion">aabellan@unal.edu.co</p>
          </div>
        </section>
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

  h2 {
    margin: 0;
  }

  .negrita {
    font-weight: bold;
  }

  .boton {
    cursor: pointer;

    &:hover {
      color: var(--azulOscuroCuenco);
    }
  }

  #contenedorFicha {
    border: 1px white solid;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  #encabezado {
    background-color: var(--blanco);
    color: var(--magentaCuenco);
    padding: 0.5em 1em;

    #superior {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid var(--magentaCuenco);
    }

    #inferior {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: 0.9em;
        font-weight: 400;
        margin: 1em 1.5em;
      }

      #año {
        margin-right: 1em;
      }
    }
  }

  #contenido {
    overflow-y: scroll;
    color: white;
    padding: 2em;
  }

  .seccionFicha {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--blanco);

    li {
      list-style: none;
    }

    .tituloSeccion {
    }
    .contenidoSeccion {
      flex-basis: 65%;
      overflow-wrap: anywhere;
    }
  }
}
</style>
