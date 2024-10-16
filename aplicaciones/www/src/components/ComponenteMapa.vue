<script setup lang="ts">
import mapbox from 'mapbox-gl';
import type { Map } from 'mapbox-gl';
import type { FeatureCollection } from 'geojson';

defineProps<{}>();

import 'mapbox-gl/dist/mapbox-gl.css';
import { onMounted, ref, type Ref } from 'vue';

// POR HACER: PASAR A ARCHIVO
const datosGeo: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { slug: 'amazonia', conteo: 9 },
      geometry: { type: 'Point', coordinates: [-69.9435977, -4.1937385] },
    },
    {
      type: 'Feature',
      properties: { slug: 'bogota', conteo: 243 },
      geometry: { type: 'Point', coordinates: [-74.0858796, 4.6363615] },
    },
    {
      type: 'Feature',
      properties: { slug: 'caribe', conteo: 5 },
      geometry: { type: 'Point', coordinates: [-81.7127803, 12.5362943] },
    },
    {
      type: 'Feature',
      properties: { slug: 'de-la-paz', conteo: 9 },
      geometry: { type: 'Point', coordinates: [-73.2029951, 10.3899886] },
    },
    {
      type: 'Feature',
      properties: { slug: 'manizales', conteo: 41 },
      geometry: { type: 'Point', coordinates: [-75.4923199, 5.0425434] },
    },
    {
      type: 'Feature',
      properties: { slug: 'medellin', conteo: 85 },
      geometry: { type: 'Point', coordinates: [-75.497473, 5.4558195] },
    },
    {
      type: 'Feature',
      properties: { slug: 'nivel-internacional', conteo: 1 },
      geometry: { type: 'Point', coordinates: [-74.1134451, 4.6359316] },
    },
    {
      type: 'Feature',
      properties: { slug: 'nivel-nacional', conteo: 10 },
      geometry: { type: 'Point', coordinates: [-73.5163515, 3.54245] },
    },
    {
      type: 'Feature',
      properties: { slug: 'orinoquia', conteo: 6 },
      geometry: { type: 'Point', coordinates: [-70.7493953, 7.013354] },
    },
    {
      type: 'Feature',
      properties: { slug: 'palmira', conteo: 20 },
      geometry: { type: 'Point', coordinates: [-76.3099641, 3.5119486] },
    },
    {
      type: 'Feature',
      properties: { slug: 'palmira', conteo: 20 },
      geometry: { type: 'Point', coordinates: [-76.3099641, 3.5119486] },
    },
    {
      type: 'Feature',
      properties: { slug: 'palmira-medellin', conteo: 1 },
      geometry: { type: 'Point', coordinates: [-76.306479, 3.517151] },
    },
    {
      type: 'Feature',
      properties: { slug: 'tumaco', conteo: 4 },
      geometry: { type: 'Point', coordinates: [-78.827125, 1.7099745] },
    },
  ],
};

const contenedorMapa: Ref<HTMLDivElement | null> = ref(null);

onMounted(() => {
  if (!contenedorMapa.value) return;
  let mapa: Map;

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
      data: datosGeo,
    });

    mapa.addLayer({
      id: 'colectivos-layer',
      type: 'circle',
      source: 'colectivos-sedes',
      paint: {
        'circle-radius': 8,
        'circle-stroke-width': 2,
        'circle-color': '#c30a93',
        'circle-stroke-color': 'white',
      },
    });

    // POR HACER: Clústers según cantidad de colectivos por sedes
  });
});
</script>

<template>
  <div id="contenedorMapa" ref="contenedorMapa"></div>
</template>

<style lang="scss">
#contenedorMapa {
  position: absolute;
  top: 7vw;
  left: 40vw;
  width: 55vw;
  height: 80vh;
  border-radius: 50%;
}
</style>
