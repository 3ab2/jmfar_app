import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TypeEvenementService } from '../../services/type-evenement.service';
import { TypeEvenement } from '../../models';

@Component({
  selector: 'app-type-evenements-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Types d'Événements</h2>
        <button class="btn btn-primary" (click)="createNew()">Nouveau Type</button>
      </div>
      
      <div class="loading" *ngIf="loading">Chargement...</div>
      
      <div class="error" *ngIf="error">{{ error }}</div>
      
      <div class="table-container" *ngIf="!loading && !error">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Label</th>
              <th>Créé le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let type of typeEvenements">
              <td>{{ type.id }}</td>
              <td>{{ type.label }}</td>
              <td>{{ formatDate(type.created_at) }}</td>
              <td class="actions">
                <button class="btn btn-secondary" (click)="edit(type.id)">Modifier</button>
                <button class="btn btn-danger" (click)="delete(type.id)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="empty-state" *ngIf="typeEvenements.length === 0">
          <p>Aucun type d'événement trouvé</p>
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
export class TypeEvenementsListComponent implements OnInit {
  typeEvenements: TypeEvenement[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private typeEvenementService: TypeEvenementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTypeEvenements();
  }

  loadTypeEvenements(): void {
    this.loading = true;
    this.error = null;
    
    this.typeEvenementService.getAll().subscribe({
      next: (data) => {
        this.typeEvenements = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des types d\'événements: ' + err.message;
        this.loading = false;
      }
    });
  }

  createNew(): void {
    this.router.navigate(['/type-evenements/create']);
  }

  edit(id: number): void {
    this.router.navigate(['/type-evenements/edit', id]);
  }

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce type d\'événement?')) {
      this.typeEvenementService.delete(id).subscribe({
        next: () => {
          this.loadTypeEvenements();
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
