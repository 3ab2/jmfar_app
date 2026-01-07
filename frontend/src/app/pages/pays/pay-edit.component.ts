import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayService } from '../../services/pay.service';
import { Pay, UpdatePayRequest } from '../../models';

@Component({
  selector: 'app-pay-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './pay-edit.component.html',
  styleUrls: ['./pay-edit.component.css']
})
export class PayEditComponent implements OnInit {
  payForm: FormGroup;
  loading = false;
  error = '';
  submitted = false;
  payId: number | null = null;
  currentPay: Pay | null = null;

  constructor(
    private fb: FormBuilder,
    private payService: PayService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.payForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      nom: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.payId = parseInt(id, 10);
      this.loadPay();
    } else {
      this.error = 'Invalid pay ID';
    }
  }

  loadPay(): void {
    if (!this.payId) return;

    this.loading = true;
    this.payService.getById(this.payId).subscribe({
      next: (pay) => {
        this.currentPay = pay;
        this.payForm.patchValue({
          code: pay.code,
          nom: pay.nom
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load pay';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.payForm.invalid || !this.payId) {
      return;
    }

    this.loading = true;
    const payData: UpdatePayRequest = this.payForm.value;

    this.payService.update(this.payId, payData).subscribe({
      next: () => {
        this.router.navigate(['/pays']);
      },
      error: (err) => {
        this.error = 'Failed to update pay';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get f() {
    return this.payForm.controls;
  }
}
