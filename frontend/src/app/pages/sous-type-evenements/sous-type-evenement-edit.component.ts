import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SousTypeEvenementService } from '../../services/sous-type-evenement.service';
import { TypeEvenementService } from '../../services/type-evenement.service';
import { SousTypeEvenement, TypeEvenement, UpdateSousTypeEvenementRequest } from '../../models';

@Component({
  selector: 'app-sous-type-evenement-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Modifier un Sous-Type d'Événement</h2>
        <button class="btn btn-secondary" (click)="cancel()">Annuler</button>
      </div>
      
      <div class="loading" *ngIf="loading">Chargement...</div>
      
      <div class="error" *ngIf="error">{{ error }}</div>
      
      <form class="form" (ngSubmit)="onSubmit()" *ngIf="!loading && sousTypeEvenement">
        <div class="form-group">
          <label for="label">Label *</label>
          <input 
            type="text" 
            id="label" 
            name="label" 
            [(ngModel)]="formData.label" 
            required
            placeholder="Entrez le label du sous-type d'événement"
          />
        </div>
        
        <div class="form-group">
          <label for="type_evenement_id">Type d'Événement *</label>
          <select 
            id="type_evenement_id" 
            name="type_evenement_id" 
            [(ngModel)]="formData.type_evenement_id" 
            required
          >
            <option value="">Sélectionnez un type d'événement</option>
            <option 
              *ngFor="let type of typeEvenements" 
              [value]="type.id"
              [selected]="type.id === sousTypeEvenement.type_evenement_id"
            >
              {{ type.label }}
            </option>
          </select>
        </div>
        
        <div class="form-info">
          <p><strong>ID:</strong> {{ sousTypeEvenement.id }}</p>
          <p><strong>Créé le:</strong> {{ formatDate(sousTypeEvenement.created_at) }}</p>
          <p><strong>Modifié le:</strong> {{ formatDate(sousTypeEvenement.updated_at) }}</p>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="saving">
            {{ saving ? 'Modification...' : 'Modifier' }}
          </button>
          <button type="button" class="btn btn-secondary" (click)="cancel()">Annuler</button>
        </div>
      </form>
    </div>
  `,
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
  loading = false;
  saving = false;
  error: string | null = null;

  constructor(
    private sousTypeEvenementService: SousTypeEvenementService,
    private typeEvenementService: TypeEvenementService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadData(+id);
    } else {
      this.error = 'ID non valide';
    }
  }

  loadData(id: number): void {
    this.loading = true;
    this.error = null;

    // Load both sous-type and types in parallel
    this.sousTypeEvenementService.getById(id).subscribe({
      next: (sousType) => {
        this.sousTypeEvenement = sousType;
        this.formData.label = sousType.label;
        this.formData.type_evenement_id = sousType.type_evenement_id;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement: ' + err.message;
        this.loading = false;
      }
    });

    this.typeEvenementService.getAll().subscribe({
      next: (types) => {
        this.typeEvenements = types;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des types d\'événements:', err);
      }
    });
  }

  onSubmit(): void {
    if (!this.sousTypeEvenement || !this.formData.label?.trim()) {
      this.error = 'Le label est obligatoire';
      return;
    }

    if (!this.formData.type_evenement_id) {
      this.error = 'Le type d\'événement est obligatoire';
      return;
    }

    this.saving = true;
    this.error = null;

    this.sousTypeEvenementService.update(this.sousTypeEvenement.id, this.formData).subscribe({
      next: () => {
        this.router.navigate(['/sous-type-evenements']);
      },
      error: (err) => {
        this.error = 'Erreur lors de la modification: ' + err.message;
        this.saving = false;
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
