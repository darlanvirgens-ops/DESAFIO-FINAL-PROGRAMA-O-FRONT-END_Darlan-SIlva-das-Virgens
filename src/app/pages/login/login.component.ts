import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = 'nome@empresa.com';
  senha: string = '123456';
  errorMessage: string = '';
  showConfirmModal: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // Disparado ao clicar no botão "Acesse a Plataforma"
  onSubmit(): void {
    if (this.email.trim() && this.senha.trim()) {
      this.errorMessage = '';
      this.showConfirmModal = true; // Abre a caixa de confirmação
    } else {
      this.errorMessage = 'Por favor, preencha o e-mail e a senha.';
    }
  }

  // Confirmação final do login
  confirmLogin(): void {
    const success = this.authService.login(this.email, this.senha);
    if (success) {
      this.showConfirmModal = false;
      this.router.navigate(['/dashboard']);
    } else {
      this.showConfirmModal = false;
      this.errorMessage = 'Credenciais inválidas.';
    }
  }

  // Cancela o acesso
  cancelLogin(): void {
    this.showConfirmModal = false;
  }
}
