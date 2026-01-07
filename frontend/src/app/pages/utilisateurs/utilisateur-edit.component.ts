import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Utilisateur, UpdateUtilisateurRequest } from '../../models';

@Component({
  selector: 'app-utilisateur-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './utilisateur-edit.component.html',
  styleUrls: ['./utilisateur-edit.component.css']
})
export class UtilisateurEditComponent implements OnInit {
  utilisateurForm: FormGroup;
  loading = false;
  error = '';
  submitted = false;
  utilisateurId: number | null = null;
  currentUtilisateur: Utilisateur | null = null;

  constructor(
    private fb: FormBuilder,
    private utilisateurService: UtilisateurService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.utilisateurForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      mot_de_passe: ['', [Validators.minLength(6)]],
      role: ['user', [Validators.required]],
      avatar: [''],
      unite_id: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.utilisateurId = parseInt(id, 10);
      this.loadUtilisateur();
    } else {
      this.error = 'Invalid utilisateur ID';
    }
  }

  loadUtilisateur(): void {
    if (!this.utilisateurId) return;

    this.loading = true;
    this.utilisateurService.getById(this.utilisateurId).subscribe({
      next: (utilisateur) => {
        this.currentUtilisateur = utilisateur;
        this.utilisateurForm.patchValue({
          nom: utilisateur.nom,
          email: utilisateur.email,
          role: utilisateur.role,
          avatar: utilisateur.avatar || '',
          unite_id: utilisateur.unite_id
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load utilisateur';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.utilisateurForm.invalid || !this.utilisateurId) {
      return;
    }

    this.loading = true;
    const utilisateurData: UpdateUtilisateurRequest = this.utilisateurForm.value;

    this.utilisateurService.update(this.utilisateurId, utilisateurData).subscribe({
      next: () => {
        this.router.navigate(['/utilisateurs']);
      },
      error: (err) => {
        this.error = 'Failed to update utilisateur';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get f() {
    return this.utilisateurForm.controls;
  }
}
