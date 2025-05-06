<script setup lang="ts">
import 'mapbox-gl/dist/mapbox-gl.css';
import mapbox from 'mapbox-gl';
import type { Map } from 'mapbox-gl';
import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import { usarCerebroDatos } from '@/cerebros/datos';
import { storeToRefs } from 'pinia';
import { usarCerebroFicha } from '@/cerebros/ficha';
import { PropiedadesGeoColectivos } from '@/tipos';

const cerebroDatos = usarCerebroDatos();
const cerebroFicha = usarCerebroFicha();
const { geoColectivos } = storeToRefs(cerebroDatos);
const contenedorMapa: Ref<HTMLDivElement | null> = ref(null);
const infoMapa: Ref<HTMLDivElement | null> = ref(null);
let mapa: Map | undefined;

const props = defineProps<{ pagina: string }>();

// Crear mapa si no existe y si hay datos.
watch(geoColectivos, (geo) => {
  if (!geo || mapa) return;
  crearMapa();
});

onMounted(() => {
  if (!geoColectivos.value) return;
  crearMapa();
});

onUnmounted(() => {
  if (!mapa) return;
  mapa.remove();
});

function crearMapa() {
  if (!contenedorMapa.value || mapa) return;
  const estilo = 'mapbox://styles/enflujo/cm1s6qduv00c701pgd1tm5sxh';
  mapbox.accessToken = 'pk.eyJ1IjoiZW5mbHVqbyIsImEiOiJjbDNrOXNndXQwMnZsM2lvNDd4N2x0M3dvIn0.eWs4BHs67PcETEUI00T66Q';
  let idDePuntoSeleccionado: string | null = null;

  mapa = new mapbox.Map({
    container: contenedorMapa.value,
    style: estilo,
    center: [-73.8343, 3],
    zoom: 4,
    attributionControl: false,
  });

  mapa.on('load', () => {
    if (!geoColectivos.value || !mapa) return;

    mapa.addSource('colectivos', {
      type: 'geojson',
      data: geoColectivos.value,
    });

    mapa.addLayer({
      id: 'sedes',
      type: 'circle',
      source: 'colectivos',
      paint: {
        'circle-radius': props.pagina === 'inicio' ? 7 : ['step', ['get', 'conteo'], 12, 20, 25, 100, 35],
        'circle-stroke-width': 2,
        //'circle-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#c30a93', '#00bc96'],
         'circle-color': [
          'match',
          ['get', 'nombre'],
          'Nivel Nacional',
          '#c30a93',
          'Nivel Internacional',
          '#c30a93',
          /* otros */ '#00bc96',
        ],
        'circle-stroke-color': 'white',
      },
    });

    // Mostrar cantidad de colectivos si es el mapa de la página de colectivos
    if (props.pagina === 'colectivos') {
      mapa.addLayer({
        id: 'conteos',
        type: 'symbol',
        source: 'colectivos',
        filter: ['has', 'conteo'],
        paint: {
          'text-color': '#000',
          // 'circle-color': ['case', ['get', 'nombre', 'Nivel Nacional'], '#c30a93', '#00bc00'],
        },
        layout: {
          'text-field': ['get', 'conteo'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
      });

      mapa.on('click', 'sedes', (evento) => {
        evento.originalEvent.stopPropagation();
        if (!evento.features || evento.features.length === 0) return;
        const propiedades = evento.features[0].properties;

        if (propiedades && propiedades.id) {
          cerebroDatos.cambiarLista('sedes');
          cerebroFicha.seleccionarNodo(propiedades.id, 'sedes');
        }
      });
    }

    mapa.on('mousemove', (evento) => {
      if (!infoMapa.value || !mapa) return;
      const features = mapa.queryRenderedFeatures(evento.point, { layers: ['sedes'] });

      if (features && features.length > 0) {
        const { clientX, clientY } = evento.originalEvent;
        const datosPunto = features[0].properties as PropiedadesGeoColectivos;
        if (!datosPunto) return;

        infoMapa.value.innerHTML = crearTextoSede(datosPunto);
        infoMapa.value.style.left = `${clientX}px`;
        infoMapa.value.style.top = `${clientY}px`;

        if (idDePuntoSeleccionado !== datosPunto.id) {
          if (idDePuntoSeleccionado) {
            mapa.setFeatureState({ source: 'colectivos', id: idDePuntoSeleccionado }, { hover: false });
          }

          idDePuntoSeleccionado = datosPunto.id as string;

          mapa.setFeatureState({ source: 'colectivos', id: idDePuntoSeleccionado }, { hover: true });
        }
      } else {
        infoMapa.value.innerHTML = '';

        if (idDePuntoSeleccionado) {
          mapa.setFeatureState({ source: 'colectivos', id: idDePuntoSeleccionado }, { hover: false });
        }
      }
    });

    // mostrar información sobre los puntos cuando el ratón entre
    mapa.on('mouseenter', 'sedes', () => {
      if (!infoMapa.value || !mapa) return;
      mapa.getCanvas().style.cursor = 'pointer';
      infoMapa.value.classList.add('activo');
    });

    mapa.on('mouseleave', 'sedes', () => {
      if (!infoMapa.value || !mapa) return;
      mapa.getCanvas().style.cursor = '';
      infoMapa.value.classList.remove('activo');
    });
  });
}

function crearTextoSede(datos: PropiedadesGeoColectivos) {
  let nombre = `Sede ${datos.nombre}`;

  if (datos.nombre === 'Nivel Internacional' || datos.nombre === 'Nivel Nacional') {
    nombre = datos.nombre;
  }
  if (props.pagina === 'colectivos') {
    return `<p class="nombre">${nombre}</p>
    <p class="conteo">${datos.conteo} colectivo${datos.conteo > 1 ? 's' : ''}</p>`;
  } else if (props.pagina === 'inicio') {
    return `<p class="nombre">${nombre}</p>`;
  }

  return nombre;
}
</script>

<template>
  <h2 v-if="props.pagina === 'inicio'">Sedes de la Universidad Nacional de Colombia</h2>
  <div id="contenedorMapa" ref="contenedorMapa"></div>
  <div id="infoMapa" ref="infoMapa"></div>
</template>

<style lang="scss">
@use '@/scss/constantes' as *;

#infoMapa {
  @include gradienteAzulCircular;
  color: var(--blanco);
  position: absolute;
  top: 0;
  right: 0;
  padding: 1em;
  z-index: 1;
  max-width: 150px;
  transform: translate(-50%, -111%);
  pointer-events: none;
  text-align: center;
  display: none;
  border-radius: 5px;

  .nombre {
    font-weight: bold;
  }

  .conteo {
    font-size: 0.8em;
  }

  &.activo {
    display: block;
  }

  p {
    margin: 0;
  }
}
</style>

<style lang="scss" scoped>
@use '@/scss/constantes' as *;
#contenedorMapa {
  width: 80vw;
  height: 60vh;
  margin: 1em auto;
}

@media screen and (min-width: $minTablet) {
  #contenedorMapa {
    width: 51vw;
    margin: 2em 0;
  }
}

@media screen and (min-width: $minPantalla) {
  // #contenedorMapa {
  // }
}
</style>
