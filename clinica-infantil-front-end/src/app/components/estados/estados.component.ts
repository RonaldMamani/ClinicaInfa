import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

// Importa Estado e EstadosService de estados.service.ts
import { EstadosService, Estado } from '../../controllers/estados/estados.service'; 
// AGORA IMPORTA CIDADE DO NOVO LOCAL: cidades.service.ts
import { CidadesService, Cidade } from '../../controllers/cidades/cidades.service'; 

@Component({
  selector: 'app-estados',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './estados.component.html',
  styleUrls: ['./estados.component.css']
})
export class EstadosComponent implements OnInit {
  estados: Estado[] = [];
  isLoadingEstados: boolean = true; 
  errorEstados: string | null = null; 

  cidades: Cidade[] = [];
  isLoadingCidades: boolean = false; 
  errorCidades: string | null = null; 
  estadoSelecionadoId: number | null = null; 

  constructor(
    private estadosService: EstadosService,
    private cidadesService: CidadesService 
  ) { }

  ngOnInit(): void {
    this.carregarEstados();
  }

  private carregarEstados(): void {
    this.isLoadingEstados = true;
    this.errorEstados = null;

    this.estadosService.getEstados().subscribe({
      next: (data: Estado[]) => {
        this.estados = data;
        this.isLoadingEstados = false;
      },
      error: (err) => {
        console.error('Erro ao buscar estados:', err);
        this.errorEstados = 'Não foi possível carregar a lista de estados. Tente novamente mais tarde.';
        this.isLoadingEstados = false;
      }
    });
  }

  onEstadoSelecionado(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const id = Number(target.value);
    
    if (id === 0 || isNaN(id)) {
      this.estadoSelecionadoId = null;
      this.cidades = [];
      this.errorCidades = null;
      this.isLoadingCidades = false;
      return;
    }

    this.estadoSelecionadoId = id;
    this.carregarCidadesPorEstado(id);
  }

  private carregarCidadesPorEstado(idEstado: number): void {
    this.isLoadingCidades = true;
    this.errorCidades = null;
    this.cidades = []; 

    this.cidadesService.getCidadesPorEstado(idEstado).subscribe({
      next: (data: Cidade[]) => {
        this.cidades = data;
        this.isLoadingCidades = false;
      },
      error: (err) => {
        console.error(`Erro ao buscar cidades para o estado ${idEstado}:`, err);
        this.errorCidades = 'Não foi possível carregar as cidades para este estado.';
        this.isLoadingCidades = false;
      }
    });
  }
}