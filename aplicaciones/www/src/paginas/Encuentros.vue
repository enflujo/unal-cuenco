<script setup lang="ts">
import { usarCerebroFicha } from '@/cerebros/ficha';
import { usarCerebroGeneral } from '@/cerebros/general';
import { usarCerebroDatos } from '@/cerebros/datos';
import { onMounted, onUnmounted, ref, Ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { EncuentroCaracterizacionConteo, LlavesCaracterizacion, LlavesEncuentro } from '@/tipos/compartidos';
import { DonaProcesada, IDona } from '@/tipos';
import Dona from '@/componentes/Dona.vue';
import { redondearDecimal } from '@/utilidades/ayudas';
import { colores, llavesEncuentro } from '../utilidades/constantes';

const cerebroGeneral = usarCerebroGeneral();
const cerebroFicha = usarCerebroFicha();
const cerebroDatos = usarCerebroDatos();

const { encuentrosCaracterizacionConteo } = storeToRefs(cerebroDatos);

const info: Ref<string | null> = ref(null);
const contenedorInfo: Ref<HTMLDivElement | null> = ref(null);
const fragmentoElegido: Ref<string> = ref('');

let donas: { tipo?: LlavesEncuentro; valores?: IDona[] }[][] = [];

function crearDonas(datos: EncuentroCaracterizacionConteo[] | null) {
  const nuevasDonas: {
    tipo?: LlavesEncuentro;
    valores?: IDona[];
  }[][] = [];

  if (!datos) return;

  datos.forEach((encuentro) => {
    if (!encuentro.sedes) return;
    let numeroEncuentro = encuentro.id;

    let datosSeccion: { slug: string; conteo: number; nombre: string }[] | undefined = [];
    nuevasDonas.push([]);

    // Crear array de datos para donas por cada llave
    llavesEncuentro.forEach((llave: LlavesEncuentro) => {
      let total = 0;
      let valores: IDona[] = [];
      if (llave !== 'id' && llave !== 'numero') {
        datosSeccion = encuentro[llave];

        if (datosSeccion) {
          datosSeccion.forEach((elemento) => {
            let valorTotal = total + elemento.conteo;
            total = valorTotal;
          });

          datosSeccion.forEach((elemento, i) => {
            const valor = {
              nombre: elemento.nombre,
              valor: elemento.conteo,
              porcentaje: Math.ceil((elemento.conteo * 100) / total),
              color: colores[i],
            };
            valores.push(valor);
          });
        }
        nuevasDonas[+numeroEncuentro - 1].push({ tipo: llave, valores: valores });
      }
    });

    donas = nuevasDonas;
  });
}

// Observar los datos para pintar las donas
watch(encuentrosCaracterizacionConteo, (datos) => {
  crearDonas(datos);
});

onMounted(async () => {
  cerebroGeneral.paginaActual = 'encuentros';
  await cerebroDatos.cargarListasCaracterizacion();
  await cerebroDatos.cargarDatosCaracterizacion();
});

onUnmounted(() => {
  cerebroFicha.fichaVisible = false;
});

function mostrarInfo(trozo: DonaProcesada) {
  console.log(trozo);
  info.value = `${trozo.nombre} (${redondearDecimal(trozo.porcentaje)}%)`;
}
function esconderInfo() {
  info.value = null;
}

function primeraMayuscula(texto: string | undefined) {
  return String(texto).charAt(0).toUpperCase() + String(texto).slice(1);
}

function elegirFragmento(fragmento: string) {
  if (fragmentoElegido.value === '') {
    fragmentoElegido.value = fragmento;
  } else {
    fragmentoElegido.value = '';
  }

  console.log(fragmentoElegido.value);
}
</script>

<template>
  <main>
    <div id="contenedorEncuentros">
      <h1>Caracterización por encuentro</h1>

      <div>
        <li class="encuentro" v-for="(encuentro, i) in encuentrosCaracterizacionConteo">
          <h2>{{ encuentro?.numero }}:</h2>

          <div class="donas">
            <section class="contenedorDona" v-for="dona in donas[i]" :key="`dona-${dona.tipo}`">
              <h3>{{ dona.tipo !== 'tiposSede' ? primeraMayuscula(dona.tipo) : 'Tipos de sede' }}</h3>
              <div class="contenidoDona">
                <Dona
                  :mostrarInfo="mostrarInfo"
                  :secciones="dona.valores ? dona.valores : []"
                  :esconderInfo="esconderInfo"
                />
                <div class="contenedorLeyendas">
                  <ul class="leyendaDona" v-for="valor in dona.valores">
                    <span class="codigoColor" :style="`background-color:${valor.color}`"></span>
                    <p @click="elegirFragmento(valor.nombre)" class="textoLeyenda">
                      {{ valor.nombre }}: {{ Math.ceil(valor.porcentaje) }}% ({{ valor.valor }})
                    </p>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </li>
        <div id="contenedorInfo" ref="contenedorInfo" v-html="info" v-if="info"></div>
      </div>
      <div>
        <!-- <h2>Caracterización total</h2>
        <h3>Asistencia total por sede:</h3>
        <li v-for="lista in listasCaracterizacion?.sedes">{{ lista.nombre }}: {{ lista.conteo }}</li>

        <h3>Asistencia total por roles:</h3>
        <li v-for="lista in listasCaracterizacion?.roles">{{ lista.nombre }}: {{ lista.conteo }}</li>

        <h3>Asistencia total por cargo:</h3>
        <li v-for="lista in listasCaracterizacion?.cargos">{{ lista.nombre }}: {{ lista.conteo }}</li> -->
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
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
  align-items: center;

  .dona {
    width: 250px;
  }

  .contenedorLeyendas {
    display: flex;
    flex-direction: column;
    font-size: 0.8em;
  }
  .leyendaDona {
    display: flex;
    align-items: baseline;

    .textoLeyenda {
      max-width: 15vw;
      margin: 0;
    }
  }
  .codigoColor {
    width: 10px;
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
</style>
