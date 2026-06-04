import { Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AuthService } from '../core/auth.service';
import { RecojoService } from '../core/api.services';
import { Recojo } from '../core/models';

@Component({
  selector: 'app-historial-vecino',
  imports: [DatePipe, DecimalPipe],
  template: `
    <h1>Mi historial de recojos</h1>
    <div class="card">
      @if (recojos().length === 0) {
        <p class="muted">Todavía no has solicitado recojos.</p>
      } @else {
        <table>
          <thead>
            <tr><th>#</th><th>Punto</th><th>Estado</th><th>Solicitado</th><th>Kg</th><th>CO₂ evitado</th></tr>
          </thead>
          <tbody>
            @for (r of recojos(); track r.id) {
              <tr>
                <td>{{ r.id }}</td>
                <td>{{ r.direccion }}</td>
                <td><span class="badge {{ r.estado }}">{{ r.estado }}</span></td>
                <td>{{ r.fechaSolicitud | date: 'dd/MM/yyyy HH:mm' }}</td>
                <td>{{ r.kgTotal | number: '1.0-2' }}</td>
                <td>{{ r.co2TotalEvitado | number: '1.0-2' }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class HistorialVecinoComponent {
  private recojosApi = inject(RecojoService);
  private auth = inject(AuthService);
  recojos = signal<Recojo[]>([]);

  constructor() {
    this.recojosApi.listar({ vecinoId: this.auth.usuarioId()! }).subscribe((r) => this.recojos.set(r));
  }
}
