import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProntuariosService } from '../../../controllers/prontuarios/prontuarios.service';

@Component({
  selector: 'app-detalhe-prontuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalhe-prontuario.component.html',
  styleUrl: './detalhe-prontuario.component.css'
})
export class DetalheProntuarioComponent {
  prontuario: any = null;
  isLoading = true;
  error: string | null = null;
  prontuarioId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private prontuarioService: ProntuariosService
  ) {}

  ngOnInit(): void {
    this.prontuarioId = +this.route.snapshot.paramMap.get('id')!;
    if (this.prontuarioId) {
      this.carregarDetalhesDoProntuario(this.prontuarioId);
    } else {
      this.error = 'ID do prontuário não fornecido na URL.';
      this.isLoading = false;
    }
  }

  carregarDetalhesDoProntuario(id: number): void {
    this.isLoading = true;
    this.prontuarioService.getProntuarioDetalhes(id).subscribe({
      next: (response) => {
        this.prontuario = response.prontuario;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar os detalhes do prontuário.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
  
  // Função para calcular a idade do paciente
  calcularIdade(dataNascimento: string): number | null {
    if (!dataNascimento) {
      return null;
    }
    const dataNasc = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const mes = hoje.getMonth() - dataNasc.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNasc.getDate())) {
      idade--;
    }
    return idade;
  }
  
  // Função para retornar o nome do gênero com base no ID
  getGenero(idGenero: number): string {
    switch (idGenero) {
      case 1: return 'Masculino';
      case 2: return 'Feminino';
      default: return 'Desconhecido';
    }
  }
}
