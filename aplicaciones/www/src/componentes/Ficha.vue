<script setup lang="ts">
import { usarCerebroFicha } from '@/cerebros/ficha';
import { TiposNodo } from '@/tipos';
import { nombresListas } from '@/utilidades/constantes';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, type Ref, ref } from 'vue';

const cerebroFicha = usarCerebroFicha();
const { datosFicha, fichaVisible } = storeToRefs(cerebroFicha);
const contenedorFicha: Ref<HTMLDivElement | null> = ref(null);
const secciones: TiposNodo[] = [
  'publicaciones',
  'colectivos',
  'fuente',
  'dependencias',
  'indicadores',
  'modalidades',
  'sedes',
  'tipos',
  'autores',
  'años',
  'estados',
];

onMounted(() => {
  document.body.addEventListener('click', clicFuera);
});

onUnmounted(() => {
  document.body.removeEventListener('click', clicFuera);
});

function clicFuera(evento: MouseEvent) {
  if (!contenedorFicha.value) return;
  const elemento = evento.target as HTMLElement;
  if (!(contenedorFicha.value === elemento || contenedorFicha.value.contains(elemento))) {
    if (fichaVisible) {
      cerebroFicha.cerrarFicha();
    }
  }
}

function abrirElemento(evento: MouseEvent, i: number, id: TiposNodo) {
  evento.stopPropagation();
  cerebroFicha.seleccionarNodo(i, id);
}
</script>

<template>
  <div id="contenedorFicha" ref="contenedorFicha" v-if="fichaVisible">
    <div class="ficha" v-if="datosFicha">
      <header id="encabezado">
        <div id="superior">
          <!-- <div class="negrita">#{{ datosNodo.id }}</div> -->
          <span class="negrita">{{ datosFicha.tipo }}</span>
          <span class="boton" id="cerrarFichaPA" ref="cerrarFichaPA" @click="cerebroFicha.cerrarFicha">X</span>
        </div>

        <div id="inferior">
          <span class="boton" id="botonAnterior" @click="cerebroFicha.fichaAnterior"><</span>
          <h3 id="tituloFicha">{{ datosFicha.titulo }}</h3>
          <span class="boton" id="botonSiguiente" @click="cerebroFicha.fichaSiguiente">></span>
        </div>
      </header>

      <div id="contenido">
        <div id="descripcionFicha" v-html="datosFicha.resumen"></div>

        <div v-for="tipo in secciones" :key="`seccion-${tipo}`">
          <section class="seccionFicha" v-if="datosFicha[tipo]?.length">
            <h4 class="tituloSeccion">{{ nombresListas[tipo] }}</h4>

            <ul class="contenidoSeccion">
              <li
                v-if="Array.isArray(datosFicha[tipo])"
                v-for="obj in datosFicha[tipo]"
                :key="`${tipo}-${obj.indice}`"
                class="enlace"
                @click="abrirElemento($event, obj.indice, tipo)"
              >
                {{ obj.nombre }}
              </li>

              <li v-else v-html="datosFicha[tipo]"></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#contenedorFicha {
  z-index: 99;
  width: 40vw;
  height: 90vh;
  background-color: var(--azulOscuroCuenco);
  position: fixed;
  right: 5vw;
  top: 10px;
  border-radius: 20px;
  padding: 1em;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

#descripcionFicha {
  padding: 1em 0 1.5em 0;
}

.ficha {
  border: 1px white solid;
  overflow: auto;

  h2 {
    margin: 0;
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
    list-style: none;
    padding-bottom: 0.25em;
  }

  .tituloSeccion {
    position: sticky;
    top: 0;
    width: 35%;
    margin: 0.5em 1em 0 0;
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
</style>
