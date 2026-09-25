import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Category { id: string; name: string; icon: string; }
interface Article {
  id: number; categoryId: string; title: string; readTime: string;
  description: string; lessons: string[]; action: string;
}

@Component({
  selector: 'app-ecoconteudo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="content-container">
      <header class="intro">
        <span class="eyebrow">ECOCONNECT • APRENDIZAGEM</span>
        <h1>📚 EcoConteúdo</h1>
        <p>Conhecimento para transformar escolhas do dia a dia em hábitos sustentáveis.</p>
        <div class="intro-stats"><span>{{ articles.length }} conteúdos educativos</span><span>Leitura prática</span><span>ESG no cotidiano</span></div>
      </header>

      <section class="featured" aria-label="Destaque educativo">
        <div class="featured-copy">
          <span class="eyebrow">EM DESTAQUE • {{ getCategoryName(featured.categoryId) }}</span>
          <h2>{{ featured.title }}</h2>
          <p>{{ featured.description }}</p>
          <button type="button" class="primary" (click)="openArticle(featured)">Explorar conteúdo →</button>
        </div>
        <div class="featured-art" aria-hidden="true">{{ categoryIcon(featured.categoryId) }}</div>
        <div class="slide-controls">
          <button type="button" (click)="previousSlide()" aria-label="Destaque anterior">‹</button>
          <span aria-live="polite">{{ featuredIndex + 1 }} / {{ articles.length }}</span>
          <button type="button" (click)="nextSlide()" aria-label="Próximo destaque">›</button>
        </div>
      </section>

      <section class="library" aria-label="Biblioteca educativa">
        <div class="section-title"><h2>Explore por tema</h2><p>Selecione uma categoria e abra um conteúdo para ler as orientações.</p></div>
        <div class="category-filters" role="group" aria-label="Filtrar conteúdos">
          <button *ngFor="let cat of categories" type="button" class="cat-btn"
            [class.active]="selectedCategory === cat.id"
            [attr.aria-pressed]="selectedCategory === cat.id"
            (click)="selectCategory(cat.id)">{{ cat.icon }} {{ cat.name }}</button>
        </div>
        <div class="cards-list">
          <article class="info-card" *ngFor="let item of filteredArticles">
            <span class="article-icon" aria-hidden="true">{{ categoryIcon(item.categoryId) }}</span>
            <span class="badge">{{ getCategoryName(item.categoryId) }} • {{ item.readTime }}</span>
            <h3>{{ item.title }}</h3><p>{{ item.description }}</p>
            <button type="button" class="read-btn" (click)="openArticle(item)">Ler orientações →</button>
          </article>
        </div>
        <p *ngIf="filteredArticles.length === 0" class="empty-state">Nenhum conteúdo nesta categoria.</p>
      </section>

      <section *ngIf="selectedArticle as item" class="reading" id="leitura" aria-label="Leitura selecionada">
        <div class="reading-head"><span class="badge">{{ getCategoryName(item.categoryId) }} • {{ item.readTime }}</span>
          <button type="button" (click)="closeArticle()" aria-label="Fechar leitura">✕ Fechar</button></div>
        <h2>{{ item.title }}</h2><p>{{ item.description }}</p>
        <h3>O que colocar em prática</h3>
        <ul><li *ngFor="let lesson of item.lessons">{{ lesson }}</li></ul>
        <div class="action"><strong>🌱 Desafio para hoje</strong><p>{{ item.action }}</p></div>
        <p class="note">Conteúdo educativo do protótipo. A leitura não gera EcoPoints automaticamente.</p>
      </section>
    </main>
  `,
  styles: [`
    :host{display:block;color:#173b2e}.content-container{width:min(1120px,100%);margin:auto;padding:clamp(14px,3vw,32px);box-sizing:border-box}
    .intro{padding:clamp(22px,4vw,42px);background:linear-gradient(120deg,#103e30,#18754c);border-radius:22px;color:white}.eyebrow{font-size:.74rem;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:#a5efbd}.intro h1{font-size:clamp(1.8rem,4vw,3rem);margin:12px 0}.intro p{max-width:680px;line-height:1.6;color:#e0f2e7}.intro-stats{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}.intro-stats span{border:1px solid #ffffff50;border-radius:100px;padding:7px 12px;font-size:.82rem}
    .featured{margin:22px 0 32px;display:grid;grid-template-columns:1.5fr 1fr;position:relative;min-height:265px;background:#eaf6ee;border:1px solid #d3e9da;border-radius:20px;overflow:hidden}.featured-copy{padding:clamp(22px,4vw,38px)}.featured .eyebrow{color:#18754c}.featured h2{font-size:clamp(1.4rem,3vw,2rem);line-height:1.2;margin:12px 0}.featured p{line-height:1.6;color:#456052}.featured-art{display:grid;place-items:center;font-size:clamp(5rem,13vw,9rem);background:radial-gradient(circle,#c0eacb,#eaf6ee)}.primary{background:#147a47;color:white;border:0;border-radius:10px;padding:12px 18px;font-weight:700;cursor:pointer}.slide-controls{position:absolute;right:15px;bottom:13px;display:flex;align-items:center;gap:10px;font-weight:700}.slide-controls button{border:1px solid #b3d4bf;border-radius:50%;width:34px;height:34px;background:white;font-size:1.5rem;cursor:pointer}
    .section-title h2{margin-bottom:5px}.section-title p{color:#52695d;margin-top:0}.category-filters{display:flex;flex-wrap:wrap;gap:9px;margin:22px 0}.cat-btn{border:1px solid #c5d7cb;border-radius:99px;padding:10px 14px;background:white;color:#244938;cursor:pointer}.cat-btn.active{background:#147a47;color:white;border-color:#147a47}.cards-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,245px),1fr));gap:16px}.info-card{background:white;border:1px solid #dbe9df;border-radius:16px;padding:22px;display:flex;flex-direction:column;box-shadow:0 4px 16px #123b2810}.article-icon{font-size:2.1rem;margin-bottom:12px}.badge{font-size:.76rem;font-weight:700;color:#147a47}.info-card h3{font-size:1.13rem;line-height:1.3;margin:12px 0}.info-card p{color:#53685c;line-height:1.5;flex:1}.read-btn{align-self:flex-start;border:0;background:none;color:#147a47;font-weight:800;padding:8px 0;cursor:pointer}.reading{margin:26px 0;background:white;border:1px solid #cce2d3;border-radius:18px;padding:clamp(20px,4vw,34px)}.reading-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.reading-head button{background:#edf5ef;border:0;border-radius:8px;padding:8px 12px;cursor:pointer}.reading h2{line-height:1.25}.reading p,.reading li{line-height:1.7;color:#455e4e}.reading li{margin:8px 0}.action{background:#eaf6ee;padding:16px;border-radius:12px;margin-top:22px}.action p{margin-bottom:0}.note{font-size:.8rem}.empty-state{padding:24px;text-align:center}
    @media(max-width:640px){.featured{grid-template-columns:1fr}.featured-art{min-height:105px;font-size:4rem}.featured-copy{padding-bottom:56px}.slide-controls{bottom:115px}.intro-stats span{font-size:.74rem}.content-container{padding:12px}.info-card{padding:18px}}
  `]
})
export class EcoConteudoComponent {
  selectedCategory = 'all';
  featuredIndex = 0;
  selectedArticle: Article | null = null;
  categories: Category[] = [
    { id: 'all', name: 'Todos', icon: '🌐' },
    { id: 'circular', name: 'Economia Circular', icon: '♻️' },
    { id: 'climate', name: 'Mudanças Climáticas', icon: '🌍' },
    { id: 'esg', name: 'Governança ESG', icon: '⚖️' },
    { id: 'water', name: 'Água e Energia', icon: '💧' },
    { id: 'mobility', name: 'Mobilidade', icon: '🚲' }
  ];
  articles: Article[] = [
    { id: 1, categoryId: 'circular', title: 'Gestão de Resíduos no Ambiente Corporativo', readTime: '5 min', description: 'Conheça os 5Rs e formas de evitar desperdícios no trabalho.', lessons: ['Repense a necessidade antes de consumir e recuse descartáveis desnecessários.', 'Reduza a geração de resíduos e reutilize materiais em boas condições.', 'Separe recicláveis conforme as orientações da coleta local.'], action: 'Identifique um item descartável que você pode substituir por uma opção reutilizável.' },
    { id: 2, categoryId: 'climate', title: 'Entendendo os Escopos 1, 2 e 3 de Emissões', readTime: '8 min', description: 'Entenda as categorias usadas para organizar inventários corporativos de gases de efeito estufa.', lessons: ['Escopo 1: emissões diretas de fontes controladas pela organização.', 'Escopo 2: emissões indiretas associadas à energia adquirida.', 'Escopo 3: outras emissões indiretas da cadeia de valor, conforme o inventário adotado.'], action: 'Observe uma atividade do seu dia que se relacione com consumo de energia ou deslocamento.' },
    { id: 3, categoryId: 'esg', title: 'Ética, Transparência e Código de Conduta', readTime: '6 min', description: 'A governança ajuda a estabelecer responsabilidades e práticas transparentes.', lessons: ['Conheça os canais e as regras de conduta da organização.', 'Registre informações de forma responsável e proteja dados pessoais.', 'Respeite as pessoas e comunique situações de risco pelos canais adequados.'], action: 'Localize o código de conduta ou a política de privacidade da sua organização.' },
    { id: 4, categoryId: 'circular', title: 'Coleta Seletiva e Compostagem', readTime: '6 min', description: 'Aprenda a separar resíduos e a compreender o aproveitamento de matéria orgânica.', lessons: ['Consulte as regras de separação e coleta do seu município ou empresa.', 'Mantenha recicláveis livres de restos de alimentos quando necessário.', 'Encaminhe orgânicos à compostagem somente quando houver estrutura adequada.'], action: 'Confira como sua residência ou local de trabalho orienta a separação dos resíduos.' },
    { id: 5, categoryId: 'water', title: 'Uso Consciente da Água', readTime: '4 min', description: 'Pequenas decisões ajudam a reduzir desperdícios de água.', lessons: ['Comunique vazamentos e torneiras com defeito.', 'Evite deixar a água correr sem necessidade.', 'Siga os procedimentos de uso e limpeza do local.'], action: 'Verifique se há algum vazamento visível e informe o responsável.' },
    { id: 6, categoryId: 'water', title: 'Eficiência Energética no Trabalho', readTime: '5 min', description: 'Consumo consciente começa pelo uso adequado dos equipamentos.', lessons: ['Desligue luzes e aparelhos quando permitido e quando não forem necessários.', 'Aproveite iluminação natural sem comprometer conforto e segurança.', 'Não altere equipamentos industriais sem autorização.'], action: 'Ao sair de um ambiente, confira os equipamentos que podem ser desligados com segurança.' },
    { id: 7, categoryId: 'mobility', title: 'Mobilidade e Deslocamentos Conscientes', readTime: '5 min', description: 'Planejamento de trajetos pode reduzir deslocamentos desnecessários.', lessons: ['Considere transporte coletivo, caminhada ou bicicleta quando forem opções seguras.', 'Combine trajetos e compromissos para evitar viagens repetidas.', 'Avalie acessibilidade, distância e segurança antes de escolher.'], action: 'Planeje um deslocamento da semana considerando alternativas disponíveis.' },
    { id: 8, categoryId: 'esg', title: 'ESG: Ambiental, Social e Governança', readTime: '6 min', description: 'Conheça os três eixos usados para organizar práticas e indicadores corporativos.', lessons: ['Ambiental: recursos, resíduos e emissões.', 'Social: pessoas, segurança, direitos e relações com a comunidade.', 'Governança: ética, controles, transparência e prestação de contas.'], action: 'Escolha uma iniciativa da sua organização e identifique a qual eixo ela se relaciona.' }
  ];
  get filteredArticles(): Article[] { return this.selectedCategory === 'all' ? this.articles : this.articles.filter(a => a.categoryId === this.selectedCategory); }
  get featured(): Article { return this.articles[this.featuredIndex]; }
  selectCategory(id: string): void { this.selectedCategory = id; }
  getCategoryName(id: string): string { return this.categories.find(c => c.id === id)?.name ?? 'Geral'; }
  categoryIcon(id: string): string { return this.categories.find(c => c.id === id)?.icon ?? '🌱'; }
  previousSlide(): void { this.featuredIndex = (this.featuredIndex - 1 + this.articles.length) % this.articles.length; }
  nextSlide(): void { this.featuredIndex = (this.featuredIndex + 1) % this.articles.length; }
  openArticle(item: Article): void { this.selectedArticle = item; setTimeout(() => document.getElementById('leitura')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0); }
  closeArticle(): void { this.selectedArticle = null; }
}
