import { Component } from '@angular/core';
import { Usuario, UsuarioDetailsResponse } from '../../../core/models/usuario.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UsuariosService } from '../../../controllers/usuarios/usuarios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalhe-funcionario',
  imports: [CommonModule, RouterModule],
  templateUrl: './detalhe-funcionario.component.html',
  styleUrl: './detalhe-funcionario.component.css'
})
export class DetalheFuncionarioComponent {
  usuario: Usuario | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuariosService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const usuarioId = params.get('id');
      if (usuarioId) {
        this.carregarDetalhesUsuario(Number(usuarioId));
      } else {
        this.error = 'ID do usuário não fornecido na rota.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Carrega os detalhes de um usuário específico.
   * @param id O ID do usuário.
   */
  carregarDetalhesUsuario(id: number): void {
    this.isLoading = true;
    this.error = null;
    this.usuarioService.getUsuarioDetalhes(id).subscribe({
      next: (response: UsuarioDetailsResponse) => {
        if (response.status && response.usuario) {
          this.usuario = response.usuario;
        } else {
          this.error = response.message || 'Detalhes do usuário não encontrados.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Erro ao carregar os detalhes do usuário.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
