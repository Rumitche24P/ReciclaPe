import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <div class="brand">♻️ ReciclaPe</div>
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
        <span class="rol">{{ auth.rol() }}</span>
        <span>{{ auth.nombres() }}</span>
        <button class="btn btn-sm btn-sec" (click)="salir()">Salir</button>
      </div>
    </header>
    <main class="container">
      <router-outlet />
    </main>
  `,
  styles: [`
    .topbar { display: flex; align-items: center; gap: 1rem; background: #fff; border-bottom: 1px solid var(--borde);
      padding: 0.6rem 1.2rem; box-shadow: var(--sombra); position: sticky; top: 0; z-index: 10; flex-wrap: wrap; }
    .brand { font-weight: 700; color: var(--verde-osc); font-size: 1.15rem; }
    .nav { display: flex; gap: 0.3rem; flex-wrap: wrap; }
    .nav a { padding: 0.4rem 0.7rem; border-radius: 8px; color: var(--gris); font-size: 0.9rem; }
    .nav a.activo, .nav a:hover { background: var(--verde-claro); color: var(--verde-osc); }
    .user { display: flex; align-items: center; gap: 0.6rem; font-size: 0.9rem; }
    .rol { background: var(--verde-claro); color: var(--verde-osc); padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.72rem; font-weight: 700; }
  `],
})
export class ShellComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  salir(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
