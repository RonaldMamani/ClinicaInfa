import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { EstatisticasService } from '../../../controllers/estatisticas/estatisticas.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-estatisticas-especialidades',
  imports: [CommonModule, HttpClientModule],
  providers: [EstatisticasService],
  standalone: true,
  templateUrl: './estatisticas-especialidades.component.html',
  styleUrl: './estatisticas-especialidades.component.css'
})
export class EstatisticasEspecialidadesComponent implements OnInit {
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
    this.estatisticasService.getConsultasPorEspecialidade().subscribe({
      next: (response) => {
        const dados = response.dados;
        
        const labels = dados.map(item => item.especialidade);
        const contagens = dados.map(item => item.total_consultas);

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
          label: 'Número de Consultas',
          data: data,
          backgroundColor: '#ff9900',
          borderColor: '#ff9900',
          borderWidth: 1
        }]
      };

      const chartOptions: ChartOptions<'bar'> = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Consultas por Especialidade Médica'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Especialidade'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Número de Consultas'
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