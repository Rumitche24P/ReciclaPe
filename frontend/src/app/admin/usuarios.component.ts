import { Component, inject, signal } from '@angular/core';
import { UsuarioService } from '../core/api.services';
import { Usuario } from '../core/models';

@Component({
  selector: 'app-usuarios',
  template: `
    <h1>Usuarios</h1>
    <div class="card">
      <table>
        <thead><tr><th>#</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th></th></tr></thead>
        <tbody>
          @for (u of usuarios(); track u.id) {
            <tr>
              <td>{{ u.id }}</td>
              <td>{{ u.nombres }} {{ u.apellidos }}</td>
              <td>{{ u.email }}</td>
              <td><span class="badge COMPLETADO">{{ u.rol }}</span></td>
              <td>{{ u.activo ? 'Activo' : 'Inactivo' }}</td>
              <td>
                @if (u.activo) {
                  <button class="btn btn-sm btn-danger" (click)="desactivar(u)">Desactivar</button>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class UsuariosComponent {
  private api = inject(UsuarioService);
  usuarios = signal<Usuario[]>([]);

  constructor() { this.cargar(); }

  cargar(): void { this.api.listar().subscribe((u) => this.usuarios.set(u)); }

  desactivar(u: Usuario): void {
    if (!confirm(`¿Desactivar a ${u.nombres}?`)) return;
    this.api.eliminar(u.id).subscribe(() => this.cargar());
  }
}
