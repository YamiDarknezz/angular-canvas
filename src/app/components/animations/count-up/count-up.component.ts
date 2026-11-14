import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

/** Angular standalone. Anima métricas con requestAnimationFrame y respeta movimiento reducido. */
@Component({
  selector: 'app-anim-count-up',
  templateUrl: './count-up.component.html',
  styleUrl: './count-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-variant]': 'variant()', '[style.--counter-accent]': 'accent()' },
})
export class CountUpComponent {
  readonly variant = input<'fulfillment' | 'conversion'>('fulfillment');
  readonly accent = input<string | null>(null);
  readonly animate = input<boolean | null>(null);
  readonly target = input<number | null>(null);
  private readonly destroyRef = inject(DestroyRef);
  private frame?: number;
  private readonly progress = signal(1);
  private readonly running = signal(false);
  private readonly ready = signal(false);
  private readonly reduced = signal(false);
  protected readonly model = computed(() =>
    this.variant() === 'conversion'
      ? { title: 'Tasa de conversión', goal: 28.4, format: 'percent' }
      : { title: 'Pedidos despachados', goal: 1248, format: 'count' },
  );
  protected readonly goal = computed(() => {
    const value = this.target();
    return value !== null && Number.isFinite(value) ? value : this.model().goal;
  });
  protected readonly shownProgress = computed(() => (this.motionAllowed() ? this.progress() : 1));
  protected readonly displayed = computed(() => this.format(this.shownProgress() * this.goal()));
  protected readonly finalValue = computed(() => this.format(this.goal()));
  protected readonly canReplay = computed(() => this.ready() && this.motionAllowed());
  protected readonly isRunning = this.running.asReadonly();

  constructor() {
    afterNextRender(() => {
      const query = window.matchMedia('(prefers-reduced-motion: reduce)');
      const update = () => {
        this.reduced.set(query.matches);
        if (!this.motionAllowed()) this.cancel();
      };
      update();
      query.addEventListener('change', update);
      this.destroyRef.onDestroy(() => query.removeEventListener('change', update));
      this.ready.set(true);
    });
    this.destroyRef.onDestroy(() => this.cancel());
  }

  private motionAllowed(): boolean {
    return this.animate() ?? !this.reduced();
  }

  protected replay(): void {
    this.cancel();
    this.progress.set(0);
    this.running.set(true);
    let first: number | undefined;
    const tick = (now: number) => {
      if (!this.motionAllowed()) {
        this.cancel();
        return;
      }
      first ??= now;
      const ratio = Math.min((now - first) / 1350, 1);
      this.progress.set(1 - (1 - ratio) ** 3);
      if (ratio < 1) this.frame = requestAnimationFrame(tick);
      else {
        this.frame = undefined;
        this.running.set(false);
      }
    };
    this.frame = requestAnimationFrame(tick);
  }

  private cancel(): void {
    if (this.frame !== undefined) cancelAnimationFrame(this.frame);
    this.frame = undefined;
    this.progress.set(1);
    this.running.set(false);
  }

  private format(value: number): string {
    const isPercent = this.model().format === 'percent';
    return new Intl.NumberFormat(
      'es-PE',
      isPercent
        ? { style: 'percent', maximumFractionDigits: 1, minimumFractionDigits: 1 }
        : { maximumFractionDigits: 0 },
    ).format(isPercent ? value / 100 : value);
  }
}
