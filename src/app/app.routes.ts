import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EcoCheckComponent } from './pages/ecocheck/ecocheck.component';
import { EcoConteudoComponent } from './pages/ecoconteudo/ecoconteudo.component';
import { EcoDataComponent } from './pages/ecodata/ecodata.component';
import { EcoPainelComponent } from './pages/ecopainel/ecopainel.component';
import { EcoQuizComponent } from './pages/ecoquiz/ecoquiz.component';
import { EcoStoreComponent } from './pages/ecostore/ecostore.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'ecocheck', component: EcoCheckComponent, canActivate: [AuthGuard] },
  { path: 'ecoconteudo', component: EcoConteudoComponent, canActivate: [AuthGuard] },
  { path: 'ecodata', component: EcoDataComponent, canActivate: [AuthGuard] },
  { path: 'ecopainel', component: EcoPainelComponent, canActivate: [AuthGuard] },
  { path: 'ecoquiz', component: EcoQuizComponent, canActivate: [AuthGuard] },
  { path: 'ecostore', component: EcoStoreComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];
