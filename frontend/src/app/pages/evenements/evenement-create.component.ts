import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EvenementService } from '../../services/evenement.service';
import { TypeEvenementService } from '../../services/type-evenement.service';
import { SousTypeEvenementService } from '../../services/sous-type-evenement.service';
import { PayService } from '../../services/pay.service';
import { VilleService } from '../../services/ville.service';
import { Evenement, TypeEvenement, SousTypeEvenement, Pay, Ville, CreateEvenementRequest } from '../../models';

@Component({
  selector: 'app-evenement-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Créer un Événement</h2>
        <button class="btn btn-secondary" (click)="cancel()">Annuler</button>
      </div>
      
      <div class="loading" *ngIf="loading">Chargement...</div>
      
      <div class="error" *ngIf="error">{{ error }}</div>
      
      <form class="form" (ngSubmit)="onSubmit()" *ngIf="!loading">
        <div class="form-row">
          <div class="form-group">
            <label for="reference">Référence *</label>
            <input 
              type="text" 
              id="reference" 
              name="reference" 
              [(ngModel)]="formData.reference" 
              required
              placeholder="Entrez la référence de l'événement"
            />
          </div>
          
          <div class="form-group">
            <label for="titre">Titre *</label>
            <input 
              type="text" 
              id="titre" 
              name="titre" 
              [(ngModel)]="formData.titre" 
              required
              placeholder="Entrez le titre de l'événement"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="date_evenement">Date de l'événement *</label>
            <input 
              type="datetime-local" 
              id="date_evenement" 
              name="date_evenement" 
              [(ngModel)]="formData.date_evenement" 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="type_evenement_id">Type d'Événement *</label>
            <select 
              id="type_evenement_id" 
              name="type_evenement_id" 
              [(ngModel)]="formData.type_evenement_id" 
              required
              (change)="onTypeChange()"
            >
              <option value="">Sélectionnez un type d'événement</option>
              <option 
                *ngFor="let type of typeEvenements" 
                [value]="type.id"
              >
                {{ type.label }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="sous_type_evenement_id">Sous-Type d'Événement</label>
            <select 
              id="sous_type_evenement_id" 
              name="sous_type_evenement_id" 
              [(ngModel)]="formData.sous_type_evenement_id"
            >
              <option value="">Sélectionnez un sous-type d'événement</option>
              <option 
                *ngFor="let sousType of filteredSousTypeEvenements" 
                [value]="sousType.id"
              >
                {{ sousType.label }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="pays_id">Pays *</label>
            <select 
              id="pays_id" 
              name="pays_id" 
              [(ngModel)]="formData.pays_id" 
              required
              (change)="onPayChange()"
            >
              <option value="">Sélectionnez un pays</option>
              <option 
                *ngFor="let pay of pays" 
                [value]="pay.id"
              >
                {{ pay.nom }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="ville_id">Ville *</label>
            <select 
              id="ville_id" 
              name="ville_id" 
              [(ngModel)]="formData.ville_id" 
              required
            >
              <option value="">Sélectionnez une ville</option>
              <option 
                *ngFor="let ville of filteredVilles" 
                [value]="ville.id"
              >
                {{ ville.label }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="utilisateur_id">Utilisateur *</label>
            <input 
              type="number" 
              id="utilisateur_id" 
              name="utilisateur_id" 
              [(ngModel)]="formData.utilisateur_id" 
              required
              placeholder="ID de l'utilisateur"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="adresse">Adresse</label>
          <input 
            type="text" 
            id="adresse" 
            name="adresse" 
            [(ngModel)]="formData.adresse" 
            placeholder="Entrez l'adresse de l'événement"
          />
        </div>
        
        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description" 
            name="description" 
            [(ngModel)]="formData.description" 
            rows="4"
            placeholder="Entrez la description de l'événement"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="saving">
            {{ saving ? 'Création...' : 'Créer' }}
          </button>
          <button type="button" class="btn btn-secondary" (click)="cancel()">Annuler</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 800px;
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
    
    .error {
      background-color: #f8d7da;
      color: #721c24;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    
    .form {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .form-group {
      flex: 1;
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #333;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
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
      
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class EvenementCreateComponent implements OnInit {
  formData: CreateEvenementRequest = {
    reference: '',
    date_evenement: '',
    titre: '',
    description: '',
    adresse: '',
    utilisateur_id: 0,
    type_evenement_id: 0,
    sous_type_evenement_id: undefined,
    pays_id: 0,
    ville_id: 0
  };
  
  typeEvenements: TypeEvenement[] = [];
  sousTypeEvenements: SousTypeEvenement[] = [];
  filteredSousTypeEvenements: SousTypeEvenement[] = [];
  pays: Pay[] = [];
  villes: Ville[] = [];
  filteredVilles: Ville[] = [];
  
  loading = false;
  saving = false;
  error: string | null = null;

  constructor(
    private evenementService: EvenementService,
    private typeEvenementService: TypeEvenementService,
    private sousTypeEvenementService: SousTypeEvenementService,
    private payService: PayService,
    private villeService: VilleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    // Load all reference data in parallel
    this.typeEvenementService.getAll().subscribe({
      next: (data) => {
        this.typeEvenements = data;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des types d\'événements: ' + err.message;
        this.loading = false;
      }
    });

    this.sousTypeEvenementService.getAll().subscribe({
      next: (data) => {
        this.sousTypeEvenements = data;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des sous-types d\'événements: ' + err.message;
        this.loading = false;
      }
    });

    this.payService.getAll().subscribe({
      next: (data) => {
        this.pays = data;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des pays: ' + err.message;
        this.loading = false;
      }
    });

    this.villeService.getAll().subscribe({
      next: (data) => {
        this.villes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des villes: ' + err.message;
        this.loading = false;
      }
    });
  }

  onTypeChange(): void {
    if (this.formData.type_evenement_id) {
      this.filteredSousTypeEvenements = this.sousTypeEvenements.filter(
        st => st.type_evenement_id === this.formData.type_evenement_id
      );
    } else {
      this.filteredSousTypeEvenements = [];
    }
    this.formData.sous_type_evenement_id = undefined;
  }

  onPayChange(): void {
    if (this.formData.pays_id) {
      this.filteredVilles = this.villes.filter(
        v => v.pays_id === this.formData.pays_id
      );
    } else {
      this.filteredVilles = [];
    }
    this.formData.ville_id = 0;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.saving = true;
    this.error = null;

    this.evenementService.create(this.formData).subscribe({
      next: () => {
        this.router.navigate(['/evenements']);
      },
      error: (err) => {
        this.error = 'Erreur lors de la création: ' + err.message;
        this.saving = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.formData.reference.trim()) {
      this.error = 'La référence est obligatoire';
      return false;
    }
    if (!this.formData.titre.trim()) {
      this.error = 'Le titre est obligatoire';
      return false;
    }
    if (!this.formData.date_evenement) {
      this.error = 'La date de l\'événement est obligatoire';
      return false;
    }
    if (!this.formData.type_evenement_id) {
      this.error = 'Le type d\'événement est obligatoire';
      return false;
    }
    if (!this.formData.pays_id) {
      this.error = 'Le pays est obligatoire';
      return false;
    }
    if (!this.formData.ville_id) {
      this.error = 'La ville est obligatoire';
      return false;
    }
    if (!this.formData.utilisateur_id) {
      this.error = 'L\'utilisateur est obligatoire';
      return false;
    }
    return true;
  }

  cancel(): void {
    this.router.navigate(['/evenements']);
  }
}
