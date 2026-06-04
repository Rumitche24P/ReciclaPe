import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { Rol } from '../core/models';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <div class="card auth-card">
        <div class="brand">♻️ ReciclaPe</div>
        <p class="muted">Plataforma de gestión de reciclaje vecinal</p>
        <h2>Iniciar sesión</h2>

        <label>Correo</label>
        <input type="email" [(ngModel)]="email" placeholder="admin@reciclape.pe" />

        <label>Contraseña</label>
        <input type="password" [(ngModel)]="password" placeholder="••••••••" (keyup.enter)="login()" />

        @if (error()) { <p class="error">{{ error() }}</p> }

        <button class="btn" style="width:100%;margin-top:1rem;justify-content:center"
                [disabled]="cargando()" (click)="login()">
          {{ cargando() ? 'Ingresando...' : 'Ingresar' }}
        </button>

        <p class="muted" style="margin-top:1rem;text-align:center">
          ¿No tienes cuenta? <a routerLink="/registro">Regístrate</a>
        </p>
        <p class="muted demo">Demo: admin&#64;reciclape.pe / ReciclaPe2026</p>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrap { min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: 1rem;
      background: linear-gradient(135deg, var(--verde) 0%, var(--verde-osc) 100%); }
    .auth-card { width: 100%; max-width: 380px; }
    .brand { font-size: 1.6rem; font-weight: 700; color: var(--verde-osc); }
    .demo { text-align: center; margin-top: 0.5rem; font-size: 0.78rem; }
  `],
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  cargando = signal(false);
  error = signal('');

  login(): void {
    if (!this.email || !this.password) {
      this.error.set('Ingresa correo y contraseña');
      return;
    }
    this.cargando.set(true);
    this.error.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => this.router.navigate([this.home(res.rol)]),
      error: () => {
        this.error.set('Credenciales incorrectas');
        this.cargando.set(false);
      },
    });
  }

  private home(rol: Rol): string {
    return rol === 'VECINO' ? '/vecino' : rol === 'RECICLADOR' ? '/reciclador' : '/admin';
  }
}
