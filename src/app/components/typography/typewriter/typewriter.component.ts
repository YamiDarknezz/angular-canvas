import { Component, OnDestroy, OnInit, signal } from '@angular/core';

const TEXTS: readonly string[] = [
  'Hola Mundo',
  'Angular Canvas',
  'Diseño Infinity',
  'Creative Code',
];

const TYPE_MS = 100;
const DELETE_MS = 50;
const HOLD_MS = 2000;
const NEXT_MS = 300;

@Component({
  selector: 'app-text-typewriter',
  templateUrl: './typewriter.component.html',
  styleUrl: './typewriter.component.scss',
})
export class TypewriterComponent implements OnInit, OnDestroy {
  readonly currentText = signal('');

  private textIndex = 0;
  private charIndex = 0;
  private deleting = false;
  private timeoutId?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.tick();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
  }

  private tick(): void {
    const full = TEXTS[this.textIndex];

    if (this.deleting) {
      this.charIndex--;
      this.currentText.set(full.slice(0, this.charIndex));

      if (this.charIndex === 0) {
        this.deleting = false;
        this.textIndex = (this.textIndex + 1) % TEXTS.length;
        this.schedule(NEXT_MS);
        return;
      }

      this.schedule(DELETE_MS);
      return;
    }

    this.charIndex++;
    this.currentText.set(full.slice(0, this.charIndex));

    if (this.charIndex === full.length) {
      this.deleting = true;
      this.schedule(HOLD_MS);
      return;
    }

    this.schedule(TYPE_MS);
  }

  private schedule(delay: number): void {
    this.timeoutId = setTimeout(() => this.tick(), delay);
  }
}
