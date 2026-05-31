import { Component, signal, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  productCount = signal(0);
  categoryCount = signal(0);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async ngOnInit() {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [products, categories] = await Promise.all([
      fetch(`${environment.apiUrl}/products`, { headers }).then((r) => r.json()),
      fetch(`${environment.apiUrl}/categories`, { headers }).then((r) => r.json()),
    ]);

    this.productCount.set((products as unknown[]).length);
    this.categoryCount.set((categories as unknown[]).length);
  }
}
