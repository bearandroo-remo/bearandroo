import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpService {
  constructor(private router: Router) {}

  private get token() {
    return localStorage.getItem('accessToken') ?? '';
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    };
  }

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${environment.apiUrl}${path}`, { headers: this.headers });
    if (res.status === 401) {
      localStorage.clear();
      void this.router.navigate(['/login']);
      throw new Error('Unauthorized');
    }
    return res.json() as Promise<T>;
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
    return res.json() as Promise<T>;
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
    return res.json() as Promise<T>;
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
    return res.json() as Promise<T>;
  }

  async upload(path: string, formData: FormData): Promise<unknown> {
    const res = await fetch(`${environment.apiUrl}${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}` },
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
