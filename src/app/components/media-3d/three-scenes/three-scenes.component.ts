import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import type { SceneController, SceneVariant } from './three-scene';
import type { SceneChoice } from './interactive-scenes';

const SCENES = {
  sculpture: { title: 'Nudo escultórico', accent: '#dba46a' },
  orbit: { title: 'Anillos orbitales', accent: '#7fb9ff' },
  waves: { title: 'Campo de ondas', accent: '#5ce2bd' },
  dunes: { title: 'Dunas de luz', accent: '#e8a977' },
  nebula: { title: 'Nebulosa espiral', accent: '#a699ff' },
  helix: { title: 'Doble hélice', accent: '#6de4e0' },
  tiles: { title: 'Mosaico cinético', accent: '#7f9dff' },
  pendulums: { title: 'Onda de péndulos', accent: '#ffb887' },
  'light-trails': { title: 'Trayectorias de luz', accent: '#66f0d8' },
  exploded: { title: 'Ensamble en despiece', accent: '#7aabff' },
  warehouse: { title: 'Almacén interactivo', accent: '#66dabb' },
  sales: { title: 'Embudo comercial', accent: '#efa967' },
  teams: { title: 'Mapa de equipos', accent: '#acacff' },
  negotiation: { title: 'Sala de negociación', accent: '#eab279' },
  delivery: { title: 'Ruta de entrega', accent: '#f4bd6d' },
  showroom: { title: 'Catálogo de productos', accent: '#f3a48a' },
  office: { title: 'Equipo y áreas', accent: '#aeb7ff' },
  onboarding: { title: 'Recorrido de incorporación', accent: '#a3c9ff' },
  'team-calendar': { title: 'Agenda de equipo', accent: '#c6acff' },
  'cash-flow': { title: 'Flujo de caja', accent: '#7ce3b1' },
  'financial-board': { title: 'Panel financiero', accent: '#80d9ed' },
  budget: { title: 'Distribución de presupuesto', accent: '#9be5a3' },
} satisfies Record<SceneVariant, { title: string; accent: string }>;

/**
 * Requiere Angular standalone, three@^0.184.0 y @types/three@^0.184.1 (desarrollo).
 * Copia la carpeta completa. El motor se carga solo en el navegador y usa WebGL 2.
 */
@Component({
  selector: 'app-media-three-scenes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './three-scenes.component.html',
  styleUrl: './three-scenes.component.scss',
})
export class ThreeScenesComponent {
  readonly variant = input<SceneVariant>('sculpture');
  readonly accent = input<string | null>(null);
  readonly animate = input<boolean | null>(null);
  /** Presentación decorativa para fondos y paneles de otros componentes. */
  readonly decorative = input(false);
  readonly choiceSelected = output<SceneChoice>();

  protected readonly scene = computed(() => SCENES[this.variant()] ?? SCENES.sculpture);
  protected readonly status = signal<'loading' | 'ready' | 'unavailable' | 'lost'>('loading');
  private readonly playingOverride = signal<boolean | null>(null);
  protected readonly reducedMotion = signal(false);
  protected readonly playing = computed(
    () =>
      this.animate() !== false &&
      (this.playingOverride() ?? this.animate() ?? !this.reducedMotion()),
  );

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly destroyRef = inject(DestroyRef);
  private readonly controller = signal<SceneController | null>(null);
  protected readonly choices = signal<readonly SceneChoice[]>([]);
  protected readonly selectedIndex = signal<number | undefined>(undefined);
  protected readonly selectedChoice = signal<SceneChoice | undefined>(undefined);
  private tapStart?: { id: number; x: number; y: number };

  constructor() {
    afterNextRender(() => void this.mount());
    effect(() => {
      const choices = this.controller()?.setScene(
        this.variant(),
        this.accent() ?? this.scene().accent,
      );
      this.choices.set(choices ?? []);
      this.selectedIndex.set(undefined);
      this.selectedChoice.set(undefined);
      this.tapStart = undefined;
    });
    effect(() => this.controller()?.setPlaying(this.playing()));
    effect(() => this.controller()?.setInteractive(!this.decorative()));
  }

  protected toggleAnimation(): void {
    this.playingOverride.set(!this.playing());
  }

  protected resetView(): void {
    this.controller()?.resetView();
  }

  protected moveCamera(event: KeyboardEvent): void {
    if (this.controller()?.moveCamera(event.key)) event.preventDefault();
  }

  protected startTap(event: PointerEvent): void {
    this.tapStart =
      event.isPrimary && event.button === 0 && this.choices().length
        ? { id: event.pointerId, x: event.clientX, y: event.clientY }
        : undefined;
  }

  protected checkTapMovement(event: PointerEvent): void {
    const start = this.tapStart;
    if (
      start &&
      start.id === event.pointerId &&
      Math.hypot(event.clientX - start.x, event.clientY - start.y) > 7
    ) {
      this.tapStart = undefined;
    }
  }

  protected finishTap(event: PointerEvent): void {
    this.checkTapMovement(event);
    const start = this.tapStart;
    this.tapStart = undefined;
    if (!start || start.id !== event.pointerId) return;
    const index = this.controller()?.pick(event.clientX, event.clientY);
    if (index !== undefined) this.selectChoice(index);
  }

  protected tapCanceled(): void {
    this.tapStart = undefined;
  }

  protected selectChoice(index: number): void {
    const choice = this.choices()[index];
    if (!choice || this.decorative() || this.status() !== 'ready') return;
    this.controller()?.select(index);
    this.selectedIndex.set(index);
    const snapshot = { ...choice };
    this.selectedChoice.set(snapshot);
    this.choiceSelected.emit(snapshot);
  }

  private async mount(): Promise<void> {
    const canvas = this.canvas().nativeElement;
    const view = canvas.ownerDocument.defaultView;
    if (!view) return;

    const preference = view.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => this.reducedMotion.set(preference.matches);
    updatePreference();
    preference.addEventListener('change', updatePreference);
    this.destroyRef.onDestroy(() => preference.removeEventListener('change', updatePreference));

    try {
      const { createThreeScene } = await import('./three-scene');
      if (this.destroyRef.destroyed) return;

      const controller = createThreeScene(canvas, (lost) =>
        this.status.set(lost ? 'lost' : 'ready'),
      );
      this.destroyRef.onDestroy(() => controller.dispose());
      this.controller.set(controller);
      this.status.set('ready');
    } catch {
      if (!this.destroyRef.destroyed) this.status.set('unavailable');
    }
  }
}
