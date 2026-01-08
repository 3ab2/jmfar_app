import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TypeEvenementService } from '../../services/type-evenement.service';
import { TypeEvenement, CreateTypeEvenementRequest } from '../../models';

@Component({
  selector: 'app-type-evenement-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './type-evenement-create.component.html',
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
export class TypeEvenementCreateComponent implements OnInit {
  formData: CreateTypeEvenementRequest = {
    label: ''
  };
  isLoading = true;
  saving = false;
  error: string | null = null;

  constructor(
    private typeEvenementService: TypeEvenementService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🚀 Initialisation du formulaire de création de type d\'événement...');
    this.isLoading = true;
    
    // Le formulaire est prêt immédiatement pour les types d'événements (pas de données de référence nécessaires)
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
      console.log('✅ Formulaire de création prêt');
      console.log('🔄 Loading status FORCÉ à false:', this.isLoading);
      console.log('🔍 Template devrait maintenant afficher le formulaire');
    }, 100);
  }

  onSubmit(): void {
    if (!this.formData.label.trim()) {
      console.log('⚠️ Formulaire invalide: label vide');
      this.error = 'Le label est obligatoire';
      return;
    }

    console.log('🚀 Début de la création du type d\'événement...');
    this.saving = true;
    this.error = null;

    this.typeEvenementService.create(this.formData).subscribe({
      next: () => {
        console.log('✅ Type d\'événement créé avec succès');
        this.saving = false;
        this.router.navigate(['/type-evenements']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la création du type d\'événement:', err);
        this.error = 'Erreur lors de la création du type d\'événement: ' + err.message;
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/type-evenements']);
  }
}
