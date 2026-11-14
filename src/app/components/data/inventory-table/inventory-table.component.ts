import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';

export interface InventoryRow {
  readonly id: string;
  readonly sku: string;
  readonly name: string;
  readonly siteId: string;
  readonly siteLabel: string;
  readonly available: number;
  readonly minimum: number;
}

type Status = 'ok' | 'low' | 'out';
type StockFilter = 'all' | Status;
type SortKey = 'name' | 'siteLabel' | 'available' | 'minimum';
type Sort = { readonly key: SortKey; readonly direction: 'asc' | 'desc' };

const DEMO_PRODUCTS = [
  { sku: 'AB-104', name: 'Arroz de 1 kg', minimum: 12 },
  { sku: 'AB-202', name: 'Aceite de 900 ml', minimum: 8 },
  { sku: 'AB-023', name: 'Fideos de 500 g', minimum: 10 },
  { sku: 'BE-013', name: 'Agua de 600 ml', minimum: 16 },
  { sku: 'SN-033', name: 'Galletas de vainilla', minimum: 8 },
] as const;

function demoStock(
  sites: readonly { id: string; label: string; stock: readonly number[] }[],
): readonly InventoryRow[] {
  return sites.flatMap(({ id, label, stock }) =>
    DEMO_PRODUCTS.map((product, index) => ({
      ...product,
      id: `${id}/${product.sku}`,
      siteId: id,
      siteLabel: label,
      available: stock[index],
    })),
  );
}

export const BODEGA_INVENTORY = demoStock([
  { id: 'san-martin', label: 'Bodega San Martín', stock: [4, 0, 24, 9, 19] },
  { id: 'el-trebol', label: 'Bodega El Trébol', stock: [21, 6, 30, 22, 4] },
  { id: 'santa-rosa', label: 'Bodega Santa Rosa', stock: [3, 14, 0, 37, 16] },
]);

const WAREHOUSE_INVENTORY = demoStock([
  { id: 'north', label: 'Almacén Norte', stock: [45, 17, 8, 16, 0] },
  { id: 'south', label: 'Almacén Sur', stock: [17, 5, 12, 39, 22] },
]);

const LABELS: Record<Status, string> = {
  ok: 'Disponible',
  low: 'Bajo mínimo',
  out: 'Agotado',
};

const collator = new Intl.Collator('es-PE', { sensitivity: 'base', numeric: true });

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

/**
 * Angular standalone, sin librerías adicionales. Usa filas con ids estables por sede y SKU.
 * quantityChange y restockRequested son eventos para persistir cambios o crear pedidos en el anfitrión.
 */
@Component({
  selector: 'app-data-inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrl: './inventory-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // El input controla el diseño también cuando la tabla se compone dentro de otra demo.
  host: { '[attr.data-inventory-layout]': 'variant()' },
})
export class InventoryTableComponent {
  readonly variant = input<'store' | 'warehouse'>('store');
  readonly title = input<string>();
  readonly rows = input<readonly InventoryRow[]>();
  readonly selectedSite = input('all');
  readonly queuedIds = input<readonly string[]>();
  readonly quantityChange = output<InventoryRow>();
  readonly restockRequested = output<InventoryRow>();
  readonly siteChange = output<string>();

  private readonly injector = inject(Injector);
  private readonly quantityField = viewChild<ElementRef<HTMLInputElement>>('quantityField');
  private readonly filterInput = viewChild<ElementRef<HTMLInputElement>>('filterInput');
  private editTrigger?: HTMLButtonElement;
  private readonly edit = signal<{ id: string; value: string; error: string } | null>(null);
  private readonly source = computed(
    () => this.rows() ?? (this.variant() === 'warehouse' ? WAREHOUSE_INVENTORY : BODEGA_INVENTORY),
  );
  private readonly inventory = linkedSignal(this.source);
  protected readonly locationLabel = computed(() =>
    this.variant() === 'warehouse' ? 'Almacén' : 'Bodega',
  );
  protected readonly locationPlural = computed(() =>
    this.variant() === 'warehouse' ? 'Todos los almacenes' : 'Todas las bodegas',
  );
  protected readonly heading = computed(
    () =>
      this.title() ??
      (this.variant() === 'warehouse' ? 'Inventario por almacén' : 'Inventario por bodega'),
  );
  protected readonly caption = computed(
    () => `Existencias y mínimos de reposición por ${this.locationLabel().toLowerCase()}`,
  );
  private readonly localRequests = linkedSignal<readonly InventoryRow[], readonly string[]>({
    source: this.source,
    computation: (rows, previous) =>
      (previous?.value ?? []).filter((id: string) => rows.some((row) => row.id === id)),
  });
  protected readonly showingDemo = computed(() => this.rows() === undefined);
  protected readonly sites = computed(() =>
    [...new Map(this.inventory().map((row) => [row.siteId, row.siteLabel]))]
      .map(([id, label]) => ({ id, label }))
      .sort((first, second) => collator.compare(first.label, second.label)),
  );
  protected readonly site = linkedSignal({
    source: this.selectedSite,
    computation: (selected) => selected,
  });
  protected readonly activeSite = computed(() =>
    this.sites().some(({ id }) => id === this.site()) ? this.site() : 'all',
  );
  protected readonly query = signal('');
  protected readonly status = signal<StockFilter>('all');
  protected readonly sort = signal<Sort>({ key: 'name', direction: 'asc' });
  protected readonly message = signal('');

  private readonly matches = computed(() => {
    const site = this.activeSite();
    const words = normalize(this.query()).trim().split(/\s+/).filter(Boolean);
    return this.inventory().filter(
      (row) =>
        (site === 'all' || row.siteId === site) &&
        words.every((word) => normalize(`${row.name} ${row.sku} ${row.siteLabel}`).includes(word)),
    );
  });
  protected readonly counts = computed(() => {
    const rows = this.matches();
    return {
      total: rows.length,
      low: rows.filter((row) => this.stockStatus(row) === 'low').length,
      out: rows.filter((row) => this.stockStatus(row) === 'out').length,
    };
  });
  protected readonly visible = computed(() => {
    const status = this.status();
    const { key, direction } = this.sort();
    return this.matches()
      .filter((row) => status === 'all' || this.stockStatus(row) === status)
      .sort((a, b) => {
        const first = a[key];
        const second = b[key];
        const compare =
          typeof first === 'number' && typeof second === 'number'
            ? first - second
            : collator.compare(String(first), String(second));
        return compare * (direction === 'asc' ? 1 : -1) || collator.compare(a.id, b.id);
      });
  });
  protected readonly draft = computed(() => {
    const edit = this.edit();
    return edit && this.visible().some(({ id }) => id === edit.id) ? edit : null;
  });

  protected setQuery(value: string): void {
    this.abandonEdit();
    this.query.set(value);
  }

  protected setSite(value: string): void {
    this.abandonEdit();
    this.site.set(value);
    this.siteChange.emit(value);
  }

  protected setStatus(value: string): void {
    this.abandonEdit();
    this.status.set(value === 'ok' || value === 'low' || value === 'out' ? value : 'all');
  }

  protected clearFilters(): void {
    this.setQuery('');
    this.setStatus('all');
    this.setSite('all');
  }

  protected sortBy(key: SortKey): void {
    this.abandonEdit();
    const current = this.sort();
    this.sort.set({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    });
  }

  protected stockStatus(row: InventoryRow): Status {
    if (row.available <= 0) return 'out';
    return row.available < row.minimum ? 'low' : 'ok';
  }

  protected statusLabel(row: InventoryRow): string {
    return LABELS[this.stockStatus(row)];
  }

  protected startEdit(row: InventoryRow, button?: HTMLButtonElement): void {
    this.editTrigger = button;
    this.edit.set({ id: row.id, value: String(row.available), error: '' });
    this.message.set('');
    afterNextRender(
      () => {
        const field = this.quantityField()?.nativeElement;
        field?.focus();
        field?.select();
      },
      { injector: this.injector },
    );
  }

  protected updateDraft(value: string): void {
    this.edit.update((edit) => (edit ? { ...edit, value, error: '' } : null));
  }

  protected saveEdit(event: Event): void {
    event.preventDefault();
    const edit = this.draft();
    if (!edit) return;
    const amount = Number(edit.value);
    if (edit.value.trim() === '' || !Number.isSafeInteger(amount) || amount < 0) {
      this.edit.set({ ...edit, error: 'Ingresa un número entero mayor o igual a cero.' });
      this.quantityField()?.nativeElement.focus();
      return;
    }
    const row = this.inventory().find(({ id }) => id === edit.id);
    if (!row) return;
    const updated = { ...row, available: amount };
    this.inventory.update((rows) => rows.map((item) => (item.id === row.id ? updated : item)));
    this.finishEdit();
    this.message.set(`${row.name}: ${amount} unidades en ${row.siteLabel}.`);
    this.quantityChange.emit(updated);
  }

  protected cancelEdit(): void {
    this.finishEdit();
  }

  protected isQueued(id: string): boolean {
    return (this.queuedIds() ?? this.localRequests()).includes(id);
  }

  protected requestRestock(row: InventoryRow): void {
    if (this.stockStatus(row) === 'ok' || this.isQueued(row.id)) return;
    if (this.queuedIds() === undefined) {
      this.localRequests.update((ids) => [...ids, row.id]);
    }
    this.message.set(`Solicitud de reposición: ${row.name} · ${row.siteLabel}.`);
    this.restockRequested.emit(row);
  }

  private abandonEdit(): void {
    this.edit.set(null);
    this.editTrigger = undefined;
  }

  private finishEdit(): void {
    const trigger = this.editTrigger;
    this.abandonEdit();
    afterNextRender(
      () => {
        if (trigger?.isConnected) trigger.focus();
        else this.filterInput()?.nativeElement.focus();
      },
      { injector: this.injector },
    );
  }
}
