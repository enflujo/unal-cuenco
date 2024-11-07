<script setup lang="ts">
import mapbox from 'mapbox-gl';
import type { Map } from 'mapbox-gl';
import type { GeoJSON, FeatureCollection, Position } from 'geojson';

import 'mapbox-gl/dist/mapbox-gl.css';
import { onBeforeMount, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
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
    datosSedesGeo.features.push({
      type: 'Feature',
      properties: { slug: `${sede.slug}`, conteo: `${sede.conteo}` },
      geometry: { type: 'Point', coordinates: sede.coordenadas as Position },
    });
  });

  if (!contenedorMapa.value) return;

  // POR HACER: Cambiar el estilo
  const estilo = 'mapbox://styles/enflujo/cm1s6qduv00c701pgd1tm5sxh'; //'mapbox://styles/enflujo/cm1s7mjel00ce01pg63yy7uxj';
  mapbox.accessToken = 'pk.eyJ1IjoiZW5mbHVqbyIsImEiOiJjbDNrOXNndXQwMnZsM2lvNDd4N2x0M3dvIn0.eWs4BHs67PcETEUI00T66Q';

  mapa = new mapbox.Map({
    container: contenedorMapa.value,
    style: estilo,
    center: [-73.8343, 3],
    zoom: 4,
    attributionControl: false,
  });

  mapa.on('load', () => {
    mapa.addSource('colectivos-sedes', {
      type: 'geojson',
      data: datosSedesGeo,
    });

    mapa.addLayer({
      id: 'colectivos-layer',
      type: 'circle',
      source: 'colectivos-sedes',
      paint: {
        'circle-radius': 8,
        'circle-stroke-width': 2,
        'circle-color': '#c30a92',
        'circle-stroke-color': 'white',
      },
    });

    // POR HACER: Clústers según cantidad de colectivos por sedes
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
