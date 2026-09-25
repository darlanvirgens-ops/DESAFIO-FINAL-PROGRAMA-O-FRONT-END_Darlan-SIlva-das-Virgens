import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EcoService } from '../../services/eco.service';

export interface HabitTask {
  id: number;
  task: string;
  category: string;
  points: number;
  icon: string;
  completed: boolean;
}

export interface HistoryLog {
  id: number;
  taskName: string;
  points: number;
  time: string;
}

@Component({
  selector: 'app-ecocheck',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ecocheck.component.html',
  styleUrls: ['./ecocheck.component.css']
})
export class EcoCheckComponent {
  private readonly destroyRef = inject(DestroyRef);

  todayDateStr = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  habits: HabitTask[] = [
    {
      id: 1,
      task: 'Transporte Sustentável (Bike/Caminhada)',
      category: 'Mobilidade',
      points: 30,
      icon: '🚲',
      completed: false
    },
    {
      id: 2,
      task: 'Uso de Garrafa/Caneca Própria',
      category: 'Consumo',
      points: 15,
      icon: '☕',
      completed: false
    },
    {
      id: 3,
      task: 'Desligar Equipamentos Sem Uso',
      category: 'Energia',
      points: 20,
      icon: '💡',
      completed: false
    },
    {
      id: 4,
      task: 'Separação Adequada de Resíduos',
      category: 'Reciclagem',
      points: 25,
      icon: '♻️',
      completed: false
    },
    {
      id: 5,
      task: 'Descarte correto de resíduos nas lixeiras de coleta seletiva',
      category: 'Reciclagem',
      points: 20,
      icon: '♻️',
      completed: false
    },
    {
      id: 6,
      task: 'Encaminhamento de resíduos orgânicos para compostagem',
      category: 'Reciclagem',
      points: 25,
      icon: '🌱',
      completed: false
    }
  ];

  historyLogs: HistoryLog[] = [];

  constructor(private ecoService: EcoService) {
    this.habits.forEach(habit => {
      habit.completed = this.ecoService.hasActionToday(
        `Check-in: ${habit.task}`
      );
    });

    this.ecoService.history$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(actions => {
        const today = new Date().toDateString();

        this.historyLogs = actions
          .filter(
            action =>
              action.title.startsWith('Check-in: ') &&
              new Date(action.date).toDateString() === today
          )
          .map(action => ({
            id: action.id,
            taskName: action.title.replace('Check-in: ', ''),
            points: action.points,
            time: new Date(action.date).toLocaleTimeString(
              'pt-BR',
              {
                hour: '2-digit',
                minute: '2-digit'
              }
            )
          }));
      });
  }

  toggleHabit(habit: HabitTask): void {
    const description = `Check-in: ${habit.task}`;

    if (
      habit.completed ||
      this.ecoService.hasActionToday(description)
    ) {
      return;
    }

    habit.completed = true;

    this.ecoService.addPoints(
      habit.points,
      description,
      habit.category,
      'habit'
    );
  }

  registerHabit(habit: HabitTask): void {
    this.toggleHabit(habit);
  }
}
