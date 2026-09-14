import { Component, signal } from '@angular/core';

/**
 * Efectos de transición tipo libro y papel: giro de página con perspectiva,
 * libro abierto con hoja que se curva y esquina que se levanta con sombra.
 *
 * Autocontenido: sin dependencias de la galería.
 */
@Component({
  selector: 'app-anim-page-flip',
  templateUrl: './page-flip.component.html',
  styleUrl: './page-flip.component.scss',
})
export class PageFlipComponent {
  readonly pageFlipped = signal(false);
  readonly bookPage = signal(0);
  readonly turning = signal(false);

  togglePage(): void {
    this.pageFlipped.update((v) => !v);
  }

  nextBookPage(): void {
    if (this.turning()) {
      return;
    }
    this.turning.set(true);
    setTimeout(() => {
      this.bookPage.update((p) => (p + 1) % 3);
      this.turning.set(false);
    }, 800);
  }
}
