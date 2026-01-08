import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UniteService } from '../../services/unite.service';
import { ArmeService } from '../../services/arme.service';
import { Unite, Arme } from '../../models';

@Component({
  selector: 'app-unite-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unite-create.component.html',
  styleUrl: './unite-create.component.css'
})
export class UniteCreateComponent implements OnInit {
  unite: Partial<Unite> = {
    nom: '',
    description: '',
    arme_id: 0
  };
  armes: Arme[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private uniteService: UniteService,
    private armeService: ArmeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadArmes();
  }

  loadArmes(): void {
    this.armeService.getAll().subscribe({
      next: (data) => {
        this.armes = data;
        if (this.armes.length > 0) {
          this.unite.arme_id = this.armes[0].id;
        }
      },
      error: (error) => {
        console.error('Error loading armes:', error);
        this.errorMessage = 'Erreur lors du chargement des armes';
      }
    });
  }

  onSubmit(): void {
    if (!this.unite.nom || !this.unite.arme_id) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.uniteService.create(this.unite).subscribe({
      next: () => {
        this.router.navigate(['/unites']);
      },
      error: (error) => {
        console.error('Error creating unite:', error);
        this.errorMessage = 'Erreur lors de la création de l\'unité';
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
