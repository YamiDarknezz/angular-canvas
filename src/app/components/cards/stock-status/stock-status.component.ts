import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

export interface StockItem {
  readonly id: string;
  readonly name: string;
  readonly available: number;
  readonly minimum: number;
  readonly capacity: number;
}

const WAREHOUSE: readonly StockItem[] = [
  { id: 'AB-01', name: 'Abarrotes', available: 34, minimum: 12, capacity: 48 },
  { id: 'SN-08', name: 'Snacks', available: 8, minimum: 10, capacity: 32 },
  { id: 'BE-04', name: 'Bebidas', available: 19, minimum: 15, capacity: 40 },
];

const STORE: readonly StockItem[] = [
  { id: 'AR-04', name: 'Arroz de 1 kg', available: 4, minimum: 6, capacity: 18 },
  { id: 'AC-02', name: 'Aceite de 900 ml', available: 0, minimum: 5, capacity: 18 },
  { id: 'FI-03', name: 'Fideos de 500 g', available: 13, minimum: 5, capacity: 20 },
];

@Component({
  selector: 'app-card-stock-status',
  templateUrl: './stock-status.component.html',
  styleUrl: './stock-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockStatusCardComponent {
  readonly variant = input<string>();
  readonly title = input('Estado del inventario');
  readonly items = input<readonly StockItem[]>();
  readonly itemSelected = output<StockItem>();
  readonly onlyLow = signal(false);
  private readonly selection = signal<string | undefined>(undefined);

  readonly stock = computed(() => this.items() ?? (this.variant() === 'store' ? STORE : WAREHOUSE));
  readonly low = computed(() => this.stock().filter((item) => this.lowStock(item)));
  readonly visible = computed(() => (this.onlyLow() ? this.low() : this.stock()));
  readonly selected = computed(() => this.visible().find((item) => item.id === this.selection()));

  lowStock(item: StockItem): boolean {
    return item.available === 0 || item.available < item.minimum;
  }

  ratio(value: number, capacity: number): number {
    if (!Number.isFinite(value) || !Number.isFinite(capacity) || capacity <= 0) return 0;
    return Math.min(1, Math.max(0, value / capacity));
  }

  select(item: StockItem): void {
    this.selection.set(this.selection() === item.id ? undefined : item.id);
    this.itemSelected.emit(item);
  }
}
