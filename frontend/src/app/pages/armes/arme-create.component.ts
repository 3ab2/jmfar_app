import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ArmeService } from '../../services';
import { CreateArmeRequest } from '../../models';

@Component({
  selector: 'app-arme-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './arme-create.component.html',
  styleUrl: './arme-create.component.css'
})
export class ArmeCreateComponent implements OnInit {
  armeForm: FormGroup;
  isLoading = true;
  saving = false;
  error: string | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private armeService: ArmeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.armeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.maxLength(1000)]
    });
  }

  ngOnInit(): void {
    console.log('🚀 Initialisation du formulaire de création d\'arme...');
    this.isLoading = true;
    
    // Le formulaire est prêt immédiatement pour les armes (pas de données de référence nécessaires)
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
      console.log('✅ Formulaire de création prêt');
      console.log('🔄 Loading status FORCÉ à false:', this.isLoading);
      console.log('🔍 Template devrait maintenant afficher le formulaire');
    }, 100);
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = null;

    if (this.armeForm.invalid) {
      console.log('⚠️ Formulaire invalide');
      return;
    }

    console.log('🚀 Début de la création de l\'arme...');
    this.saving = true;
    const armeData: CreateArmeRequest = this.armeForm.value;

    this.armeService.create(armeData).subscribe({
      next: () => {
        console.log('✅ Arme créée avec succès');
        this.saving = false;
        this.router.navigate(['/armes']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la création de l\'arme:', err);
        this.error = 'Erreur lors de la création de l\'arme: ' + err.message;
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  get f() {
    return this.armeForm.controls;
  }

  cancel(): void {
    this.router.navigate(['/armes']);
  }
}
