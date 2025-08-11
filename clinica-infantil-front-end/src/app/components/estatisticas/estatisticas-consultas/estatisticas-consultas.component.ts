import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { ConsultasService } from '../../../controllers/consultas/consultas.service';

@Component({
  selector: 'app-estatisticas-consultas',
  imports: [CommonModule],
  providers: [ConsultasService],
  standalone: true,
  templateUrl: './estatisticas-consultas.component.html',
  styleUrl: './estatisticas-consultas.component.css'
})
export class EstatisticasConsultasComponent implements OnInit {
  isLoading = true;

  quantidadeTotal: number = 0;
  quantidadeAgendadas: number = 0;
  quantidadeCanceladas: number = 0;
  quantidadeFinalizadas: number = 0;

  public chartInstance: Chart | undefined;
  @ViewChild('myChart') private chartCanvas: ElementRef | undefined;

  constructor(private estatisticasService: ConsultasService) {
    Chart.register(...registerables); 
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    // Apenas uma requisição agora
    this.estatisticasService.getTodasEstatisticas().subscribe({
      next: (response) => {
        const dados = response.dados; // Acessa o objeto 'dados' da resposta
        this.quantidadeTotal = dados.total;
        this.quantidadeAgendadas = dados.agendadas;
        this.quantidadeCanceladas = dados.canceladas;
        this.quantidadeFinalizadas = dados.finalizadas;
        
        this.isLoading = false;
        setTimeout(() => {
          this.criarGrafico();
        }, 0);
      },
      error: (err) => {
        console.error('Erro ao carregar dados:', err);
        this.isLoading = false;
      }
    });
  }

  criarGrafico(): void {
    if (this.chartCanvas) {
      const chartData: ChartData<'doughnut', number[], string> = {
        labels: ['Agendadas', 'Finalizadas', 'Canceladas'],
        datasets: [{
          data: [this.quantidadeAgendadas, this.quantidadeFinalizadas, this.quantidadeCanceladas],
          backgroundColor: ['#3366cc', '#28a745', '#dc3545']
        }]
      };

      const chartOptions: ChartOptions<'doughnut'> = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Estatísticas de Consultas por Status'
          }
        }
      };

      this.chartInstance = new Chart(this.chartCanvas.nativeElement, {
        type: 'doughnut',
        data: chartData,
        options: chartOptions,
      });
    }
  }
}
