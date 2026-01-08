import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SousTypeEvenementService } from '../../services/sous-type-evenement.service';
import { TypeEvenementService } from '../../services/type-evenement.service';
import { SousTypeEvenement, TypeEvenement, UpdateSousTypeEvenementRequest } from '../../models';

@Component({
  selector: 'app-sous-type-evenement-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sous-type-evenement-edit.component.html',
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
    
    .form-info {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    
    .form-info p {
      margin: 5px 0;
      color: #666;
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
export class SousTypeEvenementEditComponent implements OnInit {
  sousTypeEvenement: SousTypeEvenement | null = null;
  formData: UpdateSousTypeEvenementRequest = {
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadData(+id);
    } else {
      this.error = 'ID de sous-type d\'événement invalide';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  loadData(id: number): void {
    console.log('🚀 Début du chargement des données pour édition sous-type d\'événement ID:', id);
    this.isLoading = true;
    this.error = null;

    // Load both sous-type and types in parallel using forkJoin
    forkJoin({
      sousType: this.sousTypeEvenementService.getById(id),
      types: this.typeEvenementService.getAll()
    }).subscribe({
      next: (results) => {
        console.log('📥 Données reçues pour édition:', results);
        
        // Assigner le sous-type d'événement
        this.sousTypeEvenement = results.sousType;
        
        // Préremplir le formulaire
        this.formData.label = results.sousType.label;
        this.formData.type_evenement_id = results.sousType.type_evenement_id;
        
        // Assigner les types d'événements
        this.typeEvenements = Array.isArray(results.types) ? results.types : [];
        
        // Forcer isLoading à false IMMÉDIATEMENT
        this.isLoading = false;
        
        // Forcer la détection de changement Angular
        this.cdr.detectChanges();
        
        console.log('✅ Sous-type d\'événement chargé avec succès!');
        console.log('📋 Sous-type:', this.sousTypeEvenement?.label);
        console.log('🏷️ Types d\'événements disponibles:', this.typeEvenements.length);
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
    if (!this.sousTypeEvenement || !this.formData.label?.trim()) {
      console.log('⚠️ Formulaire invalide: sous-type ou label manquant');
      this.error = 'Le label est obligatoire';
      return;
    }

    if (!this.formData.type_evenement_id) {
      console.log('⚠️ Formulaire invalide: type d\'événement non sélectionné');
      this.error = 'Le type d\'événement est obligatoire';
      return;
    }

    console.log('🚀 Début de la modification du sous-type d\'événement...');
    console.log('📝 Données du formulaire:', this.formData);
    
    // Convertir type_evenement_id en nombre pour éviter l'erreur 500
    const updateData = {
      ...this.formData,
      type_evenement_id: +this.formData.type_evenement_id
    };
    
    console.log('📝 Données converties pour l\'API:', updateData);
    
    this.saving = true;
    this.error = null;

    this.sousTypeEvenementService.update(this.sousTypeEvenement.id, updateData).subscribe({
      next: () => {
        console.log('✅ Sous-type d\'événement modifié avec succès');
        this.saving = false;
        this.router.navigate(['/sous-type-evenements']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la modification du sous-type d\'événement:', err);
        this.error = 'Erreur lors de la modification du sous-type d\'événement: ' + err.message;
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/sous-type-evenements']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}
