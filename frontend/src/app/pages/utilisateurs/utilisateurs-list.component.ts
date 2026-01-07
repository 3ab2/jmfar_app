import { Component, OnInit } from '@angular/core';
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
  loading = false;
  error = '';

  constructor(private utilisateurService: UtilisateurService) {}

  ngOnInit(): void {
    this.loadUtilisateurs();
  }

  loadUtilisateurs(): void {
    this.loading = true;
    this.utilisateurService.getAll().subscribe({
      next: (data) => {
        this.utilisateurs = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load utilisateurs';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteUtilisateur(id: number): void {
    if (confirm('Are you sure you want to delete this utilisateur?')) {
      this.utilisateurService.delete(id).subscribe({
        next: () => {
          this.loadUtilisateurs();
        },
        error: (err) => {
          this.error = 'Failed to delete utilisateur';
          console.error(err);
        }
      });
    }
  }

  trackByFn(index: number, item: Utilisateur): number {
    return item.id;
  }
}
