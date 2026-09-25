
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, map } from 'rxjs';
import { EcoService } from '../../services/eco.service';

interface CategoryMetric {
  name: string;
  points: number;
  percent: number;
}

@Component({
  selector: 'app-ecopainel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="painel-container">
      <header class="header-row">
        <div>
          <p class="eyebrow">ECOCONNECT · ACOMPANHAMENTO</p>
          <h2>📊 EcoPainel</h2>
          <p>
            Indicadores de participação calculados a partir do histórico
            registrado neste navegador.
          </p>
        </div>

        <button
          type="button"
          class="btn-export"
          (click)="exportReport()"
        >
          Imprimir / salvar PDF
        </button>
      </header>

      <p class="notice">
        Protótipo demonstrativo: os dados são locais e não representam
        métricas ambientais ou corporativas verificadas.
      </p>

      <ng-container *ngIf="view$ | async as view">

        <section
          class="metrics-grid"
          aria-label="Indicadores de participação"
        >
          <article class="metric-card">
            <span class="label">SALDO ATUAL</span>
            <strong class="value">
              {{ view.points }}
              <small>EcoPoints</small>
            </strong>
          </article>

          <article class="metric-card">
            <span class="label">HÁBITOS REGISTRADOS</span>
            <strong class="value">{{ view.habits }}</strong>
          </article>

          <article class="metric-card">
            <span class="label">RESPOSTAS PONTUADAS</span>
            <strong class="value">{{ view.quizzes }}</strong>
          </article>

          <article class="metric-card">
            <span class="label">RESGATES REGISTRADOS</span>
            <strong class="value">{{ view.redemptions }}</strong>
          </article>
        </section>

        <section class="panel" aria-labelledby="categories-title">
          <h3 id="categories-title">EcoPoints por categoria ambiental</h3>
          <p>Somente pontos de check-ins registrados no EcoCheck. Quizzes, resgates e ações demonstrativas não entram neste gráfico.</p>
          <p *ngIf="view.categories.length === 0" class="empty">
            Ainda não há hábitos pontuados para exibir neste gráfico.
          </p>
          <div class="bar-group" *ngFor="let item of view.categories">
            <div class="bar-label">
              <span>{{ item.name }}</span>
              <strong>{{ item.points }} EcoPoints</strong>
            </div>
            <div class="bar-bg" role="progressbar"
              [attr.aria-label]="item.name + ': ' + item.points + ' EcoPoints'"
              [attr.aria-valuenow]="item.points"
              [attr.aria-valuemax]="view.maxCategoryPoints"
              aria-valuemin="0">
              <div class="bar-fill" [style.width.%]="item.percent"></div>
            </div>
          </div>
          <p *ngIf="view.categories.length" class="chart-total">
            Total em hábitos: <strong>{{ view.habitPoints }} EcoPoints</strong>
          </p>
        </section>

        <section
          class="panel"
          aria-labelledby="history-title"
        >
          <h3 id="history-title">Atividades recentes</h3>

          <p
            *ngIf="view.history.length === 0"
            class="empty"
          >
            Nenhuma atividade registrada.
          </p>

          <ul
            class="history"
            *ngIf="view.history.length"
          >
            <li
              *ngFor="let action of view.history | slice:0:8"
            >
              <span>
                <strong>{{ action.title }}</strong>

                <small>
                  {{ action.category }}
                  ·
                  {{ action.date | date:'dd/MM/yyyy HH:mm' }}
                </small>
              </span>

              <strong
                [class.negative]="action.points < 0"
              >
                {{ action.points > 0 ? '+' : '' }}{{ action.points }} pts
              </strong>
            </li>
          </ul>
        </section>

      </ng-container>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      color: #173b2e;
    }

    .painel-container {
      max-width: 1100px;
      margin: auto;
      padding: clamp(1rem, 3vw, 2rem);
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .header-row h2 {
      font-size: clamp(1.6rem, 4vw, 2.3rem);
      margin: .2rem 0;
    }

    .header-row p,
    .panel p {
      color: #64748b;
    }

    .eyebrow {
      font-size: .75rem;
      letter-spacing: .1em;
      font-weight: 800;
      color: #16834a !important;
    }

    .btn-export {
      background: #16834a;
      color: white;
      border: 0;
      border-radius: 10px;
      padding: .8rem 1rem;
      cursor: pointer;
      font-weight: 700;
    }

    .btn-export:focus-visible {
      outline: 3px solid #86efac;
      outline-offset: 3px;
    }

    .notice {
      padding: .8rem 1rem;
      border-radius: 10px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      font-size: .9rem;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(
        auto-fit,
        minmax(min(100%, 190px), 1fr)
      );
      gap: 1rem;
      margin: 1.4rem 0;
    }

    .metric-card,
    .panel {
      background: white;
      border: 1px solid #dce8df;
      border-radius: 14px;
      padding: 1.2rem;
      box-shadow: 0 5px 20px #173b2e08;
    }

    .metric-card {
      display: flex;
      flex-direction: column;
      gap: .6rem;
    }

    .label {
      font-size: .75rem;
      color: #536b60;
      font-weight: 800;
      letter-spacing: .04em;
    }

    .value {
      font-size: clamp(1.6rem, 4vw, 2.1rem);
    }

    .value small {
      font-size: .8rem;
    }

    .panel {
      margin: 1rem 0;
    }

    .panel h3 {
      margin: .1rem 0;
    }

    .chart-total {
      margin-top: 1.2rem;
      padding-top: .8rem;
      border-top: 1px solid #edf2ef;
    }

    .bar-group {
      margin: 1.1rem 0;
    }

    .bar-label {
      display: flex;
      justify-content: space-between;
      gap: .8rem;
      margin-bottom: .4rem;
      font-size: .9rem;
    }

    .bar-bg {
      height: 13px;
      background: #e7f2ea;
      border-radius: 99px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: #16834a;
      border-radius: 99px;
    }

    .history {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .history li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      border-top: 1px solid #edf2ef;
      padding: .85rem 0;
    }

    .history li span {
      min-width: 0;
    }

    .history small {
      display: block;
      color: #64748b;
      margin-top: .2rem;
    }

    .history li > strong {
      white-space: nowrap;
      color: #16834a;
    }

    .history li > strong.negative {
      color: #b45309;
    }

    .empty {
      padding: 1rem;
      background: #f8faf9;
      border-radius: 8px;
    }

    @media (max-width: 480px) {
      .header-row .btn-export {
        width: 100%;
      }

      .history li {
        align-items: flex-start;
      }

      .painel-container {
        padding: 1rem;
      }
    }

    @media print {
      .btn-export {
        display: none;
      }

      .painel-container {
        max-width: none;
      }

      .metric-card,
      .panel {
        break-inside: avoid;
        box-shadow: none;
      }
    }
  `]
})
export class EcoPainelComponent {

  // Inicializa o serviço antes de qualquer propriedade que o utilize.
  private readonly eco = inject(EcoService);

  readonly view$ = combineLatest([
    this.eco.userPoints$,
    this.eco.history$
  ]).pipe(
    map(([points, history]) => {

      const positive = history.filter(
        action => action.points > 0 && action.type !== 'demo'
      );
      const habits = positive.filter(action => action.type === 'habit');
      const totals = new Map<string, number>();
      habits.forEach(action => {
        const category = action.category?.trim() || 'Geral';
        totals.set(category, (totals.get(category) || 0) + action.points);
      });
      const maxCategoryPoints = Math.max(0, ...totals.values());
      const categories: CategoryMetric[] = [...totals.entries()]
        .map(([name, points]) => ({
          name,
          points,
          percent: maxCategoryPoints ? (points / maxCategoryPoints) * 100 : 0
        }))
        .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));

      return {
        points,

        habits: habits.length,

        quizzes: positive.filter(action => action.type === 'quiz').length,

        redemptions: history.filter(action => action.type === 'redemption').length,

        habitPoints: habits.reduce((total, action) => total + action.points, 0),

        maxCategoryPoints,

        categories,

        history: [...history].sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
        )
      };
    })
  );

  exportReport(): void {
    window.print();
  }
}
