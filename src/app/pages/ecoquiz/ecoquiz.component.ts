import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EcoService } from '../../services/eco.service';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
  selectedOptionIndex?: number;
  answered?: boolean;
}

@Component({
  selector: 'app-ecoquiz',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="quiz-container">
      <h2>🧠 Conscientização & EcoQuiz</h2>

      <p class="subtitle">
        Responda às perguntas e acumule mais EcoPoints!
      </p>

      <div
        class="question-card"
        *ngFor="let q of questions; let i = index"
      >
        <h3>{{ i + 1 }}. {{ q.question }}</h3>

        <div class="options">
          <button
            *ngFor="let option of q.options; let optIndex = index"
            class="option-btn"
            [class.selected]="q.selectedOptionIndex === optIndex"
            [class.correct]="
              q.answered &&
              optIndex === q.correctOptionIndex
            "
            [class.wrong]="
              q.answered &&
              q.selectedOptionIndex === optIndex &&
              optIndex !== q.correctOptionIndex
            "
            [disabled]="q.answered"
            (click)="selectOption(q, optIndex)"
          >
            {{ option }}
          </button>
        </div>

        <div
          class="action-row"
          *ngIf="!q.answered"
        >
          <button
            class="btn-submit"
            [disabled]="q.selectedOptionIndex === undefined"
            (click)="submitAnswer(q)"
          >
            Confirmar Resposta
          </button>
        </div>

        <div
          class="feedback"
          *ngIf="q.answered"
        >
          <p
            *ngIf="
              q.selectedOptionIndex ===
              q.correctOptionIndex
            "
            class="success-text"
          >
            ✓ Correto! Você ganhou +50 EcoPoints.
          </p>

          <p
            *ngIf="
              q.selectedOptionIndex !==
              q.correctOptionIndex
            "
            class="error-text"
          >
            ✕ Incorreto. A resposta correta era:
            {{ q.options[q.correctOptionIndex] }}
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quiz-container {
      padding: 1.5rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .subtitle {
      color: #64748b;
      margin-bottom: 1.5rem;
    }

    .question-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 1rem 0;
    }

    .option-btn {
      padding: 0.75rem;
      text-align: left;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .option-btn:hover:not(:disabled) {
      background: #e2e8f0;
    }

    .option-btn.selected {
      border-color: #16834a;
      background: #e8f8ec;
      font-weight: 600;
    }

    .option-btn.correct {
      background: #dcfce7;
      border-color: #16a34a;
      color: #15803d;
    }

    .option-btn.wrong {
      background: #fee2e2;
      border-color: #ef4444;
      color: #b91c1c;
    }

    .btn-submit {
      background: #16834a;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-submit:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
    }

    .success-text {
      color: #16a34a;
      font-weight: 600;
      margin-top: 0.5rem;
    }

    .error-text {
      color: #dc2626;
      font-weight: 600;
      margin-top: 0.5rem;
    }
  `]
})
export class EcoQuizComponent {
  private readonly destroyRef = inject(DestroyRef);

  questions: Question[] = [
    {
      id: 1,
      question:
        'Qual ODS (Objetivo de Desenvolvimento Sustentável) da ONU aborda a "Ação Contra a Mudança Global do Clima"?',
      options: [
        'ODS 6',
        'ODS 12',
        'ODS 13',
        'ODS 15'
      ],
      correctOptionIndex: 2
    },
    {
      id: 2,
      question:
        'O que caracteriza o conceito de "Greenwashing"?',
      options: [
        'Uso de sabão ecológico para limpeza do escritório',
        'Prática de divulgar falsas ações sustentáveis para criar boa imagem',
        'Processo de reciclagem de papéis impressos',
        'Cálculo exato da pegada de carbono'
      ],
      correctOptionIndex: 1
    },
    {
      id: 3,
      question:
        'Qual é o principal impacto positivo de destinar resíduos orgânicos para a compostagem em vez de aterros sanitários?',
      options: [
        'Redução de custos apenas.',
        'Redução da emissão de gases do efeito estufa (como o metano) e produção de adubo natural.',
        'Aumento do volume nos aterros sanitários.'
      ],
      correctOptionIndex: 1
    }
  ];

  constructor(private ecoService: EcoService) {
    this.ecoService.history$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(actions => {
        for (const question of this.questions) {
          const description =
            `Quiz: Resposta correta na questão ${question.id}`;

          const alreadyAnsweredCorrectly =
            actions.some(
              action =>
                action.title === description
            );

          if (alreadyAnsweredCorrectly) {
            question.answered = true;
            question.selectedOptionIndex =
              question.correctOptionIndex;
          }
        }
      });
  }

  selectOption(
    question: Question,
    optionIndex: number
  ): void {
    if (question.answered) {
      return;
    }

    question.selectedOptionIndex = optionIndex;
  }

  submitAnswer(question: Question): void {
    if (
      question.selectedOptionIndex === undefined ||
      question.answered
    ) {
      return;
    }

    question.answered = true;

    if (
      question.selectedOptionIndex !==
      question.correctOptionIndex
    ) {
      return;
    }

    const description =
      `Quiz: Resposta correta na questão ${question.id}`;

    if (
      this.ecoService.historyContains(description)
    ) {
      return;
    }

    this.ecoService.addPoints(
      50,
      description,
      'Geral',
      'quiz'
    );
  }
}
