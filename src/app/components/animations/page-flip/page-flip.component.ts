import { Component, input, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-anim-page-flip',
  imports: [NgTemplateOutlet],
  templateUrl: './page-flip.component.html',
  styleUrl: './page-flip.component.scss',
})
export class PageFlipComponent {
  readonly variant = input<string>();
  readonly flipped = signal(false);

  toggleFlip(): void {
    this.flipped.update((v) => !v);
  }
}
