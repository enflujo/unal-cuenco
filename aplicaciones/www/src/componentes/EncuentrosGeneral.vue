/** Visualización de la caracterización general de los encuentros */

<script setup lang="ts">
import { usarCerebroDatos } from '@/cerebros/datos';
import { storeToRefs } from 'pinia';
import { DonaProcesada, IDona } from '@/tipos';
import Dona from '@/componentes/Dona.vue';
import { onMounted, ref, Ref, watch } from 'vue';
import { ListasCaracterizacion, LlavesCaracterizacion } from '@/tipos/compartidos';
import { colores, llavesCaracterizacion, nombresListasCaracterizacion } from '../utilidades/constantes';
import { usarCerebroGeneral } from '@/cerebros/general';
import { idPedazoDona, primeraMayuscula } from '@/utilidades/ayudas';

const cerebroGeneral = usarCerebroGeneral();
const cerebroDatos = usarCerebroDatos();

const { listasCaracterizacion } = storeToRefs(cerebroDatos);
const { fragmentoDonaElegido } = storeToRefs(cerebroGeneral);

const info: Ref<string | null> = ref(null);
const fragmentoElegido: Ref<string> = ref('');

let donas: Ref<{ tipo?: LlavesCaracterizacion; valores?: IDona[] }[]> = ref([]);

const datosCaracterizacion: Ref<ListasCaracterizacion | null> = ref(null);

watch(datosCaracterizacion, (datos) => crearDonas(datos));
watch(listasCaracterizacion, (datos) => crearDonas(datos));
watch(fragmentoDonaElegido, (fragmento) => (fragmentoElegido.value = fragmento));

onMounted(async () => {
  await cerebroDatos.cargarListasCaracterizacion();
  crearDonas(listasCaracterizacion.value);
});

function crearDonas(datos: ListasCaracterizacion | null) {
  const nuevasDonas: {
    tipo?: LlavesCaracterizacion;
    valores?: IDona[];
  }[] = [];

  llavesCaracterizacion.forEach((llave) => {
    let datosSeccion: { slug: string; conteo: number; nombre: string }[] | undefined = [];
    if (!listasCaracterizacion) return;
    let total = 0;
    let valores: IDona[] = [];
    if (!datos) return;

    datos[llave].forEach((elemento) => {
      datosSeccion.push({ slug: elemento.slug, conteo: elemento.conteo, nombre: elemento.nombre });
      total += elemento.conteo;
    });

    datos[llave].forEach((elemento, i) => {
      datosSeccion.push({ slug: elemento.slug, conteo: elemento.conteo, nombre: elemento.nombre });

      const valor = {
        nombre: elemento.nombre,
        valor: elemento.conteo,
        porcentaje: (elemento.conteo * 100) / total,
        color: elemento.color || colores[i],
      };
      valores.push(valor);
      valores = valores.sort((a, b) => {
        if (a.valor < b.valor) return 1;
        else if (a.valor > b.valor) return -1;
        return 0;
      });
    });

    nuevasDonas.push({ tipo: llave, valores: valores });
  });
  donas.value = nuevasDonas;
}

function mostrarInfo(trozo: DonaProcesada) {
  cerebroGeneral.fragmentoDonaElegido = trozo.nombre;
  //info.value = `${trozo.nombre} (${redondearDecimal(trozo.porcentaje)}%)`;
}

function esconderInfo() {
  cerebroGeneral.fragmentoDonaElegido = '';
  info.value = null;
}

function elegirFragmento(datosFragmento?: IDona) {
  if (!datosFragmento) {
    fragmentoElegido.value = '';
    cerebroGeneral.fragmentoDonaElegido = '';
    return;
  }

  const id = idPedazoDona(datosFragmento);

  if (fragmentoElegido.value === '' || id !== cerebroGeneral.fragmentoDonaElegido) {
    fragmentoElegido.value = id;
  } else {
    fragmentoElegido.value = '';
  }
  cerebroGeneral.fragmentoDonaElegido = fragmentoElegido.value;
}
</script>

<template>
  <div>
    <h2>Caracterización general de los encuentros</h2>

    <div class="donas">
      <section class="contenedorDona" v-for="dona in donas" :key="`dona-${dona.tipo}`">
        <h3>{{ nombresListasCaracterizacion[dona.tipo] }}</h3>
        <div class="contenidoDona">
          <Dona :mostrarInfo="mostrarInfo" :secciones="dona.valores ? dona.valores : []" :esconderInfo="esconderInfo" />
          <div class="contenedorLeyendas">
            <ul class="leyendaDona" v-for="valor in dona.valores">
              <span class="codigoColor" :style="`background-color:${valor.color}`"></span>
              <p
                @mouseenter="elegirFragmento(valor)"
                @mouseleave="elegirFragmento()"
                class="textoLeyenda"
                :class="idPedazoDona(valor) === fragmentoElegido ? 'elegido' : ''"
              >
                {{ valor.nombre }}: {{ Math.ceil(valor.porcentaje) }}% ({{ valor.valor }})
              </p>
            </ul>
          </div>
        </div>
      </section>
    </div>

    <div id="contenedorInfo" ref="contenedorInfo" v-html="info" v-if="info"></div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/scss/constantes' as *;
#contenedorInfo {
  position: fixed;
  background-color: rgba(255, 255, 255, 0.8);
  width: 200px;
  top: 0;
  left: 0;
  //transform: translate(-150%, -100%);
  pointer-events: none;
  padding: 0.6em;
}

.donas {
  display: flex;
  flex-wrap: wrap;
}

.contenedorDona {
  flex-basis: 50%;
}

.contenidoDona {
  display: flex;
  flex-direction: column;

  .dona {
    width: 80vw;
  }

  .contenedorLeyendas {
    display: flex;
    flex-direction: column;
    font-size: 0.8em;
    width: 75vw;
    overflow: auto;
    max-height: 15em;
  }
  .leyendaDona {
    display: flex;
    align-items: baseline;

    .textoLeyenda {
      max-width: 75vw;
      margin: 0;
      cursor: pointer;

      &.elegido {
        font-weight: bold;
      }
    }
  }
  .codigoColor {
    min-width: 10px;
    height: 10px;
    display: block;
    border-radius: 50%;
    margin-right: 0.5em;
  }
}

.donaCentro {
  fill: white;
}

#contenedorEncuentros {
  width: 80vw;
  margin-left: 10vw;
  margin-top: 5vw;
}

.encuentro {
  list-style: none;
}

@media screen and (min-width: $minTablet) {
  .contenidoDona {
    align-items: center;
    flex-direction: row;

    .dona {
      width: 50%;
    }

    .contenedorLeyendas {
      width: 18vw;
    }
    .leyendaDona {
      display: flex;
      align-items: baseline;

      .textoLeyenda {
        max-width: 15vw;
      }
    }
  }
}

@media screen and (min-width: $minPantalla) {
}
</style>
