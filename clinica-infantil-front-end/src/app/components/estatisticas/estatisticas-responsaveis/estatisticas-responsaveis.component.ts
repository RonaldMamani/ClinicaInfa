import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { EstatisticasService } from '../../../controllers/estatisticas/estatisticas.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-estatisticas-responsaveis',
  imports: [CommonModule, HttpClientModule],
  providers: [EstatisticasService],
  standalone: true,
  templateUrl: './estatisticas-responsaveis.component.html',
  styleUrl: './estatisticas-responsaveis.component.css'
})
export class EstatisticasResponsaveisComponent {
  isLoading = true;

  public chartInstance: Chart | undefined;
  @ViewChild('myChart') private chartCanvas: ElementRef | undefined;

  constructor(
    private estatisticasService: EstatisticasService) {
    Chart.register(...registerables); 
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.estatisticasService.getResponsaveisPorCidade().subscribe({
      next: (response) => {
        const dados = response.dados;
        
        const labels = dados.map(item => item.nome_cidade);
        const contagens = dados.map(item => item.total_responsaveis);

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
      const chartData: ChartData<'bar'> = {
        labels: labels,
        datasets: [{
          label: 'Número de Responsaveis',
          data: data,
          backgroundColor: '#198754',
          borderColor: '#198754',
          borderWidth: 1
        }]
      };

      const chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Distribuição de Responsaveis por Cidade'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de Responsaveis'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Cidade'
            }
          }
        }
      };

      this.chartInstance = new Chart(this.chartCanvas.nativeElement, {
        type: 'bar',
        data: chartData,
        options: chartOptions,
      });
    }
  }
}
