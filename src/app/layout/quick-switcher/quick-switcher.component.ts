import { Component, computed, effect, inject, signal, viewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { CATALOG, CatalogEntry, CatalogGroup, CatalogVariant } from '../../core/catalog/catalog';
import { LibraryService } from '../../core/library/library.service';
import { catalogSearch } from '../../core/catalog/style-dictionary';
import { IconComponent } from '../../core/ui/icon.component';
import { QuickSwitcherService } from './quick-switcher.service';

interface SwitcherItem {
  readonly key: string;
  readonly code: string;
  readonly label: string;
  readonly route: string;
  readonly path: readonly string[];
  readonly group: CatalogGroup;
  readonly kind: 'component' | 'variant';
  readonly hint: string;
}

/**
 * Buscador global de la galería (`Ctrl/⌘ + K`): salta a cualquier componente o
 * sub-estilo desde el teclado, sin recorrer el sidebar.
 *
 * Cuando no hay búsqueda muestra primero favoritos y recientes, y luego el
 * catálogo en orden. Es andamiaje: no toca la librería.
 */
@Component({
  selector: 'ac-quick-switcher',
  imports: [IconComponent],
  templateUrl: './quick-switcher.component.html',
  styleUrl: './quick-switcher.component.scss',
  host: {
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class QuickSwitcherComponent {
  private readonly router = inject(Router);
  private readonly library = inject(LibraryService);
  private readonly switcher = inject(QuickSwitcherService);
  private readonly search = viewChild<ElementRef<HTMLInputElement>>('search');
  private focusBeforeSearch?: HTMLElement;

  readonly open = this.switcher.open;
  readonly query = signal('');
  readonly cursor = signal(0);
  readonly isSearching = computed(() => this.query().trim().length > 0);

  private readonly componentItems: readonly SwitcherItem[] = CATALOG.flatMap((group) =>
    group.components.map((entry) => this.toItem(group, entry)),
  );

  readonly results = computed<readonly SwitcherItem[]>(() => {
    const query = this.query().trim().toLowerCase();

    if (!query) {
      const favorites = this.library
        .favorites()
        .map(({ group, entry }) => this.toItem(group, entry));
      const recents = this.library.recents().map(({ group, entry }) => this.toItem(group, entry));
      const seen = new Set(favorites.map((item) => item.key));
      const tail = this.componentItems.filter(
        (item) => !seen.has(item.key) && !recents.some((recent) => recent.key === item.key),
      );
      return [...favorites, ...recents.filter((item) => !seen.has(item.key)), ...tail].slice(0, 12);
    }

    return catalogSearch(query)
      .slice(0, 14)
      .map(({ group, entry, code }) => {
        const variant = entry.variants.find((item) => item.code === code);
        return variant ? this.toVariantItem(group, entry, variant) : this.toItem(group, entry);
      });
  });

  constructor() {
    // Al abrir, el foco va al buscador y la lista arranca limpia.
    effect(() => {
      const field = this.search()?.nativeElement;
      if (!this.open() || !field || field.ownerDocument.activeElement === field) return;
      const focused = field.ownerDocument.activeElement;
      if (focused instanceof HTMLElement) this.focusBeforeSearch = focused;
      field.focus();
    });
  }

  onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.cursor.set(0);
  }

  go(item: SwitcherItem): void {
    void this.router.navigate(item.path);
    this.close(false);
  }

  close(restoreFocus = true): void {
    this.query.set('');
    this.cursor.set(0);
    this.switcher.hide();
    if (restoreFocus) this.focusBeforeSearch?.focus();
    this.focusBeforeSearch = undefined;
  }

  onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.open() ? this.close() : this.switcher.show();
      return;
    }

    if (!this.open()) {
      return;
    }

    if (event.key === 'Escape') {
      this.close();
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      this.search()?.nativeElement.focus();
      return;
    }

    const total = this.results().length;
    if (!total) {
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      this.cursor.update((index) => (index + delta + total) % total);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const item = this.results()[this.cursor()];
      if (item) {
        this.go(item);
      }
    }
  }

  private toItem(group: CatalogGroup, entry: CatalogEntry): SwitcherItem {
    return {
      key: `${group.id}/${entry.id}`,
      code: entry.code,
      label: entry.label,
      route: `/${group.id}/${entry.id}`,
      path: ['/', group.id, entry.id],
      group,
      kind: 'component',
      hint: entry.tagline,
    };
  }

  private toVariantItem(
    group: CatalogGroup,
    entry: CatalogEntry,
    variant: CatalogVariant,
  ): SwitcherItem {
    return {
      key: `${group.id}/${entry.id}/${variant.id}`,
      code: variant.code,
      label: `${entry.label} · ${variant.label}`,
      route: `/${group.id}/${entry.id}/${variant.id}`,
      path: ['/', group.id, entry.id, variant.id],
      group,
      kind: 'variant',
      hint: variant.hint,
    };
  }
}
