import { Injectable, signal, effect } from '@angular/core';

export type ThemeName = 'dark' | 'light' | 'hacker' | 'cyberpunk' | 'corporate';

export interface Theme {
  id: ThemeName;
  label: string;
  icon: string;
}

export const THEMES: readonly Theme[] = [
  { id: 'dark', label: 'Dark', icon: '🌙' },
  { id: 'light', label: 'Light', icon: '☀️' },
  { id: 'hacker', label: 'Hacker', icon: '💚' },
  { id: 'cyberpunk', label: 'Cyberpunk', icon: '🌆' },
  { id: 'corporate', label: 'Corporate', icon: '🏢' },
] as const;

const STORAGE_KEY = 'angular-canvas:theme';
const THEME_IDS = THEMES.map((t) => t.id);

function isThemeName(value: unknown): value is ThemeName {
  return typeof value === 'string' && (THEME_IDS as string[]).includes(value);
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly themes = THEMES;
  readonly theme = signal<ThemeName>(this.readInitialTheme());

  constructor() {
    // Sincroniza el atributo `data-theme` con el estado del signal.
    // Los tokens CSS en src/scss/_tokens.scss reaccionan a este atributo.
    effect(() => {
      const theme = this.theme();
      document.documentElement.setAttribute('data-theme', theme);
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // localStorage puede no estar disponible (modo privado / SSR).
      }
    });
  }

  setTheme(theme: ThemeName): void {
    this.theme.set(theme);
  }

  private readInitialTheme(): ThemeName {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isThemeName(stored)) {
        return stored;
      }
    } catch {
      // Ignorado: se usa el tema por defecto.
    }
    return 'dark';
  }
}
