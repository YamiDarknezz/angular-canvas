import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-btn-hold-confirm',
  templateUrl: './hold-confirm.component.html',
  styleUrl: './hold-confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HoldConfirmButtonComponent {
  readonly variant = input<string>();
  readonly label = input<string>();
  readonly duration = input(900);
  readonly disabled = input(false);
  readonly confirmed = output<void>();

  readonly milliseconds = computed(() => {
    const duration = this.duration();
    return Number.isFinite(duration) ? Math.max(400, duration) : 900;
  });
  readonly theme = computed(() =>
    this.variant() === 'publish'
      ? {
          action: 'Publicar cambios',
          result: 'Cambios publicados',
          heading: 'Publicación del catálogo',
        }
      : { action: 'Liberar pedido', result: 'Pedido liberado', heading: 'Salida de almacén' },
  );
  readonly action = computed(() => this.label() ?? this.theme().action);
  readonly phase = signal<'idle' | 'holding' | 'ready' | 'done'>('idle');
  readonly ask = signal(false);
  private pointerId?: number;
  private started = 0;
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearHold());
  }

  start(event: PointerEvent): void {
    if (this.disabled() || this.phase() !== 'idle' || !event.isPrimary || event.button !== 0)
      return;
    const button = event.currentTarget as HTMLButtonElement;
    this.ask.set(false);
    this.pointerId = event.pointerId;
    this.started = event.timeStamp;
    button.setPointerCapture(event.pointerId);
    this.phase.set('holding');
    this.timer = setTimeout(() => this.phase.set('ready'), this.milliseconds());
  }

  move(event: PointerEvent): void {
    if (event.pointerId === this.pointerId && !this.isInside(event)) this.cancel(event);
  }

  release(event: PointerEvent): void {
    if (event.pointerId !== this.pointerId) return;
    const completed = this.isInside(event) && event.timeStamp - this.started >= this.milliseconds();
    this.clearHold();
    if (completed && !this.disabled()) this.complete();
    else this.phase.set('idle');
  }

  cancel(event: PointerEvent): void {
    if (event.pointerId === this.pointerId) this.abort();
  }

  abort(): void {
    if (this.pointerId === undefined) return;
    this.clearHold();
    this.phase.set('idle');
  }

  activate(event: MouseEvent): void {
    if (event.detail === 0 && !this.disabled() && this.phase() === 'idle') this.ask.set(true);
  }

  complete(): void {
    if (this.disabled() || this.phase() === 'done') return;
    this.ask.set(false);
    this.phase.set('done');
    this.confirmed.emit();
  }

  private clearHold(): void {
    clearTimeout(this.timer);
    this.timer = undefined;
    this.pointerId = undefined;
  }

  private isInside(event: PointerEvent): boolean {
    const { left, top, right, bottom } = (
      event.currentTarget as HTMLElement
    ).getBoundingClientRect();
    return (
      event.clientX >= left &&
      event.clientX <= right &&
      event.clientY >= top &&
      event.clientY <= bottom
    );
  }
}
