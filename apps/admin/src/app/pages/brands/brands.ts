import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { HttpService } from '../../http.service';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  isActive: boolean;
}

@Component({
  selector: 'app-brands',
  imports: [FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, TagModule],
  templateUrl: './brands.html',
  styleUrl: './brands.scss',
})
export class BrandsComponent implements OnInit {
  brands = signal<Brand[]>([]);
  loading = signal(false);
  saving = signal(false);
  dialogVisible = false;
  editingId = signal<string | null>(null);

  form = { name: '', slug: '', logo: '' };

  constructor(private http: HttpService) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.loading.set(true);
    this.brands.set(await this.http.get<Brand[]>('/brands'));
    this.loading.set(false);
  }

  openDialog(brand?: Brand) {
    if (brand) {
      this.editingId.set(brand.id);
      this.form = { name: brand.name, slug: brand.slug, logo: brand.logo ?? '' };
    } else {
      this.editingId.set(null);
      this.form = { name: '', slug: '', logo: '' };
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
    if (this.editingId()) {
      await this.http.put(`/brands/${this.editingId()}`, this.form);
    } else {
      await this.http.post('/brands', this.form);
    }
    this.dialogVisible = false;
    await this.load();
    this.saving.set(false);
  }

  async delete(id: string) {
    await this.http.delete(`/brands/${id}`);
    await this.load();
  }
}
