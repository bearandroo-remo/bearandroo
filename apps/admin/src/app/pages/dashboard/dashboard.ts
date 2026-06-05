import { Component, signal, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  productCount = signal(0);
  categoryCount = signal(0);

  constructor(private http: HttpService) {}

  async ngOnInit() {
    const [products, categories] = await Promise.all([
      this.http.get<unknown[]>('/products'),
      this.http.get<unknown[]>('/categories'),
    ]);

    this.productCount.set(products.length);
    this.categoryCount.set(categories.length);
  }
}
