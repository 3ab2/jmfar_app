import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayService } from '../../services/pay.service';
import { CreatePayRequest } from '../../models';

@Component({
  selector: 'app-pay-create',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './pay-create.component.html',
  styleUrls: ['./pay-create.component.css']
})
export class PayCreateComponent implements OnInit {
  payForm: FormGroup;
  loading = false;
  error = '';
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private payService: PayService,
    private router: Router
  ) {
    this.payForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      nom: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.payForm.invalid) {
      return;
    }

    this.loading = true;
    const payData: CreatePayRequest = this.payForm.value;

    this.payService.create(payData).subscribe({
      next: () => {
        this.router.navigate(['/pays']);
      },
      error: (err) => {
        this.error = 'Failed to create pay';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get f() {
    return this.payForm.controls;
  }
}
