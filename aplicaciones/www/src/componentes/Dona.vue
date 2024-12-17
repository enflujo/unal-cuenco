<script setup lang="ts">
import type { DonaProcesada, IDona } from '@/tipos';
import { onMounted, ref, toRefs, watch } from 'vue';

interface Esquema {
  secciones: IDona[];
  mostrarInfo: (trozo: DonaProcesada) => void;
  esconderInfo: () => void;
}

const props = defineProps<Esquema>();
const { secciones } = toRefs(props);

const valoresDona = ref<DonaProcesada[]>([]);
import { colores } from '@/utilidades/constantes';
import { usarCerebroGeneral } from '@/cerebros/general';
import { storeToRefs } from 'pinia';

const cerebroGeneral = usarCerebroGeneral();
const { fragmentoDonaElegido } = storeToRefs(cerebroGeneral);
//const fragmentoElegido: Ref<string> = ref('');

onMounted(actualizarDonas);

watch(secciones, actualizarDonas);
watch(fragmentoDonaElegido, actualizarDonas);

function actualizarDonas() {
  let ajusteAngulo = 0;
  valoresDona.value = secciones.value.map((seccion, i) => {
    const obj = { ...seccion, ajuste: ajusteAngulo, color: colores[i] };
    ajusteAngulo -= seccion.porcentaje;
    return obj;
  });
}

// Si se quiere elegir el fragmento haciendo click y no con el hover
/* function elegirFragmento(fragmento: string) {
  if (fragmentoElegido.value === '' || fragmento !== cerebroGeneral.fragmentoDonaElegido) {
    fragmentoElegido.value = fragmento;
  } else {
    fragmentoElegido.value = '';
  }
  cerebroGeneral.fragmentoDonaElegido = fragmentoElegido.value;
} */
</script>

<template>
  <svg class="dona" viewBox="0 0 50 50" :stroke-width="5">
    <g>
      <circle
        v-for="(trozo, i) in valoresDona"
        cx="25"
        cy="25"
        r="16"
        :stroke-dasharray="`${trozo.porcentaje + 1} 100`"
        :stroke-dashoffset="trozo.ajuste"
        :stroke="trozo.color"
        :data-color="colores[i]"
        class="fragmento"
        :class="trozo.nombre === fragmentoDonaElegido ? 'elegido' : ''"
        @mouseenter="mostrarInfo(trozo)"
        @mouseleave="esconderInfo"
      ></circle>
      <circle
        class="donaCentro"
        cx="25"
        cy="25"
        r="16"
        :fill="`${cerebroGeneral.paginaActual === 'encuentros' ? '#ffffff' : 'rgb(57, 73, 164)'}`"
      ></circle>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.dona {
  width: 200px;
}

// Esto si quisiéramos adelgazar la línea del círculo para que coincida con el hover
// .donaCentro {
//   //fill: var(--azulOscuroCuenco);
// }

circle {
  fill: transparent;
  &.fragmento {
    cursor: pointer;
  }

  &.elegido {
    //    filter: drop-shadow(1px 1px 1px #3949a4) drop-shadow(-1px -1px 1px #3949a4);
    stroke-width: 7;
  }
}

.text {
  font-family: Roboto, sans-serif;
  fill: #fff;
  font-size: 2px;
  text-align: left;
}
</style>
