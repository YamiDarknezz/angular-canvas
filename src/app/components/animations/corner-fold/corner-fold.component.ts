import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';

const WIDTH = 440;
const HEIGHT = 252;
const PEEK = 68;
const MAXIMUM = 192;

const MODELS = {
  note: {
    title: 'Preparar\nel cierre',
    kind: 'Nota de trabajo',
    body: ['Revisar las entregas pendientes antes', 'de confirmar el inventario.'],
    footer: 'Operaciones',
    under: 'PENDIENTE',
    surface: '#4a4035',
    paper: '#f5d88a',
    back: '#fff0c5',
    edge: '#bd8e43',
    ink: '#372816',
    open: 0.73,
    initial: 0.12,
  },
  document: {
    title: 'Acta de\nrecepción',
    kind: 'Control de almacén',
    body: ['Verificar el contenido del pedido', 'antes de cerrar la recepción.'],
    footer: 'Documento de muestra',
    under: 'VERIFICADO',
    surface: '#40505a',
    paper: '#e7ebeb',
    back: '#f8fcfa',
    edge: '#a3b5b8',
    ink: '#243946',
    open: 0.83,
    initial: 0.12,
  },
  peel: {
    title: 'Bodega\nde barrio',
    kind: 'Reposición',
    body: ['Abarrotes y bebidas'],
    footer: 'Punto de venta',
    under: 'SOPORTE',
    surface: '#343c36',
    paper: '#b6d598',
    back: '#edf1d9',
    edge: '#8ea775',
    ink: '#243924',
    open: 1,
    initial: 0.24,
  },
} as const;

/** Angular standalone. El pliegue usa geometría SVG, sin dependencias ni imágenes externas. */
@Component({
  selector: 'app-anim-corner-fold',
  templateUrl: './corner-fold.component.html',
  styleUrl: './corner-fold.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-fold-style]': 'style()' },
})
export class CornerFoldComponent {
  readonly variant = input<string>();
  readonly accent = input<string | null>(null);
  readonly animate = input<boolean | null>(null);

  protected readonly style = computed(() => {
    const variant = this.variant();
    return variant === 'document' || variant === 'peel' ? variant : 'note';
  });
  protected readonly model = computed(() => MODELS[this.style()]);
  protected readonly heading = computed(() => this.model().title.split('\n'));
  protected readonly accessiblePaper = computed(
    () => `${this.heading().join(' ')}. ${this.model().body.join(' ')}`,
  );
  protected readonly amount = linkedSignal<number>(() => this.model().initial);
  protected readonly percentage = computed(() => Math.round(this.amount() * 100));
  protected readonly lifted = computed(() => this.amount() >= 0.5);
  protected readonly shape = computed(() => {
    const amount = this.amount();
    const depth = Math.max(
      0,
      amount < 0.25 ? (PEEK * amount) / 0.25 : PEEK + ((MAXIMUM - PEEK) * (amount - 0.25)) / 0.75,
    );
    const x = WIDTH - depth;
    const midX = WIDTH - depth * 0.5;
    const midY = depth * 0.5;
    // La punta se proyecta alrededor de la bisagra A–B. A partir de 90° aparece el reverso.
    const angle = Math.PI * Math.min(0.95, amount * 2.6);
    const normal = Math.cos(angle);
    const lift = Math.sin(angle) * depth;
    const tipX = midX + depth * 0.5 * normal - lift * 0.09;
    const tipY = midY - depth * 0.5 * normal + lift * 0.15;
    const bow = (this.style() === 'peel' ? 0.1 : 0.03) * depth;
    const curve = `M${x} 0 Q${(x + tipX) / 2 - bow} ${tipY * 0.54} ${tipX} ${tipY} Q${(tipX + WIDTH) / 2} ${(tipY + depth) / 2 + bow} ${WIDTH} ${depth} Z`;
    return {
      front: `M0 0 H${x} L${WIDTH} ${depth} V${HEIGHT} H0 Z`,
      revealed: `M${x} 0 H${WIDTH} V${depth} Z`,
      flap: curve,
      crease: `M${x} 0 L${WIDTH} ${depth}`,
      light: `M${x + (tipX - x) * 0.15} ${tipY * 0.15} Q${(x + tipX) / 2 - bow} ${tipY * 0.54} ${tipX} ${tipY} Q${(tipX + WIDTH) / 2} ${(tipY + depth) / 2 + bow} ${WIDTH - (WIDTH - tipX) * 0.1} ${depth - (depth - tipY) * 0.1}`,
      shadow: `translate(${-4 - lift * 0.07} ${4 + lift * 0.11})`,
      shade: `M${x} 0 L${WIDTH} ${depth} L${WIDTH - depth * 0.16} ${depth + depth * 0.01} L${x - depth * 0.09} ${depth * 0.05} Z`,
      underside: `M${x} 0 L${WIDTH} ${depth} Q${midX - depth * 0.21} ${midY + depth * 0.24} ${x} 0 Z`,
      tipX,
      tipY,
      reverse: normal < 0,
      depth,
    };
  });

  private frame?: number;
  private suppressClick = false;
  private drag?: {
    id: number;
    x: number;
    y: number;
    amount: number;
    width: number;
    moved: boolean;
  };

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stop());
  }

  protected toggleCorner(event: MouseEvent): void {
    if (this.suppressClick && event.detail > 0) {
      this.suppressClick = false;
      return;
    }
    this.toggle(event);
  }

  protected toggle(event: MouseEvent): void {
    this.playTo(this.lifted() ? 0 : this.model().open, event.currentTarget as HTMLElement);
  }

  protected setAmount(value: string): void {
    this.stop();
    this.amount.set(Math.min(1, Math.max(0, Number(value) / 100)));
  }

  protected pointerDown(event: PointerEvent, sheet: HTMLElement): void {
    if (!event.isPrimary || event.button !== 0) return;
    this.stop();
    this.suppressClick = false;
    this.drag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      amount: this.amount(),
      width: sheet.getBoundingClientRect().width,
      moved: false,
    };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected pointerMove(event: PointerEvent): void {
    const drag = this.drag;
    if (!drag || drag.id !== event.pointerId || !drag.width) return;
    const dx = drag.x - event.clientX;
    const dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true;
    const next = drag.amount + (dx + dy) / (drag.width * 0.68);
    this.amount.set(Math.min(1, Math.max(0, next)));
  }

  protected pointerEnd(event: PointerEvent): void {
    if (event.pointerId !== this.drag?.id) return;
    this.suppressClick = this.drag.moved;
    this.drag = undefined;
  }

  private playTo(target: number, element: HTMLElement): void {
    this.stop();
    const view = element.ownerDocument.defaultView;
    if (
      !view ||
      !(this.animate() ?? !view.matchMedia('(prefers-reduced-motion: reduce)').matches)
    ) {
      this.amount.set(target);
      return;
    }
    const start = this.amount();
    let first: number | undefined;
    const tick = (now: number) => {
      first ??= now;
      const ratio = this.animate() === false ? 1 : Math.min(1, (now - first) / 520);
      this.amount.set(start + (target - start) * (1 - (1 - ratio) ** 3));
      this.frame = ratio < 1 ? view.requestAnimationFrame(tick) : undefined;
    };
    this.frame = view.requestAnimationFrame(tick);
  }

  private stop(): void {
    if (this.frame !== undefined) cancelAnimationFrame(this.frame);
    this.frame = undefined;
  }
}
