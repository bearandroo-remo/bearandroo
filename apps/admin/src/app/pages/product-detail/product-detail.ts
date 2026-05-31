import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { HttpService } from '../../http.service';

interface Variant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  images: ProductImage[];
}

@Component({
  selector: 'app-product-detail',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  variants = signal<Variant[]>([]);
  images = signal<ProductImage[]>([]);
  loading = signal(false);
  saving = signal(false);
  variantDialogVisible = false;
  editingVariantId = signal<string | null>(null);

  variantForm = { sku: '', price: 0, stock: 0, attributesJson: '' };

  private productId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpService,
  ) {}

  async ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') ?? '';
    await this.load();
  }

  async load() {
    this.loading.set(true);
    const [product, variants] = await Promise.all([
      this.http.get<Product>(`/products/id/${this.productId}`),
      this.http.get<Variant[]>(`/variants/product/${this.productId}`),
    ]);
    this.product.set(product);
    this.images.set((product as Product & { images: ProductImage[] }).images ?? []);
    this.variants.set(variants);
    this.loading.set(false);
  }

  goBack() {
    void this.router.navigate(['/products']);
  }

  formatAttributes(attrs: Record<string, string>): string {
    return Object.entries(attrs)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
  }

  openVariantDialog(variant?: Variant) {
    if (variant) {
      this.editingVariantId.set(variant.id);
      this.variantForm = {
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
        attributesJson: JSON.stringify(variant.attributes),
      };
    } else {
      this.editingVariantId.set(null);
      this.variantForm = { sku: '', price: 0, stock: 0, attributesJson: '{}' };
    }
    this.variantDialogVisible = true;
  }

  async saveVariant() {
    this.saving.set(true);
    const attributes = JSON.parse(this.variantForm.attributesJson) as Record<string, string>;

    if (this.editingVariantId()) {
      await this.http.put(`/variants/${this.editingVariantId()}`, {
        sku: this.variantForm.sku,
        price: Number(this.variantForm.price),
        stock: Number(this.variantForm.stock),
        attributes,
      });
    } else {
      await this.http.post('/variants', {
        productId: this.productId,
        sku: this.variantForm.sku,
        price: Number(this.variantForm.price),
        stock: Number(this.variantForm.stock),
        attributes,
      });
    }

    this.variantDialogVisible = false;
    await this.load();
    this.saving.set(false);
  }

  async deleteVariant(id: string) {
    await this.http.delete(`/variants/${id}`);
    await this.load();
  }

  async uploadImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const formData = new FormData();
    formData.append('file', input.files[0]);

    await this.http.upload(`/images/upload?productId=${this.productId}&isMain=false`, formData);
    await this.load();
  }

  async deleteImage(id: string) {
    await this.http.delete(`/images/${id}`);
    await this.load();
  }
}
