import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-media-before-after',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './before-after.component.html',
  styleUrl: './before-after.component.scss',
})
export class BeforeAfterComponent {
  readonly variant = input<string>('split');
  readonly accent = input<string | null>(null);
  readonly animate = input<boolean | null>(null);

  protected readonly mode = computed(() => {
    const variant = this.variant();
    return variant === 'fade' || variant === 'scanner' ? variant : 'split';
  });
  protected readonly pieces = [
    18, 18, 28, 36, 28, 18, 18, 30, 48, 64, 46, 24, 24, 44, 70, 96, 64, 30, 24, 38, 58, 76, 48, 24,
    18, 24, 36, 48, 32, 18, 18, 18, 24, 28, 20, 18,
  ];

  private readonly positions = signal({ split: 50, fade: 50, scanner: 50 });
  protected readonly position = computed(() => this.positions()[this.mode()]);
  private readonly scanOverride = signal<boolean | null>(null);
  private readonly destroyRef = inject(DestroyRef);
  private readonly reducedMotion = signal(false);
  private readonly ready = signal(false);
  protected readonly scanning = computed(
    () =>
      this.mode() === 'scanner' &&
      this.animate() !== false &&
      (this.scanOverride() ?? this.animate() ?? !this.reducedMotion()),
  );

  private scanDirection = 1;
  private pointerId?: number;

  constructor() {
    afterNextRender(() => {
      const preference = matchMedia('(prefers-reduced-motion: reduce)');
      const updatePreference = () => this.reducedMotion.set(preference.matches);
      updatePreference();
      preference.addEventListener('change', updatePreference);
      this.destroyRef.onDestroy(() => preference.removeEventListener('change', updatePreference));
      this.ready.set(true);
    });

    // El iframe cambia el input sin desmontar el componente. El intervalo sigue la variante activa.
    effect((onCleanup) => {
      if (!this.ready() || !this.scanning()) return;
      const interval = setInterval(() => {
        if (document.hidden || !this.scanning()) return;
        const next = this.position() + this.scanDirection;
        if (next >= 93) this.scanDirection = -1;
        if (next <= 7) this.scanDirection = 1;
        this.setPosition(Math.max(7, Math.min(93, next)));
      }, 42);
      onCleanup(() => clearInterval(interval));
    });
  }

  protected toggleScanner(): void {
    this.scanOverride.set(!this.scanning());
  }

  protected scrub(value: number): void {
    if (this.mode() === 'scanner') this.scanOverride.set(false);
    this.setPosition(value);
  }

  protected startDrag(event: PointerEvent): void {
    if (this.mode() !== 'split' || !event.isPrimary || event.button !== 0) return;

    const viewport = event.currentTarget as HTMLElement;
    this.pointerId = event.pointerId;
    viewport.setPointerCapture(event.pointerId);
    this.drag(event);
  }

  protected drag(event: PointerEvent): void {
    if (event.pointerId !== this.pointerId || this.mode() !== 'split') return;

    const { left, width } = (event.currentTarget as HTMLElement).getBoundingClientRect();
    if (width > 0) this.setPosition(Math.round(((event.clientX - left) / width) * 100));
  }

  protected stopDrag(event: PointerEvent): void {
    if (event.pointerId === this.pointerId) this.pointerId = undefined;
  }

  private setPosition(value: number): void {
    this.positions.update((positions) => ({
      ...positions,
      [this.mode()]: Math.max(0, Math.min(100, value)),
    }));
  }
}
