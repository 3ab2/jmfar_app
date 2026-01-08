import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { VilleService, PayService } from '../../services';
import { Ville, UpdateVilleRequest, Pay } from '../../models';

@Component({
  selector: 'app-ville-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './ville-edit.component.html',
  styleUrls: ['./ville-edit.component.css']
})
export class VilleEditComponent implements OnInit {
  villeForm: FormGroup;
  isLoading = true;
  saving = false;
  error: string | null = null;
  submitted = false;
  villeId: number | null = null;
  currentVille: Ville | null = null;
  pays: Pay[] = [];

  constructor(
    private fb: FormBuilder,
    private villeService: VilleService,
    private payService: PayService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.villeForm = this.fb.group({
      label: ['', [Validators.required, Validators.maxLength(255)]],
      pays_id: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.villeId = parseInt(id, 10);
      this.loadData(this.villeId);
    } else {
      this.error = 'ID de ville invalide';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  loadData(id: number): void {
    console.log('🚀 Début du chargement des données pour édition ville ID:', id);
    this.isLoading = true;
    this.error = null;

    // Load all data in parallel using forkJoin
    forkJoin({
      ville: this.villeService.getById(id),
      pays: this.payService.getAll()
    }).subscribe({
      next: (results) => {
        console.log('📥 Toutes les données reçues pour édition ville:', results);
        
        // Assigner la ville
        this.currentVille = results.ville;
        
        // Préremplir le formulaire
        this.villeForm.patchValue({
          label: results.ville.label,
          pays_id: results.ville.pays_id
        });
        
        // Assigner les données de référence
        this.pays = Array.isArray(results.pays) ? results.pays : [];
        
        // Forcer loading à false IMMÉDIATEMENT
        this.isLoading = false;
        
        // Forcer la détection de changement Angular
        this.cdr.detectChanges();
        
        console.log('✅ Données d\'édition ville chargées avec succès!');
        console.log('🏙️ Ville:', this.currentVille?.label);
        console.log('🌍 Nombre de pays:', this.pays.length);
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

    if (this.villeForm.invalid || !this.villeId) {
      console.log('⚠️ Formulaire invalide ou ID manquant');
      return;
    }

    console.log('🚀 Début de la modification de la ville...');
    this.saving = true;
    const villeData: UpdateVilleRequest = this.villeForm.value;

    this.villeService.update(this.villeId, villeData).subscribe({
      next: () => {
        console.log('✅ Ville modifiée avec succès');
        this.saving = false;
        this.router.navigate(['/villes']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la modification de la ville:', err);
        this.error = 'Erreur lors de la modification de la ville: ' + err.message;
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  get f() {
    return this.villeForm.controls;
  }
}
