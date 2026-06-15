import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards';

export const routes: Routes = [
  // Landing pública (solo coincide con la ruta exacta '/')
  { path: '', pathMatch: 'full', loadComponent: () => import('./core/home.component').then((m) => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./auth/login.component').then((m) => m.LoginComponent) },
  { path: 'registro', loadComponent: () => import('./auth/register.component').then((m) => m.RegisterComponent) },
  {
    path: '',
    loadComponent: () => import('./layout/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      // ---- Vecino ----
      {
        path: 'vecino',
        canActivate: [roleGuard('VECINO')],
        children: [
          { path: '', loadComponent: () => import('./vecino/dashboard.component').then((m) => m.VecinoDashboardComponent) },
          { path: 'puntos', loadComponent: () => import('./vecino/puntos.component').then((m) => m.PuntosComponent) },
          { path: 'solicitar', loadComponent: () => import('./vecino/solicitar.component').then((m) => m.SolicitarComponent) },
          { path: 'historial', loadComponent: () => import('./vecino/historial.component').then((m) => m.HistorialVecinoComponent) },
        ],
      },

      // ---- Reciclador ----
      {
        path: 'reciclador',
        canActivate: [roleGuard('RECICLADOR')],
        children: [
          { path: '', loadComponent: () => import('./reciclador/disponibles.component').then((m) => m.DisponiblesComponent) },
          { path: 'mis-recojos', loadComponent: () => import('./reciclador/mis-recojos.component').then((m) => m.MisRecojosComponent) },
        ],
      },

      // ---- Admin ----
      {
        path: 'admin',
        canActivate: [roleGuard('ADMIN')],
        children: [
          { path: '', loadComponent: () => import('./admin/dashboard.component').then((m) => m.AdminDashboardComponent) },
          { path: 'tipos-residuo', loadComponent: () => import('./admin/tipos.component').then((m) => m.TiposComponent) },
          { path: 'usuarios', loadComponent: () => import('./admin/usuarios.component').then((m) => m.UsuariosComponent) },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
