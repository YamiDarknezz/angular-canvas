import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

export interface WaterfallStep {
  readonly label: string;
  readonly value: number;
}

export interface WaterfallSelection extends WaterfallStep {
  readonly balance: number;
  readonly kind: 'total' | 'gain' | 'loss';
}

const FINANCE: readonly WaterfallStep[] = [
  { label: 'Ventas', value: 56 },
  { label: 'Costos', value: -31 },
  { label: 'Ajustes', value: 12 },
  { label: 'Gastos', value: -19 },
];

const INVENTORY: readonly WaterfallStep[] = [
  { label: 'Compras', value: 90 },
  { label: 'Salidas', value: -110 },
  { label: 'Retornos', value: 30 },
  { label: 'Mermas', value: -15 },
];

const numberFormat = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 2 });

/** Barras acumuladas en CSS, con datos opcionales y selección por clic o teclado. */
@Component({
  selector: 'app-chart-waterfall',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './waterfall-chart.component.html',
  styleUrl: './waterfall-chart.component.scss',
})
export class WaterfallChartComponent {
  readonly variant = input<string>('finance');
  readonly opening = input<number | null>(null);
  readonly steps = input<readonly WaterfallStep[] | null>(null);
  readonly unit = input<string | null>(null);
  readonly stepSelected = output<WaterfallSelection>();

  private readonly selected = signal<number | undefined>(undefined);
  protected readonly inventory = computed(() => this.variant() === 'inventory');
  protected readonly unitLabel = computed(
    () => this.unit() ?? (this.inventory() ? 'unidades' : 'miles de soles'),
  );

  protected readonly chart = computed(() => {
    const startValue = this.opening() ?? (this.inventory() ? 160 : 84);
    const opening = Number.isFinite(startValue) ? startValue : 0;
    const steps = this.steps() ?? (this.inventory() ? INVENTORY : FINANCE);
    const columns = [
      { label: 'Inicio', value: opening, balance: opening, kind: 'total' as const, start: 0 },
    ] as (WaterfallSelection & { start: number })[];
    let balance = opening;
    let min = Math.min(0, opening);
    let max = Math.max(0, opening);
    for (const step of steps) {
      const next = balance + step.value;
      if (!Number.isFinite(next)) continue;
      columns.push({
        ...step,
        start: balance,
        balance: next,
        kind: step.value < 0 ? 'loss' : 'gain',
      });
      balance = next;
      min = Math.min(min, balance);
      max = Math.max(max, balance);
    }
    columns.push({ label: 'Cierre', value: balance, balance, kind: 'total', start: 0 });

    const span = max - min || 1;
    const low = min === 0 ? 0 : min - span * 0.12;
    const high = max + span * 0.12;
    const position = (value: number) => ((value - low) / (high - low)) * 100;
    return {
      baseline: position(0),
      columns: columns.map((entry) => ({
        ...entry,
        bottom: position(Math.min(entry.start, entry.balance)),
        height: Math.abs(position(entry.start) - position(entry.balance)),
        junction: position(entry.balance),
        shownValue: this.display(entry.value, entry.kind !== 'total'),
      })),
    };
  });

  protected readonly selectedIndex = computed(() => {
    const index = this.selected();
    const columns = this.chart().columns;
    return index !== undefined && index < columns.length ? index : columns.length - 1;
  });
  protected readonly detail = computed(() => this.chart().columns[this.selectedIndex()]);

  protected choose(index: number): void {
    const { label, value, balance, kind } = this.chart().columns[index];
    this.selected.set(index);
    this.stepSelected.emit({ label, value, balance, kind });
  }

  protected display(value: number, signed = false): string {
    return (signed && value > 0 ? '+' : '') + numberFormat.format(value);
  }
}
