import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpService {
  constructor(private router: Router) {}

  private get token() {
    return localStorage.getItem('accessToken') ?? '';
  }

  private get apiKey(): string {
    const token = localStorage.getItem('accessToken');
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { apiKey?: string };
      return payload.apiKey ?? '';
    } catch {
      return '';
    }
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
      'x-api-key': this.apiKey,
    };
  }

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${environment.apiUrl}${path}`, { headers: this.headers });
    if (res.status === 401) {
      localStorage.clear();
      void this.router.navigate(['/login']);
      throw new Error('Unauthorized');
    }
    const text = await res.text();
    if (!text) return null as T;
    return JSON.parse(text) as T;
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${environment.apiUrl}${path}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });
    if (res.status === 401) {
      localStorage.clear();
      void this.router.navigate(['/login']);
      throw new Error('Unauthorized');
    }
    const text = await res.text();
    if (!text) return null as T;
    return JSON.parse(text) as T;
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${environment.apiUrl}${path}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(body),
    });
    if (res.status === 401) {
      localStorage.clear();
      void this.router.navigate(['/login']);
      throw new Error('Unauthorized');
    }
    const text = await res.text();
    if (!text) return null as T;
    return JSON.parse(text) as T;
  }

  async delete<T>(path: string): Promise<T> {
    const res = await fetch(`${environment.apiUrl}${path}`, {
      method: 'DELETE',
      headers: this.headers,
    });
    if (res.status === 401) {
      localStorage.clear();
      void this.router.navigate(['/login']);
      throw new Error('Unauthorized');
    }
    const text = await res.text();
    if (!text) return null as T;
    return JSON.parse(text) as T;
  }

  async upload(path: string, formData: FormData): Promise<unknown> {
    const res = await fetch(`${environment.apiUrl}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'x-api-key': this.apiKey,
      },
      body: formData,
    });
    if (res.status === 401) {
      localStorage.clear();
      void this.router.navigate(['/login']);
      throw new Error('Unauthorized');
    }
    return res.json();
  }
}
