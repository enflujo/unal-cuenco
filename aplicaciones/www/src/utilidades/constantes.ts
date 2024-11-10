import { TiposNodo, TiposNodoSinRelaciones } from '@/tipos';

export const nombresListas: { [llave in TiposNodo | TiposNodoSinRelaciones]: string } = {
  publicaciones: 'Publicaciones',
  colectivos: 'Colectivos',
  autores: 'Autores',
  tipos: 'Tipos',
  años: 'Años',
  dependencias: 'Dependencias',
  indicadores: 'Indicadores',
  sedes: 'Sedes',
  modalidades: 'Modalidades',
  estados: 'Estado',
  referencia: 'Referencia',
  fuente: 'Fuente',
  fechaFin: 'Activo hasta',
  enlaceFuente: 'Enlace Fuente',
  contacto: 'Contacto',
};
