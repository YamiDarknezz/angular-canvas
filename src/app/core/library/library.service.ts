import { Injectable, computed, signal } from '@angular/core';

import { FLAT_ENTRIES } from '../catalog/catalog';

const FAVORITES_KEY = 'angular-canvas:favorites';
const RECENT_KEY = 'angular-canvas:recent';
const RECENT_LIMIT = 5;

/** Referencia a un entorno del catálogo: `grupo/componente`. */
type LibraryItem = (typeof FLAT_ENTRIES)[number];

/**
 * Favoritos y recientes de la galería, persistidos en `localStorage`.
 *
 * Es andamiaje: sirve para volver rápido a los diseños que estás considerando
 * para tu front, sin tocar nada de la librería.
 */
@Injectable({ providedIn: 'root' })
export class LibraryService {
  private readonly favoriteIds = signal<readonly string[]>(this.readStored(FAVORITES_KEY));
  private readonly recentIds = signal<readonly string[]>(this.readStored(RECENT_KEY));

  readonly favorites = computed(() => this.resolve(this.favoriteIds()));
  readonly recents = computed(() => this.resolve(this.recentIds()));

  isFavorite(groupId: string, entryId: string): boolean {
    return this.favoriteIds().includes(`${groupId}/${entryId}`);
  }

  toggleFavorite(groupId: string, entryId: string): void {
    const key = `${groupId}/${entryId}`;
    this.favoriteIds.update((ids) =>
      ids.includes(key) ? ids.filter((id) => id !== key) : [key, ...ids],
    );
    this.persist(FAVORITES_KEY, this.favoriteIds());
  }

  /** Marca el entorno como visto; el último visitado va primero. */
  markVisited(groupId: string, entryId: string): void {
    const key = `${groupId}/${entryId}`;
    this.recentIds.update((ids) => [key, ...ids.filter((id) => id !== key)].slice(0, RECENT_LIMIT));
    this.persist(RECENT_KEY, this.recentIds());
  }

  private resolve(ids: readonly string[]): readonly LibraryItem[] {
    return ids
      .map((id) => FLAT_ENTRIES.find((item) => `${item.group.id}/${item.entry.id}` === id))
      .filter((item): item is LibraryItem => item !== undefined);
  }

  private readStored(key: string): readonly string[] {
    try {
      const raw = localStorage.getItem(key);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed)
        ? parsed.filter((id): id is string => typeof id === 'string')
        : [];
    } catch {
      return [];
    }
  }

  private persist(key: string, ids: readonly string[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(ids));
    } catch {
      // localStorage puede no estar disponible (modo privado).
    }
  }
}
