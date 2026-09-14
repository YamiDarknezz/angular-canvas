import { Component, signal } from '@angular/core';

/**
 * Panel inferior tipo bottom-sheet con manija de arrastre visual (CSS) y
 * variantes sólida y de vidrio.
 *
 * Autocontenido: sin dependencias de la galería.
 */
@Component({
  selector: 'app-modal-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss',
})
export class BottomSheetComponent {
  readonly open = signal<string | null>(null);
  readonly confirmed = signal<string | null>(null);

  show(id: string): void {
    this.open.set(id);
  }

  close(): void {
    this.open.set(null);
  }

  select(option: string): void {
    this.confirmed.set(option);
    this.close();
  }
}
