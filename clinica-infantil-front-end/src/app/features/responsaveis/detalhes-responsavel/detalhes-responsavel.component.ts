import { Component } from '@angular/core';
import { ResponsaveisService } from '../../../controllers/responsaveis/responsaveis.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Responsavel } from '../../../core/models/responsavel.model';

@Component({
  selector: 'app-detalhes-responsavel',
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './detalhes-responsavel.component.html',
  styleUrl: './detalhes-responsavel.component.css'
})
export class DetalhesResponsavelComponent {
  responsavel: Responsavel | null = null;
  isLoading = true;
  error: string | null = null;
  responsavelId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private responsavelService: ResponsaveisService
  ) {}

  ngOnInit(): void {
    this.responsavelId = +this.route.snapshot.paramMap.get('id')!;
    if (this.responsavelId) {
      this.carregarDetalhesDoResponsavel(this.responsavelId);
    } else {
      this.error = 'ID do responsável não fornecido na URL.';
      this.isLoading = false;
    }
  }

  carregarDetalhesDoResponsavel(id: number): void {
    this.isLoading = true;
    this.responsavelService.getResponsavelDetalhes(id).subscribe({
      next: (response) => {
        this.responsavel = response.responsavel;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar os detalhes do responsável.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
