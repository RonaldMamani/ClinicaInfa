import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../controllers/auth/auth.service'; // Ajuste o caminho
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userProfile$!: Observable<string | null>;
  userName$!: Observable<string | null>; // NOVO: Observable para o nome do usuário

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userProfile$ = this.authService.userProfile$;
    this.userName$ = this.authService.userName$;
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

  capitalize(s: string | null): string {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}