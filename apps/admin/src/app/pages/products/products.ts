import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { HttpService } from '../../http.service';

interface Category {
  id: string;
  name: string;
}

interface ProductImage {
  url: string;
  isMain: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId: string | null;
  category?: Category;
  isActive: boolean;
  variants: unknown[];
  images: ProductImage[];
}

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    TagModule,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  saving = signal(false);
  dialogVisible = false;
  editingId = signal<string | null>(null);

  form = { name: '', slug: '', description: '', categoryId: null as string | null };

  constructor(
    private http: HttpService,
    private router: Router,
  ) {}

  async ngOnInit() {
    await Promise.all([this.load(), this.loadCategories()]);
  }

  async load() {
    this.loading.set(true);
    this.products.set(await this.http.get<Product[]>('/products'));
    this.loading.set(false);
  }

  async loadCategories() {
    this.categories.set(await this.http.get<Category[]>('/categories'));
  }

  getMainImage(product: Product): string | null {
    const main = product.images.find((i) => i.isMain);
    return main?.url ?? product.images[0]?.url ?? null;
  }

  goDetail(id: string) {
    void this.router.navigate(['/products', id]);
  }

  openDialog(product?: Product) {
    if (product) {
      this.editingId.set(product.id);
      this.form = {
        name: product.name,
        slug: product.slug,
        description: product.description ?? '',
        categoryId: product.categoryId,
      };
    } else {
      this.editingId.set(null);
      this.form = { name: '', slug: '', description: '', categoryId: null };
    }
    this.dialogVisible = true;
  }

  autoSlug(name: string) {
    this.form.slug = name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  async save() {
    this.saving.set(true);
    const body: Record<string, unknown> = {
      name: this.form.name,
      slug: this.form.slug,
    };
    if (this.form.description) body['description'] = this.form.description;
    if (this.form.categoryId) body['categoryId'] = this.form.categoryId;

    if (this.editingId()) {
      await this.http.put(`/products/${this.editingId()}`, body);
    } else {
      await this.http.post('/products', body);
    }
    this.dialogVisible = false;
    await this.load();
    this.saving.set(false);
  }

  async delete(id: string) {
    await this.http.delete(`/products/${id}`);
    await this.load();
  }
}
