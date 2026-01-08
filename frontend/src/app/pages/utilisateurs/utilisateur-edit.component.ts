import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Utilisateur, UpdateUtilisateurRequest } from '../../models';

@Component({
  selector: 'app-utilisateur-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './utilisateur-edit.component.html',
  styleUrls: ['./utilisateur-edit.component.css']
})
export class UtilisateurEditComponent implements OnInit {
  utilisateurForm: FormGroup;
  isLoading = true;
  saving = false;
  error: string | null = null;
  submitted = false;
  utilisateurId: number | null = null;
  currentUtilisateur: Utilisateur | null = null;

  constructor(
    private fb: FormBuilder,
    private utilisateurService: UtilisateurService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.utilisateurForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      mot_de_passe: ['', [Validators.minLength(6)]],
      role: ['user', [Validators.required]],
      avatar: [''],
      unite_id: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.utilisateurId = parseInt(id, 10);
      this.loadData(this.utilisateurId);
    } else {
      this.error = 'ID d\'utilisateur invalide';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  loadData(id: number): void {
    console.log('🚀 Début du chargement des données pour édition utilisateur ID:', id);
    this.isLoading = true;
    this.error = null;

    this.utilisateurService.getById(id).subscribe({
      next: (utilisateur) => {
        console.log('📥 Données de l\'utilisateur reçues:', utilisateur);
        
        // Assigner l'utilisateur
        this.currentUtilisateur = utilisateur;
        
        // Préremplir le formulaire
        this.utilisateurForm.patchValue({
          nom: utilisateur.nom,
          email: utilisateur.email,
          role: utilisateur.role,
          avatar: utilisateur.avatar || '',
          unite_id: utilisateur.unite_id
        });
        
        // Forcer loading à false IMMÉDIATEMENT
        this.isLoading = false;
        
        // Forcer la détection de changement Angular
        this.cdr.detectChanges();
        
        console.log('✅ Données d\'édition utilisateur chargées avec succès!');
        console.log('👤 Utilisateur:', this.currentUtilisateur?.nom);
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

    if (this.utilisateurForm.invalid || !this.utilisateurId) {
      console.log('⚠️ Formulaire invalide ou ID manquant');
      return;
    }

    console.log('🚀 Début de la modification de l\'utilisateur...');
    this.saving = true;
    const utilisateurData: UpdateUtilisateurRequest = this.utilisateurForm.value;

    this.utilisateurService.update(this.utilisateurId, utilisateurData).subscribe({
      next: () => {
        console.log('✅ Utilisateur modifié avec succès');
        this.saving = false;
        this.router.navigate(['/utilisateurs']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la modification de l\'utilisateur:', err);
        this.error = 'Erreur lors de la modification de l\'utilisateur: ' + err.message;
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  get f() {
    return this.utilisateurForm.controls;
  }
}
