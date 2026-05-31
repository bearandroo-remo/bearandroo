import { Component, signal, OnInit, computed } from '@angular/core';
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
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ImageModule } from 'primeng/image';


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
  variantId: string | null;
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
    SelectModule,
    CheckboxModule,
    ImageModule,
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

  variantForm = { sku: '', price: 0, stock: 0, attributes: [] as { key: string; value: string }[] };

  imageDialogVisible = false;
  uploading = signal(false);
  selectedFile: File | null = null;
  imageForm = { variantId: null as string | null, isMain: false };

  private productId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpService,
  ) {}

  variantOptions = computed(() =>
    this.variants().map((v) => ({
      label:
        v.sku +
        ' — ' +
        Object.entries(v.attributes)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', '),
      value: v.id,
    })),
  );

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
        attributes: Object.entries(variant.attributes).map(([key, value]) => ({ key, value })),
      };
    } else {
      this.editingVariantId.set(null);
      this.variantForm = { sku: '', price: 0, stock: 0, attributes: [] };
    }
    this.variantDialogVisible = true;
  }

  addAttr() {
    this.variantForm.attributes.push({ key: '', value: '' });
  }

  removeAttr(index: number) {
    this.variantForm.attributes.splice(index, 1);
  }

  async saveVariant() {
    this.saving.set(true);
    const attributes = this.variantForm.attributes.reduce(
      (acc, { key, value }) => {
        if (key) acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    );

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

  getVariantName(variantId: string | null): string | null {
    if (!variantId) return null;
    const variant = this.variants().find((v) => v.id === variantId);
    if (!variant) return null;
    return Object.entries(variant.attributes)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
  }

  openImageDialog() {
    this.imageForm = { variantId: null, isMain: false };
    this.selectedFile = null;
    this.imageDialogVisible = true;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  async uploadImage() {
    if (!this.selectedFile) return;
    this.uploading.set(true);

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    let url = `/images/upload?productId=${this.productId}&isMain=${this.imageForm.isMain}`;
    if (this.imageForm.variantId) url += `&variantId=${this.imageForm.variantId}`;

    await this.http.upload(url, formData);
    this.imageDialogVisible = false;
    await this.load();
    this.uploading.set(false);
  }

  async setMain(id: string) {
    await this.http.put(`/images/${id}/main`, {});
    await this.load();
  }

  async deleteImage(id: string) {
    await this.http.delete(`/images/${id}`);
    await this.load();
  }
}
