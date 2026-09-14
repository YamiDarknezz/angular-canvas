import { Injectable, signal, computed } from '@angular/core';

export type ThemeName = 'dark' | 'light' | 'hacker' | 'cyberpunk' | 'corporate';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  currentTheme = signal<ThemeName>('dark');

  themes: ThemeName[] = ['dark', 'light', 'hacker', 'cyberpunk', 'corporate'];

  setTheme(theme: ThemeName) {
    this.currentTheme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  cycleTheme() {
    const idx = this.themes.indexOf(this.currentTheme());
    const next = this.themes[(idx + 1) % this.themes.length];
    this.setTheme(next);
  }
}
