import { Component } from '@angular/core';
import { ProntuariosService } from '../../../controllers/prontuarios/prontuarios.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Prontuario } from '../../../core/models/prontuarios.model';
import { PaginatedApiResponse } from '../../../core/models/Paginate.model';
import { HttpClientModule } from '@angular/common/http';
import { BotaoVoltarComponent } from "../../../components/botao-voltar/botao-voltar.component";

@Component({
  selector: 'app-listar-prontuarios',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, BotaoVoltarComponent],
  templateUrl: './listar-prontuarios.component.html',
  styleUrl: './listar-prontuarios.component.css'
})
export class ListarProntuariosComponent {
  prontuarios: Prontuario[] = [];
  pagination: PaginatedApiResponse<Prontuario[]> | null = null;
  isLoading = true;
  hasError = false;
  errorMessage = '';

  constructor(private prontuarioService: ProntuariosService) { }

  ngOnInit(): void {
    this.carregarProntuarios();
  }

  /**
   * Carrega a lista de prontuários da API, com suporte a paginação.
   * @param pageUrl URL da página para a qual navegar (opcional).
   */
  carregarProntuarios(pageUrl: string | null = null): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    this.prontuarioService.getProntuarios(pageUrl).subscribe({
      next: (response) => {
        this.prontuarios = response.prontuarios.data;
        this.pagination = response.prontuarios;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar prontuários:', err);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = err.message || 'Falha ao carregar a lista de prontuários. Tente novamente mais tarde.';
      }
    });
  }

  /**
   * Lida com a mudança de página da paginação, chamando o método de carregamento.
   * @param pageUrl URL da página para a qual navegar.
   */
  onPageChange(pageUrl: string | null): void {
    if (pageUrl) {
      this.carregarProntuarios(pageUrl);
    }
  }

  calcularIdade(dataNascimento: string): number {
    const hoje = new Date();
    const dataNasc = new Date(dataNascimento);
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const mes = hoje.getMonth() - dataNasc.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNasc.getDate())) {
      idade--;
    }
    return idade;
  }

  /**
   * Retorna o nome do gênero com base no ID.
   *
   * @param idGenero O ID do gênero (1 ou 2).
   * @returns A string 'Masculino' ou 'Feminino', ou 'Desconhecido'.
   */
  getGenero(idGenero: number): string {
    switch (idGenero) {
      case 1:
        return 'Masculino';
      case 2:
        return 'Feminino';
      default:
        return 'Desconhecido';
    }
  }
}