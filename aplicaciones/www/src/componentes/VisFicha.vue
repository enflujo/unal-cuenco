<script setup lang="ts">
// import { usarCerebroDatos } from '@/cerebros/datos';
import { usarCerebroFicha } from '@/cerebros/ficha';
import { usarCerebroGeneral } from '@/cerebros/general';
import { llavesRelacionesColectivos, nombresListas } from '@/utilidades/constantes';
import { storeToRefs } from 'pinia';
import { type Ref, ref, watch } from 'vue';
import Dona from './Dona.vue';
import type { DonaProcesada, IDona, TiposNodo } from '@/tipos';

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

  if (cerebroGeneral.paginaActual === 'colectivos') {
    llavesRelacionesColectivos.forEach((llave) => {
      const datosSeccion = datos[llave];
      if (datosSeccion) {
        const total = datosSeccion.reduce((acumulado, actual) => {
          return acumulado + actual.conteo;
        }, 0);
        const datosDona = datosSeccion.map((obj) => {
          return { nombre: obj.nombre, valor: obj.conteo, porcentaje: (obj.conteo / total) * 100 };
        });

        donas.value.push({ tipo: llave, valores: datosDona });
      }
    });

    if (datos.tipo === 'colectivos') {
    } else {
      total.value = datos.colectivos ? datos.colectivos.length : 0;
      tituloTotal.value = 'Total colectivos: ';
    }
  } else if (cerebroGeneral.paginaActual === 'publicaciones') {
    if (datos.tipo === 'publicaciones') {
    } else {
      total.value = datos.publicaciones ? datos.publicaciones.length : 0;
      tituloTotal.value = 'Total publicaciones: ';
    }
  }
});

function mostrarInfo(trozo: DonaProcesada) {
  info.value = `${trozo.nombre} (${trozo.porcentaje}%)`;
  console.log(trozo);
}

function actualizarPosInfo(evento: MouseEvent) {
  if (!contenedorInfo.value) return;
  console.log(evento);
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

    <section v-for="dona in donas" :key="`dona-${dona.tipo}`">
      <h3>{{ nombresListas[dona.tipo] }}</h3>

      <Dona :mostrarInfo="mostrarInfo" :secciones="dona.valores" />
    </section>
    <div id="contenedorInfo" ref="contenedorInfo" v-html="info"></div>
  </div>
</template>

<style lang="scss" scoped>
#contenedorInfo {
  position: absolute;
  background-color: white;
  width: 200px;
}

.contenedorVisFicha {
  color: white;
  width: 50%;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  position: relative;
}

.fichaConteo {
  padding: 1rem;
  border: 1px solid;
  border-radius: 0.5rem;
  margin: 0.5rem;
  font-weight: bold;
  display: inline-block;
}
</style>
