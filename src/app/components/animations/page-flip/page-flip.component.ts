import { Component, computed, ElementRef, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-anim-page-flip',
  templateUrl: './page-flip.component.html',
  styleUrl: './page-flip.component.scss',
})
export class PageFlipComponent {
  private readonly rightRef = viewChild<ElementRef<HTMLElement>>('rightPage');

  readonly pageFlipped = signal(false);
  readonly foldActive = signal(false);
  readonly spread = signal(0);
  readonly turning = signal(false);

  readonly totalSpreads = 3;
  readonly leftPage = computed(() => this.spread() * 2 + 1);
  readonly rightFrontPage = computed(() => this.spread() * 2 + 2);
  readonly rightBackPage = computed(() => {
    const n = this.spread() * 2 + 3;
    return n > 6 ? 1 : n;
  });
  readonly hasPrev = computed(() => this.spread() > 0);
  readonly hasNext = computed(() => this.spread() < this.totalSpreads - 1);

  togglePage(): void {
    this.pageFlipped.update((v) => !v);
  }

  goNext(): void {
    const el = this.rightRef()?.nativeElement;
    if (!el || this.turning() || !this.hasNext()) return;
    this.turning.set(true);
    // Giro hacia adelante
    el.style.transform = 'rotateY(-180deg)';
    setTimeout(() => {
      this.spread.update((s) => s + 1);
      // Reset instantáneo: desactivar transición, quitar transform, reactivar
      el.style.transition = 'none';
      el.style.transform = '';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = '';
          this.turning.set(false);
        });
      });
    }, 900);
  }

  goPrev(): void {
    if (this.turning() || !this.hasPrev()) return;
    this.turning.set(true);
    this.spread.update((s) => s - 1);
    setTimeout(() => {
      this.turning.set(false);
    }, 900);
  }

  toggleFold(): void {
    this.foldActive.update((v) => !v);
  }
}
