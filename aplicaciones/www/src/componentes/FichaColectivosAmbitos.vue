<script setup lang="ts">
import { Colectivo, Indicador } from '@/tipos/compartidos';
import { usarCerebro } from '@/utilidades/cerebro';
import { storeToRefs } from 'pinia';
import { type Ref, ref, onMounted, watch } from 'vue';

defineProps<{ id: string }>();

const cerebro = usarCerebro();
const { colectivos, indicadoresColectivos } = storeToRefs(cerebro);
const infoColectivo: Ref<Colectivo | undefined> = ref();
const indicador: Ref<Indicador | undefined> = ref();
const contenedorFicha: Ref<HTMLDivElement | null> = ref(null);
const cerrarFichaColAmb: Ref<HTMLDivElement | undefined> = ref();

onMounted(async () => {
  await cerebro.cargarDatosColectivos();

  const idsElegidos: number[] = [5];

  infoColectivo.value = colectivos.value?.find((colectivo) => colectivo.id === idsElegidos[0]);
  indicador.value = indicadoresColectivos.value?.find((indicador) => indicador.id === infoColectivo.value?.indicadores);
});

function cerrarFicha() {
  console.log('cerrar ficha');
}
</script>

<template>
  <div id="fichaColectivosAmbitos" class="ficha">
    <div id="contenedorFicha" v-if="infoColectivo" ref="contenedorFicha">
      <section id="encabezado">
        <div id="superior">
          <div class="negrita">#{{ infoColectivo.id }}</div>
          <div class="negrita">{{ infoColectivo.tipos?.nombre }}</div>
          <div class="boton" id="cerrarFichaColAmb" ref="cerrarFichaColAmb" @click="cerrarFicha">X</div>
        </div>
        <div id="inferior">
          <div class="boton" id="botonAnterior"><</div>
          <h3 id="tituloFicha">{{ infoColectivo.nombre.nombre }}</h3>
          <p class="negrita" id="estado">{{ infoColectivo.estados?.nombre }}</p>
          <div class="boton" id="botonSiguiente">></div>
        </div>
      </section>
      <section id="contenido">
        <p id="descripcionFicha">
          {{ infoColectivo.descripcion }}
        </p>
        <div class="seccionFicha" v-if="infoColectivo.dependencias">
          <h4 class="tituloSeccion">Dependencia</h4>
          <p class="contenidoSeccion">{{ infoColectivo.dependencias.nombre }}</p>
        </div>
        <div class="seccionFicha" v-if="infoColectivo.sedes">
          <h4 class="tituloSeccion">Sede</h4>
          <p class="contenidoSeccion" v-for="sede in infoColectivo.sedes">{{ sede.nombre }}</p>
        </div>
        <div class="seccionFicha" v-if="indicador">
          <h4 class="tituloSeccion">Indicador temático</h4>
          <p class="contenidoSeccion">{{ indicador.nombre }}</p>
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
        <div class="seccionFicha" v-if="infoColectivo.enlaceFuente?.length">
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
