import { Component, ElementRef, afterRenderEffect, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-modal-slide-in',
  templateUrl: './slide-in.component.html',
  styleUrl: './slide-in.component.scss',
  host: {
    '(document:keydown.escape)': 'close()',
  },
})
export class SlideInModalComponent {
  readonly isOpen = signal(false);

  readonly placeholders = [1, 2, 3, 4];

  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');

  private lastFocused: HTMLElement | null = null;

  constructor() {
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
