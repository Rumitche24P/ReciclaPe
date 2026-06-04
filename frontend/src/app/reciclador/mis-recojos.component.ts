import { Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { RecojoService, TipoResiduoService } from '../core/api.services';
import { Recojo, TipoResiduo } from '../core/models';

interface LineaDetalle { tipoResiduoId: number; kilogramos: number; }

@Component({
  selector: 'app-mis-recojos',
  imports: [DatePipe, DecimalPipe, FormsModule],
  template: `
    <h1>Mis recojos</h1>
    <div class="card">
      @if (recojos().length === 0) {
        <p class="muted">Aún no has aceptado recojos.</p>
      } @else {
        <table>
          <thead><tr><th>#</th><th>Dirección</th><th>Estado</th><th>Aceptado</th><th>Kg</th><th></th></tr></thead>
          <tbody>
            @for (r of recojos(); track r.id) {
              <tr>
                <td>{{ r.id }}</td>
                <td>{{ r.direccion }}</td>
                <td><span class="badge {{ r.estado }}">{{ r.estado }}</span></td>
                <td>{{ r.fechaSolicitud | date: 'dd/MM HH:mm' }}</td>
                <td>{{ r.kgTotal | number: '1.0-2' }}</td>
                <td>
                  @if (r.estado === 'ACEPTADO') {
                    <button class="btn btn-sm" (click)="abrir(r)">Completar</button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>

    @if (completando(); as rec) {
      <div class="card">
        <h3>Completar recojo #{{ rec.id }} — registrar kilogramos</h3>
        @for (l of lineas(); track $index) {
          <div class="row" style="margin-bottom:0.5rem">
            <select [(ngModel)]="l.tipoResiduoId" style="max-width:240px">
              @for (t of tipos(); track t.id) { <option [value]="t.id">{{ t.nombre }}</option> }
            </select>
            <input type="number" min="0" step="0.1" [(ngModel)]="l.kilogramos" placeholder="kg" style="max-width:120px" />
            <button class="btn btn-sm btn-danger" (click)="quitar($index)">✕</button>
          </div>
        }
        @if (error()) { <p class="error">{{ error() }}</p> }
        <div class="row" style="margin-top:0.8rem">
          <button class="btn btn-sec btn-sm" (click)="agregarLinea()">+ Agregar residuo</button>
          <div class="spacer"></div>
          <button class="btn btn-sec" (click)="completando.set(null)">Cancelar</button>
          <button class="btn" (click)="guardar(rec)">Confirmar y completar</button>
        </div>
      </div>
    }
  `,
})
export class MisRecojosComponent {
  private api = inject(RecojoService);
  private tiposApi = inject(TipoResiduoService);
  private auth = inject(AuthService);

  recojos = signal<Recojo[]>([]);
  tipos = signal<TipoResiduo[]>([]);
  completando = signal<Recojo | null>(null);
  lineas = signal<LineaDetalle[]>([]);
  error = signal('');

  constructor() {
    this.cargar();
    this.tiposApi.listar().subscribe((t) => this.tipos.set(t));
  }

  cargar(): void {
    this.api.listar({ recicladorId: this.auth.usuarioId()! }).subscribe((r) => this.recojos.set(r));
  }

  abrir(r: Recojo): void {
    this.error.set('');
    const primer = this.tipos()[0]?.id ?? 0;
    this.lineas.set([{ tipoResiduoId: primer, kilogramos: 0 }]);
    this.completando.set(r);
  }

  agregarLinea(): void {
    const primer = this.tipos()[0]?.id ?? 0;
    this.lineas.update((l) => [...l, { tipoResiduoId: primer, kilogramos: 0 }]);
  }

  quitar(i: number): void {
    this.lineas.update((l) => l.filter((_, idx) => idx !== i));
  }

  guardar(rec: Recojo): void {
    const detalles = this.lineas()
      .filter((l) => l.kilogramos > 0)
      .map((l) => ({ tipoResiduoId: Number(l.tipoResiduoId), kilogramos: Number(l.kilogramos) }));
    if (detalles.length === 0) { this.error.set('Registra al menos un residuo con kilogramos > 0'); return; }
    this.api.completar(rec.id, detalles).subscribe({
      next: () => { this.completando.set(null); this.cargar(); },
      error: () => this.error.set('No se pudo completar el recojo'),
    });
  }
}
