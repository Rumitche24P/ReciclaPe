import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { PuntoAcopioService } from '../core/api.services';
import { PuntoAcopio } from '../core/models';

@Component({
  selector: 'app-puntos',
  imports: [FormsModule],
  template: `
    <div class="row">
      <h1>Puntos de acopio</h1>
      <div class="spacer"></div>
      <button class="btn" (click)="nuevo()">+ Nuevo punto</button>
    </div>

    @if (form()) {
      <div class="card">
        <h3>{{ editId() ? 'Editar' : 'Nuevo' }} punto de acopio</h3>
        <div class="grid grid-2">
          <div><label>Dirección</label><input [(ngModel)]="direccion" /></div>
          <div><label>Distrito</label><input [(ngModel)]="distrito" /></div>
        </div>
        <label>Referencia</label>
        <input [(ngModel)]="referencia" />
        @if (error()) { <p class="error">{{ error() }}</p> }
        <div class="row" style="margin-top:1rem">
          <button class="btn" (click)="guardar()">Guardar</button>
          <button class="btn btn-sec" (click)="form.set(false)">Cancelar</button>
        </div>
      </div>
    }

    <div class="card">
      @if (puntos().length === 0) {
        <p class="muted">Aún no tienes puntos de acopio registrados.</p>
      } @else {
        <table>
          <thead><tr><th>Dirección</th><th>Distrito</th><th>Referencia</th><th></th></tr></thead>
          <tbody>
            @for (p of puntos(); track p.id) {
              <tr>
                <td>{{ p.direccion }}</td>
                <td>{{ p.distrito }}</td>
                <td>{{ p.referencia }}</td>
                <td class="row">
                  <button class="btn btn-sm btn-sec" (click)="editar(p)">Editar</button>
                  <button class="btn btn-sm btn-danger" (click)="eliminar(p)">Eliminar</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class PuntosComponent {
  private api = inject(PuntoAcopioService);
  private auth = inject(AuthService);

  puntos = signal<PuntoAcopio[]>([]);
  form = signal(false);
  editId = signal<number | null>(null);
  error = signal('');
  direccion = '';
  distrito = '';
  referencia = '';

  constructor() { this.cargar(); }

  cargar(): void {
    const id = this.auth.usuarioId()!;
    this.api.listar(id).subscribe((p) => this.puntos.set(p));
  }

  nuevo(): void {
    this.editId.set(null);
    this.direccion = ''; this.distrito = ''; this.referencia = '';
    this.error.set(''); this.form.set(true);
  }

  editar(p: PuntoAcopio): void {
    this.editId.set(p.id);
    this.direccion = p.direccion; this.distrito = p.distrito; this.referencia = p.referencia ?? '';
    this.error.set(''); this.form.set(true);
  }

  guardar(): void {
    if (!this.direccion || !this.distrito) { this.error.set('Dirección y distrito son obligatorios'); return; }
    const dto = {
      vecinoId: this.auth.usuarioId()!,
      direccion: this.direccion,
      distrito: this.distrito,
      referencia: this.referencia,
    };
    const obs = this.editId()
      ? this.api.actualizar(this.editId()!, dto)
      : this.api.crear(dto);
    obs.subscribe({ next: () => { this.form.set(false); this.cargar(); }, error: () => this.error.set('No se pudo guardar') });
  }

  eliminar(p: PuntoAcopio): void {
    if (!confirm(`¿Eliminar el punto "${p.direccion}"?`)) return;
    this.api.eliminar(p.id).subscribe(() => this.cargar());
  }
}
