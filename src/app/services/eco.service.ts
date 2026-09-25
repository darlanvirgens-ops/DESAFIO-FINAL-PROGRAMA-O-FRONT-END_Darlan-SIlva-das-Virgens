import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from './toast.service';

export type EcoActionType =
  | 'habit'
  | 'quiz'
  | 'redemption'
  | 'demo'
  | 'other';

export interface EcoAction {
  type?: EcoActionType;
  id: number;
  title: string;
  points: number;
  category: string;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EcoService {
  private readonly storageKey = 'ecoconnect_demo_state_v1';

  private userPointsSubject = new BehaviorSubject<number>(1250);
  userPoints$ = this.userPointsSubject.asObservable();

  // Histórico inicial demonstrativo do protótipo.
  private historySubject = new BehaviorSubject<EcoAction[]>([
    {
      id: 1,
      type: 'demo',
      title: 'Uso de Garrafa Reutilizável',
      points: 20,
      category: 'Hábitos',
      date: new Date()
    },
    {
      id: 2,
      type: 'demo',
      title: 'Descarte Correto de Pilhas',
      points: 50,
      category: 'Reciclagem',
      date: new Date()
    },
    {
      id: 3,
      type: 'demo',
      title: 'Descarte correto de resíduos nas lixeiras de coleta seletiva',
      points: 20,
      category: 'Reciclagem',
      date: new Date()
    },
    {
      id: 4,
      type: 'demo',
      title: 'Encaminhamento de resíduos orgânicos para compostagem',
      points: 25,
      category: 'Reciclagem',
      date: new Date()
    }
  ]);

  history$ = this.historySubject.asObservable();

  constructor(private toastService: ToastService) {
    this.restoreState();
  }

  private restoreState(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);

      if (!raw) {
        return;
      }

      const saved = JSON.parse(raw);

      if (
        typeof saved.points !== 'number' ||
        !Number.isFinite(saved.points) ||
        !Array.isArray(saved.history)
      ) {
        return;
      }

      this.userPointsSubject.next(
        Math.max(0, saved.points)
      );

      const restoredHistory = saved.history
        .filter(
          (item: EcoAction) =>
            item &&
            typeof item.title === 'string' &&
            typeof item.points === 'number'
        )
        .map((item: EcoAction) => ({
          ...item,
          type: item.type || this.inferLegacyType(item),
          date: new Date(item.date)
        }));

      this.historySubject.next(restoredHistory);
    } catch {
      // O protótipo continua utilizável se o armazenamento
      // local estiver indisponível ou possuir dados inválidos.
    }
  }

  // Mantém compatibilidade com históricos salvos
  // antes da inclusão dos tipos de ações.
  private inferLegacyType(action: EcoAction): EcoActionType {
    if (action.title.startsWith('Check-in: ')) {
      return 'habit';
    }

    if (action.title.startsWith('Quiz: ')) {
      return 'quiz';
    }

    if (
      action.category === 'Resgate' &&
      action.points < 0
    ) {
      return 'redemption';
    }

    const demoTitles = [
      'Uso de Garrafa Reutilizável',
      'Descarte Correto de Pilhas',
      'Descarte correto de resíduos nas lixeiras de coleta seletiva',
      'Encaminhamento de resíduos orgânicos para compostagem'
    ];

    if (
      [1, 2, 3, 4].includes(action.id) &&
      demoTitles.includes(action.title)
    ) {
      return 'demo';
    }

    return 'other';
  }

  private saveState(): void {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          points: this.currentPoints,
          history: this.historySubject.value
        })
      );
    } catch {
      this.toastService.show(
        'Não foi possível salvar neste navegador. Verifique o armazenamento local.',
        'error'
      );
    }
  }

  historyContains(description: string): boolean {
    return this.historySubject.value.some(
      action => action.title === description
    );
  }

  hasActionToday(description: string): boolean {
    const today = new Date().toDateString();

    return this.historySubject.value.some(
      action =>
        action.title === description &&
        new Date(action.date).toDateString() === today
    );
  }

  get currentPoints(): number {
    return this.userPointsSubject.value;
  }

  addPoints(
    amount: number,
    description: string,
    category: string = 'Geral',
    type: EcoActionType = 'other'
  ): void {
    const updatedPoints = this.currentPoints + amount;

    this.userPointsSubject.next(updatedPoints);

    const newAction: EcoAction = {
      id: Date.now(),
      title: description,
      type,
      points: amount,
      category,
      date: new Date()
    };

    const currentHistory = this.historySubject.value;

    this.historySubject.next([
      newAction,
      ...currentHistory
    ]);

    this.saveState();

    this.toastService.show(
      `+${amount} EcoPoints: ${description}`,
      'success'
    );
  }

  deductPoints(
    amount: number,
    description: string
  ): boolean {
    if (this.currentPoints < amount) {
      this.toastService.show(
        'Saldo insuficiente de EcoPoints!',
        'error'
      );

      return false;
    }

    const updatedPoints =
      this.currentPoints - amount;

    this.userPointsSubject.next(updatedPoints);

    const newAction: EcoAction = {
      id: Date.now(),
      title: description,
      type: 'redemption',
      points: -amount,
      category: 'Resgate',
      date: new Date()
    };

    const currentHistory = this.historySubject.value;

    this.historySubject.next([
      newAction,
      ...currentHistory
    ]);

    this.saveState();

    this.toastService.show(
      `Resgate demonstrativo: ${description}`,
      'info'
    );

    return true;
  }
}
