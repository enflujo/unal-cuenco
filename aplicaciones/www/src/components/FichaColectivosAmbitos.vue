<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue';

// ¿Cómo se hace un custom element?
/*import { defineCustomElement } from 'vue';
import { Colectivo } from '../../../../tipos/compartidos';

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

const datosColectivos: Ref<Colectivo[] | undefined> = ref([]);
const infoColectivo: Ref<Colectivo | undefined> = ref();

onMounted(async () => {
  try {
    const datos = await fetch('datos/colectivos.json').then((res) => res.json());
    //  console.log(datos);
    if (datos) datosColectivos.value = datos;
  } catch (error) {
    console.error('Problema descargando datos de listas de colectivos', error);
  }

  const idsElegidos: number[] = [5];

  infoColectivo.value = datosColectivos.value.find((colectivo) => colectivo.id === idsElegidos[0]);

  console.log(infoColectivo);
});

const cerrarFichaColAmb: Ref<HTMLDivElement | undefined> = ref();

function cerrarFicha() {
  console.log('cerrar ficha');
}
</script>

<template>
  <div id="fichaColectivosAmbitos" class="ficha">
    <div id="contenedorFicha" v-if="infoColectivo" :ref="infoColectivo">
      <section id="encabezado">
        <div id="superior">
          <div class="negrita">#{{ infoColectivo.id }}</div>
          <div class="negrita">{{ infoColectivo.tipos.nombre }}</div>
          <div class="boton" id="cerrarFichaColAmb" ref="cerrarFichaColAmb" @click="cerrarFicha">X</div>
        </div>
        <div id="inferior">
          <div class="boton" id="botonAnterior"><</div>
          <h3 id="tituloFicha">{{ infoColectivo.nombre }}</h3>
          <p class="negrita" id="estado">{{ infoColectivo.estados.nombre }}</p>
          <div class="boton" id="botonSiguiente">></div>
        </div>
      </section>
      <section id="contenido">
        <p id="descripcionFicha">
          {{ infoColectivo.descripcion }}
        </p>
        <div class="seccionFicha">
          <h4 class="tituloSeccion">Dependencia</h4>
          <p class="contenidoSeccion">{{ infoColectivo.dependencias.nombre }}</p>
        </div>
        <div class="seccionFicha">
          <h4 class="tituloSeccion">Sede</h4>
          <p class="contenidoSeccion" v-for="sede in infoColectivo.sedes">{{ sede.nombre }}</p>
        </div>
        <div class="seccionFicha">
          <h4 class="tituloSeccion">Indicador temático</h4>
          <p class="contenidoSeccion">{{ infoColectivo.indicador }}</p>
        </div>
        <div class="seccionFicha" v-if="infoColectivo.modalidades">
          <h4 class="tituloSeccion">Modalidad</h4>
          <p class="contenidoSeccion">{{ infoColectivo.modalidades.nombre }}</p>
        </div>
        <div class="seccionFicha" v-if="infoColectivo.fuente">
          <h4 class="tituloSeccion">Fuente</h4>
          <p class="contenidoSeccion">
            {{ infoColectivo.fuente }}
          </p>
        </div>
        <div class="seccionFicha" v-if="infoColectivo.enlaceFuente.length">
          <h4 class="tituloSeccion">Enlace a la fuente</h4>
          <a class="contenidoSeccion" :href="infoColectivo.enlaceFuente[0]">{{ infoColectivo.enlaceFuente[0] }}</a>
        </div>
        <div class="seccionFicha" v-if="infoColectivo.contacto">
          <h4 class="tituloSeccion">Contacto</h4>
          <p class="contenidoSeccion">{{ infoColectivo.contacto }}</p>
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
