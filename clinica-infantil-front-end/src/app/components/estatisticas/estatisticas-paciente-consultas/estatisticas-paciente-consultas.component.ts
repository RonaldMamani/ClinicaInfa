import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { EstatisticasService } from '../../../controllers/estatisticas/estatisticas.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-estatisticas-paciente-consultas',
  imports: [CommonModule, HttpClientModule],
  providers: [EstatisticasService],
  standalone: true,
  templateUrl: './estatisticas-paciente-consultas.component.html',
  styleUrl: './estatisticas-paciente-consultas.component.css'
})
export class EstatisticasPacienteConsultasComponent implements OnInit {
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
    this.estatisticasService.getConsultasEAtividadeDePacienteMensal().subscribe({
      next: (response) => {
        const dados = response.dados;
        
        const labels = dados.map(item => item.mes);
        const consultas = dados.map(item => item.total_consultas);
        const pacientes = dados.map(item => item.total_pacientes_unicos);

        this.isLoading = false;
        setTimeout(() => {
          this.criarGrafico(labels, consultas, pacientes);
        }, 0);
      },
      error: (err) => {
        console.error('Erro ao carregar dados:', err);
        this.isLoading = false;
      }
    });
  }

  criarGrafico(labels: string[], consultas: number[], pacientes: number[]): void {
    if (this.chartCanvas) {
      const chartData: ChartData<'line'> = {
        labels: labels,
        datasets: [
            {
              label: 'Total de Consultas',
              data: consultas,
              borderColor: '#0d6efd', // Azul
              backgroundColor: 'rgba(13, 110, 253, 0.2)',
              fill: false,
              tension: 0.3
            },
            {
              label: 'Pacientes Únicos',
              data: pacientes,
              borderColor: '#fd7e14', // Laranja
              backgroundColor: 'rgba(253, 126, 20, 0.2)',
              fill: false,
              tension: 0.3
            }
        ]
      };

      const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Consultas vs Pacientes Únicos (Mensal)'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quantidade'
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