import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal<boolean>(this.loadTheme());

  constructor() {
    this.applyTheme(this.isDark());
  }

  toggle(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    this.applyTheme(next);
    localStorage.setItem('mlff_theme', next ? 'dark' : 'light');
  }

  private applyTheme(dark: boolean): void {
    if (dark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }

  private loadTheme(): boolean {
    return localStorage.getItem('mlff_theme') === 'dark';
  }
}
