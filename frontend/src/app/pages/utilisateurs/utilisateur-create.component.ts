import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilisateurService } from '../../services/utilisateur.service';
import { CreateUtilisateurRequest } from '../../models';

@Component({
  selector: 'app-utilisateur-create',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './utilisateur-create.component.html',
  styleUrls: ['./utilisateur-create.component.css']
})
export class UtilisateurCreateComponent implements OnInit {
  utilisateurForm: FormGroup;
  isLoading = true;
  saving = false;
  error: string | null = null;
  submitted = false;
  unites: any[] = [];

  constructor(
    private fb: FormBuilder,
    private utilisateurService: UtilisateurService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.utilisateurForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      mot_de_passe: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', [Validators.required]],
      avatar: [''],
      unite_id: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    console.log('🚀 Initialisation du formulaire de création d\'utilisateur...');
    this.isLoading = true;
    this.loadUnites();
  }

  loadUnites(): void {
    console.log('📥 Chargement des unités pour le formulaire...');
    // Simuler le chargement des unités (API pas encore disponible)
    setTimeout(() => {
      this.unites = [];
      console.log('✅ Unités chargées (vide pour le moment)');
      
      // Forcer isLoading à false IMMÉDIATEMENT
      this.isLoading = false;
      
      // Forcer la détection de changement Angular
      this.cdr.detectChanges();
      
      console.log('🔄 Loading status FORCÉ à false:', this.isLoading);
      console.log('🔍 Template devrait maintenant afficher le formulaire');
    }, 100);
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = null;

    if (this.utilisateurForm.invalid) {
      console.log('⚠️ Formulaire invalide');
      return;
    }

    console.log('🚀 Début de la création de l\'utilisateur...');
    this.saving = true;
    const utilisateurData: CreateUtilisateurRequest = this.utilisateurForm.value;

    this.utilisateurService.create(utilisateurData).subscribe({
      next: () => {
        console.log('✅ Utilisateur créé avec succès');
        this.saving = false;
        this.router.navigate(['/utilisateurs']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la création de l\'utilisateur:', err);
        this.error = 'Erreur lors de la création de l\'utilisateur: ' + err.message;
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  get f() {
    return this.utilisateurForm.controls;
  }
}
