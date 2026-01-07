import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PayService } from '../../services/pay.service';
import { Pay } from '../../models';

@Component({
  selector: 'app-pays-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pays-list.component.html',
  styleUrls: ['./pays-list.component.css']
})
export class PaysListComponent implements OnInit {
  pays: Pay[] = [];
  loading = false;
  error = '';

  constructor(private payService: PayService) {}

  ngOnInit(): void {
    this.loadPays();
  }

  loadPays(): void {
    this.loading = true;
    this.payService.getAll().subscribe({
      next: (data) => {
        this.pays = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load pays';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deletePay(id: number): void {
    if (confirm('Are you sure you want to delete this pay?')) {
      this.payService.delete(id).subscribe({
        next: () => {
          this.loadPays();
        },
        error: (err) => {
          this.error = 'Failed to delete pay';
          console.error(err);
        }
      });
    }
  }

  trackByFn(index: number, item: Pay): number {
    return item.id;
  }
}
