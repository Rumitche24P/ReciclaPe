import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Redirige al inicio del rol correspondiente. */
@Component({ selector: 'app-inicio', template: '' })
export class InicioComponent {
  constructor() {
    const auth = inject(AuthService);
    const router = inject(Router);
    const rol = auth.rol();
    router.navigate([rol === 'RECICLADOR' ? '/reciclador' : rol === 'ADMIN' ? '/admin' : '/vecino']);
  }
}
