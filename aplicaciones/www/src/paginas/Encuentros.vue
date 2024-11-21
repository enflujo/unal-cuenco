<script setup lang="ts">
import { usarCerebroFicha } from '@/cerebros/ficha';
import { usarCerebroGeneral } from '@/cerebros/general';
import { usarCerebroDatos } from '@/cerebros/datos';
import { onMounted, onUnmounted, ref, Ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { EncuentroCaracterizacionConteo, LlavesCaracterizacion, LlavesEncuentro } from '@/tipos/compartidos';
import { DonaProcesada, IDona, TiposNodo } from '@/tipos';
import { nombresListasCaracterizacion } from '@/utilidades/constantes';
import Dona from '@/componentes/Dona.vue';
import { redondearDecimal } from '@/utilidades/ayudas';
const donas: Ref<{ tipo: TiposNodo; valores: IDona[] }[]> = ref([]);

const cerebroGeneral = usarCerebroGeneral();
const cerebroFicha = usarCerebroFicha();
const cerebroDatos = usarCerebroDatos();

const { listasCaracterizacion, encuentrosCaracterizacionConteo } = storeToRefs(cerebroDatos);

const info: Ref<string | null> = ref(null);

/*
function crearDonas(datos: EncuentroCaracterizacionConteo) {
  const nuevasDonas: { tipo: TiposNodo; valores: IDona[] }[] = [];
  let datosSeccion: {sedes:{ slug: string; conteo: number }[] | PersonaCaracterizacion[] | undefined = [];
  llavesEncuentro.forEach((llave: LlavesEncuentro) => {
    if (llave !== 'id' && llave !== 'numero') {
      datosSeccion = datos[llave];
    }

    if (datosSeccion) {
      const total = datosSeccion.sedes?.reduce((acumulado: number, actual) => acumulado + actual.conteo, 0);
      const datosDona = datosSeccion.sedes?.map((obj, i) => {
        return { nombre: obj.slug, valor: obj.conteo, porcentaje: (obj.conteo / total) * 100 };
      });

      nuevasDonas.push({ tipo: llave, valores: datosDona });
    }
  });

  if (datos.tipo === 'colectivos') {
  } else {
    total.value = datos.colectivos ? datos.colectivos.length : 0;
    tituloTotal.value = 'Total colectivos: ';
  }

  donas.value = nuevasDonas;
}
} */

async function crearDonas(datos: EncuentroCaracterizacionConteo[] | null) {
  const nuevasDonas: {
    tipo: LlavesEncuentro;
    valores: IDona[];
  }[][] = [];

  if (!datos) return;

  datos.forEach((encuentro, i) => {
    let total = 0;
    let valores: IDona[] = [];

    if (!encuentro.sedes) return;

    // calcular el total para sacar el porcentaje de cada elemento
    encuentro.sedes.forEach((sede) => {
      let valorTotal = total + sede.conteo;
      total = valorTotal;
    });

    encuentro.sedes.forEach((sede) => {
      const valor = {
        nombre: sede.slug ? sede.slug : 'no slug',
        valor: sede.conteo,
        porcentaje: (sede.conteo * 100) / total,
      };
      valores.push(valor);
    });
    console.log(encuentro);
    nuevasDonas.push([{ tipo: 'sedes', valores: valores }]);
  });
  // console.log(nuevasDonas);
}

onMounted(async () => {
  cerebroGeneral.paginaActual = 'encuentros';
  await cerebroDatos.cargarListasCaracterizacion();
  await cerebroDatos.cargarDatosCaracterizacion();
  await crearDonas(encuentrosCaracterizacionConteo.value);
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

const donasPrueba: {
  tipo: LlavesCaracterizacion;
  valores: IDona[];
}[][] = [
  [
    {
      tipo: 'sedes',
      valores: [
        { nombre: 'Bogotá', valor: 4, porcentaje: (4 * 100) / 9 },
        { nombre: 'Manizales', valor: 3, porcentaje: (3 * 100) / 9 },
        { nombre: 'Palmira', valor: 1, porcentaje: (1 * 100) / 9 },
        { nombre: 'Tumaco', valor: 1, porcentaje: (1 * 100) / 9 },
      ],
    },
    {
      tipo: 'roles',
      valores: [
        { nombre: 'docente', valor: 7, porcentaje: (7 * 100) / 9 },
        { nombre: 'egresado', valor: 1, porcentaje: (1 * 100) / 9 },
        { nombre: 'administrativo', valor: 1, porcentaje: (1 * 100) / 9 },
      ],
    },
  ],
];
</script>

<template>
  <main>
    <div id="contenedorEncuentros">
      <h1>Encuentros</h1>

      <div>
        <h2>Caracterización por encuentro</h2>

        <li v-for="encuentro in encuentrosCaracterizacionConteo">
          {{ encuentro?.numero }}:

          <section class="contenedorDona" v-for="dona in donasPrueba[0]" :key="`dona-${dona.tipo}`">
            <h3>{{ nombresListasCaracterizacion[dona.tipo] }}</h3>

            <Dona :mostrarInfo="mostrarInfo" :secciones="dona.valores" :esconderInfo="esconderInfo" />
          </section>

          <ul v-for="sede in encuentro?.sedes">
            {{
              sede.slug
            }}:
            {{
              sede.conteo
            }}
          </ul>
        </li>
        */
      </div>
      <div>
        <h2>Caracterización total</h2>
        <h3>Asistencia total por sede:</h3>
        <li v-for="lista in listasCaracterizacion?.sedes">{{ lista.nombre }}: {{ lista.conteo }}</li>

        <h3>Asistencia total por roles:</h3>
        <li v-for="lista in listasCaracterizacion?.roles">{{ lista.nombre }}: {{ lista.conteo }}</li>

        <h3>Asistencia total por cargo:</h3>
        <li v-for="lista in listasCaracterizacion?.cargos">{{ lista.nombre }}: {{ lista.conteo }}</li>
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
</style>
