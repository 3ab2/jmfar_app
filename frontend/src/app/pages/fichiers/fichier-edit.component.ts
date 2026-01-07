import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FichierService } from '../../services/fichier.service';
import { Fichier, UpdateFichierRequest } from '../../models';

@Component({
  selector: 'app-fichier-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Modifier un Fichier</h2>
        <button class="btn btn-secondary" (click)="cancel()">Annuler</button>
      </div>
      
      <div class="loading" *ngIf="loading">Chargement...</div>
      
      <div class="error" *ngIf="error">{{ error }}</div>
      
      <form class="form" (ngSubmit)="onSubmit()" *ngIf="!loading && fichier">
        <div class="form-group">
          <label for="nom">Nom du fichier</label>
          <input 
            type="text" 
            id="nom" 
            name="nom" 
            [(ngModel)]="formData.nom" 
            placeholder="Entrez le nom du fichier"
          />
        </div>
        
        <div class="form-group">
          <label for="type">Type</label>
          <input 
            type="text" 
            id="type" 
            name="type" 
            [(ngModel)]="formData.type" 
            placeholder="Entrez le type du fichier"
          />
        </div>
        
        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description" 
            name="description" 
            [(ngModel)]="formData.description" 
            rows="4"
            placeholder="Entrez la description du fichier"
          ></textarea>
        </div>
        
        <div class="form-info">
          <p><strong>ID:</strong> {{ fichier.id }}</p>
          <p><strong>Chemin:</strong> {{ fichier.path }}</p>
          <p><strong>Taille:</strong> {{ formatFileSize(fichier.taille) }}</p>
          <p><strong>Date d'upload:</strong> {{ formatDate(fichier.date_upload) }}</p>
          <p><strong>Créé le:</strong> {{ formatDate(fichier.created_at) }}</p>
          <p><strong>Modifié le:</strong> {{ formatDate(fichier.updated_at) }}</p>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="saving">
            {{ saving ? 'Modification...' : 'Modifier' }}
          </button>
          <button type="button" class="btn btn-info" (click)="download()">Télécharger</button>
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
    
    .btn-info {
      background-color: #17a2b8;
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
    .form-group textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
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
export class FichierEditComponent implements OnInit {
  fichier: Fichier | null = null;
  formData: UpdateFichierRequest = {
    nom: '',
    type: '',
    description: ''
  };
  loading = false;
  saving = false;
  error: string | null = null;

  constructor(
    private fichierService: FichierService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFichier(+id);
    } else {
      this.error = 'ID non valide';
    }
  }

  loadFichier(id: number): void {
    this.loading = true;
    this.error = null;

    this.fichierService.getById(id).subscribe({
      next: (data) => {
        this.fichier = data;
        this.formData = {
          nom: data.nom,
          type: data.type || '',
          description: data.description || ''
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement: ' + err.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.fichier) {
      this.error = 'Données du fichier non chargées';
      return;
    }

    this.saving = true;
    this.error = null;

    this.fichierService.update(this.fichier.id, this.formData).subscribe({
      next: () => {
        this.router.navigate(['/fichiers']);
      },
      error: (err) => {
        this.error = 'Erreur lors de la modification: ' + err.message;
        this.saving = false;
      }
    });
  }

  download(): void {
    if (!this.fichier) return;

    this.fichierService.downloadFile(this.fichier.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.fichier!.nom || `fichier_${this.fichier!.id}`;
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

  cancel(): void {
    this.router.navigate(['/fichiers']);
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
