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

export const coloresFiltros: string[] = [
  '#3949a4',
  '#8ac50b',
  '#4444AE',
  '#dc6f62',
  '#EE8B98',
  '#9920EF',
  '#45CB85',
  '#22AED1',
  '#70FF44',
  '#d8cc34',
  '#edc9ff',
  '#e8aa14',
  '#3bf4fb',
  '#ff5714',
  '#1a1b41',
  '#c2e7da',
  '#a4243b',
  '#c879ff',
  '#caff8a',
  '#6eeb83',
  '#363457',
  '#735290',
  '#465c69',
  '#C4A69D',
  '#24ff46',
  '#5584fb',
  '#005714',
  '#161741',
  '#c2e47f',
  '#a424ff',
  '#c87900',
  '#caff99',
  '#3f3f57',
  '#7f52f0',
  '#465c60',
  '#C4A6ED',
  '#24AA46',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FF00FF',
  '#00FFFF',
  '#800000',
  '#008000',
  '#000080',
  '#808000',
  '#800080',
  '#008080',
  '#C0C0C0',
  '#808080',
  '#D3D3D3',
  '#A9A9A9',
  '#D2691E',
  '#DC143C',
  '#c30a93',
  '#FF4500',
  '#2E8B57',
  '#ADFF2F',
  '#FFD700',
  '#DAA520',
  '#FF6347',
  '#F4A300',
  '#B22222',
  '#FF1493',
  '#7FFF00',
  '#FF8C00',
  '#8A2BE2',
  '#D8BFD8',
  '#FF00FF',
  '#90EE90',
  '#FF69B4',
  '#FFB6C1',
  '#8B0000',
  '#4B0082',
  '#800080',
  '#F0E68C',
  '#98FB98',
  '#FF7F50',
  '#E9967A',
  '#B0C4DE',
  '#708090',
  '#9ACD32',
  '#B8860B',
  '#483D8B',
  '#D3D3D3',
  '#F5FFFA',
  '#9B30FF',
  '#2F4F4F',
  '#228B22',
  '#FFFFF0',
  '#F0F8FF',
  '#DC143C',
  '#C71585',
  '#4B0082',
  '#A52A2A',
  '#800000',
  '#BC8F8F',
  '#3CB371',
  '#F5F5DC',
  '#98FB98',
  '#CD5C5C',
  '#BDB76B',
  '#800080',
  '#FAEBD7',
  '#F0E68C',
  '#D2691E',
  '#FFD700',
  '#8A2BE2',
  '#DDA0DD',
  '#B0E0E6',
  '#6A5ACD',
  '#E0FFFF',
  '#D3D3D3',
  '#008B8B',
  '#8B008B',
  '#7FFF00',
  '#FF1493',
  '#9ACD32',
  '#7CFC00',
  '#20B2AA',
  '#87CEFA',
  '#FF6347',
  '#4682B4',
  '#B0C4DE',
  '#5F9EA0',
  '#9B30FF',
  '#8B4513',
  '#800080',
  '#A52A2A',
  '#FFD700',
  '#FF6347',
  '#B8860B',
  '#D2691E',
  '#C71585',
  '#FF00FF',
  '#F0E68C',
  '#E6E6FA',
  '#FF00FF',
  '#9C27B0',
  '#FF9800',
  '#FF5722',
  '#E91E63',
  '#2196F3',
  '#4CAF50',
  '#9C27B0',
  '#FFEB3B',
  '#00BCD4',
  '#FF9800',
  '#607D8B',
  '#03A9F4',
  '#4CAF50',
  '#FF5722',
  '#9C27B0',
  '#673AB7',
  '#8BC34A',
  '#FFEB3B',
  '#00BCD4',
  '#CDDC39',
  '#FFEB3B',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#03A9F4',
  '#9E9E9E',
  '#607D8B',
  '#00BCD4',
  '#FF9800',
  '#4CAF50',
  '#2196F3',
  '#E91E63',
  '#FF5722',
  '#9C27B0',
  '#00BCD4',
  '#CDDC39',
  '#F44336',
  '#673AB7',
  '#FFEB3B',
  '#FF9800',
  '#4CAF50',
  '#2196F3',
  '#9E9E9E',
  '#607D8B',
  '#00BCD4',
  '#CDDC39',
  '#FFEB3B',
  '#8BC34A',
  '#FF9800',
  '#FF5722',
  '#F44336',
  '#3F51B5',
  '#8BC34A',
  '#607D8B',
  '#E91E63',
  '#2196F3',
  '#4CAF50',
  '#FFEB3B',
  '#00BCD4',
  '#CDDC39',
  '#FF5722',
  '#FF9800',
  '#9C27B0',
  '#8BC34A',
  '#2196F3',
  '#607D8B',
  '#00BCD4',
  '#4CAF50',
  '#FFEB3B',
  '#9E9E9E',
  '#CDDC39',
  '#FF5722',
  '#2196F3',
  '#03A9F4',
  '#607D8B',
  '#8BC34A',
  '#FFEB3B',
  '#9C27B0',
  '#4CAF50',
  '#FF5722',
  '#2196F3',
  '#607D8B',
  '#8BC34A',
  '#CDDC39',
  '#FF5722',
  '#FFEB3B',
  '#9C27B0',
  '#607D8B',
  '#03A9F4',
  '#4CAF50',
  '#CDDC39',
  '#FF5722',
  '#2196F3',
  '#9E9E9E',
  '#8BC34A',
  '#FFEB3B',
  '#9C27B0',
  '#607D8B',
  '#03A9F4',
  '#FF5722',
  '#2196F3',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#607D8B',
  '#FF5722',
  '#9E9E9E',
  '#03A9F4',
  '#4CAF50',
  '#CDDC39',
  '#FF5722',
  '#2196F3',
  '#9E9E9E',
  '#8BC34A',
  '#FFEB3B',
  '#9C27B0',
  '#4CAF50',
  '#FF5722',
  '#2196F3',
  '#607D8B',
  '#8BC34A',
  '#CDDC39',
  '#FF5722',
  '#FFEB3B',
  '#9C27B0',
  '#607D8B',
  '#03A9F4',
  '#4CAF50',
  '#CDDC39',
  '#FF5722',
  '#2196F3',
  '#9E9E9E',
  '#8BC34A',
  '#FFEB3B',
  '#9C27B0',
  '#607D8B',
  '#03A9F4',
  '#FF5722',
  '#2196F3',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#607D8B',
  '#FF5722',
  '#9E9E9E',
  '#03A9F4',
  '#4CAF50',
  '#CDDC39',
  '#FF5722',
  '#2196F3',
  '#9E9E9E',
  '#8BC34A',
  '#FFEB3B',
  '#9C27B0',
  '#607D8B',
  '#03A9F4',
  '#FF5722',
  '#2196F3',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#607D8B',
  '#FF5722',
  '#9E9E9E',
  '#03A9F4',
  '#4CAF50',
  '#CDDC39',
  '#FF5722',
  '#2196F3',
  '#9E9E9E',
  '#8BC34A',
  '#FFEB3B',
  '#9C27B0',
  '#607D8B',
  '#03A9F4',
  '#FF5722',
  '#2196F3',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#607D8B',
  '#FF5722',
  '#9E9E9E',
  '#03A9F4',
  '#4CAF50',
  '#CDDC39',
  '#FF5722',
  '#2196F3',
  '#9E9E9E',
  '#8BC34A',
  '#FFEB3B',
  '#9C27B0',
  '#607D8B',
  '#03A9F4',
  '#FF5722',
  '#2196F3',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#607D8B',
  '#FF5722',
  '#9E9E9E',
  '#03A9F4',
  '#4CAF50',
  '#CDDC39',
  '#FF5722',
  '#2196F3',
  '#9E9E9E',
  '#8BC34A',
  '#FFEB3B',
  '#9C27B0',
  '#607D8B',
  '#03A9F4',
  '#FF5722',
  '#2196F3',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#607D8B',
  '#FF5722',
  '#9E9E9E',
  '#03A9F4',
  '#4CAF50',
  '#CDDC39',
  '#FF5722',
  '#2196F3',
  '#9E9E9E',
  '#8BC34A',
  '#FFEB3B',
  '#9C27B0',
  '#607D8B',
  '#03A9F4',
  '#FF5722',
  '#2196F3',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#607D8B',
  '#FF5722',
  '#9E9E9E',
  '#03A9F4',
  '#4CAF50',
  '#CDDC39',
  '#FF5722',
  '#2196F3',
  '#9E9E9E',
  '#8BC34A',
  '#FFEB3B',
  '#9C27B0',
  '#607D8B',
  '#03A9F4',
  '#FF5722',
  '#2196F3',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#607D8B',
  '#FF5722',
  '#9E9E9E',
];
