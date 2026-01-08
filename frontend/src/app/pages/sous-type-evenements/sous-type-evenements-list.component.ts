import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SousTypeEvenementService } from '../../services/sous-type-evenement.service';
import { TypeEvenementService } from '../../services/type-evenement.service';
import { SousTypeEvenement, TypeEvenement } from '../../models';

@Component({
  selector: 'app-sous-type-evenements-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sous-type-evenements-list.component.html',
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
    
    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    
    .label-badge {
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .type-badge {
      background-color: #f3e5f5;
      color: #7b1fa2;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
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
  isLoading = true;
  error: string | null = null;

  constructor(
    private sousTypeEvenementService: SousTypeEvenementService,
    private typeEvenementService: TypeEvenementService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    console.log('🚀 Début du chargement des sous-types d\'événements...');
    this.isLoading = true;
    this.error = null;
    
    // Load both sous-types and types in parallel using forkJoin
    forkJoin({
      sousTypes: this.sousTypeEvenementService.getAll(),
      types: this.typeEvenementService.getAll()
    }).subscribe({
      next: (results) => {
        console.log('📥 Données reçues:', results);
        this.sousTypeEvenements = Array.isArray(results.sousTypes) ? results.sousTypes : [];
        this.typeEvenements = Array.isArray(results.types) ? results.types : [];
        console.log('✅ Sous-types d\'événements stockés:', this.sousTypeEvenements);
        console.log('📈 Nombre de sous-types reçus:', this.sousTypeEvenements.length);
        console.log('🏷️ Types d\'événements disponibles:', this.typeEvenements.length);
        
        // Forcer isLoading à false IMMÉDIATEMENT
        this.isLoading = false;
        
        // Forcer la détection de changement Angular
        this.cdr.detectChanges();
        
        console.log('🔄 Loading status FORCÉ à false:', this.isLoading);
        console.log('🔍 Template devrait maintenant afficher les données');
        
        if (this.sousTypeEvenements.length === 0) {
          console.log('⚠️ Aucun sous-type d\'événement à afficher - liste vide');
        } else {
          console.log('🎉 Sous-types d\'événements chargés avec succès!');
          console.log('🔍 Premier sous-type détaillé:', this.sousTypeEvenements[0]);
        }
      },
      error: (err) => {
        console.error('❌ Erreur complète lors du chargement des sous-types d\'événements:', err);
        console.error('📝 Détails de l\'erreur:', {
          message: err.message,
          status: err.status,
          statusText: err.statusText,
          url: err.url
        });
        this.error = 'Erreur lors du chargement des sous-types d\'événements: ' + err.message;
        this.isLoading = false;
        this.cdr.detectChanges();
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
          console.log('✅ Sous-type d\'événement supprimé avec succès, rechargement de la liste...');
          this.loadData();
        },
        error: (err) => {
          console.error('❌ Erreur lors de la suppression du sous-type d\'événement:', err);
          this.error = 'Erreur lors de la suppression du sous-type d\'événement: ' + err.message;
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}
