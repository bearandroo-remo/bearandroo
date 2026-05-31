import { Component, signal } from '@angular/core';
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

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  logout() {
    localStorage.clear();
    void this.router.navigate(['/login']);
  }
}
