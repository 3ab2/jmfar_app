import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Utilisateur } from '../../models';

@Component({
  selector: 'app-utilisateurs-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './utilisateurs-list.component.html',
  styleUrls: ['./utilisateurs-list.component.css']
})
export class UtilisateursListComponent implements OnInit {
  utilisateurs: Utilisateur[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private utilisateurService: UtilisateurService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUtilisateurs();
  }

  loadUtilisateurs(): void {
    console.log('🚀 Début du chargement des utilisateurs...');
    this.isLoading = true;
    this.error = null;
    
    this.utilisateurService.getAll().subscribe({
      next: (data) => {
        console.log('📥 Données utilisateurs reçues:', data);
        this.utilisateurs = Array.isArray(data) ? data : [];
        console.log('✅ Utilisateurs stockés dans le composant:', this.utilisateurs);
        console.log('📈 Nombre final d\'utilisateurs affichés:', this.utilisateurs.length);
        
        // Forcer isLoading à false IMMÉDIATEMENT
        this.isLoading = false;
        
        // Forcer la détection de changement Angular
        this.cdr.detectChanges();
        
        console.log('🔄 Loading status FORCÉ à false:', this.isLoading);
        console.log('🔍 Template devrait maintenant afficher les données');
        
        if (this.utilisateurs.length === 0) {
          console.log('⚠️ Aucun utilisateur à afficher - liste vide');
        } else {
          console.log('🎉 Utilisateurs chargés avec succès!');
          console.log('🔍 Premier utilisateur détaillé:', this.utilisateurs[0]);
        }
      },
      error: (err) => {
        console.error('❌ Erreur complète lors du chargement des utilisateurs:', err);
        console.error('📝 Détails de l\'erreur:', {
          message: err.message,
          status: err.status,
          statusText: err.statusText,
          url: err.url
        });
        this.error = 'Erreur lors du chargement des utilisateurs: ' + err.message;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteUtilisateur(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      this.utilisateurService.delete(id).subscribe({
        next: () => {
          console.log('✅ Utilisateur supprimé avec succès, rechargement de la liste...');
          this.loadUtilisateurs();
        },
        error: (err) => {
          console.error('❌ Erreur lors de la suppression de l\'utilisateur:', err);
          this.error = 'Erreur lors de la suppression de l\'utilisateur: ' + err.message;
        }
      });
    }
  }

  trackByFn(index: number, item: Utilisateur): number {
    return item.id;
  }
}
