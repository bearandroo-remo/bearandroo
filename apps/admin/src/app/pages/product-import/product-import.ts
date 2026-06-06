import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpService } from '../../http.service';
import { environment } from '../../../environments/environment';

interface ValidationResult {
  valid: boolean;
  errors: { sheet: string; row: number; field: string; message: string }[];
  warnings: string[];
  summary: {
    categories: number;
    brands: number;
    collections: number;
    products: number;
    variants: number;
    newCategories: string[];
    newBrands: string[];
    newCollections: string[];
    slugConflicts: string[];
  };
}

interface ImportResult {
  imported: number;
  errors: string[];
}

@Component({
  selector: 'app-product-import',
  imports: [CommonModule, ButtonModule, FileUploadModule],
  templateUrl: './product-import.html',
  styleUrl: './product-import.scss',
})
export class ProductImportComponent {
  selectedFile: File | null = null;
  validating = signal(false);
  importing = signal(false);
  validationResult = signal<ValidationResult | null>(null);
  importResult = signal<ImportResult | null>(null);

  constructor(private http: HttpService) {}

  onFileSelect(event: { files: File[] }) {
    this.selectedFile = event.files[0] ?? null;
    this.validationResult.set(null);
    this.importResult.set(null);
  }

  downloadTemplate() {
    const token = localStorage.getItem('accessToken');
    const apiKey = this.getApiKey();
    const link = document.createElement('a');
    link.href = `${environment.apiUrl}/product-import/template`;
    link.setAttribute('download', 'urun-import-template.xlsx');

    // Token ile fetch et
    void fetch(`${environment.apiUrl}/product-import/template`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-api-key': apiKey,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      });
  }

  async validate() {
    if (!this.selectedFile) return;
    this.validating.set(true);
    this.validationResult.set(null);

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const result = (await this.http.upload(
      '/product-import/validate',
      formData,
    )) as ValidationResult;
    this.validationResult.set(result);
    this.validating.set(false);
  }

  async import() {
    if (!this.selectedFile) return;
    this.importing.set(true);

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const result = (await this.http.upload('/product-import/import', formData)) as ImportResult;
    this.importResult.set(result);
    this.importing.set(false);
  }

  exportProducts() {
    const token = localStorage.getItem('accessToken');
    const apiKey = this.getApiKey();
    void fetch(`${environment.apiUrl}/product-import/export`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-api-key': apiKey,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'urunler-export.xlsx');
        link.click();
        URL.revokeObjectURL(url);
      });
  }

  private getApiKey(): string {
    const token = localStorage.getItem('accessToken');
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { apiKey?: string };
      return payload.apiKey ?? '';
    } catch {
      return '';
    }
  }
}
