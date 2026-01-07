import { Component, OnInit } from '@angular/core';
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
  loading = false;
  error = '';

  constructor(private villeService: VilleService) {}

  ngOnInit(): void {
    this.loadVilles();
  }

  loadVilles(): void {
    this.loading = true;
    this.villeService.getAll().subscribe({
      next: (data) => {
        this.villes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load villes';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteVille(id: number): void {
    if (confirm('Are you sure you want to delete this ville?')) {
      this.villeService.delete(id).subscribe({
        next: () => {
          this.loadVilles();
        },
        error: (err) => {
          this.error = 'Failed to delete ville';
          console.error(err);
        }
      });
    }
  }

  trackByFn(index: number, item: Ville): number {
    return item.id;
  }
}
