import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule, CommonModule],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class ShellComponent {
  menuOpen = signal(false);

  isSuperAdmin = computed(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { role: string };
      return payload.role === 'SUPER_ADMIN';
    } catch {
      return false;
    }
  });

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  logout() {
    localStorage.clear();
    void this.router.navigate(['/login']);
  }
}
