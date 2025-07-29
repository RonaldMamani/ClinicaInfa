import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Ainda precisamos do FormsModule para [(ngModel)]

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Mantenha CommonModule e FormsModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Modelo para os dados do formulário de login
  // Apenas para que o [(ngModel)] no HTML funcione sem erros
  credentials = {
    email: '',
    password: ''
  };

  // Flags para controlar o estado visual (isLoading, errorMessage)
  // Úteis para simular o comportamento de UI
  isLoading: boolean = false; 
  errorMessage: string | null = null; 

  // O método onSubmit não fará nada por enquanto, apenas para evitar erros no HTML
  onSubmit(): void {
    console.log('Formulário submetido (apenas visual):', this.credentials);
    // Você pode alternar isLoading ou errorMessage aqui para testar o visual
    // this.isLoading = !this.isLoading;
    // this.errorMessage = this.errorMessage ? null : 'Simulando um erro de login.';
  }
}