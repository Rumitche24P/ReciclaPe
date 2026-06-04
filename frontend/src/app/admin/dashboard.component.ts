import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ReporteService } from '../core/api.services';
import { ImpactoDistrital, RankingTipo } from '../core/models';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DecimalPipe],
  template: `
    <h1>Dashboard de impacto distrital</h1>
    <p class="muted">Indicadores agregados del programa de segregación.</p>

    <div class="grid grid-3">
      <div class="card stat">
        <div class="num">{{ impacto()?.recojosCompletados ?? 0 }}</div>
        <div class="lbl">Recojos completados</div>
      </div>
      <div class="card stat">
        <div class="num">{{ impacto()?.kgTotalRecuperado ?? 0 | number: '1.0-1' }}</div>
        <div class="lbl">Kg totales recuperados</div>
      </div>
      <div class="card stat">
        <div class="num">{{ impacto()?.co2TotalEvitado ?? 0 | number: '1.0-1' }}</div>
        <div class="lbl">Kg de CO₂ evitado</div>
      </div>
    </div>

    <div class="card">
      <h3>Ranking de tipos de residuo recuperados</h3>
      @if (ranking().length === 0) {
        <p class="muted">Aún no hay datos de recojos completados.</p>
      } @else {
        @for (r of ranking(); track r.tipoResiduo) {
          <div style="margin-bottom:0.7rem">
            <div class="row"><strong>{{ r.tipoResiduo }}</strong><div class="spacer"></div>
              <span class="muted">{{ r.kgTotal | number: '1.0-1' }} kg · {{ r.co2Evitado | number: '1.0-1' }} kg CO₂</span></div>
            <div class="bar-track"><div class="bar-fill" [style.width.%]="ancho(r)"></div></div>
          </div>
        }
      }
      @if (impacto()) { <p class="muted" style="margin-top:1rem">Fuente: {{ impacto()!.fuente }}</p> }
    </div>
  `,
})
export class AdminDashboardComponent {
  private reportes = inject(ReporteService);
  impacto = signal<ImpactoDistrital | null>(null);
  ranking = signal<RankingTipo[]>([]);
  private max = computed(() => Math.max(1, ...this.ranking().map((r) => r.kgTotal)));

  constructor() {
    this.reportes.impactoDistrital().subscribe({ next: (i) => this.impacto.set(i), error: () => {} });
    this.reportes.rankingTipos().subscribe({ next: (r) => this.ranking.set(r), error: () => {} });
  }

  ancho(r: RankingTipo): number {
    return Math.round((r.kgTotal / this.max()) * 100);
  }
}
