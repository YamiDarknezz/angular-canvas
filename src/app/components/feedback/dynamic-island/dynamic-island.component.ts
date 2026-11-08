import { Component, ElementRef, OnDestroy, OnInit, input, signal, viewChild } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-dynamic-island',
  templateUrl: './dynamic-island.component.html',
  styleUrl: './dynamic-island.component.scss',
})
export class DynamicIslandComponent implements OnInit, OnDestroy {
  readonly variant = input<string>('music');

  readonly islandBox = viewChild<ElementRef<HTMLElement>>('islandBox');
  readonly isExpanded = signal<boolean>(false);
  readonly isPlaying = signal<boolean>(true);
  readonly timerSeconds = signal<number>(45);

  private timerInterval?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    if (this.variant() === 'timer') {
      this.timerInterval = setInterval(() => {
        this.timerSeconds.update((s) => (s > 0 ? s - 1 : 60));
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  toggleExpand(): void {
    const el = this.islandBox()?.nativeElement;
    const nextState = !this.isExpanded();
    this.isExpanded.set(nextState);

    if (el) {
      gsap.fromTo(el, { scale: 0.94 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.7)' });
    }
  }

  togglePlay(e: MouseEvent): void {
    e.stopPropagation();
    this.isPlaying.update((p) => !p);
  }
}
