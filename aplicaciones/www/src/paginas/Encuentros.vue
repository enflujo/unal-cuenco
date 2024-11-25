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
import { llavesEncuentro } from '../utilidades/constantes';

const cerebroGeneral = usarCerebroGeneral();
const cerebroFicha = usarCerebroFicha();
const cerebroDatos = usarCerebroDatos();

const { encuentrosCaracterizacionConteo } = storeToRefs(cerebroDatos);

const info: Ref<string | null> = ref(null);

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

          datosSeccion.forEach((elemento) => {
            const valor = {
              nombre: elemento.nombre,
              valor: elemento.conteo,
              porcentaje: Math.ceil((elemento.conteo * 100) / total),
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
  info.value = `${trozo.nombre} (${redondearDecimal(trozo.porcentaje)}%)`;
}
function esconderInfo() {
  info.value = null;
}

function primeraMayuscula(texto: string | undefined) {
  return String(texto).charAt(0).toUpperCase() + String(texto).slice(1);
}
</script>

<template>
  <main>
    <div id="contenedorEncuentros">
      <h1>Encuentros</h1>

      <div>
        <h2>Caracterización por encuentro</h2>

        <li class="encuentro" v-for="(encuentro, i) in encuentrosCaracterizacionConteo">
          <h3>{{ encuentro?.numero }}:</h3>

          <section class="contenedorDona" v-for="dona in donas[i]" :key="`dona-${dona.tipo}`">
            <h3>{{ dona.tipo !== 'tiposSede' ? primeraMayuscula(dona.tipo) : 'Tipos de sede' }}</h3>
            <Dona
              :mostrarInfo="mostrarInfo"
              :secciones="dona.valores ? dona.valores : []"
              :esconderInfo="esconderInfo"
            />
            <ul v-for="valor in dona.valores">
              {{
                valor.nombre
              }}:
              {{
                Math.ceil(valor.porcentaje)
              }}
            </ul>
          </section>
        </li>
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
#contenedorEncuentros {
  width: 70vw;
  margin-left: 10vw;
  margin-top: 5vw;
}

.encuentro {
  list-style: none;
}
</style>
