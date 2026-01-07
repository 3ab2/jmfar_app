import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EvenementService } from '../../services/evenement.service';
import { TypeEvenementService } from '../../services/type-evenement.service';
import { SousTypeEvenementService } from '../../services/sous-type-evenement.service';
import { PayService } from '../../services/pay.service';
import { VilleService } from '../../services/ville.service';
import { Evenement, TypeEvenement, SousTypeEvenement, Pay, Ville } from '../../models';

@Component({
  selector: 'app-evenements-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Événements</h2>
        <button class="btn btn-primary" (click)="createNew()">Nouvel Événement</button>
      </div>
      
      <div class="loading" *ngIf="loading">Chargement...</div>
      
      <div class="error" *ngIf="error">{{ error }}</div>
      
      <div class="table-container" *ngIf="!loading && !error">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Référence</th>
              <th>Titre</th>
              <th>Date</th>
              <th>Type</th>
              <th>Sous-Type</th>
              <th>Ville</th>
              <th>Pays</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let evenement of evenements">
              <td>{{ evenement.id }}</td>
              <td>{{ evenement.reference }}</td>
              <td>{{ evenement.titre }}</td>
              <td>{{ formatDate(evenement.date_evenement) }}</td>
              <td>{{ getTypeEvenementLabel(evenement.type_evenement_id) }}</td>
              <td>{{ getSousTypeEvenementLabel(evenement.sous_type_evenement_id) }}</td>
              <td>{{ getVilleLabel(evenement.ville_id) }}</td>
              <td>{{ getPayLabel(evenement.pays_id) }}</td>
              <td class="actions">
                <button class="btn btn-secondary" (click)="edit(evenement.id)">Modifier</button>
                <button class="btn btn-danger" (click)="delete(evenement.id)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="empty-state" *ngIf="evenements.length === 0">
          <p>Aucun événement trouvé</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1400px;
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
        font-size: 12px;
      }
      
      .actions {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    }
  `]
})
export class EvenementsListComponent implements OnInit {
  evenements: Evenement[] = [];
  typeEvenements: TypeEvenement[] = [];
  sousTypeEvenements: SousTypeEvenement[] = [];
  pays: Pay[] = [];
  villes: Ville[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private evenementService: EvenementService,
    private typeEvenementService: TypeEvenementService,
    private sousTypeEvenementService: SousTypeEvenementService,
    private payService: PayService,
    private villeService: VilleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;
    
    // Load all data in parallel
    this.evenementService.getAll().subscribe({
      next: (data) => {
        this.evenements = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des événements: ' + err.message;
        this.loading = false;
      }
    });

    this.typeEvenementService.getAll().subscribe({
      next: (data) => {
        this.typeEvenements = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des types d\'événements:', err);
      }
    });

    this.sousTypeEvenementService.getAll().subscribe({
      next: (data) => {
        this.sousTypeEvenements = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des sous-types d\'événements:', err);
      }
    });

    this.payService.getAll().subscribe({
      next: (data) => {
        this.pays = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des pays:', err);
      }
    });

    this.villeService.getAll().subscribe({
      next: (data) => {
        this.villes = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des villes:', err);
      }
    });
  }

  getTypeEvenementLabel(typeEvenementId: number): string {
    const type = this.typeEvenements.find(t => t.id === typeEvenementId);
    return type ? type.label : 'Type inconnu';
  }

  getSousTypeEvenementLabel(sousTypeEvenementId?: number): string {
    if (!sousTypeEvenementId) return 'N/A';
    const sousType = this.sousTypeEvenements.find(st => st.id === sousTypeEvenementId);
    return sousType ? sousType.label : 'Sous-type inconnu';
  }

  getPayLabel(payId: number): string {
    const pay = this.pays.find(p => p.id === payId);
    return pay ? pay.nom : 'Pays inconnu';
  }

  getVilleLabel(villeId: number): string {
    const ville = this.villes.find(v => v.id === villeId);
    return ville ? ville.label : 'Ville inconnue';
  }

  createNew(): void {
    this.router.navigate(['/evenements/create']);
  }

  edit(id: number): void {
    this.router.navigate(['/evenements/edit', id]);
  }

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) {
      this.evenementService.delete(id).subscribe({
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
