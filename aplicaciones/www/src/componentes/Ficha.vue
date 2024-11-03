<script setup lang="ts">
import { usarCerebroFicha } from '@/cerebros/ficha';
import { LlavesColectivos, LlavesPublicaciones } from '@/tipos/compartidos';
import { nombresListas } from '@/utilidades/constantes';
import { storeToRefs } from 'pinia';

const cerebroFicha = usarCerebroFicha();
const { datosFicha } = storeToRefs(cerebroFicha);
const secciones: (LlavesPublicaciones | LlavesColectivos)[] = [
  'dependencias',
  'indicadores',
  'modalidades',
  'sedes',
  'tipos',
  'autores',
  'años',
  'estados',
];
</script>

<template>
  <div id="contenedorFicha" v-if="datosFicha">
    <div class="ficha">
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
            <div>
              <h4 class="tituloSeccion">{{ nombresListas[tipo] }}</h4>
            </div>

            <ul class="contenidoSeccion">
              <li
                v-for="obj in datosFicha[tipo]"
                :key="`${tipo}-${obj.indice}`"
                class="enlace"
                @click="cerebroFicha.seleccionarNodo(obj.indice, tipo)"
              >
                {{ obj.nombre }}
              </li>
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

.enlace {
  cursor: pointer;
  color: var(--enlacesFondoOscuro);

  &:hover {
    color: var(--blanco);
  }
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
