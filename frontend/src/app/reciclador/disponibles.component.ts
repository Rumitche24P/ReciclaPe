import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../core/auth.service';
import { RecojoService } from '../core/api.services';
import { Recojo } from '../core/models';

@Component({
  selector: 'app-disponibles',
  imports: [DatePipe],
  template: `
    <h1>Recojos disponibles</h1>
    <p class="muted">Solicitudes de vecinos pendientes de ser atendidas.</p>
    <div class="card">
      @if (recojos().length === 0) {
        <p class="muted">No hay recojos disponibles por ahora.</p>
      } @else {
        <table>
          <thead><tr><th>#</th><th>Dirección</th><th>Distrito</th><th>Solicitado</th><th>Observación</th><th></th></tr></thead>
          <tbody>
            @for (r of recojos(); track r.id) {
              <tr>
                <td>{{ r.id }}</td>
                <td>{{ r.direccion }}</td>
                <td>{{ r.distrito }}</td>
                <td>{{ r.fechaSolicitud | date: 'dd/MM HH:mm' }}</td>
                <td>{{ r.observacion }}</td>
                <td><button class="btn btn-sm" (click)="aceptar(r)">Aceptar</button></td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class DisponiblesComponent {
  private api = inject(RecojoService);
  private auth = inject(AuthService);
  recojos = signal<Recojo[]>([]);

  constructor() { this.cargar(); }

  cargar(): void {
    this.api.listar({ estado: 'SOLICITADO' }).subscribe((r) => this.recojos.set(r));
  }

  aceptar(r: Recojo): void {
    this.api.aceptar(r.id, this.auth.usuarioId()!).subscribe(() => this.cargar());
  }
}
