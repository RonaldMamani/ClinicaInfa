import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { EstatisticasService } from '../../../controllers/estatisticas/estatisticas.service';

@Component({
  selector: 'app-estatisticas-receita',
  imports: [CommonModule],
  providers: [EstatisticasService],
  standalone: true,
  templateUrl: './estatisticas-receita.component.html',
  styleUrl: './estatisticas-receita.component.css'
})
export class EstatisticasReceitaComponent implements OnInit {
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
    this.estatisticasService.getReceitaMensal().subscribe({
      next: (response) => {
        const dados = response.dados;
        
        const labels = dados.map(item => item.mes);
        const receita = dados.map(item => item.total_receita);

        this.isLoading = false;
        setTimeout(() => {
          this.criarGrafico(labels, receita);
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
      const chartData: ChartData<'line'> = {
        labels: labels,
        datasets: [{
          label: 'Receita Mensal (R$)',
          data: data,
          borderColor: '#4CAF50', // Verde
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          fill: true,
          tension: 0.3
        }]
      };

      const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Receita Mensal do Consultório'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Valor (R$)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Mês/Ano'
            }
          }
        }
      };

      this.chartInstance = new Chart(this.chartCanvas.nativeElement, {
        type: 'line',
        data: chartData,
        options: chartOptions,
      });
    }
  }
}