import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { Rol } from '../core/models';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <div class="card auth-card">
        <div class="brand">♻️ ReciclaPe</div>
        <h2>Crear cuenta</h2>

        <div class="grid grid-2">
          <div>
            <label>Nombres</label>
            <input [(ngModel)]="nombres" />
          </div>
          <div>
            <label>Apellidos</label>
            <input [(ngModel)]="apellidos" />
          </div>
        </div>

        <label>Correo</label>
        <input type="email" [(ngModel)]="email" />

        <label>Teléfono</label>
        <input [(ngModel)]="telefono" />

        <label>Contraseña</label>
        <input type="password" [(ngModel)]="password" />

        <label>Rol</label>
        <select [(ngModel)]="rol">
          <option value="VECINO">Vecino</option>
          <option value="RECICLADOR">Reciclador</option>
        </select>

        @if (error()) { <p class="error">{{ error() }}</p> }
        @if (ok()) { <p class="muted" style="color:var(--verde)">Cuenta creada. Redirigiendo...</p> }

        <button class="btn" style="width:100%;margin-top:1rem;justify-content:center"
                [disabled]="cargando()" (click)="registrar()">
          {{ cargando() ? 'Creando...' : 'Registrarme' }}
        </button>

        <p class="muted" style="margin-top:1rem;text-align:center">
          ¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrap { min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: 1rem;
      background: linear-gradient(135deg, var(--verde) 0%, var(--verde-osc) 100%); }
    .auth-card { width: 100%; max-width: 440px; }
    .brand { font-size: 1.6rem; font-weight: 700; color: var(--verde-osc); }
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
            next: (res) =>
              this.router.navigate([res.rol === 'RECICLADOR' ? '/reciclador' : '/vecino']),
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
