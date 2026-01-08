import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Arme } from '../../models';
import { ArmeService } from '../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-armes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './armes-list.component.html',
  styleUrl: './armes-list.component.css'
})
export class ArmesListComponent implements OnInit {
  armes: Arme[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private armeService: ArmeService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadArmes();
  }

  loadArmes(): void {
    console.log('🚀 Début du chargement des armes...');
    this.isLoading = true;
    this.error = null;
    this.armeService.getAll().subscribe({
      next: (data) => {
        console.log('📥 Données armes reçues:', data);
        this.armes = Array.isArray(data) ? data : [];
        console.log('✅ Armes stockées dans le composant:', this.armes);
        console.log('📈 Nombre final d\'armes affichées:', this.armes.length);
        
        // Forcer loading à false IMMÉDIATEMENT
        this.isLoading = false;
        
        // Forcer la détection de changement Angular
        this.cdr.detectChanges();
        
        console.log('🔄 Loading status FORCÉ à false:', this.isLoading);
        console.log('🔍 Template devrait maintenant afficher les données');
        
        if (this.armes.length === 0) {
          console.log('⚠️ Aucune arme à afficher - liste vide');
        } else {
          console.log('🎉 Armes chargées avec succès!');
          console.log('🔍 Première arme détaillée:', this.armes[0]);
        }
      },
      error: (err) => {
        console.error('❌ Erreur complète lors du chargement des armes:', err);
        console.error('📝 Détails de l\'erreur:', {
          message: err.message,
          status: err.status,
          statusText: err.statusText,
          url: err.url
        });
        this.error = 'Erreur lors du chargement des armes: ' + err.message;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createArme(): void {
    this.router.navigate(['/armes/create']);
  }

  editArme(id: number): void {
    this.router.navigate(['/armes/edit', id]);
  }

  deleteArme(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette arme?')) {
      this.armeService.delete(id).subscribe({
        next: () => {
          console.log('✅ Arme supprimée avec succès, rechargement de la liste...');
          this.loadArmes();
        },
        error: (err) => {
          console.error('❌ Erreur lors de la suppression de l\'arme:', err);
          this.error = 'Erreur lors de la suppression de l\'arme: ' + err.message;
        }
      });
    }
  }
}
