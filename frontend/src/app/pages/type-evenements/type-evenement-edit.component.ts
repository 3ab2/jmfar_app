import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TypeEvenementService } from '../../services/type-evenement.service';
import { TypeEvenement, UpdateTypeEvenementRequest } from '../../models';

@Component({
  selector: 'app-type-evenement-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Modifier un Type d'Événement</h2>
        <button class="btn btn-secondary" (click)="cancel()">Annuler</button>
      </div>
      
      <div class="loading" *ngIf="loading">Chargement...</div>
      
      <div class="error" *ngIf="error">{{ error }}</div>
      
      <form class="form" (ngSubmit)="onSubmit()" *ngIf="!loading && typeEvenement">
        <div class="form-group">
          <label for="label">Label *</label>
          <input 
            type="text" 
            id="label" 
            name="label" 
            [(ngModel)]="formData.label" 
            required
            placeholder="Entrez le label du type d'événement"
          />
        </div>
        
        <div class="form-info">
          <p><strong>ID:</strong> {{ typeEvenement.id }}</p>
          <p><strong>Créé le:</strong> {{ formatDate(typeEvenement.created_at) }}</p>
          <p><strong>Modifié le:</strong> {{ formatDate(typeEvenement.updated_at) }}</p>
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
    
    .form-group input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }
    
    .form-group input:focus {
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
export class TypeEvenementEditComponent implements OnInit {
  typeEvenement: TypeEvenement | null = null;
  formData: UpdateTypeEvenementRequest = {
    label: ''
  };
  loading = false;
  saving = false;
  error: string | null = null;

  constructor(
    private typeEvenementService: TypeEvenementService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTypeEvenement(+id);
    } else {
      this.error = 'ID non valide';
    }
  }

  loadTypeEvenement(id: number): void {
    this.loading = true;
    this.error = null;

    this.typeEvenementService.getById(id).subscribe({
      next: (data) => {
        this.typeEvenement = data;
        this.formData.label = data.label;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement: ' + err.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.typeEvenement || !this.formData.label?.trim()) {
      this.error = 'Le label est obligatoire';
      return;
    }

    this.saving = true;
    this.error = null;

    this.typeEvenementService.update(this.typeEvenement.id, this.formData).subscribe({
      next: () => {
        this.router.navigate(['/type-evenements']);
      },
      error: (err) => {
        this.error = 'Erreur lors de la modification: ' + err.message;
        this.saving = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/type-evenements']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}
