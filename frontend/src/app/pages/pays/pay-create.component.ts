import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayService } from '../../services/pay.service';
import { CreatePayRequest } from '../../models';

@Component({
  selector: 'app-pay-create',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './pay-create.component.html',
  styleUrls: ['./pay-create.component.css']
})
export class PayCreateComponent implements OnInit {
  payForm: FormGroup;
  isLoading = true;
  saving = false;
  error: string | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private payService: PayService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.payForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      nom: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    console.log('🚀 Initialisation du formulaire de création de pays...');
    this.isLoading = true;
    
    // Le formulaire est prêt immédiatement pour les pays (pas de données de référence nécessaires)
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

    if (this.payForm.invalid) {
      console.log('⚠️ Formulaire invalide');
      return;
    }

    console.log('🚀 Début de la création du pays...');
    this.saving = true;
    const payData: CreatePayRequest = this.payForm.value;

    this.payService.create(payData).subscribe({
      next: () => {
        console.log('✅ Pays créé avec succès');
        this.saving = false;
        this.router.navigate(['/pays']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la création du pays:', err);
        this.error = 'Erreur lors de la création du pays: ' + err.message;
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  get f() {
    return this.payForm.controls;
  }
}
