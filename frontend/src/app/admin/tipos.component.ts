import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoResiduoService } from '../core/api.services';
import { TipoResiduo } from '../core/models';

@Component({
  selector: 'app-tipos',
  imports: [FormsModule, DecimalPipe],
  template: `
    <div class="row">
      <h1>Tipos de residuo</h1>
      <div class="spacer"></div>
      <button class="btn" (click)="nuevo()">+ Nuevo tipo</button>
    </div>

    @if (form()) {
      <div class="card">
        <h3>{{ editId() ? 'Editar' : 'Nuevo' }} tipo de residuo</h3>
        <div class="grid grid-2">
          <div><label>Nombre</label><input [(ngModel)]="nombre" /></div>
          <div><label>Descripción</label><input [(ngModel)]="descripcion" /></div>
          <div><label>Factor CO₂ (kg CO₂ / kg)</label><input type="number" step="0.001" [(ngModel)]="factorCo2Kg" /></div>
          <div><label>Precio por kg (S/.)</label><input type="number" step="0.01" [(ngModel)]="precioKg" /></div>
        </div>
        @if (error()) { <p class="error">{{ error() }}</p> }
        <div class="row" style="margin-top:1rem">
          <button class="btn" (click)="guardar()">Guardar</button>
          <button class="btn btn-sec" (click)="form.set(false)">Cancelar</button>
        </div>
      </div>
    }

    <div class="card">
      <table>
        <thead><tr><th>Nombre</th><th>Descripción</th><th>Factor CO₂</th><th>Precio/kg</th><th></th></tr></thead>
        <tbody>
          @for (t of tipos(); track t.id) {
            <tr>
              <td>{{ t.nombre }}</td>
              <td>{{ t.descripcion }}</td>
              <td>{{ t.factorCo2Kg | number: '1.0-3' }}</td>
              <td>{{ t.precioKg | number: '1.2-2' }}</td>
              <td class="row">
                <button class="btn btn-sm btn-sec" (click)="editar(t)">Editar</button>
                <button class="btn btn-sm btn-danger" (click)="eliminar(t)">Eliminar</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class TiposComponent {
  private api = inject(TipoResiduoService);

  tipos = signal<TipoResiduo[]>([]);
  form = signal(false);
  editId = signal<number | null>(null);
  error = signal('');
  nombre = '';
  descripcion = '';
  factorCo2Kg: number | null = null;
  precioKg: number | null = null;

  constructor() { this.cargar(); }

  cargar(): void { this.api.listar().subscribe((t) => this.tipos.set(t)); }

  nuevo(): void {
    this.editId.set(null);
    this.nombre = ''; this.descripcion = ''; this.factorCo2Kg = null; this.precioKg = null;
    this.error.set(''); this.form.set(true);
  }

  editar(t: TipoResiduo): void {
    this.editId.set(t.id);
    this.nombre = t.nombre; this.descripcion = t.descripcion ?? '';
    this.factorCo2Kg = t.factorCo2Kg; this.precioKg = t.precioKg;
    this.error.set(''); this.form.set(true);
  }

  guardar(): void {
    if (!this.nombre || this.factorCo2Kg == null) { this.error.set('Nombre y factor de CO₂ son obligatorios'); return; }
    const dto = { nombre: this.nombre, descripcion: this.descripcion, factorCo2Kg: this.factorCo2Kg, precioKg: this.precioKg ?? 0 };
    const obs = this.editId() ? this.api.actualizar(this.editId()!, dto) : this.api.crear(dto);
    obs.subscribe({ next: () => { this.form.set(false); this.cargar(); }, error: (e) => this.error.set(e?.error?.message ?? 'No se pudo guardar') });
  }

  eliminar(t: TipoResiduo): void {
    if (!confirm(`¿Eliminar el tipo "${t.nombre}"?`)) return;
    this.api.eliminar(t.id).subscribe(() => this.cargar());
  }
}
