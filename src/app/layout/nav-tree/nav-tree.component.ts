import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

import { CATALOG } from '../../core/catalog/catalog';
import { LibraryService } from '../../core/library/library.service';
import { IconComponent } from '../../core/ui/icon.component';
import { QuickSwitcherService } from '../quick-switcher/quick-switcher.service';

/**
 * Navegación de dos niveles: **grupo → componente**, con estantes de favoritos
 * y recientes arriba.
 *
 * Cada componente es un entorno con su propia URL, así que este árbol no hace
 * scroll a ninguna parte: cambia de vista. Los sub-estilos se eligen dentro del
 * entorno (chips y atajos), y la búsqueda vive en el selector global (`⌘K`).
 *
 * El grupo del componente activo se despliega solo, de modo que un enlace
 * profundo (`/cards/neon/blue`) abre el árbol en su sitio.
 */
@Component({
  selector: 'ac-nav-tree',
  imports: [RouterLink, IconComponent],
  templateUrl: './nav-tree.component.html',
  styleUrl: './nav-tree.component.scss',
})
export class NavTreeComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly library = inject(LibraryService);
  private readonly quickSwitcher = inject(QuickSwitcherService);

  readonly catalog = CATALOG;
  private readonly currentUrl = signal(this.router.url);
  private readonly openGroups = signal<ReadonlySet<string>>(new Set<string>());

  /** Favoritos y recientes, en ese orden; los vacíos no se muestran. */
  readonly shelves = computed(() =>
    [
      { id: 'favorites', title: 'Favoritos', icon: 'star-filled', items: this.library.favorites() },
      { id: 'recents', title: 'Recientes', icon: 'clock', items: this.library.recents() },
    ].filter((shelf) => shelf.items.length > 0),
  );

  private readonly segments = computed(() =>
    this.currentUrl().split('?')[0].split('/').filter(Boolean),
  );

  readonly activeGroupId = computed(() => this.segments()[0] ?? '');
  readonly activeEntryId = computed(() => this.segments()[1] ?? '');

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
    return this.openGroups().has(groupId);
  }

  /** Activo aunque la URL incluya sub-estilo: el componente es el mismo. */
  isEntryActive(groupId: string, entryId: string): boolean {
    return this.activeGroupId() === groupId && this.activeEntryId() === entryId;
  }

  isFavorite(groupId: string, entryId: string): boolean {
    return this.library.isFavorite(groupId, entryId);
  }

  toggleFavorite(event: Event, groupId: string, entryId: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.library.toggleFavorite(groupId, entryId);
  }

  toggleGroup(groupId: string): void {
    this.openGroups.update((open) => this.toggleIn(open, groupId));
  }

  openSearch(): void {
    this.quickSwitcher.show();
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
}
