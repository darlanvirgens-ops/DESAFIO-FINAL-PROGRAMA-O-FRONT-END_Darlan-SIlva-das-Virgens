
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ecodata',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="data-container">
      <h2>Sustentabilidade Digital e Governança de Dados</h2>

      <p class="subtitle">
        Diretrizes e propostas para uma evolução corporativa do EcoConnect,
        considerando privacidade, governança e uso consciente de recursos digitais.
      </p>

      <div class="cards-grid">

        <div class="data-card">
          <span class="status-badge guideline">
            Diretriz do projeto
          </span>

          <h3>Privacidade e Proteção de Dados</h3>

          <p>
            O protótipo utiliza dados demonstrativos armazenados
            localmente no navegador. Uma versão corporativa deverá
            prever controle de acesso, transparência no tratamento
            de dados pessoais e medidas de segurança adequadas.
          </p>
        </div>

        <div class="data-card">
          <span class="status-badge future">
            Proposta futura
          </span>

          <h3>Infraestrutura Digital Sustentável</h3>

          <p>
            Para uma implantação corporativa, poderão ser avaliados
            provedores de nuvem com compromissos ambientais verificáveis
            e práticas de eficiência energética.
          </p>
        </div>

        <div class="data-card">
          <span class="status-badge proposed">
            Boa prática proposta
          </span>

          <h3>Armazenamento Consciente</h3>

          <p>
            A plataforma poderá adotar políticas de retenção, revisão
            e descarte de dados desnecessários, respeitando as
            necessidades do serviço e as obrigações aplicáveis.
          </p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .data-container {
      padding: 1.5rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .subtitle {
      color: #64748b;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
    }

    .data-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.25rem;
      position: relative;
    }

    .data-card h3 {
      color: #103e30;
      margin: 0.75rem 0 0.5rem;
      font-size: 1.1rem;
    }

    .data-card p {
      color: #475569;
      font-size: 0.9rem;
      line-height: 1.6;
      margin: 0;
    }

    .status-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: bold;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .status-badge.guideline {
      background: #e0f2fe;
      color: #075985;
    }

    .status-badge.future {
      background: #dcfce7;
      color: #15803d;
    }

    .status-badge.proposed {
      background: #fef3c7;
      color: #b45309;
    }
  `]
})
export class EcoDataComponent {}
