export type Rol = 'VECINO' | 'RECICLADOR' | 'ADMIN';

export interface TokenResponse {
  token: string;
  tipo: string;
  usuarioId: number;
  nombres: string;
  email: string;
  rol: Rol;
}

export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  rol: Rol;
  activo: boolean;
}

export interface PuntoAcopio {
  id: number;
  vecinoId: number;
  direccion: string;
  distrito: string;
  referencia?: string;
  latitud?: number;
  longitud?: number;
  activo: boolean;
}

export interface TipoResiduo {
  id: number;
  nombre: string;
  descripcion?: string;
  factorCo2Kg: number;
  precioKg: number;
  activo: boolean;
}

export type EstadoRecojo = 'SOLICITADO' | 'ACEPTADO' | 'COMPLETADO' | 'CANCELADO';

export interface DetalleRecojo {
  tipoResiduoId: number;
  tipoResiduo: string;
  kilogramos: number;
  co2Evitado: number;
}

export interface Recojo {
  id: number;
  puntoAcopioId: number;
  direccion: string;
  distrito: string;
  vecinoId: number;
  recicladorId?: number;
  estado: EstadoRecojo;
  fechaSolicitud: string;
  fechaRecojo?: string;
  observacion?: string;
  detalles: DetalleRecojo[];
  kgTotal: number;
  co2TotalEvitado: number;
}

export interface ImpactoDistrital {
  recojosCompletados: number;
  kgTotalRecuperado: number;
  co2TotalEvitado: number;
  fuente: string;
}

export interface ImpactoVecino {
  vecinoId: number;
  recojosCompletados: number;
  kgTotalRecuperado: number;
  co2TotalEvitado: number;
  fuente: string;
}

export interface RankingTipo {
  tipoResiduo: string;
  kgTotal: number;
  co2Evitado: number;
}
