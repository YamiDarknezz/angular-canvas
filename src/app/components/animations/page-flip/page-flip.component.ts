import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-anim-page-flip',
  templateUrl: './page-flip.component.html',
  styleUrl: './page-flip.component.scss',
})
export class PageFlipComponent {
  readonly pageFlipped = signal(false);
  readonly bookFlipped = signal(false);
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
    if (this.turning() || !this.hasNext()) return;
    this.turning.set(true);
    this.bookFlipped.set(true);
    setTimeout(() => {
      this.spread.update((s) => s + 1);
      this.bookFlipped.set(false);
      this.turning.set(false);
    }, 950);
  }

  goPrev(): void {
    if (this.turning() || !this.hasPrev()) return;
    this.turning.set(true);
    this.bookFlipped.set(false);
    setTimeout(() => {
      this.spread.update((s) => s - 1);
      this.turning.set(false);
    }, 950);
  }

  toggleFold(): void {
    this.foldActive.update((v) => !v);
  }
}
