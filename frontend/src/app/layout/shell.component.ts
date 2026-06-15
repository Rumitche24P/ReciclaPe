import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <a class="logo" [routerLink]="inicio()">
        <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="9" fill="#0e5c30"/>
          <path d="M16 7l4.2 7.2h-3.1v5.3h-2.2v-5.3h-3.1z" fill="#7dd957"/>
          <path d="M9 19.5a7 7 0 0 0 13 2.2" fill="none" stroke="#7dd957" stroke-width="2.1" stroke-linecap="round"/>
        </svg>
        ReciclaPe
      </a>

      <nav class="nav">
        @switch (auth.rol()) {
          @case ('VECINO') {
            <a routerLink="/vecino" routerLinkActive="activo" [routerLinkActiveOptions]="{exact:true}">Inicio</a>
            <a routerLink="/vecino/puntos" routerLinkActive="activo">Puntos de acopio</a>
            <a routerLink="/vecino/solicitar" routerLinkActive="activo">Solicitar recojo</a>
            <a routerLink="/vecino/historial" routerLinkActive="activo">Historial</a>
          }
          @case ('RECICLADOR') {
            <a routerLink="/reciclador" routerLinkActive="activo" [routerLinkActiveOptions]="{exact:true}">Disponibles</a>
            <a routerLink="/reciclador/mis-recojos" routerLinkActive="activo">Mis recojos</a>
          }
          @case ('ADMIN') {
            <a routerLink="/admin" routerLinkActive="activo" [routerLinkActiveOptions]="{exact:true}">Dashboard</a>
            <a routerLink="/admin/tipos-residuo" routerLinkActive="activo">Tipos de residuo</a>
            <a routerLink="/admin/usuarios" routerLinkActive="activo">Usuarios</a>
          }
        }
      </nav>

      <div class="spacer"></div>

      <div class="user">
        <div class="avatar">{{ inicial() }}</div>
        <div class="meta">
          <span class="nm">{{ auth.nombres() }}</span>
          <span class="rl">{{ auth.rol() }}</span>
        </div>
        <button class="btn btn-sm btn-sec" (click)="salir()">Salir</button>
      </div>
    </header>

    <main class="container">
      <router-outlet />
    </main>
  `,
  styles: [`
    .topbar { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
      background: rgba(251, 250, 244, 0.85); backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--line); padding: 0.7rem clamp(1rem, 3vw, 2rem);
      position: sticky; top: 0; z-index: 20; }
    .logo { font-size: 1.15rem; color: var(--ink); }

    .nav { display: flex; gap: 0.25rem; flex-wrap: wrap; }
    .nav a { padding: 0.5rem 0.85rem; border-radius: 999px; color: var(--ink-soft);
      font-size: 0.9rem; font-weight: 600; transition: background 0.15s, color 0.15s; }
    .nav a:hover { background: var(--mint); color: var(--forest); }
    .nav a.activo { background: var(--forest); color: #fff; }

    .user { display: flex; align-items: center; gap: 0.6rem; }
    .avatar { width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center;
      font-family: var(--font-head); font-weight: 700; color: #fff;
      background: linear-gradient(135deg, var(--forest-300), var(--forest)); }
    .meta { display: flex; flex-direction: column; line-height: 1.1; }
    .meta .nm { font-weight: 600; font-size: 0.88rem; color: var(--ink); }
    .meta .rl { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.06em; color: var(--forest-300); }
    @media (max-width: 640px) { .meta { display: none; } }
  `],
})
export class ShellComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  inicio = computed(() => {
    const r = this.auth.rol();
    return r === 'RECICLADOR' ? '/reciclador' : r === 'ADMIN' ? '/admin' : '/vecino';
  });

  inicial = computed(() => (this.auth.nombres()?.trim()?.[0] ?? 'U').toUpperCase());

  salir(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
