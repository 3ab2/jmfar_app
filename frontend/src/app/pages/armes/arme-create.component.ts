import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ArmeService } from '../../services';
import { CreateArmeRequest } from '../../models';

@Component({
  selector: 'app-arme-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './arme-create.component.html',
  styleUrl: './arme-create.component.css'
})
export class ArmeCreateComponent {
  arme: CreateArmeRequest = {
    nom: '',
    description: ''
  };
  isLoading = false;
  error: string | null = null;

  constructor(private armeService: ArmeService, private router: Router) {}

  onSubmit(): void {
    if (!this.arme.nom.trim()) {
      this.error = 'Name is required';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.armeService.create(this.arme).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/armes']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to create arme';
        console.error('Error creating arme:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/armes']);
  }
}
