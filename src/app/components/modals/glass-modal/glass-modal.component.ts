import { Component, ElementRef, afterRenderEffect, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-modal-glass',
  templateUrl: './glass-modal.component.html',
  styleUrl: './glass-modal.component.scss',
  host: {
    '(document:keydown.escape)': 'close()',
  },
})
export class GlassModalComponent {
  readonly isOpen = signal(false);

  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');

  private lastFocused: HTMLElement | null = null;

  constructor() {
    // Al abrir, el foco pasa al botón de cierre para que el teclado funcione.
    afterRenderEffect(() => {
      if (this.isOpen()) {
        this.closeButton()?.nativeElement.focus();
      }
    });
  }

  open(): void {
    // Recordamos quién abrió el diálogo para devolverle el foco al cerrar
    // (patrón WAI-ARIA de diálogo modal).
    this.lastFocused = document.activeElement as HTMLElement | null;
    this.isOpen.set(true);
  }

  close(): void {
    if (!this.isOpen()) {
      return;
    }
    this.isOpen.set(false);
    this.lastFocused?.focus();
    this.lastFocused = null;
  }
}
