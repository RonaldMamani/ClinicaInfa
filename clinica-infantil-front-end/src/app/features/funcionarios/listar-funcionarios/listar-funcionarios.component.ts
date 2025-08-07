import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UpdateUsuarioPayload, Usuario, UsuariosListResponse } from '../../../core/models/usuario.model';
import { UsuariosService } from '../../../controllers/usuarios/usuarios.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-listar-funcionarios',
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-funcionarios.component.html',
  styleUrl: './listar-funcionarios.component.css'
})
export class ListarFuncionariosComponent {
  usuariosAtivos: Usuario[] = [];
  usuariosInativos: Usuario[] = [];
  isLoading = true;
  error: string | null = null;
  successMessage: string | null = null;

  // Variáveis para o modal de confirmação
  showConfirmModal = false;
  selectedUsuario: Usuario | null = null;
  actionType: 'desativar' | 'reativar' | null = null;

  constructor(private usuarioService: UsuariosService) { }

  ngOnInit(): void {
    this.carregarUsuarios();
  }
  /**
   * Carrega as listas de usuários ativos e inativos.
   */
  carregarUsuarios(): void {
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;

    forkJoin({
      ativos: this.usuarioService.getActiveUsuarios(),
      inativos: this.usuarioService.getInactiveUsuarios()
    }).subscribe({
      next: (results: { ativos: UsuariosListResponse, inativos: UsuariosListResponse }) => {
        this.usuariosAtivos = results.ativos.usuarios || [];
        this.usuariosInativos = results.inativos.usuarios || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Falha ao carregar a lista de usuários.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  /**
   * Abre o modal de confirmação para desativar ou reativar um usuário.
   * @param usuario O usuário selecionado.
   * @param action O tipo de ação ('desativar' ou 'reativar').
   */
  openConfirmModal(usuario: Usuario, action: 'desativar' | 'reativar'): void {
    this.selectedUsuario = usuario;
    this.actionType = action;
    this.showConfirmModal = true;
  }

  /**
   * Fecha o modal de confirmação.
   */
  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.selectedUsuario = null;
    this.actionType = null;
    this.error = null;
  }

  /**
   * Confirma e executa a ação de desativar/reativar o usuário.
   * Esta função constrói o payload com o novo status 'ativo' e o envia ao backend
   * através do método updateUsuario do serviço.
   */
  confirmAction(): void {
    if (this.selectedUsuario && this.actionType) {
      // Determina o novo status baseado na ação (reativar = true, desativar = false)
      const novoStatus = this.actionType === 'reativar';
      
      // Constrói o payload completo para o update.
      // É importante incluir todos os campos obrigatórios que o backend espera no PUT,
      // mesmo que apenas o 'ativo' esteja sendo alterado, para evitar erros de validação.
      const payload: UpdateUsuarioPayload = {
        username: this.selectedUsuario.username,
        id_perfil: this.selectedUsuario.id_perfil,
        id_funcionario: this.selectedUsuario.id_funcionario,
        ativo: novoStatus // Define o novo status ativo/inativo
      };

      this.usuarioService.updateUsuario(this.selectedUsuario.id, payload).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.closeConfirmModal();
          this.carregarUsuarios(); // Recarrega as listas para refletir a mudança
          setTimeout(() => this.successMessage = null, 3000); // Limpa a mensagem de sucesso após 3 segundos
        },
        error: (err) => {
          this.error = err.error?.message || `Erro ao ${this.actionType} o usuário.`;
          console.error(err);
        }
      });
    }
  }
}
