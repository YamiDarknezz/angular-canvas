import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import {
  StockStatusCardComponent,
  type StockItem,
} from '../../cards/stock-status/stock-status.component';
import {
  BODEGA_INVENTORY,
  InventoryTableComponent,
  type InventoryRow,
} from '../../data/inventory-table/inventory-table.component';
import {
  OrderWorkbenchComponent,
  type WorkbenchOrder,
} from '../order-workbench/order-workbench.component';

interface Replenishment {
  readonly rowId: string;
  readonly order: WorkbenchOrder;
  readonly received: boolean;
}

/** Ejemplo de composición local. Las tres piezas aceptan sus datos y emiten cambios al anfitrión. */
@Component({
  selector: 'app-workflow-replenishment-flow',
  imports: [InventoryTableComponent, StockStatusCardComponent, OrderWorkbenchComponent],
  templateUrl: './replenishment-flow.component.html',
  styleUrl: './replenishment-flow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReplenishmentFlowComponent {
  readonly variant = input<'retail'>('retail');
  protected readonly rows = signal<readonly InventoryRow[]>(BODEGA_INVENTORY);
  protected readonly selectedSite = signal('all');
  protected readonly message = signal('');
  private readonly lastTouchedSite = signal<string | undefined>(undefined);
  private readonly shipments = signal<readonly Replenishment[]>([]);
  private nextOrder = 1;

  protected readonly activeOrders = computed(() =>
    this.shipments()
      .filter(({ received }) => !received)
      .map(({ order }) => order),
  );
  protected readonly pendingRowIds = computed(() =>
    this.shipments()
      .filter(({ received }) => !received)
      .map(({ rowId }) => rowId),
  );
  protected readonly receipts = computed(() =>
    this.shipments().filter(({ order }) => order.stage === 'sent'),
  );
  protected readonly awaitingReceipt = computed(() =>
    this.receipts().some(({ received }) => !received),
  );

  private readonly activeSite = computed(() => {
    const site = this.selectedSite();
    return site === 'all' ? (this.lastTouchedSite() ?? this.rows()[0]?.siteId) : site;
  });
  private readonly siteRows = computed(() =>
    this.rows().filter((row) => row.siteId === this.activeSite()),
  );
  protected readonly siteTitle = computed(
    () => this.siteRows()[0]?.siteLabel ?? 'Existencias por bodega',
  );
  protected readonly stock = computed<readonly StockItem[]>(() =>
    this.siteRows().map((row) => ({
      id: row.id,
      name: row.name,
      available: row.available,
      minimum: row.minimum,
      capacity: Math.max(1, row.available, row.minimum * 2),
    })),
  );

  protected updateQuantity(row: InventoryRow): void {
    this.lastTouchedSite.set(row.siteId);
    this.replaceRow(row);
  }

  protected createOrder(row: InventoryRow): void {
    const current = this.rows().find(({ id }) => id === row.id);
    if (
      !current ||
      (current.available > 0 && current.available >= current.minimum) ||
      this.pendingRowIds().includes(row.id)
    ) {
      return;
    }

    // Para la demo se repone hasta el doble del mínimo y cada SKU viaja por separado.
    const quantity = Math.max(1, current.minimum * 2 - current.available);
    const id = 'REP-' + String(this.nextOrder++).padStart(3, '0');
    const order: WorkbenchOrder = {
      id,
      destination: current.siteLabel,
      route: 'Reposición de existencias',
      time: 'Por programar',
      stage: 'queued',
      lines: [{ sku: current.sku, label: current.name, quantity }],
    };
    this.lastTouchedSite.set(current.siteId);
    this.shipments.update((shipments) => [
      { rowId: current.id, order, received: false },
      ...shipments,
    ]);
    this.message.set(
      `Pedido ${id} creado: ${quantity} unidades de ${current.name} para ${current.siteLabel}.`,
    );
  }

  protected updateOrder(order: WorkbenchOrder): void {
    // El despacho y el registro de recepción son dos pasos independientes.
    this.shipments.update((shipments) =>
      shipments.map((shipment) =>
        shipment.order.id === order.id && !shipment.received
          ? { ...shipment, order: { ...shipment.order, stage: order.stage } }
          : shipment,
      ),
    );
    if (order.stage === 'sent') {
      this.message.set(
        `Pedido ${order.id} despachado. Confirma su llegada en Recepciones en bodega.`,
      );
    } else {
      this.message.set('');
    }
  }

  protected receive(id: string): void {
    const shipment = this.shipments().find(({ order }) => order.id === id);
    if (!shipment || shipment.received || shipment.order.stage !== 'sent') return;
    const row = this.rows().find((current) => current.id === shipment.rowId);
    if (!row) return;

    const quantity = shipment.order.lines[0].quantity;
    const available = row.available + quantity;
    if (!Number.isSafeInteger(available)) {
      this.message.set(
        'La cantidad supera el máximo admitido. Corrige las existencias y vuelve a registrar la recepción.',
      );
      return;
    }
    this.replaceRow({ ...row, available });
    this.shipments.update((shipments) =>
      shipments.map((entry) => (entry === shipment ? { ...entry, received: true } : entry)),
    );
    this.lastTouchedSite.set(row.siteId);
    this.message.set(
      `Recepción ${id} registrada. ${row.siteLabel} tiene ${available} unidades de ${row.name}.`,
    );
  }

  private replaceRow(row: InventoryRow): void {
    this.rows.update((rows) => rows.map((current) => (current.id === row.id ? row : current)));
  }
}
