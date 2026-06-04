import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from './api.config';
import { Rol, TokenResponse } from './models';

interface SesionGuardada {
  token: string;
  usuarioId: number;
  nombres: string;
  email: string;
  rol: Rol;
}

const STORAGE_KEY = 'reciclape.sesion';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  readonly sesion = signal<SesionGuardada | null>(this.cargar());
  readonly autenticado = computed(() => this.sesion() !== null);
  readonly rol = computed(() => this.sesion()?.rol ?? null);
  readonly nombres = computed(() => this.sesion()?.nombres ?? '');
  readonly usuarioId = computed(() => this.sesion()?.usuarioId ?? null);

  login(email: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${API_URL}/api/auth/login`, { email, password }).pipe(
      tap((res) => this.guardar(res)),
    );
  }

  registrar(payload: {
    nombres: string;
    apellidos: string;
    email: string;
    password: string;
    telefono?: string;
    rol: Rol;
  }): Observable<unknown> {
    return this.http.post(`${API_URL}/api/auth/registro`, payload);
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.sesion.set(null);
  }

  get token(): string | null {
    return this.sesion()?.token ?? null;
  }

  private guardar(res: TokenResponse): void {
    const s: SesionGuardada = {
      token: res.token,
      usuarioId: res.usuarioId,
      nombres: res.nombres,
      email: res.email,
      rol: res.rol,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    this.sesion.set(s);
  }

  private cargar(): SesionGuardada | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SesionGuardada;
    } catch {
      return null;
    }
  }
}
