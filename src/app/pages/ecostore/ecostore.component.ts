import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcoService } from '../../services/eco.service';

interface Reward {
  id: number;
  title: string;
  pointsCost: number;
  icon: string;
}

@Component({
  selector: 'app-ecostore',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="store-container">
      <h2>🎁 Loja de Recompensas Sustentáveis</h2>

      <p class="subtitle">
        Simule o uso dos seus EcoPoints em recompensas demonstrativas do protótipo.
      </p>

      <p class="demo-notice">
        Ambiente demonstrativo: os resgates não correspondem a benefícios reais.
      </p>

      <p class="cost">
        Saldo disponível:
        {{ ecoService.userPoints$ | async }} EcoPoints
      </p>

      <div class="rewards-grid">
        <div
          class="reward-card"
          *ngFor="let reward of rewards"
        >
          <div class="reward-icon">
            {{ reward.icon }}
          </div>

          <h3>{{ reward.title }}</h3>

          <p class="cost">
            {{ reward.pointsCost }} EcoPoints
          </p>

          <button
            class="btn-redeem"
            [disabled]="
              (ecoService.userPoints$ | async)! <
              reward.pointsCost
            "
            (click)="redeem(reward)"
          >
            Simular resgate
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .store-container {
      padding: 1.5rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .subtitle {
      color: #64748b;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .demo-notice {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .rewards-grid {
      display: grid;
      grid-template-columns:
        repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
    }

    .reward-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.25rem;
      text-align: center;
    }

    .reward-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .reward-card h3 {
      font-size: 1.1rem;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .cost {
      font-weight: 700;
      color: #16834a;
      margin-bottom: 1rem;
    }

    .btn-redeem {
      background: #16834a;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      width: 100%;
    }

    .btn-redeem:hover:not(:disabled) {
      background: #136f3e;
    }

    .btn-redeem:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class EcoStoreComponent {

  rewards: Reward[] = [
    {
      id: 1,
      title: 'Cupom Café Sustentável',
      pointsCost: 800,
      icon: '☕'
    },
    {
      id: 2,
      title: 'Kit Eco (Garrafa + Sacola)',
      pointsCost: 1500,
      icon: '🎁'
    },
    {
      id: 3,
      title: 'Muda de Árvore Plantada',
      pointsCost: 2000,
      icon: '🌱'
    },
    {
      id: 4,
      title: 'Day-Off no Mês do Aniversário',
      pointsCost: 3500,
      icon: '🏖️'
    }
  ];

  constructor(public ecoService: EcoService) {}

  redeem(reward: Reward): void {
    const success = this.ecoService.deductPoints(
      reward.pointsCost,
      `Resgate: ${reward.title}`
    );

    if (success) {
      alert(
        `Resgate demonstrativo realizado: "${reward.title}".`
      );
    } else {
      alert(
        'Saldo de EcoPoints insuficiente para este resgate.'
      );
    }
  }
}
