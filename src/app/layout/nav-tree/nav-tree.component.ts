import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

import { CATALOG, CatalogEntry, CatalogGroup } from '../../core/catalog/catalog';

/** Grupo con los componentes que pasan el filtro de búsqueda. */
interface NavGroup {
  readonly group: CatalogGroup;
  readonly entries: readonly CatalogEntry[];
}

/**
 * Navegación de dos niveles: **grupo → componente**.
 *
 * Cada componente es un entorno con su propia URL, así que este árbol no hace
 * scroll a ninguna parte: cambia de vista. Los sub-estilos no viven aquí: se
 * eligen dentro del entorno (chips y atajos), para que el árbol no se convierta
 * en una lista de tres niveles difícil de recorrer.
 *
 * El grupo del componente activo se despliega solo, de modo que un enlace
 * profundo (`/cards/neon/blue`) abre el árbol en su sitio.
 */
@Component({
  selector: 'ac-nav-tree',
  imports: [RouterLink],
  templateUrl: './nav-tree.component.html',
  styleUrl: './nav-tree.component.scss',
})
export class NavTreeComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  /** Filtro de búsqueda: por nombre, resumen o sub-estilo. */
  readonly query = signal('');
  private readonly currentUrl = signal(this.router.url);
  private readonly openGroups = signal<ReadonlySet<string>>(new Set<string>());

  private readonly segments = computed(() =>
    this.currentUrl().split('?')[0].split('/').filter(Boolean),
  );

  readonly activeGroupId = computed(() => this.segments()[0] ?? '');
  readonly activeEntryId = computed(() => this.segments()[1] ?? '');

  /** Si hay búsqueda activa, el árbol se muestra entero desplegado. */
  readonly searching = computed(() => this.query().trim().length > 0);

  readonly groups = computed<readonly NavGroup[]>(() => this.filterTree(this.query()));

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.currentUrl.set((event as NavigationEnd).urlAfterRedirects);
        this.revealActive((event as NavigationEnd).urlAfterRedirects);
      });

    // Estado inicial: si se entra por enlace profundo, el árbol ya viene abierto.
    this.revealActive(this.router.url);
  }

  isGroupOpen(groupId: string): boolean {
    return this.searching() || this.openGroups().has(groupId);
  }

  /** Activo aunque la URL incluya sub-estilo: el componente es el mismo. */
  isEntryActive(groupId: string, entryId: string): boolean {
    return this.activeGroupId() === groupId && this.activeEntryId() === entryId;
  }

  toggleGroup(groupId: string): void {
    this.openGroups.update((open) => this.toggleIn(open, groupId));
  }

  onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  /** Abre el grupo del componente activo, sin cerrar lo demás. */
  private revealActive(url: string): void {
    const [groupId] = url.split('?')[0].split('/').filter(Boolean);
    if (!groupId || this.openGroups().has(groupId)) {
      return;
    }
    this.openGroups.update((open) => new Set([...open, groupId]));
  }

  private toggleIn(set: ReadonlySet<string>, key: string): ReadonlySet<string> {
    const next = new Set(set);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    return next;
  }

  private filterTree(rawQuery: string): readonly NavGroup[] {
    const query = rawQuery.trim().toLowerCase();
    if (!query) {
      return CATALOG.map((group) => ({ group, entries: group.components }));
    }
    return CATALOG.map((group) => ({
      group,
      entries: group.label.toLowerCase().includes(query)
        ? group.components
        : group.components.filter((entry) => this.matches(entry, query)),
    })).filter((item) => item.entries.length > 0);
  }

  private matches(entry: CatalogEntry, query: string): boolean {
    return (
      entry.label.toLowerCase().includes(query) ||
      entry.id.includes(query) ||
      entry.tagline.toLowerCase().includes(query) ||
      entry.variants.some(
        (variant) => variant.label.toLowerCase().includes(query) || variant.id.includes(query),
      )
    );
  }
}
