import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-anim-page-flip',
  templateUrl: './page-flip.component.html',
  styleUrl: './page-flip.component.scss',
})
export class PageFlipComponent {
  readonly flipped = signal(false);

  toggleFlip(): void {
    this.flipped.update((v) => !v);
  }
}
