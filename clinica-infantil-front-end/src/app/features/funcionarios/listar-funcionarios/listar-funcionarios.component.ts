import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Usuario, UsuariosListResponse } from '../../../core/models/usuario.model';
import { UsuariosService } from '../../../controllers/usuarios/usuarios.service';
import { forkJoin, Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { BotaoVoltarComponent } from "../../../components/botao-voltar/botao-voltar.component";

@Component({
  selector: 'app-listar-funcionarios',
  imports: [CommonModule, RouterModule, HttpClientModule, BotaoVoltarComponent],
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
      ativos: this.usuarioService.getUsuariosAtivos(),
      inativos: this.usuarioService.getUsuariosInativos()
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
   */
  confirmAction(): void {
    if (this.selectedUsuario && this.actionType) {
      let requestObservable: Observable<any>;
      const usuarioId = this.selectedUsuario.id;

      if (this.actionType === 'desativar') {
        // Usa o método específico de desativação (DELETE)
        requestObservable = this.usuarioService.desativarUsuario(usuarioId);
      } else {
        // Usa o método específico de reativação (PUT)
        requestObservable = this.usuarioService.reativarUsuario(usuarioId);
      }
      
      requestObservable.subscribe({
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
