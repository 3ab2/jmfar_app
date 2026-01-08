import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UniteService } from '../../services/unite.service';
import { Unite } from '../../models';

@Component({
  selector: 'app-unites-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unites-list.component.html',
  styleUrl: './unites-list.component.css'
})
export class UnitesListComponent implements OnInit {
  unites: Unite[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private uniteService: UniteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUnites();
  }

  loadUnites(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.uniteService.getAll().subscribe({
      next: (data) => {
        this.unites = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading unites:', error);
        this.errorMessage = 'Erreur lors du chargement des unités';
        this.isLoading = false;
      }
    });
  }

  goToCreate(): void {
    this.router.navigate(['/unites/create']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/unites/edit', id]);
  }

  deleteUnite(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette unité ?')) {
      this.uniteService.delete(id).subscribe({
        next: () => {
          this.loadUnites();
        },
        error: (error) => {
          console.error('Error deleting unite:', error);
          this.errorMessage = 'Erreur lors de la suppression de l\'unité';
        }
      });
    }
  }
}
