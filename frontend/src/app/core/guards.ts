import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Rol } from './models';

/** Permite el acceso solo a usuarios autenticados. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.autenticado()) return true;
  router.navigate(['/login']);
  return false;
};

/** Permite el acceso solo a los roles indicados. */
export const roleGuard = (...roles: Rol[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const rol = auth.rol();
    if (rol && roles.includes(rol)) return true;
    router.navigate([auth.autenticado() ? '/' : '/login']);
    return false;
  };
};
