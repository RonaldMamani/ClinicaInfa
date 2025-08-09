import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { EstatisticasService } from '../../../controllers/estatisticas/estatisticas.service';

@Component({
  selector: 'app-estatisticas-pacientes',
  imports: [CommonModule],
  providers: [EstatisticasService],
  standalone: true,
  templateUrl: './estatisticas-pacientes.component.html',
  styleUrl: './estatisticas-pacientes.component.css'
})
export class EstatisticasPacientesComponent implements OnInit {
  isLoading = true;

  public chartInstance: Chart | undefined;
  @ViewChild('myChart') private chartCanvas: ElementRef | undefined;

  constructor(
    private consultasService: EstatisticasService) {
    Chart.register(...registerables); 
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.consultasService.getPacientesPorCidade().subscribe({
      next: (response) => {
        const dados = response.dados;
        
        const labels = dados.map(item => item.nome_cidade);
        const contagens = dados.map(item => item.total_pacientes);

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
          label: 'Número de Pacientes',
          data: data,
          backgroundColor: '#3366cc',
          borderColor: '#3366cc',
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
            text: 'Distribuição de Pacientes por Cidade'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de Pacientes'
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