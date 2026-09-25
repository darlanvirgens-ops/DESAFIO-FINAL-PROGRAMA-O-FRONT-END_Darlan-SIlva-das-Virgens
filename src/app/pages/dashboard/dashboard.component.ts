import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../../services/auth.service';
import { EcoService } from '../../services/eco.service';

import { EcoConteudoComponent } from '../ecoconteudo/ecoconteudo.component';
import { EcoCheckComponent } from '../ecocheck/ecocheck.component';
import { EcoPainelComponent } from '../ecopainel/ecopainel.component';
import { EcoQuizComponent } from '../ecoquiz/ecoquiz.component';
import { EcoStoreComponent } from '../ecostore/ecostore.component';
import { EcoDataComponent } from '../ecodata/ecodata.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    EcoPainelComponent,
    EcoConteudoComponent,
    EcoCheckComponent,
    EcoQuizComponent,
    EcoStoreComponent,
    EcoDataComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private readonly destroyRef = inject(DestroyRef);

  currentView: 'home' | 'dashboard' = 'home';
  isMenuOpen = false;
  activeTab = 'ecopainel';

  // Saldo exibido no cabeçalho.
  userPoints = 0;

  // Carrossel da Home.
  currentSlide = 0;

  carouselItems = [
    {
      icon: '📚',
      tab: 'ecoconteudo',
      shortTitle: 'EcoConteúdo',
      title: 'Educação Sustentável (EcoConteúdo)',
      description:
        'Acesse pílulas de conhecimento sobre Economia Circular, Pegada de Carbono e Governança Corporativa.'
    },
    {
      icon: '🧠',
      tab: 'ecoquiz',
      shortTitle: 'EcoQuiz',
      title: 'Conscientização Interativa (EcoQuiz)',
      description:
        'Teste seus conhecimentos sobre sustentabilidade, aprenda sobre as metas ODS e acumule EcoPoints.'
    },
    {
      icon: '🌱',
      tab: 'ecocheck',
      shortTitle: 'EcoCheck',
      title: 'Hábitos Diários (EcoCheck)',
      description:
        'Registre pequenas ações diárias no escritório ou em home office que reduzem o impacto ambiental.'
    },
    {
      icon: '🎁',
      tab: 'ecostore',
      shortTitle: 'EcoStore',
      title: 'Recompensas Verdes (EcoStore)',
      description:
        'Use seus EcoPoints para simular o resgate de cupons, produtos ecológicos e benefícios dentro do protótipo.'
    },
    {
      icon: '📊',
      tab: 'ecopainel',
      shortTitle: 'EcoPainel',
      title: 'Indicadores de Engajamento (EcoPainel)',
      description:
        'Acompanhe seus hábitos, respostas pontuadas, resgates e saldo de EcoPoints.'
    },
    {
      icon: '🔐',
      tab: 'ecodata',
      shortTitle: 'EcoData',
      title: 'Sustentabilidade Digital (EcoData)',
      description:
        'Conheça diretrizes de privacidade, governança de dados e sustentabilidade digital consideradas na evolução do protótipo.'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private ecoService: EcoService
  ) {
    // Mantém o saldo do cabeçalho sincronizado com o EcoService
    // e encerra automaticamente a inscrição ao destruir o componente.
    this.ecoService.userPoints$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(points => {
        this.userPoints = points;
      });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateTo(view: 'home' | 'dashboard'): void {
    this.currentView = view;
    this.isMenuOpen = false;
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  openModule(tab: string): void {
    this.activeTab = tab;
    this.currentView = 'dashboard';
    this.isMenuOpen = false;
  }

  nextSlide(): void {
    this.currentSlide =
      (this.currentSlide + 1) % this.carouselItems.length;
  }

  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.carouselItems.length) %
      this.carouselItems.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
