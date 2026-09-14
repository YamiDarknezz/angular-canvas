import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-anim-page-flip',
  templateUrl: './page-flip.component.html',
  styleUrl: './page-flip.component.scss',
})
export class PageFlipComponent {
  readonly pageFlipped = signal(false);
  readonly bookFlipped = signal(false);
  readonly foldActive = signal(false);

  togglePage(): void {
    this.pageFlipped.update((v) => !v);
  }

  toggleBook(): void {
    if (this.bookFlipped()) {
      return;
    }
    this.bookFlipped.set(true);
  }

  toggleFold(): void {
    this.foldActive.update((v) => !v);
  }
}
