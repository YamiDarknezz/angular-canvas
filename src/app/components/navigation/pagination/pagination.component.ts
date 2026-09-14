import { Component, computed, signal } from '@angular/core';

type PageItem = number | '…';

/**
 * Paginación en tres acabados: números con elipsis, versión compacta y barra
 * de vidrio. El estado es local y compartido por las tres variantes.
 *
 * Autocontenido: sin dependencias de la galería.
 */
@Component({
  selector: 'app-nav-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  readonly total = 12;
  readonly page = signal(4);

  readonly pages = computed<readonly PageItem[]>(() => {
    const items: PageItem[] = [];
    for (let number = 1; number <= this.total; number++) {
      const near = Math.abs(number - this.page()) <= 1;
      if (number === 1 || number === this.total || near) {
        items.push(number);
      } else if (items[items.length - 1] !== '…') {
        items.push('…');
      }
    }
    return items;
  });

  go(item: PageItem): void {
    if (typeof item === 'number') {
      this.page.set(item);
    }
  }

  prev(): void {
    this.page.update((page) => Math.max(1, page - 1));
  }

  next(): void {
    this.page.update((page) => Math.min(this.total, page + 1));
  }
}
