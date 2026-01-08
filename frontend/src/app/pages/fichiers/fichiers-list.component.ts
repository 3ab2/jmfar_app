import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FichierService } from '../../services/fichier.service';
import { Fichier } from '../../models';

@Component({
  selector: 'app-fichiers-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Fichiers</h2>
        <button class="btn btn-primary" (click)="createNew()">Nouveau Fichier</button>
      </div>
      
      <div class="loading" *ngIf="isLoading">⏳ Chargement...</div>
      
      <div class="error" *ngIf="error">{{ error }}</div>
      
      <div class="table-container" *ngIf="!isLoading && !error">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Type</th>
              <th>Taille</th>
              <th>Créé le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let fichier of fichiers">
              <td>{{ fichier.id }}</td>
              <td>{{ fichier.nom }}</td>
              <td>{{ fichier.type }}</td>
              <td>{{ formatFileSize(fichier.taille) }}</td>
              <td>{{ formatDate(fichier.created_at) }}</td>
              <td class="actions">
                <button class="btn btn-info" (click)="download(fichier.id)">Télécharger</button>
                <button class="btn btn-secondary" (click)="edit(fichier.id)">Modifier</button>
                <button class="btn btn-danger" (click)="delete(fichier.id)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="empty-state" *ngIf="fichiers.length === 0">
          <p>Aucun fichier trouvé</p>
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
    
    .btn-info {
      background-color: #17a2b8;
      color: white;
      margin-right: 8px;
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
export class FichiersListComponent implements OnInit {
  fichiers: Fichier[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private fichierService: FichierService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFichiers();
  }

  loadFichiers(): void {
    console.log('🚀 Début du chargement des fichiers...');
    this.isLoading = true;
    this.error = null;
    
    this.fichierService.getAll().subscribe({
      next: (data) => {
        console.log('📥 Données fichiers reçues:', data);
        this.fichiers = Array.isArray(data) ? data : [];
        console.log('✅ Fichiers stockés dans le composant:', this.fichiers);
        console.log('📈 Nombre final de fichiers affichés:', this.fichiers.length);
        
        // Forcer isLoading à false IMMÉDIATEMENT
        this.isLoading = false;
        
        // Forcer la détection de changement Angular
        this.cdr.detectChanges();
        
        console.log('🔄 Loading status FORCÉ à false:', this.isLoading);
        console.log('🔍 Template devrait maintenant afficher les données');
        
        if (this.fichiers.length === 0) {
          console.log('⚠️ Aucun fichier à afficher - liste vide');
        } else {
          console.log('🎉 Fichiers chargés avec succès!');
          console.log('🔍 Premier fichier détaillé:', this.fichiers[0]);
        }
      },
      error: (err) => {
        console.error('❌ Erreur complète lors du chargement des fichiers:', err);
        console.error('📝 Détails de l\'erreur:', {
          message: err.message,
          status: err.status,
          statusText: err.statusText,
          url: err.url
        });
        this.error = 'Erreur lors du chargement des fichiers: ' + err.message;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createNew(): void {
    this.router.navigate(['/fichiers/create']);
  }

  edit(id: number): void {
    this.router.navigate(['/fichiers/edit', id]);
  }

  download(id: number): void {
    this.fichierService.downloadFile(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fichier_${id}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.error = 'Erreur lors du téléchargement: ' + err.message;
      }
    });
  }

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fichier?')) {
      this.fichierService.delete(id).subscribe({
        next: () => {
          console.log('✅ Fichier supprimé avec succès, rechargement de la liste...');
          this.loadFichiers();
        },
        error: (err) => {
          console.error('❌ Erreur lors de la suppression du fichier:', err);
          this.error = 'Erreur lors de la suppression du fichier: ' + err.message;
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  formatFileSize(bytes?: number): string {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}
