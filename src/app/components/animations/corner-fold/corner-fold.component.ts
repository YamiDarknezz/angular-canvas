import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-anim-corner-fold',
  templateUrl: './corner-fold.component.html',
  styleUrl: './corner-fold.component.scss',
})
export class CornerFoldComponent {
  readonly notePinned = signal(false);
  readonly docPinned = signal(false);
  readonly peelPinned = signal(false);

  readonly noteSize = signal<number | null>(null);
  readonly docSize = signal<number | null>(null);
  readonly peelSize = signal<number | null>(null);

  onMouseMove(event: MouseEvent, type: 'note' | 'doc' | 'peel'): void {
    const card = (event.currentTarget as HTMLElement).getBoundingClientRect();
    // Distancia del cursor hacia la esquina superior derecha
    const dx = card.right - event.clientX;
    const dy = event.clientY - card.top;
    const dist = Math.hypot(dx, dy);

    // Radio de proximidad: 220px
    const maxDist = 220;
    if (dist < maxDist) {
      // Progresión suave: entre 28px en reposo hasta 90px cerca de la esquina
      const factor = Math.max(0, 1 - dist / maxDist);
      const size = Math.round(28 + factor * 62);
      this.setSize(type, size);
    } else {
      this.setSize(type, null);
    }
  }

  onMouseLeave(type: 'note' | 'doc' | 'peel'): void {
    this.setSize(type, null);
  }

  toggle(type: 'note' | 'doc' | 'peel'): void {
    if (type === 'note') this.notePinned.update((v) => !v);
    if (type === 'doc') this.docPinned.update((v) => !v);
    if (type === 'peel') this.peelPinned.update((v) => !v);
  }

  private setSize(type: 'note' | 'doc' | 'peel', size: number | null): void {
    if (type === 'note') this.noteSize.set(size);
    if (type === 'doc') this.docSize.set(size);
    if (type === 'peel') this.peelSize.set(size);
  }
}
