import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PayService, VilleService } from '../../services';
import { Pay, UpdatePayRequest } from '../../models';

@Component({
  selector: 'app-pay-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './pay-edit.component.html',
  styleUrls: ['./pay-edit.component.css']
})
export class PayEditComponent implements OnInit {
  payForm: FormGroup;
  isLoading = true;
  saving = false;
  error: string | null = null;
  submitted = false;
  payId: number | null = null;
  currentPay: Pay | null = null;
  villes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private payService: PayService,
    private villeService: VilleService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.payForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      nom: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.payId = parseInt(id, 10);
      this.loadData(this.payId);
    } else {
      this.error = 'ID de pays invalide';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  loadData(id: number): void {
    console.log('🚀 Début du chargement des données pour édition pays ID:', id);
    this.isLoading = true;
    this.error = null;

    // Load all data in parallel using forkJoin
    forkJoin({
      pay: this.payService.getById(id),
      villes: this.villeService.getAll()
    }).subscribe({
      next: (results) => {
        console.log('📥 Toutes les données reçues pour édition pays:', results);
        
        // Assigner le pays
        this.currentPay = results.pay;
        
        // Préremplir le formulaire
        this.payForm.patchValue({
          code: results.pay.code,
          nom: results.pay.nom
        });
        
        // Assigner les données de référence
        this.villes = Array.isArray(results.villes) ? results.villes : [];
        
        // Forcer loading à false IMMÉDIATEMENT
        this.isLoading = false;
        
        // Forcer la détection de changement Angular
        this.cdr.detectChanges();
        
        console.log('✅ Données d\'édition pays chargées avec succès!');
        console.log('🌍 Pays:', this.currentPay?.nom);
        console.log('🏙️ Nombre de villes:', this.villes.length);
        console.log('🔄 Loading status FORCÉ à false:', this.isLoading);
        console.log('🔍 Template devrait maintenant afficher le formulaire avec les données');
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des données:', err);
        this.error = 'Erreur lors du chargement des données: ' + err.message;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = null;

    if (this.payForm.invalid || !this.payId) {
      console.log('⚠️ Formulaire invalide ou ID manquant');
      return;
    }

    console.log('🚀 Début de la modification du pays...');
    this.saving = true;
    const payData: UpdatePayRequest = this.payForm.value;

    this.payService.update(this.payId, payData).subscribe({
      next: () => {
        console.log('✅ Pays modifié avec succès');
        this.saving = false;
        this.router.navigate(['/pays']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la modification du pays:', err);
        this.error = 'Erreur lors de la modification du pays: ' + err.message;
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  get f() {
    return this.payForm.controls;
  }
}
