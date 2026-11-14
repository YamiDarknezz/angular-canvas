import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';

export type OrderStage = 'queued' | 'packing' | 'sent';
export interface WorkbenchLine {
  readonly sku: string;
  readonly label: string;
  readonly quantity: number;
}
export interface WorkbenchOrder {
  readonly id: string;
  readonly destination: string;
  readonly route: string;
  readonly time: string;
  readonly stage: OrderStage;
  readonly lines: readonly WorkbenchLine[];
}

const STAGES = [
  { id: 'queued', label: 'Por preparar', action: 'Empezar preparación' },
  { id: 'packing', label: 'En preparación', action: 'Registrar despacho' },
  { id: 'sent', label: 'Despachado', action: 'Despacho registrado' },
] as const;

const RICE = { sku: 'AB-104', label: 'Arroz de 1 kg', quantity: 24 };
const OIL = { sku: 'AB-202', label: 'Aceite de 900 ml', quantity: 12 };
const WATER = { sku: 'BE-013', label: 'Agua de 600 ml', quantity: 36 };
const PASTA = { sku: 'AB-023', label: 'Fideos de 500 g', quantity: 12 };
const WAREHOUSE: readonly WorkbenchOrder[] = [
  {
    id: 'PED-1048',
    destination: 'Muelle Norte',
    route: 'Ruta 01 · Lima Norte',
    time: '09:30',
    stage: 'queued',
    lines: [RICE, OIL, WATER],
  },
  {
    id: 'PED-1049',
    destination: 'Centro de distribución Sur',
    route: 'Ruta 02 · Lima Sur',
    time: '10:15',
    stage: 'queued',
    lines: [PASTA, OIL],
  },
  {
    id: 'PED-1050',
    destination: 'Muelle Principal',
    route: 'Ruta 04 · Lima Centro',
    time: '11:00',
    stage: 'packing',
    lines: [WATER, PASTA],
  },
  {
    id: 'PED-1045',
    destination: 'Depósito del Puerto',
    route: 'Ruta 03 · Callao',
    time: '08:45',
    stage: 'sent',
    lines: [RICE, WATER],
  },
];
const RETAIL: readonly WorkbenchOrder[] = [
  {
    id: 'REP-0282',
    destination: 'Bodega San Martín',
    route: 'Ruta 07 · Pueblo Libre',
    time: '10:00',
    stage: 'queued',
    lines: [RICE, PASTA, OIL],
  },
  {
    id: 'REP-0283',
    destination: 'Bodega El Trébol',
    route: 'Ruta 08 · Breña',
    time: '11:15',
    stage: 'queued',
    lines: [OIL, WATER],
  },
  {
    id: 'REP-0284',
    destination: 'Bodega Santa Rosa',
    route: 'Ruta 09 · Magdalena',
    time: '12:40',
    stage: 'packing',
    lines: [RICE, PASTA],
  },
  {
    id: 'REP-0281',
    destination: 'Bodega Las Flores',
    route: 'Ruta 07 · Pueblo Libre',
    time: '09:15',
    stage: 'sent',
    lines: [WATER, PASTA],
  },
];

function searchable(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

/** Angular standalone. Recibe pedidos por `orders` y emite el pedido actualizado por `orderChange`. */
@Component({
  selector: 'app-workflow-order-workbench',
  templateUrl: './order-workbench.component.html',
  styleUrl: './order-workbench.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-variant]': 'variant()' },
})
export class OrderWorkbenchComponent {
  readonly variant = input<'warehouse' | 'retail'>('warehouse');
  readonly orders = input<readonly WorkbenchOrder[]>();
  readonly orderChange = output<WorkbenchOrder>();

  protected readonly stages = STAGES;
  protected readonly filter = linkedSignal<'all' | OrderStage>(() => {
    this.variant();
    return 'all';
  });
  protected readonly query = linkedSignal(() => {
    this.variant();
    return '';
  });
  private readonly queue = linkedSignal(
    () => this.orders() ?? (this.variant() === 'retail' ? RETAIL : WAREHOUSE),
  );
  private readonly chosen = signal<string | null>(null);
  private readonly previous = signal<WorkbenchOrder | null>(null);
  protected readonly announcement = signal('');
  protected readonly filters = computed(() => [
    { id: 'all' as const, label: 'Todos', count: this.queue().length },
    ...STAGES.map((stage) => ({
      ...stage,
      count: this.queue().filter((order) => order.stage === stage.id).length,
    })),
  ]);
  protected readonly visible = computed(() => {
    const term = searchable(this.query().trim());
    const filter = this.filter();
    return this.queue().filter((order) => {
      return (
        (filter === 'all' || order.stage === filter) &&
        searchable([order.id, order.destination, order.route].join(' ')).includes(term)
      );
    });
  });
  protected readonly selected = computed(
    () => this.visible().find(({ id }) => id === this.chosen()) ?? this.visible()[0],
  );
  protected readonly canUndo = computed(() => {
    const previous = this.previous();
    const order = this.selected();
    return (
      !!previous &&
      !!order &&
      previous.id === order.id &&
      this.stageIndex(order.stage) === this.stageIndex(previous.stage) + 1
    );
  });

  protected choose(id: string): void {
    this.chosen.set(id);
    this.announcement.set('');
  }

  protected stageIndex(stage: OrderStage): number {
    return STAGES.findIndex(({ id }) => id === stage);
  }

  protected advance(order: WorkbenchOrder): void {
    const next = STAGES[this.stageIndex(order.stage) + 1];
    if (!next || !order.lines.length) return;
    this.previous.set(order);
    this.updateOrder({ ...order, stage: next.id }, `${order.id}: ${next.label}.`);
  }

  protected undo(order: WorkbenchOrder, action: HTMLButtonElement): void {
    const previous = this.previous();
    if (!previous || !this.canUndo()) return;
    this.previous.set(null);
    this.updateOrder({ ...order, stage: previous.stage }, `${order.id}: cambio de etapa deshecho.`);
    action.focus();
  }

  private updateOrder(order: WorkbenchOrder, message: string): void {
    this.queue.update((orders) =>
      orders.map((current) => (current.id === order.id ? order : current)),
    );
    this.chosen.set(order.id);
    if (this.filter() !== 'all' && this.filter() !== order.stage) this.filter.set('all');
    this.announcement.set(message);
    this.orderChange.emit(order);
  }
}
