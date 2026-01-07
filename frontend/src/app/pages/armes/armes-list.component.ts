import { Component, OnInit } from '@angular/core';
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
  isLoading = false;
  error: string | null = null;

  constructor(private armeService: ArmeService, private router: Router) {}

  ngOnInit(): void {
    this.loadArmes();
  }

  loadArmes(): void {
    this.isLoading = true;
    this.error = null;
    this.armeService.getAll().subscribe({
      next: (data) => {
        this.armes = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load armes';
        this.isLoading = false;
        console.error('Error loading armes:', err);
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
    if (confirm('Are you sure you want to delete this arme?')) {
      this.armeService.delete(id).subscribe({
        next: () => {
          this.loadArmes();
        },
        error: (err) => {
          this.error = 'Failed to delete arme';
          console.error('Error deleting arme:', err);
        }
      });
    }
  }
}
