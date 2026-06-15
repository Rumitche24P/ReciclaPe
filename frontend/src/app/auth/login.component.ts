import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { Rol } from '../core/models';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth">
      <!-- Panel de marca -->
      <aside class="brand-panel">
        <div class="bp-blob"></div>
        <a class="logo" routerLink="/">
          <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="9" fill="#7dd957"/>
            <path d="M16 7l4.2 7.2h-3.1v5.3h-2.2v-5.3h-3.1z" fill="#06351c"/>
            <path d="M9 19.5a7 7 0 0 0 13 2.2" fill="none" stroke="#06351c" stroke-width="2.1" stroke-linecap="round"/>
          </svg>
          ReciclaPe
        </a>
        <div class="bp-body">
          <h2>Bienvenido de vuelta 🌿</h2>
          <p>Gestiona tus recojos y mira el impacto ambiental que generas en tu distrito.</p>
          <ul>
            <li>Programa y sigue tus recojos</li>
            <li>Registra kilogramos por tipo de residuo</li>
            <li>Mide el CO₂ que evitas emitir</li>
          </ul>
        </div>
        <a class="bp-back" routerLink="/">← Volver al inicio</a>
      </aside>

      <!-- Formulario -->
      <main class="form-side">
        <div class="form-box">
          <span class="eyebrow">Acceso</span>
          <h1>Iniciar sesión</h1>
          <p class="muted">Ingresa con tu cuenta para continuar.</p>

          <label>Correo</label>
          <input type="email" [(ngModel)]="email" placeholder="admin@reciclape.pe" autocomplete="username" />

          <label>Contraseña</label>
          <input type="password" [(ngModel)]="password" placeholder="••••••••"
                 autocomplete="current-password" (keyup.enter)="login()" />

          @if (error()) { <p class="error">{{ error() }}</p> }

          <button class="btn" style="width:100%;margin-top:1.2rem" [disabled]="cargando()" (click)="login()">
            {{ cargando() ? 'Ingresando…' : 'Ingresar' }}
          </button>

          <p class="muted alt">¿No tienes cuenta? <a routerLink="/registro">Regístrate</a></p>
          <div class="demo">Cuenta demo · <strong>admin&#64;reciclape.pe</strong> / <strong>ReciclaPe2026</strong></div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .auth { min-height: 100dvh; display: grid; grid-template-columns: 1.05fr 1fr; }
    @media (max-width: 860px) { .auth { grid-template-columns: 1fr; } .brand-panel { display: none; } }

    /* Panel de marca */
    .brand-panel { position: relative; overflow: hidden; color: #eafff0; padding: 2.5rem;
      display: flex; flex-direction: column; gap: 2rem;
      background: linear-gradient(150deg, var(--forest-300), var(--forest-700) 70%, #06351c); }
    .brand-panel .logo { color: #fff; font-size: 1.3rem; z-index: 1; }
    .bp-blob { position: absolute; width: 420px; height: 420px; border-radius: 50%; bottom: -160px; right: -120px;
      background: radial-gradient(circle, rgba(125,217,87,0.45), transparent 70%); filter: blur(6px); }
    .bp-body { z-index: 1; margin-top: auto; }
    .bp-body h2 { color: #fff; font-size: 2rem; }
    .bp-body p { color: #cfe6d7; max-width: 34ch; }
    .bp-body ul { list-style: none; padding: 0; margin: 1.5rem 0 0; display: grid; gap: 0.7rem; }
    .bp-body li { position: relative; padding-left: 1.8rem; color: #eafff0; font-weight: 500; }
    .bp-body li::before { content: "✓"; position: absolute; left: 0; top: -1px; width: 1.25rem; height: 1.25rem;
      display: grid; place-items: center; border-radius: 50%; background: var(--leaf); color: var(--forest-700);
      font-size: 0.8rem; font-weight: 800; }
    .bp-back { color: #cfe6d7; font-weight: 600; font-size: 0.9rem; z-index: 1; }
    .bp-back:hover { color: #fff; }

    /* Formulario */
    .form-side { display: flex; align-items: center; justify-content: center; padding: 2rem 1.5rem; }
    .form-box { width: 100%; max-width: 400px; }
    .form-box h1 { font-size: 2rem; margin: 0.4rem 0 0.2rem; }
    .alt { margin-top: 1.2rem; text-align: center; }
    .demo { margin-top: 1rem; text-align: center; font-size: 0.78rem; color: var(--ink-soft);
      background: var(--leaf-soft); border-radius: 999px; padding: 0.45rem 0.9rem; }
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
