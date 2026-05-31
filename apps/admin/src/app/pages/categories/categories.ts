import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { HttpService } from '../../http.service';

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parent?: { name: string };
  isActive: boolean;
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

  form = { name: '', slug: '', parentId: null as string | null };

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
    if (category) {
      this.editingId.set(category.id);
      this.form = { name: category.name, slug: category.slug, parentId: category.parentId };
    } else {
      this.editingId.set(null);
      this.form = { name: '', slug: '', parentId: null };
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

  async save() {
    this.saving.set(true);
    if (this.editingId()) {
      await this.http.put(`/categories/${this.editingId()}`, this.form);
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
