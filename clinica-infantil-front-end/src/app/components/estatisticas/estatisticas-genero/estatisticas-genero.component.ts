import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { EstatisticasService } from '../../../controllers/estatisticas/estatisticas.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-estatisticas-genero',
  imports: [CommonModule, HttpClientModule],
  providers: [EstatisticasService],
  standalone: true,
  templateUrl: './estatisticas-genero.component.html',
  styleUrl: './estatisticas-genero.component.css'
})
export class EstatisticasGeneroComponent implements OnInit {
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
    this.estatisticasService.getPacientesPorGenero().subscribe({
      next: (response) => {
        const dados = response.dados;
        
        const labels = dados.map(item => item.genero);
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
      const chartData: ChartData<'pie', number[], string> = {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#ff6384','#36a2eb', '#ffcd56'],
        }]
      };

      const chartOptions: ChartOptions<'pie'> = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Distribuição de Pacientes por Gênero'
          }
        }
      };

      this.chartInstance = new Chart(this.chartCanvas.nativeElement, {
        type: 'pie',
        data: chartData,
        options: chartOptions,
      });
    }
  }
}