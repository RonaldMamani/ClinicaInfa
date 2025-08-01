import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../controllers/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLoading: boolean = true; // Para mostrar um spinner enquanto decide para onde ir

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Obter o perfil do usuário logado.
    // O AuthService deve fornecer o perfil (ex: 'secretaria', 'medico', 'administrador').
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        this.isLoading = false;
        if (profile) {
          switch (profile) {
            case 'administrador':
              this.router.navigate(['/administrador']); // Redireciona para sua rota de administrador
              break;
            case 'medico':
              this.router.navigate(['/medico']); // Redireciona para sua rota de médico
              break;
            case 'secretaria':
              this.router.navigate(['/secretaria']); // Redireciona para sua rota de secretária
              break;
            default:
              // Perfil desconhecido ou não esperado, redireciona para login e desloga
              console.warn('Perfil de usuário desconhecido:', profile);
              this.authService.logout();
              break;
          }
        } else {
          // Não há perfil (usuário não logado ou token inválido)
          this.authService.logout();
        }
      },
      error: (err) => {
        console.error('Erro ao obter perfil do usuário:', err);
        this.isLoading = false;
        this.authService.logout(); // Em caso de erro, desloga e redireciona para login
      }
    });
  }
}