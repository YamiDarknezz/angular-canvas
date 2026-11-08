import { Component, ElementRef, OnDestroy, OnInit, input, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-media-before-after',
  templateUrl: './before-after.component.html',
  styleUrl: './before-after.component.scss',
})
export class BeforeAfterComponent implements OnInit, OnDestroy {
  readonly variant = input<string>('split');

  readonly containerRef = viewChild<ElementRef<HTMLElement>>('boxEl');

  // Posición del divisor (0 a 100%)
  readonly position = signal<number>(50);
  readonly isDragging = signal<boolean>(false);

  private scanInterval?: ReturnType<typeof setInterval>;
  private scanDirection = 1;

  ngOnInit(): void {
    if (this.variant() === 'scanner') {
      this.scanInterval = setInterval(() => {
        this.position.update((p) => {
          let next = p + this.scanDirection * 0.75;
          if (next >= 90) {
            this.scanDirection = -1;
            next = 90;
          } else if (next <= 10) {
            this.scanDirection = 1;
            next = 10;
          }
          return next;
        });
      }, 25);
    }
  }

  ngOnDestroy(): void {
    if (this.scanInterval) clearInterval(this.scanInterval);
  }

  onPointerDown(e: MouseEvent): void {
    this.isDragging.set(true);
    this.updatePos(e);
  }

  onPointerMove(e: MouseEvent): void {
    if (!this.isDragging() && this.variant() !== 'split') return;
    if (e.buttons === 1) {
      this.updatePos(e);
    }
  }

  onPointerUp(): void {
    this.isDragging.set(false);
  }

  private updatePos(e: MouseEvent): void {
    const box = this.containerRef()?.nativeElement;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    this.position.set(pct);
  }
}
