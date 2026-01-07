import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SousTypeEvenementService } from '../../services/sous-type-evenement.service';
import { TypeEvenementService } from '../../services/type-evenement.service';
import { SousTypeEvenement, TypeEvenement } from '../../models';

@Component({
  selector: 'app-sous-type-evenements-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Sous-Types d'Événements</h2>
        <button class="btn btn-primary" (click)="createNew()">Nouveau Sous-Type</button>
      </div>
      
      <div class="loading" *ngIf="loading">Chargement...</div>
      
      <div class="error" *ngIf="error">{{ error }}</div>
      
      <div class="table-container" *ngIf="!loading && !error">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Label</th>
              <th>Type d'Événement</th>
              <th>Créé le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let sousType of sousTypeEvenements">
              <td>{{ sousType.id }}</td>
              <td>{{ sousType.label }}</td>
              <td>{{ getTypeEvenementLabel(sousType.type_evenement_id) }}</td>
              <td>{{ formatDate(sousType.created_at) }}</td>
              <td class="actions">
                <button class="btn btn-secondary" (click)="edit(sousType.id)">Modifier</button>
                <button class="btn btn-danger" (click)="delete(sousType.id)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="empty-state" *ngIf="sousTypeEvenements.length === 0">
          <p>Aucun sous-type d'événement trouvé</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
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
      margin-right: 8px;
    }
    
    .btn-danger {
      background-color: #dc3545;
      color: white;
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
    
    .table-container {
      overflow-x: auto;
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .data-table th,
    .data-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    
    .data-table th {
      background-color: #f8f9fa;
      font-weight: bold;
    }
    
    .data-table tr:hover {
      background-color: #f5f5f5;
    }
    
    .actions {
      white-space: nowrap;
    }
    
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
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
      
      .table-container {
        font-size: 14px;
      }
      
      .actions {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    }
  `]
})
export class SousTypeEvenementsListComponent implements OnInit {
  sousTypeEvenements: SousTypeEvenement[] = [];
  typeEvenements: TypeEvenement[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private sousTypeEvenementService: SousTypeEvenementService,
    private typeEvenementService: TypeEvenementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;
    
    // Load both sous-types and types in parallel
    this.sousTypeEvenementService.getAll().subscribe({
      next: (sousTypes) => {
        this.sousTypeEvenements = sousTypes;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des sous-types d\'événements: ' + err.message;
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

  getTypeEvenementLabel(typeEvenementId: number): string {
    const type = this.typeEvenements.find(t => t.id === typeEvenementId);
    return type ? type.label : 'Type inconnu';
  }

  createNew(): void {
    this.router.navigate(['/sous-type-evenements/create']);
  }

  edit(id: number): void {
    this.router.navigate(['/sous-type-evenements/edit', id]);
  }

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce sous-type d\'événement?')) {
      this.sousTypeEvenementService.delete(id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression: ' + err.message;
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}
