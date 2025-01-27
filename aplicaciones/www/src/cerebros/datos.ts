import { defineStore } from 'pinia';
import { ordenarRapido, pedirDatos } from '@/utilidades/ayudas';
import type { CerebroDatos, GeoColectivos } from '@/tipos';
import type {
  Colectivo,
  Indicador,
  ListasColectivos,
  ListasPublicaciones,
  LlavesColectivos,
  LlavesPublicaciones,
  Publicacion,
  ListasCaracterizacion,
  LlavesCaracterizacion,
  EncuentroCaracterizacionConteo,
  ElementoLista,
  LlavesEncuentros,
  ListasEncuentros,
  Encuentro,
} from '@/tipos/compartidos';
import { colores } from '@/utilidades/constantes';

function asignarColor(lista: ElementoLista[]) {
  lista.forEach((elemento, i) => {
    const color = colores[i % colores.length];
    elemento.color = color;
  });
}

export const usarCerebroDatos = defineStore('cerebroDatos', {
  state: (): CerebroDatos => {
    return {
      listaElegida: null,
      extremosFechasPublicaciones: null,

      // COLECTIVOS
      colectivos: null,
      indicadoresColectivos: null,
      cargandoColectivos: false,

      listasColectivos: null,
      listasColectivosOrdenadas: null,
      cargandoListasColectivos: false,

      geoColectivos: null,

      // PUBLICACIONES
      publicaciones: null,
      indicadoresPublicaciones: null,
      cargandoPublicaciones: false,

      listasPublicaciones: null,
      listasPublicacionesOrdenadas: null,
      cargandoListasPublicaciones: false,

      // CARACTERIZACIÓN ENCUENTROS
      encuentrosCaracterizacionConteo: null,
      cargandoEncuentroCaracterizacion: false,

      listasCaracterizacion: null,
      cargandoCaracterizacionConteo: false,

      // ENCUENTROS
      encuentros: null,
      indicadoresEncuentros: null,
      cargandoEncuentros: false,
      listasEncuentros: null,
      cargandoListasEncuentros: false,
      listasEncuentrosOrdenadas: null,
    };
  },

  actions: {
    /**
     * Define la lista a mostrar.
     *
     * @param llaveLista Llave de la lista a cambiar.
     */
    cambiarLista(llaveLista: LlavesColectivos | LlavesPublicaciones | LlavesEncuentros) {
      this.listaElegida = llaveLista;
    },

    async cargarDatosPublicaciones() {
      if (this.publicaciones || this.cargandoPublicaciones) return;
      this.cargandoPublicaciones = true;

      try {
        this.publicaciones = await pedirDatos<Publicacion[]>('datos/publicaciones.json');
        this.indicadoresPublicaciones = await pedirDatos<Indicador[]>('datos/indicadores-publicaciones.json');
        this.cargandoPublicaciones = false;
      } catch (error) {
        console.error('Problema cargando datos de publicaciones', JSON.stringify(error));
      }

      await this.cargarDatosListaPublicaciones();
    },

    async cargarDatosListaPublicaciones() {
      if (this.listasPublicaciones || this.cargandoListasPublicaciones) return;
      this.cargandoListasPublicaciones = true;

      try {
        const listas = await pedirDatos<ListasPublicaciones>('datos/listasPublicaciones.json');
        const { años } = listas;
        let añoMin = Infinity;
        let añoMax = 0;

        // Extraer los extremos de fecha mínima y máxima
        años.forEach((año) => {
          const valorAño = +año.nombre;
          if (añoMin > valorAño) añoMin = valorAño;
          if (añoMax < valorAño) añoMax = valorAño;
        });
        const valores = { min: añoMin, max: añoMax };
        this.extremosFechasPublicaciones = { ...valores, total: añoMax - añoMin };
        this.listasPublicacionesOrdenadas = { tipos: [], años: [], dependencias: [], indicadores: [], autores: [] };

        for (const tipo in listas) {
          const lista = [...listas[tipo as LlavesPublicaciones]];
          const largo = lista.length;
          ordenarRapido(lista, 0, largo - 1, largo);
          asignarColor(lista);
          this.listasPublicacionesOrdenadas[tipo as LlavesPublicaciones] = lista;
        }
        this.listasPublicaciones = listas;
        this.cargandoListasPublicaciones = false;
      } catch (error) {
        console.error('Problema cargando datos de listasPublicaciones', JSON.stringify(error));
      }
    },

    async cargarDatosColectivos() {
      if (this.colectivos || this.cargandoColectivos) return;
      this.cargandoColectivos = true;

      try {
        this.colectivos = await pedirDatos<Colectivo[]>('datos/colectivos.json');
        this.indicadoresColectivos = await pedirDatos<Indicador[]>('datos/indicadores-colectivos.json');
        this.cargandoColectivos = false;
      } catch (error) {
        console.error('Problema cargando datos de colectivos', JSON.stringify(error));
      }

      await this.cargarDatosListaColectivos();

      /**
       * Crear geojson de colectivos.
       */
      const sedes = this.listasColectivos?.sedes;

      if (!sedes) return;
      const geo: GeoColectivos = { type: 'FeatureCollection', features: [] };

      sedes?.forEach((sede) => {
        if (!sede.coordenadas) return;

        geo.features.push({
          type: 'Feature',
          id: sede.id,
          properties: {
            id: sede.id,
            conteo: sede.conteo,
            nombre: sede.nombre,
          },
          geometry: { type: 'Point', coordinates: sede.coordenadas },
        });
      });

      this.geoColectivos = geo;
    },

    async cargarDatosListaColectivos() {
      if (this.listasColectivos || this.cargandoListasColectivos) return;
      this.cargandoListasColectivos = true;

      try {
        const listas = await pedirDatos<ListasColectivos>('datos/listasColectivos.json');
        this.listasColectivosOrdenadas = {
          tipos: [],
          estados: [],
          dependencias: [],
          indicadores: [],
          sedes: [],
          modalidades: [],
        };

        for (const tipo in listas) {
          const lista = [...listas[tipo as LlavesColectivos]];
          const largo = lista.length;
          ordenarRapido(lista, 0, largo - 1, largo);
          asignarColor(lista);
          this.listasColectivosOrdenadas[tipo as LlavesColectivos] = lista;
        }
        this.listasColectivos = listas;
        this.cargandoListasColectivos = false;
      } catch (error) {
        console.error('Problema cargando datos de listasColectivos', JSON.stringify(error));
      }
    },

    async cargarDatosEncuentros() {
      if (this.encuentros || this.cargandoEncuentros) return;
      this.cargandoEncuentros = true;

      try {
        this.encuentros = await pedirDatos<Encuentro[]>('datos/encuentros2.json');
        this.indicadoresEncuentros = await pedirDatos<Indicador[]>('datos/categoriasEncuentros.json');
        this.cargandoEncuentros = false;
      } catch (error) {
        console.error('Problema cargando datos de encuentros', JSON.stringify(error));
      }

      await this.cargarDatosListaEncuentros();
    },

    async cargarDatosListaEncuentros() {
      if (this.listasEncuentros || this.cargandoListasEncuentros) return;
      this.cargandoListasEncuentros = true;

      try {
        const listas = await pedirDatos<ListasEncuentros>('datos/listasEncuentros2.json');
        this.listasEncuentrosOrdenadas = {
          tipos: [],
          indicadores: [],
          sedes: [],
          tecnicas: [],
          categorias: [],
          tematicas: [],
          participantes: [],
        };

        for (const tipo in listas) {
          const lista = [...listas[tipo as LlavesEncuentros]];
          const largo = lista.length;
          ordenarRapido(lista, 0, largo - 1, largo);
          asignarColor(lista);
          this.listasEncuentrosOrdenadas[tipo as LlavesEncuentros] = lista;
        }
        this.listasEncuentros = listas;
        this.cargandoListasEncuentros = false;
      } catch (error) {
        console.error('Problema cargando datos de listasEncuentros', JSON.stringify(error));
      }
    },

    // CARACTERIZACIÓN DE ENCUENTROS
    async cargarDatosCaracterizacion() {
      if (this.encuentrosCaracterizacionConteo || this.cargandoEncuentroCaracterizacion) return;
      this.cargandoEncuentroCaracterizacion = true;

      try {
        this.encuentrosCaracterizacionConteo =
          await pedirDatos<EncuentroCaracterizacionConteo[]>('datos/encuentros.json');
        this.cargandoEncuentroCaracterizacion = false;
      } catch (error) {
        console.error('Problema cargando datos de encuentros', JSON.stringify(error));
      }

      await this.cargarListasCaracterizacion();
    },

    async cargarListasCaracterizacion() {
      if (this.listasCaracterizacion || this.cargandoCaracterizacionConteo) return;
      this.cargandoCaracterizacionConteo = true;

      try {
        const listas = await pedirDatos<ListasCaracterizacion>('datos/listasEncuentros.json');
        this.listasCaracterizacion = { sedes: [], tiposSede: [], roles: [], cargos: [] };

        for (const tipo in listas) {
          const lista = [...listas[tipo as LlavesCaracterizacion]];
          const largo = lista.length;
          ordenarRapido(lista, 0, largo - 1, largo);
          asignarColor(lista);
          if (!this.listasCaracterizacion) return;
          this.listasCaracterizacion[tipo as LlavesCaracterizacion] = lista;
        }
        this.listasCaracterizacion = listas;
        this.cargandoListasColectivos = false;
      } catch (error) {
        console.error('Problema cargando datos de caracterizacionConteo', JSON.stringify(error));
      }
    },
  },
});
