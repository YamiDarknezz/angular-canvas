import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Angular standalone. El patrón vectorial se genera localmente y no necesita librerías. */
@Component({
  selector: 'app-bg-topographic',
  templateUrl: './topographic.component.html',
  styleUrl: './topographic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
    '[class.paused]': 'animate() === false',
    '[class.motion-forced]': 'animate() === true',
    '[style.--topographic-accent]': 'accent()',
  },
})
export class TopographicComponent {
  readonly variant = input<'terrain' | 'bathymetry' | 'plateau'>('terrain');
  readonly accent = input<string | null>(null);
  readonly animate = input<boolean | null>(null);

  protected readonly settings = computed(() => {
    switch (this.variant()) {
      case 'bathymetry':
        return {
          title: 'Cuenca oceánica',
          detail: 'Batimetría · Curvas de profundidad',
          phase: 1.5,
        };
      case 'plateau':
        return { title: 'Meseta mineral', detail: 'Relieve · Curvas de elevación', phase: 3.1 };
      default:
        return { title: 'Sierra central', detail: 'Relieve · Curvas de elevación', phase: 0 };
    }
  });

  protected readonly contours = computed(() => {
    const { phase } = this.settings();
    return Array.from({ length: 29 }, (_, level) => {
      const radius = 17 + level * 9.3;
      const points = Array.from({ length: 72 }, (_, index) => {
        const angle = (index / 72) * Math.PI * 2;
        const r =
          radius *
          (1 +
            0.13 * Math.sin(3 * angle + phase + level * 0.076) +
            0.08 * Math.cos(5 * angle + phase) +
            0.14 * Math.sin(angle - 0.6));
        const x = 623 + Math.cos(angle) * r * 1.51 - level * 1.6;
        const y = 205 + Math.sin(angle) * r * 0.88 - level * 0.72;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      });
      return 'M' + points.join('L') + 'Z';
    });
  });
}
