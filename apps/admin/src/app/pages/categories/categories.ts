import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { HttpService } from '../../http.service';
import { TabsModule } from 'primeng/tabs';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parent?: { name: string };
  isActive: boolean;
  image?: string;
  icon?: string;
}

@Component({
  selector: 'app-categories',
  imports: [
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    TagModule,
    TabsModule,
    CheckboxModule,
    TextareaModule,
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class CategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  loading = signal(false);
  saving = signal(false);
  dialogVisible = false;
  editingId = signal<string | null>(null);

  form = { name: '', slug: '', parentId: null as string | null, image: '', icon: '' };
  categoryActiveTab: string | number = '0';

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
    await this.load();
  }

  async load() {
    this.loading.set(true);
    this.categories.set(await this.http.get<Category[]>('/categories'));
    this.loading.set(false);
  }

  openDialog(category?: Category) {
    this.categoryActiveTab = '0';
    if (category) {
      this.editingId.set(category.id);
      this.form = {
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        image: category.image ?? '',
        icon: category.icon ?? '',
      };
      void this.loadSeo(category.id);
    } else {
      this.editingId.set(null);
      this.form = { name: '', slug: '', parentId: null, image: '', icon: '' };
      this.seoForm.canonicalUrl = `https://bearandroo.com.tr/kategori/${this.form.slug}`;
    }
    this.dialogVisible = true;
  }

  getParentName(parentId: string | null): string {
    if (!parentId) return '-';
    const parent = this.categories().find((c) => c.id === parentId);
    return parent?.name ?? '-';
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

  async loadSeo(categoryId: string) {
    try {
      const seo = await this.http.get<typeof this.seoForm | null>(`/seo/category/${categoryId}`);
      if (seo) {
        this.seoForm = {
          metaTitle: seo.metaTitle ?? '',
          metaDescription: seo.metaDescription ?? '',
          canonicalUrl: seo.canonicalUrl ?? `https://bearandroo.com.tr/kategori/${this.form.slug}`,
          noIndex: seo.noIndex ?? false,
          ogTitle: seo.ogTitle ?? '',
          ogDescription: seo.ogDescription ?? '',
          ogImage: seo.ogImage ?? '',
          twitterTitle: seo.twitterTitle ?? '',
          twitterDescription: seo.twitterDescription ?? '',
          twitterImage: seo.twitterImage ?? '',
        };
      } else {
        this.seoForm.canonicalUrl = `https://bearandroo.com.tr/kategori/${this.form.slug}`;
      }
    } catch {
      this.seoForm.canonicalUrl = `https://bearandroo.com.tr/kategori/${this.form.slug}`;
    }
  }

  async save() {
    this.saving.set(true);
    if (this.editingId()) {
      await this.http.put(`/categories/${this.editingId()}`, this.form);
      await this.http.put(`/seo/category/${this.editingId()}`, this.seoForm);
    } else {
      await this.http.post('/categories', this.form);
    }
    this.dialogVisible = false;
    await this.load();
    this.saving.set(false);
  }

  async delete(id: string) {
    await this.http.delete(`/categories/${id}`);
    await this.load();
  }
}
