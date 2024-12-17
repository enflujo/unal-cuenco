<script setup lang="ts">
import { usarCerebroFicha } from '@/cerebros/ficha';
import { TiposNodo, TiposNodoSinRelaciones } from '@/tipos';
import { nombresListas } from '@/utilidades/constantes';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, type Ref, ref, watch } from 'vue';
import VisFicha from './VisFicha.vue';

const cerebroFicha = usarCerebroFicha();
const { datosFicha, fichaVisible } = storeToRefs(cerebroFicha);
const contenedorFicha: Ref<HTMLDivElement | null> = ref(null);
const ficha: Ref<HTMLDivElement | null> = ref(null);
/**
 * Las secciones de la ficha en el orden que se muestran
 */
const secciones: Array<TiposNodo | TiposNodoSinRelaciones> = [
  'publicaciones',
  'colectivos',
  'fuente',
  'enlaceFuente',
  'autores',
  'estados',
  'contacto',
  'dependencias',
  'indicadores',
  'modalidades',
  'sedes',
  'tipos',
  'años',
  'referencia',
];

onMounted(() => {
  document.body.addEventListener('click', clicFuera);
  document.body.addEventListener('keydown', cambiarFicha);
});

onUnmounted(() => {
  document.body.removeEventListener('click', clicFuera);
  document.body.removeEventListener('keydown', cambiarFicha);
});

watch(datosFicha, (datos) => {
  if (datos && ficha.value) {
    ficha.value.scroll({ top: 0, behavior: 'smooth' });
  }
});

function cambiarFicha(evento: KeyboardEvent) {
  if (!datosFicha.value || !fichaVisible.value) return;
  const tecla = evento.key;

  if (tecla === 'ArrowLeft') {
    cerebroFicha.cambiarFicha(datosFicha.value.id, datosFicha.value.tipo, 'atras');
  } else if (tecla === 'ArrowRight') {
    cerebroFicha.cambiarFicha(datosFicha.value.id, datosFicha.value.tipo, 'adelante');
  }
}

function clicFuera(evento: MouseEvent) {
  evento.stopPropagation();
  if (!contenedorFicha.value) return;
  const elemento = evento.target as HTMLElement;
  if (!(contenedorFicha.value === elemento || contenedorFicha.value.contains(elemento))) {
    if (fichaVisible) {
      cerebroFicha.cerrarFicha();
    }
  }
}

function abrirElemento(evento: MouseEvent, id: string, tipo: TiposNodo) {
  evento.stopPropagation();
  cerebroFicha.seleccionarNodo(id, tipo);
}
</script>

<template>
  <div id="contenedorFicha" ref="contenedorFicha" :class="fichaVisible ? 'visible' : ''">
    <div class="ficha" ref="ficha" v-if="datosFicha">
      <header id="encabezado">
        <div id="superior">
          <span class="negrita">{{ datosFicha.nombreTipo }}</span>
          <span class="boton" id="cerrarFichaPA" ref="cerrarFichaPA" @click="cerebroFicha.cerrarFicha">X</span>
        </div>

        <div id="inferior">
          <span
            class="boton"
            id="botonAnterior"
            @click="cerebroFicha.cambiarFicha(datosFicha.id, datosFicha.tipo, 'atras')"
            ><</span
          >
          <h2 id="tituloFicha">{{ datosFicha.titulo }}</h2>
          <span
            class="boton"
            id="botonSiguiente"
            @click="cerebroFicha.cambiarFicha(datosFicha.id, datosFicha.tipo, 'adelante')"
            >></span
          >
        </div>
      </header>

      <div id="contenido">
        <div id="descripcionFicha" v-html="datosFicha.resumen"></div>

        <div v-for="tipo in secciones" :key="`seccion-${tipo}`">
          <section class="seccionFicha" v-if="datosFicha[tipo]">
            <div class="contenedorPegajoso">
              <h3 class="tituloSeccion">{{ nombresListas[tipo] }}</h3>
            </div>

            <ul class="contenidoSeccion">
              <li
                v-if="Array.isArray(datosFicha[tipo])"
                v-for="obj in datosFicha[tipo]"
                :key="`${tipo}-${obj.id}`"
                class="enlace"
                @click="abrirElemento($event, obj.id, tipo as TiposNodo)"
              >
                {{ obj.nombre }} {{ tipo === 'estados' && datosFicha.fechaFin ? ` (${datosFicha.fechaFin})` : '' }}
              </li>

              <li v-else v-html="datosFicha[tipo]"></li>
            </ul>
          </section>
        </div>
      </div>
    </div>

    <VisFicha />
  </div>
</template>

<style lang="scss" scoped>
@use '@/scss/constantes' as *;
$margenY: 10px;

#contenedorFicha {
  z-index: 99;
  width: 90vw;
  height: calc(95vh - $altoMenuCelular);
  @include gradienteAzulCircular;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  top: $altoMenuPantalla;
  border-radius: 20px;
  padding: 1em;
  overflow: hidden;
  display: none;

  &.visible {
    display: flex;
    flex-direction: column;
  }
}

#descripcionFicha {
  padding: 1em 0 1.5em 0;
}

.ficha {
  border: 1px white solid;
  overflow: auto;
  display: flex;
  flex-direction: column;
  width: 100%;

  h2 {
    margin: 0;
    font-size: 1em;
    padding: 1em 2em;
  }

  .boton {
    cursor: pointer;

    &:hover {
      color: var(--azulOscuroCuenco);
    }
  }

  #contenido {
    color: white;
    padding: 1em 2em;
  }
}

.negrita {
  font-weight: bold;
}

.seccionFicha {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid var(--blanco);
  margin-bottom: 0.5em;

  li {
    padding-bottom: 0.25em;
  }

  .contenedorPegajoso {
    width: 35%;
    margin: 0.5em 1em 0 0;
  }

  .tituloSeccion {
    position: sticky;
    top: 100px;
  }

  .contenidoSeccion {
    flex-basis: 65%;
    overflow-wrap: anywhere;
    margin: 0.5em 0 0 0;
  }
}

#encabezado {
  background-color: var(--blanco);
  color: var(--magentaCuenco);
  padding: 0.5em 1em;
  position: sticky;
  top: 0;
  z-index: 2;

  #superior {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--magentaCuenco);
  }

  #inferior {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: 0.9em;
      font-weight: 400;
      margin: 1em 1.5em;
    }

    #año {
      margin-right: 1em;
    }
  }
}

@media screen and (min-width: $minTablet) {
  #contenedorFicha {
    width: 80vw;
    height: calc(100vh - $altoMenuPantalla - $altoLinea);
    &.visible {
      flex-direction: row;
    }
  }
  .ficha {
    width: 50%;
  }
}
</style>
