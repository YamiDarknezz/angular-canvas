import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-anim-corner-fold',
  templateUrl: './corner-fold.component.html',
  styleUrl: './corner-fold.component.scss',
})
export class CornerFoldComponent {
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
