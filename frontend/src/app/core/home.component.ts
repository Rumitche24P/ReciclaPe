import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <!-- ===== Barra superior ===== -->
    <header class="nav">
      <a class="logo" routerLink="/">
        <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="9" fill="#0e5c30"/>
          <path d="M16 7l4.2 7.2h-3.1v5.3h-2.2v-5.3h-3.1z" fill="#7dd957"/>
          <path d="M9 19.5a7 7 0 0 0 13 2.2" fill="none" stroke="#7dd957" stroke-width="2.1" stroke-linecap="round"/>
        </svg> ReciclaPe
      </a>
      <nav class="links">
        <a href="#como">Cómo funciona</a>
        <a href="#roles">Para quién</a>
        <a href="#impacto">Impacto</a>
      </nav>
      <div class="row" style="gap:0.6rem">
        @if (auth.autenticado()) {
          <a class="btn btn-sm" [routerLink]="panel()">Ir a mi panel →</a>
        } @else {
          <a class="btn btn-sm btn-sec" routerLink="/login">Iniciar sesión</a>
          <a class="btn btn-sm" routerLink="/registro">Crear cuenta</a>
        }
      </div>
    </header>

    <!-- ===== Hero ===== -->
    <section class="hero">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="hero-grid container">
        <div class="hero-copy">
          <span class="eyebrow">♻ Reciclaje vecinal inteligente</span>
          <h1>Convierte tus residuos<br /> en <span class="hl">impacto medible</span>.</h1>
          <p class="lead">
            ReciclaPe conecta a los vecinos con recicladores formales de su distrito.
            Programa un recojo, registra los kilogramos recuperados y mira en tiempo real
            el CO₂ que evitas emitir.
          </p>
          <div class="row" style="gap:0.7rem;margin-top:1.6rem">
            @if (auth.autenticado()) {
              <a class="btn" [routerLink]="panel()">Ir a mi panel</a>
            } @else {
              <a class="btn" routerLink="/registro">Empezar gratis</a>
              <a class="btn btn-sec" routerLink="/login">Ya tengo cuenta</a>
            }
          </div>
          <div class="trust">Demo: <strong>admin&#64;reciclape.pe</strong> · contraseña <strong>ReciclaPe2026</strong></div>
        </div>

        <!-- Tarjeta flotante de impacto -->
        <div class="hero-card">
          <div class="hc-head">
            <span class="eyebrow">Tu impacto este mes</span>
            <span class="hc-dot"></span>
          </div>
          <div class="hc-co2">128.4 <small>kg CO₂ evitado</small></div>
          <div class="hc-bars">
            <div class="hc-bar"><span>Plástico PET</span><div class="bar-track"><div class="bar-fill" style="width:82%"></div></div></div>
            <div class="hc-bar"><span>Papel</span><div class="bar-track"><div class="bar-fill" style="width:60%"></div></div></div>
            <div class="hc-bar"><span>Vidrio</span><div class="bar-track"><div class="bar-fill" style="width:38%"></div></div></div>
          </div>
          <div class="hc-foot">
            <div><strong>214 kg</strong><span>recuperados</span></div>
            <div><strong>9</strong><span>recojos</span></div>
            <div><strong>17</strong><span>árboles ≈</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Banda de estadísticas (contexto real) ===== -->
    <section class="stripe" id="impacto">
      <div class="container stripe-grid">
        <div><b>9 343 t</b><span>de residuos al día en Lima Metropolitana</span></div>
        <div><b>3.9 %</b><span>de los reciclables se recupera formalmente</span></div>
        <div><b>108 000</b><span>recicladores en el Perú</span></div>
        <div><b>1.5 t CO₂</b><span>se evitan por tonelada de PET reciclado</span></div>
      </div>
    </section>

    <!-- ===== Cómo funciona ===== -->
    <section class="container" id="como">
      <div style="text-align:center;max-width:620px;margin:0 auto 2.2rem">
        <span class="eyebrow">Cómo funciona</span>
        <h2>Tres pasos para cerrar el ciclo</h2>
        <p class="muted">Del tacho de tu casa al reporte de impacto del distrito.</p>
      </div>
      <div class="steps">
        @for (s of pasos; track s.n) {
          <div class="card step">
            <div class="step-n">{{ s.n }}</div>
            <h3>{{ s.t }}</h3>
            <p class="muted">{{ s.d }}</p>
          </div>
        }
      </div>
    </section>

    <!-- ===== Roles ===== -->
    <section class="container" id="roles">
      <div style="text-align:center;max-width:620px;margin:0 auto 2.2rem">
        <span class="eyebrow">Para quién</span>
        <h2>Una plataforma, tres protagonistas</h2>
      </div>
      <div class="grid grid-3">
        @for (r of roles; track r.t) {
          <div class="card role">
            <div class="role-ic" [style.background]="r.bg">{{ r.ic }}</div>
            <h3>{{ r.t }}</h3>
            <p class="muted">{{ r.d }}</p>
          </div>
        }
      </div>
    </section>

    <!-- ===== CTA final ===== -->
    <section class="container">
      <div class="cta">
        <div class="blob blob-3"></div>
        <h2>¿Listo para reciclar con propósito?</h2>
        <p>Únete a ReciclaPe y mide el impacto ambiental de tu barrio.</p>
        <a class="btn btn-accent" routerLink="/registro">Crear mi cuenta</a>
      </div>
    </section>

    <!-- ===== Footer ===== -->
    <footer class="foot">
      <div class="container foot-grid">
        <div>
          <div class="logo" style="color:#fff">
            <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" rx="9" fill="#7dd957"/>
              <path d="M16 7l4.2 7.2h-3.1v5.3h-2.2v-5.3h-3.1z" fill="#06351c"/>
              <path d="M9 19.5a7 7 0 0 0 13 2.2" fill="none" stroke="#06351c" stroke-width="2.1" stroke-linecap="round"/>
            </svg> ReciclaPe
          </div>
          <p>Plataforma de gestión de reciclaje vecinal basada en microservicios.</p>
        </div>
        <div class="muted foot-meta">
          CIBERTEC · Desarrollo de Aplicaciones Web II (4697) · 2026
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host { display: block; }

    /* Nav */
    .nav { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; gap: 1.5rem;
      padding: 0.9rem clamp(1rem, 4vw, 3rem); background: rgba(251, 250, 244, 0.85);
      backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
    .logo { font-size: 1.2rem; color: var(--ink); }
    .links { display: flex; gap: 1.4rem; }
    .links a { color: var(--ink-soft); font-weight: 600; font-size: 0.92rem; }
    .links a:hover { color: var(--forest); }
    .nav .row { margin-left: auto; }
    @media (max-width: 720px) { .links { display: none; } }

    /* Hero */
    .hero { position: relative; overflow: hidden; }
    .hero-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 2.5rem; align-items: center;
      padding-top: 3.5rem; padding-bottom: 3.5rem; }
    @media (max-width: 880px) { .hero-grid { grid-template-columns: 1fr; } }
    .eyebrow .hl { color: var(--leaf-700); }
    .hero h1 { font-size: clamp(2.1rem, 1.2rem + 3.4vw, 3.5rem); margin-top: 0.8rem; }
    .hero .hl { color: var(--forest); }
    .lead { font-size: 1.12rem; color: var(--ink-soft); max-width: 33ch; margin-top: 0.4rem; }
    .trust { margin-top: 1.4rem; font-size: 0.82rem; color: var(--ink-soft);
      background: var(--surface); border: 1px dashed var(--line); border-radius: 999px;
      padding: 0.45rem 0.9rem; display: inline-block; }

    .blob { position: absolute; border-radius: 50%; filter: blur(10px); z-index: 0; pointer-events: none; }
    .blob-1 { width: 380px; height: 380px; top: -120px; right: -80px;
      background: radial-gradient(circle, rgba(125,217,87,0.35), transparent 70%); }
    .blob-2 { width: 320px; height: 320px; bottom: -140px; left: -100px;
      background: radial-gradient(circle, rgba(14,92,48,0.18), transparent 70%); }
    .hero-grid { position: relative; z-index: 1; }

    /* Tarjeta de impacto */
    .hero-card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg);
      box-shadow: var(--sh-lg); padding: 1.6rem; }
    .hc-head { display: flex; align-items: center; justify-content: space-between; }
    .hc-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--leaf);
      box-shadow: 0 0 0 4px var(--leaf-soft); }
    .hc-co2 { font-family: var(--font-head); font-weight: 800; font-size: 2.8rem; color: var(--forest);
      letter-spacing: -0.03em; margin: 0.4rem 0 1.2rem; }
    .hc-co2 small { display: block; font-size: 0.8rem; font-weight: 600; color: var(--ink-soft);
      letter-spacing: 0.04em; text-transform: uppercase; }
    .hc-bar { margin-bottom: 0.7rem; }
    .hc-bar span { font-size: 0.8rem; font-weight: 600; color: var(--ink-soft); display: block; margin-bottom: 0.25rem; }
    .hc-foot { display: flex; gap: 0.5rem; margin-top: 1.3rem; padding-top: 1.1rem; border-top: 1px solid var(--line); }
    .hc-foot div { flex: 1; }
    .hc-foot strong { display: block; font-family: var(--font-head); font-size: 1.25rem; color: var(--ink); }
    .hc-foot span { font-size: 0.72rem; color: var(--ink-soft); }

    /* Banda estadística */
    .stripe { background: linear-gradient(135deg, var(--forest), var(--forest-700)); margin-top: 1rem; }
    .stripe-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;
      padding-top: 2.2rem; padding-bottom: 2.2rem; }
    @media (max-width: 760px) { .stripe-grid { grid-template-columns: repeat(2, 1fr); } }
    .stripe-grid b { font-family: var(--font-head); font-size: 1.8rem; color: var(--leaf); display: block; }
    .stripe-grid span { color: #d7e8dd; font-size: 0.86rem; }

    /* Pasos */
    .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.1rem; }
    @media (max-width: 760px) { .steps { grid-template-columns: 1fr; } }
    .step { position: relative; padding-top: 2.6rem; }
    .step-n { position: absolute; top: -18px; left: 1.5rem; width: 44px; height: 44px;
      display: grid; place-items: center; border-radius: 14px; font-family: var(--font-head);
      font-weight: 800; color: #fff; background: linear-gradient(135deg, var(--forest-300), var(--forest));
      box-shadow: var(--sh); }

    /* Roles */
    .role-ic { width: 54px; height: 54px; border-radius: 16px; display: grid; place-items: center;
      font-size: 1.6rem; margin-bottom: 0.8rem; }

    /* CTA */
    .cta { position: relative; overflow: hidden; text-align: center; color: #fff;
      background: linear-gradient(135deg, var(--forest-700), #06351c);
      border-radius: var(--r-lg); padding: 3rem 1.5rem; box-shadow: var(--sh-lg); }
    .cta h2 { color: #fff; }
    .cta p { color: #cfe6d7; margin-bottom: 1.5rem; }
    .blob-3 { width: 300px; height: 300px; top: -120px; right: -60px;
      background: radial-gradient(circle, rgba(125,217,87,0.4), transparent 70%); }

    /* Footer */
    .foot { background: #06351c; color: #cfe6d7; margin-top: 2rem; }
    .foot-grid { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between;
      padding-top: 2rem; padding-bottom: 2rem; }
    .foot p { color: #9fc4ac; max-width: 40ch; margin: 0.5rem 0 0; font-size: 0.9rem; }
    .foot-meta { color: #9fc4ac; }
  `],
})
export class HomeComponent {
  auth = inject(AuthService);

  panel = computed(() => {
    const r = this.auth.rol();
    return r === 'RECICLADOR' ? '/reciclador' : r === 'ADMIN' ? '/admin' : '/vecino';
  });

  pasos = [
    { n: 1, t: 'Segrega en casa', d: 'Separa papel, plástico, vidrio y metal en tus puntos de acopio.' },
    { n: 2, t: 'Solicita el recojo', d: 'Un reciclador formal de tu zona acepta y recoge tus residuos.' },
    { n: 3, t: 'Mide tu impacto', d: 'Visualiza kilogramos recuperados y CO₂ evitado en tu dashboard.' },
  ];

  roles = [
    { ic: '🏠', bg: 'var(--leaf-soft)', t: 'Vecino', d: 'Gestiona puntos de acopio, solicita recojos y sigue tu impacto personal.' },
    { ic: '🚲', bg: 'var(--mint)', t: 'Reciclador', d: 'Recibe recojos asignados y registra los kilogramos recuperados.' },
    { ic: '🏛️', bg: '#e4f0fb', t: 'Municipalidad', d: 'Reportes distritales y KPIs para el programa de segregación.' },
  ];
}
