<script setup lang="ts">
// import { usarCerebroDatos } from '@/cerebros/datos';
import { usarCerebroFicha } from '@/cerebros/ficha';
import { usarCerebroGeneral } from '@/cerebros/general';
import {
  colores,
  llavesRelacionesColectivos,
  llavesRelacionesEncuentros,
  llavesRelacionesPublicaciones,
  nombresListas,
} from '@/utilidades/constantes';
import { storeToRefs } from 'pinia';
import { type Ref, ref, watch } from 'vue';
import Dona from './Dona.vue';
import type { DatosFicha, DonaProcesada, IDona, TiposNodo } from '@/tipos';
import { redondearDecimal } from '@/utilidades/ayudas';

const cerebroGeneral = usarCerebroGeneral();
const cerebroFicha = usarCerebroFicha();
const { datosFicha } = storeToRefs(cerebroFicha);
const total = ref(0);
const tituloTotal: Ref<string | null> = ref(null);
const contenedorInfo: Ref<HTMLDivElement | null> = ref(null);
const info: Ref<string | null> = ref(null);
const donas: Ref<{ tipo: TiposNodo; valores: IDona[] }[]> = ref([]);

watch(datosFicha, (datos) => {
  if (!datos) return;

  tituloTotal.value = null;
  donas.value = [];

  crearDonas(datos);
});

function crearDonas(datos: DatosFicha) {
  const nuevasDonas: { tipo: TiposNodo; valores: IDona[] }[] = [];

  if (cerebroGeneral.paginaActual === 'colectivos') {
    llavesRelacionesColectivos.forEach((llave) => {
      const datosSeccion = datos[llave];

      if (datosSeccion) {
        const total = datosSeccion.reduce((acumulado, actual) => acumulado + actual.conteo, 0);
        const datosDona = datosSeccion.map((obj, i) => {
          return {
            nombre: obj.nombre,
            valor: obj.conteo,
            porcentaje: Math.ceil((obj.conteo / total) * 100),
            color: obj.color || colores[i],
            id: obj.id,
            tipo: llave,
          };
        });

        nuevasDonas.push({ tipo: llave, valores: datosDona });
      }
    });

    if (datos.tipo === 'colectivos') {
    } else {
      total.value = datos.colectivos ? datos.colectivos.length : 0;
      tituloTotal.value = 'Total colectivos: ';
    }
  } else if (cerebroGeneral.paginaActual === 'publicaciones') {
    llavesRelacionesPublicaciones.forEach((llave) => {
      const datosSeccion = datos[llave];

      if (datosSeccion) {
        const total = datosSeccion.reduce((acumulado, actual) => acumulado + actual.conteo, 0);
        const datosDona = datosSeccion.map((obj, i) => {
          return {
            nombre: obj.nombre,
            valor: obj.conteo,
            porcentaje: (obj.conteo / total) * 100,
            color: obj.color || colores[i],
            id: obj.id,
            tipo: llave,
          };
        });

        nuevasDonas.push({ tipo: llave, valores: datosDona });
      }
    });

    if (datos.tipo === 'publicaciones') {
    } else {
      total.value = datos.publicaciones ? datos.publicaciones.length : 0;
      tituloTotal.value = 'Total publicaciones: ';
    }
  } else if (cerebroGeneral.paginaActual === 'encuentros') {
    llavesRelacionesEncuentros.forEach((llave) => {
      const datosSeccion = datos[llave];

      if (datosSeccion) {
        const total = datosSeccion.reduce((acumulado, actual) => acumulado + actual.conteo, 0);
        const datosDona = datosSeccion.map((obj, i) => {
          return {
            nombre: obj.nombre,
            valor: obj.conteo,
            porcentaje: (obj.conteo / total) * 100,
            color: obj.color || colores[i],
            id: obj.id,
            tipo: llave,
          };
        });

        nuevasDonas.push({ tipo: llave, valores: datosDona });
      }
    });

    if (datos.tipo === 'publicaciones') {
    } else {
      total.value = datos.encuentros ? datos.encuentros.length : 0;
      tituloTotal.value = 'Total publicaciones: ';
    }
  }
  donas.value = nuevasDonas;
}

function mostrarInfo(trozo: DonaProcesada) {
  info.value = `${trozo.nombre} (${redondearDecimal(trozo.porcentaje)}%)`;
}
function esconderInfo() {
  info.value = null;
}

function actualizarPosInfo(evento: MouseEvent) {
  if (!contenedorInfo.value) return;
  Object.assign(contenedorInfo.value.style, {
    top: `${evento.clientY}px`,
    left: `${evento.clientX}px`,
  });
}
</script>

<template>
  <div class="contenedorVisFicha" @mousemove="actualizarPosInfo">
    <div class="fichaConteo" v-if="tituloTotal">
      <p class="valorConteo">{{ tituloTotal }} {{ total }}</p>
    </div>

    <section class="contenedorDona" v-for="dona in donas" :key="`dona-${dona.tipo}`">
      <h3>{{ nombresListas[dona.tipo] }}</h3>
      <Dona :mostrarInfo="mostrarInfo" :secciones="dona.valores" :esconderInfo="esconderInfo" :conEnlace="true" />
    </section>
  </div>
  <div id="contenedorInfo" ref="contenedorInfo" v-html="info" v-if="info"></div>
</template>

<style lang="scss" scoped>
@use '@/scss/constantes' as *;
#contenedorInfo {
  position: fixed;
  background-color: rgba(255, 255, 255, 0.8);
  width: 200px;
  top: 0;
  left: 0;
  transform: translate(-150%, -100%);
  pointer-events: none;
  padding: 0.6em;
}

.contenedorDona {
  padding: 0.6em;
  text-align: center;
  display: inline-block;
  vertical-align: top;

  h3 {
    margin-bottom: 0;
  }
}

.contenedorVisFicha {
  color: white;
  width: 100%;
  overflow: auto;
}

.fichaConteo {
  padding: 0 1rem;
  border: 1px solid;
  border-radius: 0.5rem;
  margin: 0.5rem 0;
  font-weight: bold;
  display: inline-block;
}
@media screen and (min-width: $minTablet) {
  .contenedorVisFicha {
    width: 50%;
  }

  .fichaConteo {
    padding: 1rem;
    margin: 0.5rem;
  }
}
</style>
