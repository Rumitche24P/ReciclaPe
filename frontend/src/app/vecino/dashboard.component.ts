import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ReporteService } from '../core/api.services';
import { ImpactoVecino } from '../core/models';

@Component({
  selector: 'app-vecino-dashboard',
  imports: [DecimalPipe, RouterLink],
  template: `
    <h1>Hola, {{ auth.nombres() }} 👋</h1>
    <p class="muted">Este es tu impacto ambiental acumulado en ReciclaPe.</p>

    <div class="grid grid-3">
      <div class="card stat">
        <div class="num">{{ impacto()?.recojosCompletados ?? 0 }}</div>
        <div class="lbl">Recojos completados</div>
      </div>
      <div class="card stat">
        <div class="num">{{ impacto()?.kgTotalRecuperado ?? 0 | number: '1.0-1' }}</div>
        <div class="lbl">Kg recuperados</div>
      </div>
      <div class="card stat">
        <div class="num">{{ impacto()?.co2TotalEvitado ?? 0 | number: '1.0-1' }}</div>
        <div class="lbl">Kg de CO₂ evitado</div>
      </div>
    </div>

    <div class="card">
      <h3>Acciones rápidas</h3>
      <div class="row">
        <a class="btn" routerLink="/vecino/solicitar">Solicitar recojo</a>
        <a class="btn btn-sec" routerLink="/vecino/puntos">Gestionar puntos de acopio</a>
        <a class="btn btn-sec" routerLink="/vecino/historial">Ver historial</a>
      </div>
    </div>
  `,
})
export class VecinoDashboardComponent {
  auth = inject(AuthService);
  private reportes = inject(ReporteService);
  impacto = signal<ImpactoVecino | null>(null);

  constructor() {
    const id = this.auth.usuarioId();
    if (id != null) {
      this.reportes.impactoVecino(id).subscribe({ next: (i) => this.impacto.set(i), error: () => {} });
    }
  }
}
