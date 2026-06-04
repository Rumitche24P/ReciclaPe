import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { PuntoAcopioService, RecojoService } from '../core/api.services';
import { PuntoAcopio } from '../core/models';

@Component({
  selector: 'app-solicitar',
  imports: [FormsModule],
  template: `
    <h1>Solicitar recojo</h1>
    <div class="card">
      @if (puntos().length === 0) {
        <p class="muted">Primero registra un punto de acopio para poder solicitar un recojo.</p>
      } @else {
        <label>Punto de acopio</label>
        <select [(ngModel)]="puntoId">
          @for (p of puntos(); track p.id) {
            <option [value]="p.id">{{ p.direccion }} — {{ p.distrito }}</option>
          }
        </select>

        <label>Observación (opcional)</label>
        <textarea rows="3" [(ngModel)]="observacion" placeholder="Ej: tengo cartón y botellas PET"></textarea>

        @if (error()) { <p class="error">{{ error() }}</p> }
        @if (ok()) { <p style="color:var(--verde)">✅ Recojo solicitado correctamente.</p> }

        <div class="row" style="margin-top:1rem">
          <button class="btn" [disabled]="enviando()" (click)="solicitar()">Solicitar recojo</button>
        </div>
      }
    </div>
  `,
})
export class SolicitarComponent {
  private puntosApi = inject(PuntoAcopioService);
  private recojos = inject(RecojoService);
  private auth = inject(AuthService);
  private router = inject(Router);

  puntos = signal<PuntoAcopio[]>([]);
  puntoId: number | null = null;
  observacion = '';
  enviando = signal(false);
  error = signal('');
  ok = signal(false);

  constructor() {
    this.puntosApi.listar(this.auth.usuarioId()!).subscribe((p) => {
      this.puntos.set(p);
      if (p.length) this.puntoId = p[0].id;
    });
  }

  solicitar(): void {
    if (!this.puntoId) { this.error.set('Selecciona un punto de acopio'); return; }
    this.enviando.set(true);
    this.error.set('');
    this.recojos
      .crear({ puntoAcopioId: Number(this.puntoId), vecinoId: this.auth.usuarioId()!, observacion: this.observacion })
      .subscribe({
        next: () => {
          this.ok.set(true);
          this.enviando.set(false);
          setTimeout(() => this.router.navigate(['/vecino/historial']), 900);
        },
        error: () => { this.error.set('No se pudo solicitar el recojo'); this.enviando.set(false); },
      });
  }
}
