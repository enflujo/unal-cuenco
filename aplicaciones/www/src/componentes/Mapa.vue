<script setup lang="ts">
import mapbox from 'mapbox-gl';
import type { Map } from 'mapbox-gl';
import type { GeoJSON, Position } from 'geojson';

import 'mapbox-gl/dist/mapbox-gl.css';
import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import { usarCerebroDatos } from '@/cerebros/datos';
import { ElementoLista } from '@/tipos/compartidos';

const cerebroDatos = usarCerebroDatos();
const datosSedesGeo: GeoJSON = { type: 'FeatureCollection', features: [] }; //: Ref<FeatureCollection | null> = ref(null);
const cargado: Ref<boolean> = ref(false);

const listaSedes: Ref<ElementoLista[] | undefined> = ref();

const contenedorMapa: Ref<HTMLDivElement | null> = ref(null);
let mapa: Map;

watch(cerebroDatos, (datos) => {
  listaSedes.value = datos.listasColectivos?.sedes;
  cargado.value = true;
});

onMounted(() => {
  // POR HACER: Esperar a que se carguen los datos para mostrar el mapa
  const listaSedes = cerebroDatos.listasColectivos?.sedes;

  listaSedes?.forEach((sede) => {
    // esto podría usarse si se van a hacer donas. Por definir
    const cantActivos = sede.relaciones.find((relacion) => relacion.tipo === 'estados' && relacion.id === '1');
    const cantInactivos = sede.relaciones.find((relacion) => relacion.tipo === 'estados' && relacion.id === '2');

    datosSedesGeo.features.push({
      type: 'Feature',
      properties: {
        slug: `${sede.slug}`,
        conteo: sede.conteo,
        estadoActivo: cantActivos?.conteo ? cantActivos?.conteo : 0, // esto podría usarse si se van a hacer donas. Por definir
        estadoInactivo: cantInactivos?.conteo ? cantInactivos?.conteo : 0,
      },
      geometry: { type: 'Point', coordinates: sede.coordenadas as Position },
    });
  });

  if (!contenedorMapa.value) return;

  const estilo = 'mapbox://styles/enflujo/cm1s6qduv00c701pgd1tm5sxh'; //'mapbox://styles/enflujo/cm1s7mjel00ce01pg63yy7uxj';
  mapbox.accessToken = 'pk.eyJ1IjoiZW5mbHVqbyIsImEiOiJjbDNrOXNndXQwMnZsM2lvNDd4N2x0M3dvIn0.eWs4BHs67PcETEUI00T66Q';

  mapa = new mapbox.Map({
    container: contenedorMapa.value,
    style: estilo,
    center: [-73.8343, 3],
    zoom: 4,
    attributionControl: false,
  });

  // Tratando de hacer filtros
  const estado1 = ['get', 'estados[0]'];
  const estado2 = ['get', 'estados[1]'];
  const estados1 = ['+', ['get', 'estadoActivo']];
  const estados2 = ['+', ['get', 'estadoInactivo']];

  //const estado1 = ['all', ['===', ['get', 'relaciones.tipos'], 'estados'], ['===', ['get', 'relaciones.id'], 1]];
  //const estado2 = ['all', ['===', ['get', 'relaciones.tipos'], 'estados'], ['===', ['get', 'relaciones.id'], 0]];

  // colores para usar si se divide el círculo en dona
  const colors = ['#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c'];

  mapa.on('load', () => {
    mapa.addSource('colectivos-sedes', {
      type: 'geojson',
      data: datosSedesGeo,
      cluster: false, // Por ahora false porque se comporta raro
      clusterRadius: 20,
      clusterProperties: {
        sum: [
          ['+', ['accumulated'], ['get', 'sum']],
          ['get', 'conteo'],
        ],
        clusterAggregate: [
          ['+', ['accumulated'], ['get', 'sum']],
          ['get', 'conteo'],
        ],
      },
    });

    /* circle-radius: 
        valor1: radio si la cantidad es menor que valor2
        valor3: radio si la cantidad está entre valor2 y valor4
        valor5: radio si la cantidad supera valor4 
        */
    mapa.addLayer({
      id: 'colectivos-layer',
      type: 'circle',
      source: 'colectivos-sedes',
      paint: {
        'circle-radius': ['step', ['get', 'conteo'], 12, 20, 25, 100, 35],
        'circle-stroke-width': 2,
        'circle-color': '#00bc96', //['case', estados1, colors[0], estados2],
        'circle-stroke-color': 'white',
      },
    });

    mapa.addLayer({
      id: 'colectivos-cuenta',
      type: 'symbol',
      source: 'colectivos-sedes',
      filter: ['has', 'conteo'],
      paint: {
        'text-color': '#000000',
      },
      layout: {
        'text-field': ['get', 'conteo'],
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 14,
      },
    });
    // POR HACER: Donas ?
  });
});

onUnmounted(() => {
  mapa.remove();
});
</script>

<template>
  <div id="contenedorMapa" ref="contenedorMapa"></div>
</template>

<style lang="scss" scoped>
#contenedorMapa {
  width: 55vw;
  height: 60vh;
}
</style>
