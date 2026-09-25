import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <div class="hero">
        <span class="brand">ECOCONNECT</span>
        <h1>Conectando conhecimento, hábitos e impacto</h1>
        <p>Engajamento corporativo transformado em ações sustentáveis mensuráveis.</p>
        <button class="btn-primary" (click)="goToDashboard()">Acesse a Plataforma / Dashboard →</button>
      </div>
    </div>
  `,
  styles: [`
    .home-container { padding: 3rem 1.5rem; text-align: center; max-width: 800px; margin: 0 auto; }
    .brand { color: #16834a; font-weight: 800; letter-spacing: 1px; font-size: 0.85rem; }
    .hero h1 { color: #103e30; font-size: 2.25rem; margin: 0.75rem 0; }
    .hero p { color: #64748b; font-size: 1.1rem; margin-bottom: 2rem; }
    .btn-primary { background: #16834a; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; }
    .btn-primary:hover { background: #136f3e; }
  `]
})
export class HomeComponent {
  constructor(private router: Router) {}

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
