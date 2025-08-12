import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { EstatisticasService } from '../../../controllers/estatisticas/estatisticas.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-estatisticas-medicos',
  imports: [CommonModule, HttpClientModule],
  providers: [EstatisticasService],
  standalone: true,
  templateUrl: './estatisticas-medicos.component.html',
  styleUrl: './estatisticas-medicos.component.css'
})
export class EstatisticasMedicosComponent implements OnInit {
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
    this.estatisticasService.getConsultasPorMedicoPorMes().subscribe({
      next: (response) => {
        const dados = response.dados;
        
        this.isLoading = false;
        setTimeout(() => {
          this.criarGrafico(dados);
        }, 0);
      },
      error: (err) => {
        console.error('Erro ao carregar dados:', err);
        this.isLoading = false;
      }
    });
  }

  criarGrafico(dados: { nome: string, mes: string, total_consultas: number }[]): void {
    if (this.chartCanvas) {
      const medicos = [...new Set(dados.map(item => item.nome))];
      const meses = [...new Set(dados.map(item => item.mes))].sort();

      const datasets = medicos.map((medico, index) => {
        const cor = this.gerarCorAleatoria(index);
        const data = meses.map(mes => {
          const item = dados.find(d => d.nome === medico && d.mes === mes);
          return item ? item.total_consultas : 0;
        });

        return {
          label: medico,
          data: data,
          borderColor: cor,
          backgroundColor: cor,
          fill: false,
          tension: 0.3
        };
      });

      const chartData: ChartData<'line'> = {
        labels: meses,
        datasets: datasets,
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
            text: 'Consultas por Médico (Mensal)'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de Consultas'
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

  private gerarCorAleatoria(index: number): string {
    const cores = ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC', '#26A69A'];
    return cores[index % cores.length];
  }
}