import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-editar-responsavel',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './editar-responsavel.component.html',
  styleUrl: './editar-responsavel.component.css'
})
export class EditarResponsavelComponent {
  
}
