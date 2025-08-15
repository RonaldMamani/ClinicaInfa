import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Consulta } from '../../../core/models/consultas.model';
import { ConsultasService } from '../../../controllers/consultas/consultas.service';
import { HttpClientModule } from '@angular/common/http';
import { PaginatedApiResponse } from '../../../core/models/Paginate.model';
import { BotaoVoltarComponent } from "../../../components/botao-voltar/botao-voltar.component";

@Component({
  selector: 'app-listar-todas-consultas',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, HttpClientModule, BotaoVoltarComponent],
  templateUrl: './listar-todas-consultas.component.html',
  styleUrls: ['./listar-todas-consultas.component.css']
})
export class ListarTodasConsultasComponent implements OnInit {
  consultas: Consulta[] = [];
  pagination: PaginatedApiResponse<Consulta[]> | null = null;
  isLoading = true;
  error: string | null = null;
  successMessage: string | null = null;

  // Variáveis para paginação e contagem
  currentPage: number = 1;
  pageSize: number = 15;
  totalItems: number = 0;

  showCancelModal = false;
  consultaToCancelId: number | null = null;

  constructor(
    private consultasService: ConsultasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carrega a primeira página por padrão
    this.carregarConsultas();
  }

  get isSecretariaRoute(): boolean {
    return this.router.url.startsWith('/secretaria');
  }

  get isAdministradorRoute(): boolean {
    return this.router.url.startsWith('/administrador');
  }

  /**
   * Carrega a lista de consultas para uma página específica.
   */
  carregarConsultas(page: number = 1): void {
    this.isLoading = true;
    this.error = null;

    this.consultasService.getConsultasListar(page).subscribe({
      next: (response) => {
        // Armazena a lista de consultas e o objeto de paginação
        this.consultas = response.consultas.data || [];
        this.pagination = response.consultas;
        
        // Atualiza as variáveis de paginação com os dados da API
        if (this.pagination) {
          this.currentPage = this.pagination.current_page;
          this.pageSize = this.pagination.per_page;
          this.totalItems = this.pagination.total;
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar as consultas.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  /**
   * Método chamado quando um link de paginação é clicado.
   * Ele extrai o número da página da URL e chama o carregarConsultas.
   * @param url A URL completa do link de paginação.
   */
  onPageChange(url: string | null): void {
    if (url) {
      this.isLoading = true;
      const pageNumber = this.extractPageNumberFromUrl(url);
      if (pageNumber) {
        this.carregarConsultas(pageNumber);
      }
    }
  }

  /**
   * Extrai o número da página de uma URL de paginação.
   * @param url A URL contendo o parâmetro 'page'.
   * @returns O número da página ou null se não for encontrado.
   */
  private extractPageNumberFromUrl(url: string): number | null {
    const params = new URLSearchParams(new URL(url).search);
    const page = params.get('page');
    return page ? parseInt(page, 10) : null;
  }

  openCancelModal(id: number): void {
    this.consultaToCancelId = id;
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.consultaToCancelId = null;
  }

  confirmCancel(): void {
    if (this.consultaToCancelId) {
      this.isLoading = true;
      this.consultasService.cancelarConsulta(this.consultaToCancelId).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Consulta cancelada com sucesso!';
          this.closeCancelModal();
          this.carregarConsultas(this.currentPage); // Recarrega a página atual para manter a posição
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.error = 'Erro ao cancelar a consulta.';
          this.isLoading = false;
          this.closeCancelModal();
          console.error(err);
        }
      });
    }
  }

  cancelarConsulta(id: number): void {
    this.openCancelModal(id);
  }
}