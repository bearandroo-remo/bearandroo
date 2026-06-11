import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule, CommonModule, SelectModule],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class ShellComponent {
  menuOpen = signal(false);

  role = computed(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { role: string };
      return payload.role;
    } catch {
      return '';
    }
  });

  isSuperAdmin = computed(() => this.role() === 'SUPER_ADMIN');
  isTenantAdmin = computed(() => this.role() === 'TENANT_ADMIN');

  constructor(private router: Router) {}

  selectedTenantId = signal<string | null>(null);
  selectedTenantApiKey = signal<string | null>(null);
  tenants = signal<{ id: string; name: string; apiKey: string }[]>([]);

  async ngOnInit() {
    if (this.isSuperAdmin()) {
      await this.loadTenants();
    }
  }

  async loadTenants() {
    const token = localStorage.getItem('accessToken');
    const apiKey = this.getApiKey();
    const res = await fetch(`${environment.apiUrl}/super-admin/tenants`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-api-key': apiKey,
      },
    });
    if (res.ok) {
      const data = (await res.json()) as { id: string; name: string; apiKey: string }[];
      this.tenants.set(data);
    }
  }

  selectTenant(tenant: { id: string; name: string; apiKey: string }) {
    this.selectedTenantId.set(tenant.id);
    this.selectedTenantApiKey.set(tenant.apiKey);
    localStorage.setItem('selectedTenantApiKey', tenant.apiKey);
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

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  logout() {
    localStorage.clear();
    void this.router.navigate(['/login']);
  }
}
