import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PayService } from '../../services/pay.service';
import { Pay } from '../../models';

@Component({
  selector: 'app-pays-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pays-list.component.html',
  styleUrls: ['./pays-list.component.css']
})
export class PaysListComponent implements OnInit {
  pays: Pay[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private payService: PayService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadPays();
  }

  loadPays(): void {
    console.log('🚀 Début du chargement des pays...');
    this.isLoading = true;
    this.error = null;
    
    this.payService.getAll().subscribe({
      next: (data) => {
        console.log('📥 Données pays reçues:', data);
        this.pays = Array.isArray(data) ? data : [];
        console.log('✅ Pays stockés dans le composant:', this.pays);
        console.log('📈 Nombre final de pays affichés:', this.pays.length);
        
        // Forcer isLoading à false IMMÉDIATEMENT
        this.isLoading = false;
        
        // Forcer la détection de changement Angular
        this.cdr.detectChanges();
        
        console.log('🔄 Loading status FORCÉ à false:', this.isLoading);
        console.log('🔍 Template devrait maintenant afficher les données');
        
        if (this.pays.length === 0) {
          console.log('⚠️ Aucun pays à afficher - liste vide');
        } else {
          console.log('🎉 Pays chargés avec succès!');
          console.log('🔍 Premier pays détaillé:', this.pays[0]);
        }
      },
      error: (err) => {
        console.error('❌ Erreur complète lors du chargement des pays:', err);
        console.error('📝 Détails de l\'erreur:', {
          message: err.message,
          status: err.status,
          statusText: err.statusText,
          url: err.url
        });
        this.error = 'Erreur lors du chargement des pays: ' + err.message;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deletePay(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce pays?')) {
      this.payService.delete(id).subscribe({
        next: () => {
          console.log('✅ Pays supprimé avec succès, rechargement de la liste...');
          this.loadPays();
        },
        error: (err) => {
          console.error('❌ Erreur lors de la suppression du pays:', err);
          this.error = 'Erreur lors de la suppression du pays: ' + err.message;
        }
      });
    }
  }

  trackByFn(index: number, item: Pay): number {
    return item.id;
  }
}
