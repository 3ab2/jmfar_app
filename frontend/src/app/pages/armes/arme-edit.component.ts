import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ArmeService, UniteService } from '../../services';
import { Arme, UpdateArmeRequest, Unite } from '../../models';

@Component({
  selector: 'app-arme-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './arme-edit.component.html',
  styleUrl: './arme-edit.component.css'
})
export class ArmeEditComponent implements OnInit {
  armeForm: FormGroup;
  armeId: number | null = null;
  currentArme: Arme | null = null;
  unites: Unite[] = [];
  isLoading = true;
  saving = false;
  error: string | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private armeService: ArmeService,
    private uniteService: UniteService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.armeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.maxLength(1000)]
    });
  }

  ngOnInit(): void {
    this.armeId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.armeId) {
      this.loadData(this.armeId);
    } else {
      this.error = 'ID non valide';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  loadData(id: number): void {
    console.log('🚀 Début du chargement des données pour édition arme ID:', id);
    this.isLoading = true;
    this.error = null;

    // Load arme data (unites will be added later when API is available)
    this.armeService.getById(id).subscribe({
      next: (arme) => {
        console.log('📥 Données de l\'arme reçues:', arme);
        
        // Assigner l'arme
        this.currentArme = arme;
        
        // Préremplir le formulaire
        this.armeForm.patchValue({
          nom: arme.nom,
          description: arme.description
        });
        
        // Initialiser les unités comme tableau vide (API pas encore disponible)
        this.unites = [];
        
        // Forcer loading à false IMMÉDIATEMENT
        this.isLoading = false;
        
        // Forcer la détection de changement Angular
        this.cdr.detectChanges();
        
        console.log('✅ Données d\'édition armes chargées avec succès!');
        console.log('🔫 Arme:', this.currentArme?.nom);
        console.log('📈 Nombre d\'unités:', this.unites.length);
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

    if (this.armeForm.invalid || !this.armeId) {
      console.log('⚠️ Formulaire invalide ou ID manquant');
      return;
    }

    console.log('🚀 Début de la modification de l\'arme...');
    this.saving = true;
    const armeData: UpdateArmeRequest = this.armeForm.value;

    this.armeService.update(this.armeId, armeData).subscribe({
      next: () => {
        console.log('✅ Arme modifiée avec succès');
        this.saving = false;
        this.router.navigate(['/armes']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la modification de l\'arme:', err);
        this.error = 'Erreur lors de la modification de l\'arme: ' + err.message;
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}
