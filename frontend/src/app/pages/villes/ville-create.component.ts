import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VilleService, PayService } from '../../services';
import { CreateVilleRequest, Pay } from '../../models';

@Component({
  selector: 'app-ville-create',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './ville-create.component.html',
  styleUrls: ['./ville-create.component.css']
})
export class VilleCreateComponent implements OnInit {
  villeForm: FormGroup;
  isLoading = true;
  saving = false;
  error: string | null = null;
  submitted = false;
  pays: Pay[] = [];

  constructor(
    private fb: FormBuilder,
    private villeService: VilleService,
    private payService: PayService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.villeForm = this.fb.group({
      label: ['', [Validators.required, Validators.maxLength(255)]],
      pays_id: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    console.log('🚀 Initialisation du formulaire de création de ville...');
    this.isLoading = true;
    this.loadPays();
  }

  loadPays(): void {
    console.log('📥 Chargement des pays pour le formulaire...');
    this.payService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Pays reçus:', data);
        this.pays = Array.isArray(data) ? data : [];
        console.log('📈 Nombre de pays disponibles:', this.pays.length);
        
        // Forcer isLoading à false IMMÉDIATEMENT
        this.isLoading = false;
        
        // Forcer la détection de changement Angular
        this.cdr.detectChanges();
        
        console.log('🔄 Loading status FORCÉ à false:', this.isLoading);
        console.log('🔍 Template devrait maintenant afficher le formulaire');
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des pays:', err);
        this.error = 'Erreur lors du chargement des pays: ' + err.message;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = null;

    if (this.villeForm.invalid) {
      console.log('⚠️ Formulaire invalide');
      return;
    }

    console.log('🚀 Début de la création de la ville...');
    this.saving = true;
    const villeData: CreateVilleRequest = this.villeForm.value;

    this.villeService.create(villeData).subscribe({
      next: () => {
        console.log('✅ Ville créée avec succès');
        this.saving = false;
        this.router.navigate(['/villes']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la création de la ville:', err);
        this.error = 'Erreur lors de la création de la ville: ' + err.message;
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  get f() {
    return this.villeForm.controls;
  }
}
