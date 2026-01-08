import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VilleService } from '../../services/ville.service';
import { Ville } from '../../models';

@Component({
  selector: 'app-villes-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './villes-list.component.html',
  styleUrls: ['./villes-list.component.css']
})
export class VillesListComponent implements OnInit {
  villes: Ville[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private villeService: VilleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadVilles();
  }

  loadVilles(): void {
    console.log('🚀 Début du chargement des villes...');
    this.isLoading = true;
    this.error = null;
    
    this.villeService.getAll().subscribe({
      next: (data) => {
        console.log('📥 Données villes reçues:', data);
        this.villes = Array.isArray(data) ? data : [];
        console.log('✅ Villes stockées dans le composant:', this.villes);
        console.log('📈 Nombre final de villes affichées:', this.villes.length);
        
        // Forcer isLoading à false IMMÉDIATEMENT
        this.isLoading = false;
        
        // Forcer la détection de changement Angular
        this.cdr.detectChanges();
        
        console.log('🔄 Loading status FORCÉ à false:', this.isLoading);
        console.log('🔍 Template devrait maintenant afficher les données');
        
        if (this.villes.length === 0) {
          console.log('⚠️ Aucune ville à afficher - liste vide');
        } else {
          console.log('🎉 Villes chargées avec succès!');
          console.log('🔍 Première ville détaillée:', this.villes[0]);
        }
      },
      error: (err) => {
        console.error('❌ Erreur complète lors du chargement des villes:', err);
        console.error('📝 Détails de l\'erreur:', {
          message: err.message,
          status: err.status,
          statusText: err.statusText,
          url: err.url
        });
        this.error = 'Erreur lors du chargement des villes: ' + err.message;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteVille(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette ville?')) {
      this.villeService.delete(id).subscribe({
        next: () => {
          console.log('✅ Ville supprimée avec succès, rechargement de la liste...');
          this.loadVilles();
        },
        error: (err) => {
          console.error('❌ Erreur lors de la suppression de la ville:', err);
          this.error = 'Erreur lors de la suppression de la ville: ' + err.message;
        }
      });
    }
  }

  trackByFn(index: number, item: Ville): number {
    return item.id;
  }
}
