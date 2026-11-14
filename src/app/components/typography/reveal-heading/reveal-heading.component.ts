import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

/** Angular standalone. Se puede usar como encabezado y disparar la entrada desde el padre. */
@Component({
  selector: 'app-type-reveal-heading',
  templateUrl: './reveal-heading.component.html',
  styleUrl: './reveal-heading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
    '[class.static]': 'animate() === false',
    '[class.motion-forced]': 'animate() === true',
    '[style.--reveal-accent]': 'accent()',
  },
})
export class RevealHeadingComponent {
  readonly variant = input<'mask' | 'shutter' | 'underline'>('mask');
  readonly text = input('Las ideas toman forma');
  readonly accent = input<string | null>(null);
  readonly animate = input<boolean | null>(null);
  readonly showReplay = input(true);
  readonly replayToken = input(0);
  private readonly replayCount = signal(0);

  protected readonly animationKeys = computed(() => [
    `${this.variant()}:${this.replayToken()}:${this.replayCount()}`,
  ]);
  protected readonly words = computed(() => this.text().trim().split(/\s+/));

  protected replay(): void {
    this.replayCount.update((count) => count + 1);
  }
}
