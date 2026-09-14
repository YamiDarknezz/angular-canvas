import { Injectable, signal } from '@angular/core';

/**
 * Estado compartido del buscador global (`Ctrl/⌘ + K`): el sidebar abre, el
 * shell monta la paleta. Es andamiaje de la galería.
 */
@Injectable({ providedIn: 'root' })
export class QuickSwitcherService {
  readonly open = signal(false);

  show(): void {
    this.open.set(true);
  }

  hide(): void {
    this.open.set(false);
  }
}
