<script setup lang="ts">
import { usarCerebroFicha } from '@/cerebros/ficha';
import { usarCerebroGeneral } from '@/cerebros/general';
import { usarCerebroDatos } from '@/cerebros/datos';
import { onMounted, onUnmounted, ref, Ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import type { EncuentroCaracterizacionConteo, LlavesEncuentro } from '@/tipos/compartidos';
import { DonaProcesada, IDona } from '@/tipos';
import Dona from '@/componentes/Dona.vue';
import { colores, llavesEncuentro } from '../utilidades/constantes';
import { idPedazoDona, primeraMayuscula } from '@/utilidades/ayudas';
import { nombresListas } from '@/utilidades/constantes';
import ListaNodos from '@/componentes/ListaNodos.vue';

const cerebroGeneral = usarCerebroGeneral();
const cerebroFicha = usarCerebroFicha();
const cerebroDatos = usarCerebroDatos();

const { encuentrosCaracterizacionConteo, listasEncuentros } = storeToRefs(cerebroDatos);
const { fragmentoDonaElegido } = storeToRefs(cerebroGeneral);

const info: Ref<string | null> = ref(null);
const contenedorInfo: Ref<HTMLDivElement | null> = ref(null);
const fragmentoElegido: Ref<string> = ref('');

const donas: Ref<{ tipo?: LlavesEncuentro; valores?: IDona[] }[][]> = ref([]);

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
            valores = valores.sort((a, b) => {
              if (a.valor < b.valor) return 1;
              else if (a.valor > b.valor) return -1;
              return 0;
            });
          });
        }
        nuevasDonas[+numeroEncuentro - 1].push({ tipo: llave, valores: valores });
      }
    });
    donas.value = nuevasDonas;
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
  await cerebroDatos.cargarDatosEncuentros();

  crearDonas(encuentrosCaracterizacionConteo.value);
});

onUnmounted(() => {
  cerebroFicha.fichaVisible = false;
});

function mostrarInfo(trozo: DonaProcesada) {
  cerebroGeneral.fragmentoDonaElegido = idPedazoDona(trozo);
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
  <main>
    <nav class="columna columna1 contenedorListas" v-if="listasEncuentros">
      <ListaNodos v-for="(lista, llave) in listasEncuentros" :tipo="llave" :lista="lista" tipoLista="menu">
        <h2 class="titulo" @click="cerebroDatos.cambiarLista(llave)">{{ nombresListas[llave] }}</h2>
      </ListaNodos>
    </nav>

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
                    <p
                      @mouseenter="elegirFragmento(valor)"
                      @mouseleave="elegirFragmento()"
                      class="textoLeyenda"
                      :class="idPedazoDona(valor) === fragmentoDonaElegido ? 'elegido' : ''"
                    >
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
      cursor: pointer;

      &.elegido {
        font-weight: bold;
      }
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
