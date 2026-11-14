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

type ProgressPhase = 'idle' | 'running' | 'complete' | 'cancelled';

/** Angular standalone. Demostración local; completed emite al completar el flujo. */
@Component({
  selector: 'app-feedback-task-progress',
  templateUrl: './task-progress.component.html',
  styleUrl: './task-progress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-variant]': 'variant()' },
})
export class TaskProgressComponent {
  readonly variant = input<'report' | 'sync'>('report');
  readonly completed = output<void>();
  protected readonly phase = signal<ProgressPhase>('idle');
  protected readonly step = signal(0);
  protected readonly config = computed(() =>
    this.variant() === 'sync'
      ? {
          title: 'Sincronizar inventario',
          stages: ['Leer existencias', 'Comparar cambios', 'Actualizar datos'],
        }
      : {
          title: 'Preparar informe',
          stages: ['Reunir datos', 'Generar documento', 'Verificar resultado'],
        },
  );
  protected readonly status = computed(() => {
    switch (this.phase()) {
      case 'running':
        return this.config().stages[this.step()];
      case 'complete':
        return 'Proceso completado.';
      case 'cancelled':
        return 'Proceso cancelado. Puedes reiniciarlo.';
      default:
        return 'Todo listo para comenzar.';
    }
  });
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected runAction(): void {
    if (this.phase() === 'running') this.cancel();
    else this.start();
  }

  private start(): void {
    clearTimeout(this.timer);
    this.step.set(0);
    this.phase.set('running');
    this.schedule();
  }

  private cancel(): void {
    clearTimeout(this.timer);
    this.phase.set('cancelled');
  }

  private schedule(): void {
    this.timer = setTimeout(() => {
      this.step.update((step) => step + 1);
      if (this.step() >= this.config().stages.length) {
        this.phase.set('complete');
        this.completed.emit();
      } else {
        this.schedule();
      }
    }, 1050);
  }
}
