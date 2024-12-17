<script setup lang="ts">
import type { DonaProcesada, IDona } from '@/tipos';
import { onMounted, ref, toRefs, watch } from 'vue';
import { colores } from '@/utilidades/constantes';
import { usarCerebroGeneral } from '@/cerebros/general';
import { storeToRefs } from 'pinia';

interface Esquema {
  secciones: IDona[];
  mostrarInfo: (trozo: DonaProcesada) => void;
  esconderInfo: () => void;
}

const props = defineProps<Esquema>();
const { secciones } = toRefs(props);
const trozosDona = ref<SVGPathElement[]>([]);
const valoresDona = ref<DonaProcesada[]>([]);
const cerebroGeneral = usarCerebroGeneral();
const { fragmentoDonaElegido } = storeToRefs(cerebroGeneral);

onMounted(actualizarDonas);
watch(secciones, actualizarDonas);
watch(fragmentoDonaElegido, () => {
  if (!fragmentoDonaElegido.value) return;
  const indiceTrozo = valoresDona.value.findIndex((trozo) => trozo.nombre === fragmentoDonaElegido.value);

  if (indiceTrozo >= 0) {
    traerAlFrente(indiceTrozo);
  }
});

function actualizarDonas() {
  let anguloActual = 0; // Empezamos en 0 grados

  valoresDona.value = secciones.value.map((seccion, i) => {
    const anguloInicial = anguloActual;
    const anguloFinal = anguloActual + (seccion.porcentaje / 100) * 360;

    const obj = {
      ...seccion,
      ajuste: anguloInicial,
      anguloFinal,
      color: colores[i],
    };

    anguloActual = anguloFinal;
    return obj;
  });
}

// Reordenar el elemento seleccionado al final del contenedor
function traerAlFrente(indice: number) {
  const elemento = trozosDona.value[indice];
  const contenedor = elemento.parentNode;
  if (contenedor) {
    contenedor.appendChild(elemento); // Mueve el elemento al final
  }
}

function generarArcoDona(
  cx: number, // Centro X
  cy: number, // Centro Y
  radioExterior: number, // Radio exterior
  radioInterior: number, // Radio interior
  anguloInicial: number, // Ángulo inicial
  anguloFinal: number // Ángulo final
) {
  const p1 = polarACartesiano(cx, cy, radioExterior, anguloInicial);
  const p2 = polarACartesiano(cx, cy, radioExterior, anguloFinal);
  const p3 = polarACartesiano(cx, cy, radioInterior, anguloFinal);
  const p4 = polarACartesiano(cx, cy, radioInterior, anguloInicial);

  const arco = anguloFinal - anguloInicial > 180 ? 1 : 0;

  return [
    // Mover al punto exterior inicial
    `M ${p1.x} ${p1.y}`,
    // Arco exterior
    `A ${radioExterior} ${radioExterior} 0 ${arco} 1 ${p2.x} ${p2.y}`,
    // Línea al punto interior
    `L ${p3.x} ${p3.y}`,
    // Arco interior
    `A ${radioInterior} ${radioInterior} 0 ${arco} 0 ${p4.x} ${p4.y}`,
    // Cerrar el path
    `Z`,
  ].join(' ');
}

// Conversión de coordenadas polares a cartesianas
function polarACartesiano(centroX: number, centroY: number, radio: number, anguloEnGrados: number) {
  const anguloEnRadianes = ((anguloEnGrados - 90) * Math.PI) / 180.0;
  return {
    x: centroX + radio * Math.cos(anguloEnRadianes),
    y: centroY + radio * Math.sin(anguloEnRadianes),
  };
}
</script>

<template>
  <svg class="dona" viewBox="0 0 50 50">
    <g>
      <path
        v-for="(trozo, i) in valoresDona"
        :key="i"
        ref="trozosDona"
        :d="generarArcoDona(25, 25, 20, 10, trozo.ajuste, trozo.anguloFinal)"
        :fill="trozo.color"
        :class="{ elegido: trozo.nombre === fragmentoDonaElegido }"
        @mouseenter="
          () => {
            mostrarInfo(trozo);
            traerAlFrente(i);
          }
        "
        @mouseleave="esconderInfo"
      ></path>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.dona {
  width: 200px;
}

path {
  cursor: pointer;
  stroke: #fff; /* Borde blanco entre secciones */
  stroke-width: 0.1;
  transform-origin: center;
  transition: transform 0.2s ease;

  &.elegido,
  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4));
  }
}
</style>
