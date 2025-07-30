import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../controllers/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  // Use um Observable para o perfil, que pode ser nulo antes de carregar.
  userProfile$!: Observable<string | null>;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Inscreve-se no Observable de perfil do serviço de autenticação.
    this.userProfile$ = this.authService.userProfile$;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Redirecionamento já acontece no AuthService.
      },
      error: (err) => {
        console.error('Erro ao fazer logout:', err);
        // Mesmo com erro, o AuthService limpa a sessão local.
      }
    });
  }
  
  // Método para capitalizar a primeira letra do perfil para exibição.
  capitalize(s: string | null): string {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}