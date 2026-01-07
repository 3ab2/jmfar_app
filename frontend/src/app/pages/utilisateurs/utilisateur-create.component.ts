import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilisateurService } from '../../services/utilisateur.service';
import { CreateUtilisateurRequest } from '../../models';

@Component({
  selector: 'app-utilisateur-create',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './utilisateur-create.component.html',
  styleUrls: ['./utilisateur-create.component.css']
})
export class UtilisateurCreateComponent implements OnInit {
  utilisateurForm: FormGroup;
  loading = false;
  error = '';
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private utilisateurService: UtilisateurService,
    private router: Router
  ) {
    this.utilisateurForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      mot_de_passe: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', [Validators.required]],
      avatar: [''],
      unite_id: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.utilisateurForm.invalid) {
      return;
    }

    this.loading = true;
    const utilisateurData: CreateUtilisateurRequest = this.utilisateurForm.value;

    this.utilisateurService.create(utilisateurData).subscribe({
      next: () => {
        this.router.navigate(['/utilisateurs']);
      },
      error: (err) => {
        this.error = 'Failed to create utilisateur';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get f() {
    return this.utilisateurForm.controls;
  }
}
