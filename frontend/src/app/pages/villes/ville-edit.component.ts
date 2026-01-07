import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VilleService, PayService } from '../../services';
import { Ville, UpdateVilleRequest, Pay } from '../../models';

@Component({
  selector: 'app-ville-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './ville-edit.component.html',
  styleUrls: ['./ville-edit.component.css']
})
export class VilleEditComponent implements OnInit {
  villeForm: FormGroup;
  loading = false;
  error = '';
  submitted = false;
  villeId: number | null = null;
  currentVille: Ville | null = null;
  pays: Pay[] = [];

  constructor(
    private fb: FormBuilder,
    private villeService: VilleService,
    private payService: PayService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.villeForm = this.fb.group({
      label: ['', [Validators.required, Validators.maxLength(255)]],
      pays_id: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.villeId = parseInt(id, 10);
      this.loadPays();
      this.loadVille();
    } else {
      this.error = 'Invalid ville ID';
    }
  }

  loadPays(): void {
    this.payService.getAll().subscribe({
      next: (data) => {
        this.pays = data;
      },
      error: (err) => {
        this.error = 'Failed to load pays';
        console.error(err);
      }
    });
  }

  loadVille(): void {
    if (!this.villeId) return;

    this.loading = true;
    this.villeService.getById(this.villeId).subscribe({
      next: (ville) => {
        this.currentVille = ville;
        this.villeForm.patchValue({
          label: ville.label,
          pays_id: ville.pays_id
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load ville';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.villeForm.invalid || !this.villeId) {
      return;
    }

    this.loading = true;
    const villeData: UpdateVilleRequest = this.villeForm.value;

    this.villeService.update(this.villeId, villeData).subscribe({
      next: () => {
        this.router.navigate(['/villes']);
      },
      error: (err) => {
        this.error = 'Failed to update ville';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get f() {
    return this.villeForm.controls;
  }
}
