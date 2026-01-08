import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UniteService } from '../../services/unite.service';
import { ArmeService } from '../../services/arme.service';
import { Unite, Arme } from '../../models';

@Component({
  selector: 'app-unite-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unite-edit.component.html',
  styleUrl: './unite-edit.component.css'
})
export class UniteEditComponent implements OnInit {
  unite: Unite | null = null;
  armes: Arme[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  id: number = 0;

  constructor(
    private uniteService: UniteService,
    private armeService: ArmeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.loadUnite();
      this.loadArmes();
    } else {
      this.errorMessage = 'ID d\'unité non valide';
    }
  }

  loadUnite(): void {
    this.isLoading = true;
    this.uniteService.getById(this.id).subscribe({
      next: (data) => {
        this.unite = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading unite:', error);
        this.errorMessage = 'Erreur lors du chargement de l\'unité';
        this.isLoading = false;
      }
    });
  }

  loadArmes(): void {
    this.armeService.getAll().subscribe({
      next: (data) => {
        this.armes = data;
      },
      error: (error) => {
        console.error('Error loading armes:', error);
        this.errorMessage = 'Erreur lors du chargement des armes';
      }
    });
  }

  onSubmit(): void {
    if (!this.unite || !this.unite.nom || !this.unite.arme_id) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.uniteService.update(this.id, this.unite).subscribe({
      next: () => {
        this.router.navigate(['/unites']);
      },
      error: (error) => {
        console.error('Error updating unite:', error);
        this.errorMessage = 'Erreur lors de la mise à jour de l\'unité';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/unites']);
  }
}
