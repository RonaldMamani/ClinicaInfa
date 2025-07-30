import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../controllers/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    username: '', 
    senha: ''
  };

  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = null; // Limpa mensagens de erro anteriores

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        // O AuthService já cuida de armazenar o token e o perfil
        // E o DashboardComponent fará o redirecionamento com base no perfil
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro de login:', err);
        // Lidar com mensagens de erro da API.
        // Sua API retorna `message` para erros de login.
        if (err.status === 401 && err.error && err.error.message) {
          this.errorMessage = err.error.message; // Mensagem específica de credenciais inválidas
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message; // Outras mensagens de erro da API
        } else {
          this.errorMessage = 'Ocorreu um erro ao tentar logar. Tente novamente mais tarde.';
        }
      }
    });
  }
}