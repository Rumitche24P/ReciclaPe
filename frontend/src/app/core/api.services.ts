import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './api.config';
import {
  EstadoRecojo,
  ImpactoDistrital,
  ImpactoVecino,
  PuntoAcopio,
  RankingTipo,
  Recojo,
  TipoResiduo,
  Usuario,
} from './models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private base = `${API_URL}/api/usuarios`;
  listar(): Observable<Usuario[]> { return this.http.get<Usuario[]>(this.base); }
  obtener(id: number): Observable<Usuario> { return this.http.get<Usuario>(`${this.base}/${id}`); }
  actualizar(id: number, dto: Partial<Usuario>): Observable<Usuario> { return this.http.put<Usuario>(`${this.base}/${id}`, dto); }
  eliminar(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class TipoResiduoService {
  private http = inject(HttpClient);
  private base = `${API_URL}/api/tipos-residuo`;
  listar(): Observable<TipoResiduo[]> { return this.http.get<TipoResiduo[]>(this.base); }
  crear(dto: Partial<TipoResiduo>): Observable<TipoResiduo> { return this.http.post<TipoResiduo>(this.base, dto); }
  actualizar(id: number, dto: Partial<TipoResiduo>): Observable<TipoResiduo> { return this.http.put<TipoResiduo>(`${this.base}/${id}`, dto); }
  eliminar(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class PuntoAcopioService {
  private http = inject(HttpClient);
  private base = `${API_URL}/api/puntos-acopio`;
  listar(vecinoId?: number): Observable<PuntoAcopio[]> {
    let params = new HttpParams();
    if (vecinoId != null) params = params.set('vecinoId', vecinoId);
    return this.http.get<PuntoAcopio[]>(this.base, { params });
  }
  crear(dto: Partial<PuntoAcopio>): Observable<PuntoAcopio> { return this.http.post<PuntoAcopio>(this.base, dto); }
  actualizar(id: number, dto: Partial<PuntoAcopio>): Observable<PuntoAcopio> { return this.http.put<PuntoAcopio>(`${this.base}/${id}`, dto); }
  eliminar(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class RecojoService {
  private http = inject(HttpClient);
  private base = `${API_URL}/api/recojos`;
  listar(filtro?: { estado?: EstadoRecojo; vecinoId?: number; recicladorId?: number }): Observable<Recojo[]> {
    let params = new HttpParams();
    if (filtro?.estado) params = params.set('estado', filtro.estado);
    if (filtro?.vecinoId != null) params = params.set('vecinoId', filtro.vecinoId);
    if (filtro?.recicladorId != null) params = params.set('recicladorId', filtro.recicladorId);
    return this.http.get<Recojo[]>(this.base, { params });
  }
  obtener(id: number): Observable<Recojo> { return this.http.get<Recojo>(`${this.base}/${id}`); }
  crear(dto: { puntoAcopioId: number; vecinoId: number; observacion?: string }): Observable<Recojo> {
    return this.http.post<Recojo>(this.base, dto);
  }
  aceptar(id: number, recicladorId: number): Observable<Recojo> {
    return this.http.put<Recojo>(`${this.base}/${id}/aceptar`, { recicladorId });
  }
  completar(id: number, detalles: { tipoResiduoId: number; kilogramos: number }[]): Observable<Recojo> {
    return this.http.put<Recojo>(`${this.base}/${id}/completar`, { detalles });
  }
  cancelar(id: number): Observable<Recojo> { return this.http.put<Recojo>(`${this.base}/${id}/cancelar`, {}); }
}

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private http = inject(HttpClient);
  private base = `${API_URL}/api/reportes`;
  impactoDistrital(): Observable<ImpactoDistrital> { return this.http.get<ImpactoDistrital>(`${this.base}/impacto-distrital`); }
  impactoVecino(vecinoId: number): Observable<ImpactoVecino> { return this.http.get<ImpactoVecino>(`${this.base}/impacto-vecino/${vecinoId}`); }
  rankingTipos(): Observable<RankingTipo[]> { return this.http.get<RankingTipo[]>(`${this.base}/ranking-tipos`); }
}
