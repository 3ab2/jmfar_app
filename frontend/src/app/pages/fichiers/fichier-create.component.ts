import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FichierService } from '../../services/fichier.service';
import { Fichier, CreateFichierRequest, UpdateFichierRequest } from '../../models';

@Component({
  selector: 'app-fichier-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Ajouter un Fichier</h2>
        <button class="btn btn-secondary" (click)="cancel()">Annuler</button>
      </div>
      
      <div class="loading" *ngIf="loading">Chargement...</div>
      
      <div class="error" *ngIf="error">{{ error }}</div>
      
      <div class="upload-section" *ngIf="!loading">
        <div class="form-group">
          <label for="file">Sélectionner un fichier *</label>
          <input 
            type="file" 
            id="file" 
            name="file" 
            (change)="onFileSelect($event)" 
            accept="*/*"
          />
          <small class="help-text">Tous les types de fichiers sont acceptés</small>
        </div>
        
        <div class="file-preview" *ngIf="selectedFile">
          <p><strong>Fichier sélectionné:</strong> {{ selectedFile.name }}</p>
          <p><strong>Taille:</strong> {{ formatFileSize(selectedFile.size) }}</p>
          <p><strong>Type:</strong> {{ selectedFile.type || 'Inconnu' }}</p>
        </div>
        
        <div class="form-group" *ngIf="selectedFile">
          <label for="nom">Nom du fichier (optionnel)</label>
          <input 
            type="text" 
            id="nom" 
            name="nom" 
            [(ngModel)]="formData.nom" 
            placeholder="Laissez vide pour utiliser le nom original"
          />
        </div>
        
        <div class="form-group" *ngIf="selectedFile">
          <label for="description">Description</label>
          <textarea 
            id="description" 
            name="description" 
            [(ngModel)]="formData.description" 
            rows="4"
            placeholder="Entrez une description pour ce fichier"
          ></textarea>
        </div>
        
        <div class="form-actions" *ngIf="selectedFile">
          <button class="btn btn-primary" (click)="uploadFile()" [disabled]="uploading">
            {{ uploading ? 'Téléchargement...' : 'Télécharger' }}
          </button>
          <button class="btn btn-secondary" (click)="cancel()">Annuler</button>
        </div>
      </div>
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
    
    .upload-section {
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
    
    .form-group input[type="file"] {
      width: 100%;
      padding: 10px;
      border: 2px dashed #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
      background-color: #f8f9fa;
    }
    
    .form-group input[type="text"],
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
    
    .help-text {
      display: block;
      margin-top: 5px;
      color: #666;
      font-size: 12px;
    }
    
    .file-preview {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    
    .file-preview p {
      margin: 5px 0;
      color: #333;
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
      
      .upload-section {
        padding: 15px;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class FichierCreateComponent implements OnInit {
  selectedFile: File | null = null;
  formData: CreateFichierRequest = {
    nom: '',
    description: ''
  };
  loading = false;
  uploading = false;
  error: string | null = null;

  constructor(
    private fichierService: FichierService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.formData.nom = file.name; // Pre-fill with original filename
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.error = 'Veuillez sélectionner un fichier';
      return;
    }

    this.uploading = true;
    this.error = null;

    this.fichierService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        // If we have additional metadata to update, do it here
        if (this.formData.nom || this.formData.description) {
          const updateData: UpdateFichierRequest = {};
          if (this.formData.nom) updateData.nom = this.formData.nom;
          if (this.formData.description) updateData.description = this.formData.description;
          
          this.fichierService.update(response.id, updateData).subscribe({
            next: () => {
              this.router.navigate(['/fichiers']);
            },
            error: (err) => {
              this.error = 'Fichier téléchargé mais erreur lors de la mise à jour: ' + err.message;
              this.uploading = false;
            }
          });
        } else {
          this.router.navigate(['/fichiers']);
        }
      },
      error: (err) => {
        this.error = 'Erreur lors du téléchargement: ' + err.message;
        this.uploading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/fichiers']);
  }

  formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}
