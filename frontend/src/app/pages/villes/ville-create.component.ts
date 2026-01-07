import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VilleService, PayService } from '../../services';
import { CreateVilleRequest, Pay } from '../../models';

@Component({
  selector: 'app-ville-create',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './ville-create.component.html',
  styleUrls: ['./ville-create.component.css']
})
export class VilleCreateComponent implements OnInit {
  villeForm: FormGroup;
  loading = false;
  error = '';
  submitted = false;
  pays: Pay[] = [];

  constructor(
    private fb: FormBuilder,
    private villeService: VilleService,
    private payService: PayService,
    private router: Router
  ) {
    this.villeForm = this.fb.group({
      label: ['', [Validators.required, Validators.maxLength(255)]],
      pays_id: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadPays();
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

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.villeForm.invalid) {
      return;
    }

    this.loading = true;
    const villeData: CreateVilleRequest = this.villeForm.value;

    this.villeService.create(villeData).subscribe({
      next: () => {
        this.router.navigate(['/villes']);
      },
      error: (err) => {
        this.error = 'Failed to create ville';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get f() {
    return this.villeForm.controls;
  }
}
