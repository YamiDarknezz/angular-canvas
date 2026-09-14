import { Component, signal } from '@angular/core';

/**
 * Efectos de transición tipo libro y papel: giro de página, libro abierto y
 * esquina que se dobla. Cada variante tiene un estado activo/quieto.
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

  togglePage(): void {
    this.pageFlipped.update((v) => !v);
  }

  nextBookPage(): void {
    this.bookPage.update((p) => (p + 1) % 3);
  }
}
