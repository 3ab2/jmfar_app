import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EvenementService } from '../../services/evenement.service';
import { TypeEvenementService } from '../../services/type-evenement.service';
import { SousTypeEvenementService } from '../../services/sous-type-evenement.service';
import { PayService } from '../../services/pay.service';
import { VilleService } from '../../services/ville.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Evenement, TypeEvenement, SousTypeEvenement, Pay, Ville, Utilisateur } from '../../models';

@Component({
  selector: 'app-evenements-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evenements-list.component.html',
  styleUrls: ['./evenements-list.component.css']
})
export class EvenementsListComponent implements OnInit {
  evenements: Evenement[] = [];
  typeEvenements: TypeEvenement[] = [];
  sousTypeEvenements: SousTypeEvenement[] = [];
  pays: Pay[] = [];
  villes: Ville[] = [];
  utilisateurs: Utilisateur[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private evenementService: EvenementService,
    private typeEvenementService: TypeEvenementService,
    private sousTypeEvenementService: SousTypeEvenementService,
    private payService: PayService,
    private villeService: VilleService,
    private utilisateurService: UtilisateurService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;
    
    console.log('🚀 Début du chargement des données...');
    
    // Load all data in parallel using forkJoin
    forkJoin({
      evenements: this.evenementService.getAll(),
      typeEvenements: this.typeEvenementService.getAll(),
      sousTypeEvenements: this.sousTypeEvenementService.getAll(),
      pays: this.payService.getAll(),
      villes: this.villeService.getAll(),
      utilisateurs: this.utilisateurService.getAll()
    }).subscribe({
      next: (results) => {
        console.log('📥 Toutes les données reçues:', results);
        
        // Vérification et assignation robuste des données
        this.evenements = Array.isArray(results.evenements) ? results.evenements : [];
        this.typeEvenements = Array.isArray(results.typeEvenements) ? results.typeEvenements : [];
        this.sousTypeEvenements = Array.isArray(results.sousTypeEvenements) ? results.sousTypeEvenements : [];
        this.pays = Array.isArray(results.pays) ? results.pays : [];
        this.villes = Array.isArray(results.villes) ? results.villes : [];
        this.utilisateurs = Array.isArray(results.utilisateurs) ? results.utilisateurs : [];
        
        // Forcer isLoading à false IMMÉDIATEMENT
        this.isLoading = false;
        
        // Forcer la détection de changement Angular
        this.cdr.detectChanges();
        
        console.log('✅ Événements stockés dans le composant:', this.evenements);
        console.log('📈 Nombre final d\'événements affichés:', this.evenements.length);
        console.log('🔄 Loading status FORCÉ à false:', this.isLoading);
        console.log('🔍 Template devrait maintenant afficher les données');
        
        if (this.evenements.length === 0) {
          console.log('⚠️ Aucun événement à afficher - liste vide');
        } else {
          console.log('🎉 Événements chargés avec succès!');
          console.log('🔍 Premier événement détaillé:', this.evenements[0]);
        }
      },
      error: (err) => {
        console.error('❌ Erreur complète lors du chargement des données:', err);
        console.error('📝 Détails de l\'erreur:', {
          message: err.message,
          status: err.status,
          statusText: err.statusText,
          url: err.url
        });
        this.error = 'Erreur lors du chargement des données: ' + err.message;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Utiliser les relations de l'API si disponibles, sinon utiliser les données chargées
  getTypeEvenementLabel(evenement: Evenement): string {
    // Priorité aux relations chargées depuis l'API
    if (evenement.typeEvenement?.label) {
      return evenement.typeEvenement.label;
    }
    // Fallback vers les données chargées séparément
    const type = this.typeEvenements.find(t => t.id === evenement.type_evenement_id);
    return type ? type.label : 'Type inconnu';
  }

  getSousTypeEvenementLabel(evenement: Evenement): string {
    // Priorité aux relations chargées depuis l'API
    if (evenement.sousTypeEvenement?.label) {
      return evenement.sousTypeEvenement.label;
    }
    // Fallback vers les données chargées séparément
    if (!evenement.sous_type_evenement_id) return 'N/A';
    const sousType = this.sousTypeEvenements.find(st => st.id === evenement.sous_type_evenement_id);
    return sousType ? sousType.label : 'Sous-type inconnu';
  }

  getPayLabel(evenement: Evenement): string {
    // Priorité aux relations chargées depuis l'API
    if (evenement.pay?.nom) {
      return evenement.pay.nom;
    }
    // Fallback vers les données chargées séparément
    const pay = this.pays.find(p => p.id === evenement.pays_id);
    return pay ? pay.nom : 'Pays inconnu';
  }

  getVilleLabel(evenement: Evenement): string {
    // Priorité aux relations chargées depuis l'API
    if (evenement.ville?.label) {
      return evenement.ville.label;
    }
    // Fallback vers les données chargées séparément
    const ville = this.villes.find(v => v.id === evenement.ville_id);
    return ville ? ville.label : 'Ville inconnue';
  }

  getUtilisateurLabel(evenement: Evenement): string {
    // Priorité aux relations chargées depuis l'API
    if (evenement.utilisateur?.nom) {
      return evenement.utilisateur.nom;
    }
    // Fallback vers les données chargées séparément
    const utilisateur = this.utilisateurs.find(u => u.id === evenement.utilisateur_id);
    return utilisateur ? utilisateur.nom : 'Utilisateur inconnu';
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

  trackByEvenementId(index: number, evenement: Evenement): number {
    return evenement.id;
  }
}
