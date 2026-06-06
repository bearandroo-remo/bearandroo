import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { HttpService } from '../../http.service';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  plan: string;
  isActive: boolean;
  apiKey: string;
  _count: { products: number; users: number; orders: number };
}

@Component({
  selector: 'app-tenants',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    TagModule,
  ],
  templateUrl: './tenants.html',
  styleUrl: './tenants.scss',
})
export class TenantsComponent implements OnInit {
  tenants = signal<Tenant[]>([]);
  loading = signal(false);
  saving = signal(false);
  dialogVisible = false;
  editingId = signal<string | null>(null);

  form = {
    name: '',
    slug: '',
    domain: '',
    plan: 'FREE',
    adminEmail: '',
    adminPassword: '',
    adminName: '',
  };

  planOptions = [
    { label: 'Free', value: 'FREE' },
    { label: 'Basic', value: 'BASIC' },
    { label: 'Pro', value: 'PRO' },
  ];

  constructor(private http: HttpService) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.loading.set(true);
    this.tenants.set(await this.http.get<Tenant[]>('/super-admin/tenants'));
    this.loading.set(false);
  }

  openDialog(tenant?: Tenant) {
    if (tenant) {
      this.editingId.set(tenant.id);
      this.form = {
        name: tenant.name,
        slug: tenant.slug,
        domain: tenant.domain ?? '',
        plan: tenant.plan,
        adminEmail: '',
        adminPassword: '',
        adminName: '',
      };
    } else {
      this.editingId.set(null);
      this.form = {
        name: '',
        slug: '',
        domain: '',
        plan: 'FREE',
        adminEmail: '',
        adminPassword: '',
        adminName: '',
      };
    }
    this.dialogVisible = true;
  }

  autoSlug(name: string) {
    if (this.editingId()) return;
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
      await this.http.put(`/super-admin/tenants/${this.editingId()}`, {
        name: this.form.name,
        domain: this.form.domain || undefined,
        plan: this.form.plan,
      });
    } else {
      await this.http.post('/super-admin/tenants', this.form);
    }
    this.dialogVisible = false;
    await this.load();
    this.saving.set(false);
  }

  async toggleActive(tenant: Tenant) {
    await this.http.put(`/super-admin/tenants/${tenant.id}`, { isActive: !tenant.isActive });
    await this.load();
  }
}
