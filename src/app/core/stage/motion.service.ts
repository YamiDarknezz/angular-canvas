import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';

export type MotionMode = 'auto' | 'forced' | 'reduced';

const STORAGE_KEY = 'ac:motion-mode';

/**
 * Servicio de diagnóstico y control de animaciones.
 *
 * Detecta si el sistema operativo o navegador tiene desactivadas las animaciones
 * (`prefers-reduced-motion: reduce`) y permite forzar su ejecución (`forced`)
 * o simular la reducción (`reduced`) para pruebas de accesibilidad y diagnóstico.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly document = inject(DOCUMENT);

  /** Modo de movimiento elegido por el usuario ('auto', 'forced' o 'reduced'). */
  readonly mode = signal<MotionMode>(this.readInitialMode());

  /** `true` si el sistema operativo / navegador tiene activado prefers-reduced-motion. */
  readonly systemReduced = signal<boolean>(false);

  /** `true` si actualmente las animaciones se reproducen activamente. */
  readonly animationsActive = computed(() => {
    const current = this.mode();
    if (current === 'forced') return true;
    if (current === 'reduced') return false;
    return !this.systemReduced();
  });

  constructor() {
    const window = this.document.defaultView;
    if (!window || typeof window.matchMedia !== 'function') return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.systemReduced.set(mq.matches);

    mq.addEventListener('change', (e) => {
      this.systemReduced.set(e.matches);
      this.applyToDocument();
    });

    this.applyToDocument();
  }

  setMode(mode: MotionMode): void {
    this.mode.set(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignorar fallo de almacenamiento
    }
    this.applyToDocument();
  }

  toggleForced(): void {
    if (this.mode() === 'forced') {
      this.setMode('auto');
    } else {
      this.setMode('forced');
    }
  }

  private applyToDocument(): void {
    const root = this.document.documentElement;
    const mode = this.mode();
    root.setAttribute('data-motion-mode', mode);
    root.setAttribute('data-animations-active', String(this.animationsActive()));
  }

  private readInitialMode(): MotionMode {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'forced' || saved === 'reduced' || saved === 'auto') {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'auto';
  }
}
