import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ArmeService } from '../../services';
import { Arme, UpdateArmeRequest } from '../../models';

@Component({
  selector: 'app-arme-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './arme-edit.component.html',
  styleUrl: './arme-edit.component.css'
})
export class ArmeEditComponent implements OnInit {
  armeId: number | null = null;
  arme: Arme | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private armeService: ArmeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.armeId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.armeId) {
      this.loadArme();
    }
  }

  loadArme(): void {
    this.isLoading = true;
    this.error = null;

    this.armeService.getById(this.armeId!).subscribe({
      next: (data) => {
        this.arme = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load arme';
        this.isLoading = false;
        console.error('Error loading arme:', err);
      }
    });
  }

  onSubmit(): void {
    if (!this.arme || !this.arme.nom.trim()) {
      this.error = 'Name is required';
      return;
    }

    this.isLoading = true;
    this.error = null;

    const updateData: UpdateArmeRequest = {
      nom: this.arme.nom,
      description: this.arme.description
    };

    this.armeService.update(this.armeId!, updateData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/armes']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to update arme';
        console.error('Error updating arme:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/armes']);
  }
}
