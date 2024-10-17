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

const cerrarFichaColAmb: Ref<HTMLDivElement | undefined> = ref();

function cerrarFicha() {
  console.log('cerrar ficha');
}
</script>

<template>
  <div id="fichaColectivosAmbitos" class="ficha">
    <div id="contenedorFicha">
      <section id="encabezado">
        <div id="superior">
          <div class="negrita">#{{ id }}</div>
          <div class="negrita">Cátedra</div>
          <div class="boton" id="cerrarFichaColAmb" ref="cerrarFichaColAmb" @click="cerrarFicha">X</div>
        </div>
        <div id="inferior">
          <div class="boton" id="botonAnterior"><</div>
          <h3 id="tituloFicha">Cátedra Hábitos y Técnicas de Estudio</h3>
          <p class="negrita" id="año">2024</p>
          <div class="boton" id="botonSiguiente">></div>
        </div>
      </section>
      <section id="contenido">
        <p id="descripcionFicha">
          Esta cátedra busca potencializar el aprendizaje autorregulado en los estudiantes de la UNAL sede Manizales,
          para que implementen estrategias que les permita optimizar sus procesos de aprendizaje. Esto implica que ellos
          aprendan a conocer sus procesos conductuales, cognitivos y afectivos involucrados en la construcción de su
          propio conocimiento, y conozcan y apliquen estrategias para regular dichos procesos según los factores
          contextuales. Objetivo general Fortalecer las habilidades de los alumnos de la Universidad Nacional de
          Colombia sede Manizales para aprender a aprender. Objetivos específicos • Presentar los fundamentos teóricos
          de los procesos conductuales, cognitivos y afectivos involucrados en el aprendizaje autorregulado. • Reconocer
          las estrategias de regulación conductual, cognitiva y afectiva para lograr un aprendizaje eficaz. Acompañar,
          evaluar, retroalimentar y pro alimentar la implementación de estrategias de regulación conductual, cognitiva y
          afectiva para el aprendizaje.
        </p>
        <div class="seccionFicha">
          <h4 class="tituloSeccion">Responsable</h4>
          <p class="contenidoSeccion">Dirección Académica</p>
        </div>
        <div class="seccionFicha">
          <h4 class="tituloSeccion">Dependencia</h4>
          <p class="contenidoSeccion">Dirección Académica</p>
        </div>
        <div class="seccionFicha">
          <h4 class="tituloSeccion">Sede</h4>
          <p class="contenidoSeccion">Manizales</p>
        </div>
        <div class="seccionFicha">
          <h4 class="tituloSeccion">Estado</h4>
          <p class="contenidoSeccion">Activo</p>
        </div>
        <div class="seccionFicha">
          <h4 class="tituloSeccion">Indicador temático</h4>
          <p class="contenidoSeccion">Apoyo académico</p>
        </div>
        <div class="seccionFicha">
          <h4 class="tituloSeccion">Sub-indicador temático</h4>
          <p class="contenidoSeccion">Estrategias de estudio</p>
        </div>
        <div class="seccionFicha">
          <h4 class="tituloSeccion">Modalidad</h4>
          <p class="contenidoSeccion">Presencial</p>
        </div>
        <div class="seccionFicha">
          <h4 class="tituloSeccion">Fuente</h4>
          <p class="contenidoSeccion">
            Cátedra Hábitos y Técnicas de Estudio. (s.f.). Recuperado el 02 de octubre de 2023 de Dama, Sede Manizales.
            Universidad Nacional de Colombia.
          </p>
        </div>
        <div class="seccionFicha">
          <h4 class="tituloSeccion">Enlace a la fuente</h4>
          <a class="contenidoSeccion" href="http://dama.manizales.unal.edu.co/index.php/catedras/"
            >http://dama.manizales.unal.edu.co/index.php/catedras/</a
          >
        </div>
        <div class="seccionFicha">
          <h4 class="tituloSeccion">Contacto</h4>
          <p class="contenidoSeccion">diracade_man@unal.edu.co</p>
        </div>
      </section>
    </div>
  </div>
  <ComponenteMapa />
</template>

<style lang="scss">
#fichaColectivosAmbitos {
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
}
</style>
