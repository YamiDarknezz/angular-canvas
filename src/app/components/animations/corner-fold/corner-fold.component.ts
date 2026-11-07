import { Component, input, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-anim-corner-fold',
  imports: [NgTemplateOutlet],
  templateUrl: './corner-fold.component.html',
  styleUrl: './corner-fold.component.scss',
})
export class CornerFoldComponent {
  readonly variant = input<string>();

  readonly noteActive = signal(false);
  readonly docActive = signal(false);
  readonly peelActive = signal(false);

  toggleNote(): void {
    this.noteActive.update((v) => !v);
  }

  toggleDoc(): void {
    this.docActive.update((v) => !v);
  }

  togglePeel(): void {
    this.peelActive.update((v) => !v);
  }
}
