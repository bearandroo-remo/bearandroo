import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [FormsModule, InputTextModule, PasswordModule, ButtonModule, FloatLabelModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(private router: Router) {}

  async onLogin() {
    this.loading = true;
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (!environment.production) {
        headers['x-api-key'] = environment.apiKey;
      } else {
        headers['x-tenant-domain'] = window.location.hostname;
      }

      const res = await fetch(`${environment.apiUrl}/auth/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email: this.email, password: this.password }),
      });

      const data = (await res.json()) as { accessToken: string; refreshToken: string };

      if (res.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        await this.router.navigate(['/dashboard']);
      }
    } finally {
      this.loading = false;
    }
  }
}
