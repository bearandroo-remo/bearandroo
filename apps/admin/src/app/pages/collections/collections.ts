import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { HttpService } from '../../http.service';
import { TabsModule } from 'primeng/tabs';

interface CollectionProduct {
  product: { id: string; name: string };
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  order: number;
  products: CollectionProduct[];
}

interface Product {
  id: string;
  name: string;
}

@Component({
  selector: 'app-collections',
  imports: [
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    SelectModule,
    TagModule,
    CheckboxModule,
    TabsModule,
  ],
  templateUrl: './collections.html',
  styleUrl: './collections.scss',
})
export class CollectionsComponent implements OnInit {
  collections = signal<Collection[]>([]);
  allProducts = signal<Product[]>([]);
  selectedCollection = signal<Collection | null>(null);
  loading = signal(false);
  saving = signal(false);
  dialogVisible = false;
  productsDialogVisible = false;
  editingId = signal<string | null>(null);
  selectedProductId: string | null = null;

  form = { name: '', slug: '', description: '', order: 0, isActive: true };
  activeTab: string | number = '0';

  seoForm = {
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    noIndex: false,
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
  };

  constructor(private http: HttpService) {}

  async ngOnInit() {
    await Promise.all([this.load(), this.loadProducts()]);
  }

  async load() {
    this.loading.set(true);
    this.collections.set(await this.http.get<Collection[]>('/collections'));
    this.loading.set(false);
  }

  async loadProducts() {
    this.allProducts.set(await this.http.get<Product[]>('/products'));
  }

  openDialog(collection?: Collection) {
    this.activeTab = '0';
    if (collection) {
      this.editingId.set(collection.id);
      this.form = {
        name: collection.name,
        slug: collection.slug,
        description: collection.description ?? '',
        order: collection.order,
        isActive: collection.isActive,
      };
      void this.loadSeo(collection.id);
    } else {
      this.editingId.set(null);
      this.form = { name: '', slug: '', description: '', order: 0, isActive: true };
      this.seoForm = {
        metaTitle: '',
        metaDescription: '',
        canonicalUrl: '',
        noIndex: false,
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        twitterTitle: '',
        twitterDescription: '',
        twitterImage: '',
      };
    }
    this.dialogVisible = true;
  }

  openProducts(collection: Collection) {
    this.selectedCollection.set(collection);
    this.productsDialogVisible = true;
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

  async loadSeo(collectionId: string) {
    try {
      const seo = await this.http.get<typeof this.seoForm | null>(
        `/seo/collection/${collectionId}`,
      );
      if (seo) {
        this.seoForm = {
          metaTitle: seo.metaTitle ?? '',
          metaDescription: seo.metaDescription ?? '',
          canonicalUrl:
            seo.canonicalUrl ?? `https://bearandroo.com.tr/koleksiyon/${this.form.slug}`,
          noIndex: seo.noIndex ?? false,
          ogTitle: seo.ogTitle ?? '',
          ogDescription: seo.ogDescription ?? '',
          ogImage: seo.ogImage ?? '',
          twitterTitle: seo.twitterTitle ?? '',
          twitterDescription: seo.twitterDescription ?? '',
          twitterImage: seo.twitterImage ?? '',
        };
      } else {
        this.seoForm.canonicalUrl = `https://bearandroo.com.tr/koleksiyon/${this.form.slug}`;
      }
    } catch {
      this.seoForm.canonicalUrl = `https://bearandroo.com.tr/koleksiyon/${this.form.slug}`;
    }
  }

  async save() {
    this.saving.set(true);
    if (this.editingId()) {
      await this.http.put(`/collections/${this.editingId()}`, this.form);
      await this.http.put(`/seo/collection/${this.editingId()}`, this.seoForm);
    } else {
      await this.http.post('/collections', this.form);
    }
    this.dialogVisible = false;
    await this.load();
    this.saving.set(false);
  }

  async delete(id: string) {
    await this.http.delete(`/collections/${id}`);
    await this.load();
  }

  async addProduct() {
    if (!this.selectedProductId || !this.selectedCollection()) return;
    this.saving.set(true);
    await this.http.post(`/collections/${this.selectedCollection()!.id}/products`, {
      productId: this.selectedProductId,
    });
    await this.load();
    this.selectedCollection.set(
      this.collections().find((c) => c.id === this.selectedCollection()!.id) ?? null,
    );
    this.selectedProductId = null;
    this.saving.set(false);
  }

  async removeProduct(productId: string) {
    if (!this.selectedCollection()) return;
    await this.http.delete(`/collections/${this.selectedCollection()!.id}/products/${productId}`);
    await this.load();
    this.selectedCollection.set(
      this.collections().find((c) => c.id === this.selectedCollection()!.id) ?? null,
    );
  }
}
