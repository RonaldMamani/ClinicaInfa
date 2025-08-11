import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { EstatisticasService } from '../../../controllers/estatisticas/estatisticas.service';

@Component({
  selector: 'app-estatisticas-clientes',
  imports: [CommonModule],
  providers: [EstatisticasService],
  standalone: true,
  templateUrl: './estatisticas-clientes.component.html',
  styleUrl: './estatisticas-clientes.component.css'
})
export class EstatisticasClientesComponent implements OnInit {
  isLoading = true;

  public chartInstance: Chart | undefined;
  @ViewChild('myChart') private chartCanvas: ElementRef | undefined;

  constructor(private estatisticasService: EstatisticasService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.estatisticasService.getClientesPorFuncao().subscribe({
      next: (response) => {
        const dados = response.dados;
        
        const labels = ['Pacientes', 'Responsáveis'];
        const contagens = [dados.total_pacientes, dados.total_responsaveis];

        this.isLoading = false;
        setTimeout(() => {
          this.criarGrafico(labels, contagens);
        }, 0);
      },
      error: (err) => {
        console.error('Erro ao carregar dados:', err);
        this.isLoading = false;
      }
    });
  }

  criarGrafico(labels: string[], data: number[]): void {
    if (this.chartCanvas) {
      const chartData: ChartData<'doughnut', number[], string> = {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#42A5F5', '#FFCA28'], // Azul e Amarelo
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
            text: 'Distribuição de Clientes (Pacientes e Responsáveis)'
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