import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CATALOG, findGroup, TOTAL_COMPONENTS, TOTAL_VARIANTS } from '../../core/catalog/catalog';
import { catalogSearch } from '../../core/catalog/style-dictionary';
import { LibraryService } from '../../core/library/library.service';
import { IconComponent } from '../../core/ui/icon.component';
import { QuickSwitcherService } from '../../layout/quick-switcher/quick-switcher.service';

const PAGE_SIZE = 12;
const PREFERRED_GROUPS = ['workflows', 'data', 'media-3d', 'cards', 'forms', 'charts'];

@Component({
  selector: 'ac-home',
  imports: [RouterLink, IconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly library = inject(LibraryService);
  private readonly quickSwitcher = inject(QuickSwitcherService);
  readonly group = input<string>();
  protected readonly selectedGroup = computed(() => findGroup(this.group()));
  protected readonly catalog = [...CATALOG].sort(
    (a, b) => this.categoryRank(a.id) - this.categoryRank(b.id),
  );
  protected readonly totalComponents = TOTAL_COMPONENTS;
  protected readonly totalVariants = TOTAL_VARIANTS;
  protected readonly query = signal('');
  protected readonly limit = signal(PAGE_SIZE);
  protected readonly results = computed(() =>
    catalogSearch(this.query(), this.selectedGroup()?.id),
  );
  protected readonly visible = computed(() => this.results().slice(0, this.limit()));
  protected readonly shelves = computed(() =>
    [
      { label: 'Favoritos', icon: 'star', items: this.library.favorites() },
      { label: 'Recientes', icon: 'clock', items: this.library.recents() },
    ].filter(({ items }) => items.length),
  );
  protected readonly startingPoints = [
    {
      label: 'Simular una reposición',
      category: 'Flujos de trabajo',
      icon: 'workflows',
      tone: 'mint',
      path: '/workflows/replenishment-flow/retail',
    },
    {
      label: 'Consultar inventario por bodega',
      category: 'Tablas y datos',
      icon: 'data',
      tone: 'lilac',
      path: '/data/inventory-table/store',
    },
    {
      label: 'Entender movimientos de caja',
      category: 'Charts',
      icon: 'charts',
      tone: 'amber',
      path: '/charts/waterfall-chart/finance',
    },
  ];

  protected openSearch(): void {
    this.quickSwitcher.show();
  }

  protected updateQuery(value: string): void {
    this.query.set(value);
    this.resetLimit();
  }

  protected resetLimit(): void {
    this.limit.set(PAGE_SIZE);
  }

  protected showMore(): void {
    this.limit.update((limit) => limit + PAGE_SIZE);
  }

  protected toggleFavorite(group: string, entry: string): void {
    this.library.toggleFavorite(group, entry);
  }

  protected isFavorite(group: string, entry: string): boolean {
    return this.library.isFavorite(group, entry);
  }

  private categoryRank(id: string): number {
    const rank = PREFERRED_GROUPS.indexOf(id);
    return rank === -1 ? PREFERRED_GROUPS.length : rank;
  }
}
