import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { Rol } from '../core/models';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth">
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
          <h2>Súmate al cambio</h2>
          <p>Crea tu cuenta y empieza a reciclar con propósito en tu distrito.</p>
          <ul>
            <li>Gratis para vecinos y recicladores</li>
            <li>Tus datos protegidos</li>
            <li>Impacto ambiental medible</li>
          </ul>
        </div>
        <a class="bp-back" routerLink="/">← Volver al inicio</a>
      </aside>

      <main class="form-side">
        <div class="form-box">
          <span class="eyebrow">Nueva cuenta</span>
          <h1>Crear cuenta</h1>
          <p class="muted">Completa tus datos para empezar.</p>

          <div class="grid grid-2">
            <div><label>Nombres</label><input [(ngModel)]="nombres" /></div>
            <div><label>Apellidos</label><input [(ngModel)]="apellidos" /></div>
          </div>

          <label>Correo</label>
          <input type="email" [(ngModel)]="email" placeholder="tucorreo@correo.com" />

          <div class="grid grid-2">
            <div><label>Teléfono</label><input [(ngModel)]="telefono" /></div>
            <div>
              <label>Rol</label>
              <select [(ngModel)]="rol">
                <option value="VECINO">Vecino</option>
                <option value="RECICLADOR">Reciclador</option>
              </select>
            </div>
          </div>

          <label>Contraseña</label>
          <input type="password" [(ngModel)]="password" placeholder="Mínimo 6 caracteres" />

          @if (error()) { <p class="error">{{ error() }}</p> }
          @if (ok()) { <p class="ok">✓ Cuenta creada. Redirigiendo…</p> }

          <button class="btn" style="width:100%;margin-top:1.2rem" [disabled]="cargando()" (click)="registrar()">
            {{ cargando() ? 'Creando…' : 'Registrarme' }}
          </button>

          <p class="muted alt">¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a></p>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .auth { min-height: 100dvh; display: grid; grid-template-columns: 1fr 1.05fr; }
    @media (max-width: 860px) { .auth { grid-template-columns: 1fr; } .brand-panel { display: none; } }
    .brand-panel { position: relative; overflow: hidden; color: #eafff0; padding: 2.5rem;
      display: flex; flex-direction: column; gap: 2rem; order: 1;
      background: linear-gradient(150deg, var(--forest-300), var(--forest-700) 70%, #06351c); }
    .brand-panel .logo { color: #fff; font-size: 1.3rem; z-index: 1; }
    .bp-blob { position: absolute; width: 420px; height: 420px; border-radius: 50%; bottom: -160px; left: -120px;
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
    .form-side { display: flex; align-items: center; justify-content: center; padding: 2rem 1.5rem; }
    .form-box { width: 100%; max-width: 440px; }
    .form-box h1 { font-size: 2rem; margin: 0.4rem 0 0.2rem; }
    .alt { margin-top: 1.2rem; text-align: center; }
    .ok { color: var(--forest); font-weight: 600; margin-top: 0.6rem; background: var(--leaf-soft);
      border-radius: var(--r-sm); padding: 0.5rem 0.75rem; font-size: 0.88rem; }
  `],
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  nombres = '';
  apellidos = '';
  email = '';
  telefono = '';
  password = '';
  rol: Rol = 'VECINO';
  cargando = signal(false);
  error = signal('');
  ok = signal(false);

  registrar(): void {
    if (!this.nombres || !this.apellidos || !this.email || !this.password) {
      this.error.set('Completa todos los campos obligatorios');
      return;
    }
    this.cargando.set(true);
    this.error.set('');
    this.auth
      .registrar({
        nombres: this.nombres,
        apellidos: this.apellidos,
        email: this.email,
        telefono: this.telefono,
        password: this.password,
        rol: this.rol,
      })
      .subscribe({
        next: () => {
          this.ok.set(true);
          this.auth.login(this.email, this.password).subscribe({
            next: (res) => this.router.navigate([res.rol === 'RECICLADOR' ? '/reciclador' : '/vecino']),
            error: () => this.router.navigate(['/login']),
          });
        },
        error: (e) => {
          this.error.set(e?.error?.message ?? 'No se pudo crear la cuenta');
          this.cargando.set(false);
        },
      });
  }
}
