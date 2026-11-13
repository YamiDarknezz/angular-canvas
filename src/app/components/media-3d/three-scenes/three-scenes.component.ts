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
  signal,
  viewChild,
} from '@angular/core';

import type { SceneController, SceneVariant } from './three-scene';

const SCENES = {
  sculpture: { title: 'Nudo escultórico', accent: '#dba46a' },
  orbit: { title: 'Anillos orbitales', accent: '#7fb9ff' },
  waves: { title: 'Campo de ondas', accent: '#5ce2bd' },
  dunes: { title: 'Dunas de luz', accent: '#e8a977' },
  nebula: { title: 'Nebulosa espiral', accent: '#a699ff' },
  helix: { title: 'Doble hélice', accent: '#6de4e0' },
  tiles: { title: 'Mosaico cinético', accent: '#7f9dff' },
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

  constructor() {
    afterNextRender(() => void this.mount());
    effect(() => {
      this.controller()?.setScene(this.variant(), this.accent() ?? this.scene().accent);
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
