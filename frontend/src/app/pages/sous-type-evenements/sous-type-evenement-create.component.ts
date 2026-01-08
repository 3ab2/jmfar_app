import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SousTypeEvenementService } from '../../services/sous-type-evenement.service';
import { TypeEvenementService } from '../../services/type-evenement.service';
import { SousTypeEvenement, TypeEvenement, CreateSousTypeEvenementRequest } from '../../models';

@Component({
  selector: 'app-sous-type-evenement-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sous-type-evenement-create.component.html',
  styles: [`
    .container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .loading {
      text-align: center;
      padding: 20px;
      font-style: italic;
    }
    
    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error {
      background-color: #f8d7da;
      color: #721c24;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    
    .error-icon {
      font-size: 20px;
      margin-bottom: 5px;
    }
    
    .error-content {
      font-weight: 500;
    }
    
    .form {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #333;
    }
    
    .form-group input,
    .form-group select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }
    
    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }
    
    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 30px;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 10px;
      }
      
      .header {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
      }
      
      .form {
        padding: 15px;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class SousTypeEvenementCreateComponent implements OnInit {
  formData: CreateSousTypeEvenementRequest = {
    label: '',
    type_evenement_id: 0
  };
  typeEvenements: TypeEvenement[] = [];
  isLoading = true;
  saving = false;
  error: string | null = null;

  constructor(
    private sousTypeEvenementService: SousTypeEvenementService,
    private typeEvenementService: TypeEvenementService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTypeEvenements();
  }

  loadTypeEvenements(): void {
    console.log('🚀 Début du chargement des types d\'événements pour création...');
    this.isLoading = true;
    this.error = null;
    
    this.typeEvenementService.getAll().subscribe({
      next: (data) => {
        console.log('📥 Types d\'événements reçus:', data);
        this.typeEvenements = Array.isArray(data) ? data : [];
        console.log('✅ Types d\'événements chargés avec succès!');
        console.log('🏷️ Nombre de types disponibles:', this.typeEvenements.length);
        
        // Forcer isLoading à false IMMÉDIATEMENT
        this.isLoading = false;
        
        // Forcer la détection de changement Angular
        this.cdr.detectChanges();
        
        console.log('✅ Formulaire prêt');
        console.log('🔄 Loading status FORCÉ à false:', this.isLoading);
        console.log('🔍 Template devrait maintenant afficher le formulaire');
        
        if (this.typeEvenements.length === 0) {
          console.log('⚠️ Aucun type d\'événement disponible pour la création');
        } else {
          console.log('🎉 Types d\'événements disponibles pour la création!');
          console.log('🔍 Premier type disponible:', this.typeEvenements[0]);
        }
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des types d\'événements:', err);
        this.error = 'Erreur lors du chargement des types d\'événements: ' + err.message;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (!this.formData.label.trim()) {
      console.log('⚠️ Formulaire invalide: label vide');
      this.error = 'Le label est obligatoire';
      return;
    }

    if (!this.formData.type_evenement_id) {
      console.log('⚠️ Formulaire invalide: type d\'événement non sélectionné');
      this.error = 'Le type d\'événement est obligatoire';
      return;
    }

    console.log('🚀 Début de la création du sous-type d\'événement...');
    console.log('📝 Données du formulaire:', this.formData);
    
    // Convertir type_evenement_id en nombre pour éviter l'erreur 500
    const createData = {
      ...this.formData,
      type_evenement_id: +this.formData.type_evenement_id
    };
    
    console.log('📝 Données converties pour l\'API:', createData);
    console.log('🔗 URL de l\'API:', 'http://127.0.0.1:8000/api/sous-types-evenement');
    console.log('📋 Type des données:', typeof createData.type_evenement_id);
    
    this.saving = true;
    this.error = null;

    this.sousTypeEvenementService.create(createData).subscribe({
      next: (response) => {
        console.log('✅ Sous-type d\'événement créé avec succès:', response);
        this.saving = false;
        this.router.navigate(['/sous-type-evenements']);
      },
      error: (err) => {
        console.error('❌ Erreur complète lors de la création:', err);
        console.error('📝 Status:', err.status);
        console.error('📝 StatusText:', err.statusText);
        console.error('📝 URL:', err.url);
        console.error('📝 Error body:', err.error);
        console.error('📝 Headers:', err.headers);
        
        // Si c'est une erreur 500, essayer d\'extraire plus de détails
        if (err.status === 500 && err.error) {
          console.error('🔍 Détails de l\'erreur 500:');
          if (typeof err.error === 'string') {
            console.error('Message:', err.error);
          } else if (err.error.message) {
            console.error('Message backend:', err.error.message);
          }
          if (err.error.exception) {
            console.error('Exception:', err.error.exception);
          }
          if (err.error.trace) {
            console.error('Trace disponible (premières lignes):', err.error.trace.slice(0, 3));
          }
        }
        
        this.error = 'Erreur lors de la création du sous-type d\'événement: ' + err.message;
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/sous-type-evenements']);
  }
}
