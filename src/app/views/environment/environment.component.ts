import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';

import {
  CatalogEntry,
  CatalogGroup,
  FLAT_ENTRIES,
  findEntry,
  findVariant,
  hasMultipleVariants,
} from '../../core/catalog/catalog';
import { StageComponent } from '../../core/stage/stage.component';

/**
 * Vista de un entorno: **un solo componente**, aislado en su ventana.
 *
 * Los parámetros de la ruta (`group`, `entry`, `variant`) llegan como inputs
 * gracias a `withComponentInputBinding()`. Aquí no se busca nada a mano ni se
 * toca el DOM para mostrar el componente: se resuelve el catálogo, se pasa el
 * tipo a la ventana y listo.
 *
 * El filtro por variante tampoco se hace por DOM: la ventana marca
 * `data-focus` en el iframe y el CSS generado por `VariantFocusStyles` oculta
 * el resto.
 */
@Component({
  selector: 'ac-environment',
  imports: [RouterLink, StageComponent],
  templateUrl: './environment.component.html',
  styleUrl: './environment.component.scss',
  host: {
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class EnvironmentComponent {
  private readonly title = inject(Title);
  private readonly router = inject(Router);

  /** Parámetro de ruta: categoría (`cards`). */
  readonly group = input<string>();
  /** Parámetro de ruta: componente (`neon`). */
  readonly entry = input<string>();
  /** Parámetro de ruta: sub-estilo (`blue`). Opcional. */
  readonly variant = input<string>();

  readonly item = computed(() => findEntry(this.group(), this.entry()));
  readonly groupData = computed<CatalogGroup | undefined>(() => this.item()?.group);
  readonly entryData = computed<CatalogEntry | undefined>(() => this.item()?.entry);
  readonly hasVariants = computed(() => {
    const entry = this.entryData();
    return entry ? hasMultipleVariants(entry) : false;
  });

  /** Variante enfocada. `null` = se ven todas. */
  readonly activeVariant = computed(() => {
    const entry = this.entryData();
    return entry ? (findVariant(entry, this.variant()) ?? null) : null;
  });

  private readonly index = computed(() =>
    FLAT_ENTRIES.findIndex(
      (item) => item.group.id === this.group() && item.entry.id === this.entry(),
    ),
  );

  readonly previous = computed(() => {
    const index = this.index();
    return index > 0 ? FLAT_ENTRIES[index - 1] : undefined;
  });

  readonly next = computed(() => {
    const index = this.index();
    return index >= 0 && index < FLAT_ENTRIES.length - 1 ? FLAT_ENTRIES[index + 1] : undefined;
  });

  constructor() {
    // El título de la pestaña sigue al entorno abierto: sirve para compartir
    // un enlace y para el historial del navegador.
    effect(() => {
      const entry = this.entryData();
      this.title.setTitle(
        entry ? `${entry.label} — AngularCanvas` : 'Entorno no encontrado — AngularCanvas',
      );
    });
  }

  /**
   * Atajos para elegir sin ratón: ←/→ recorren el catálogo entero y 1–9 aíslan
   * un sub-estilo (0 vuelve a verlos todos). Se ignoran al escribir en un campo
   * y dentro del iframe (sus teclas no llegan hasta aquí).
   */
  onKeydown(event: KeyboardEvent): void {
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }
    const target = event.target as HTMLElement | null;
    if (target?.closest('input, textarea, select, [contenteditable]')) {
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const item = event.key === 'ArrowLeft' ? this.previous() : this.next();
      if (!item) {
        return;
      }
      event.preventDefault();
      this.router.navigate(['/', item.group.id, item.entry.id]);
      return;
    }

    const entry = this.entryData();
    if (!entry || !this.hasVariants() || !/^[0-9]$/.test(event.key)) {
      return;
    }

    event.preventDefault();
    if (event.key === '0') {
      this.router.navigate(['/', this.group(), entry.id]);
      return;
    }
    const variant = entry.variants[Number(event.key) - 1];
    if (variant) {
      this.router.navigate(['/', this.group(), entry.id, variant.id]);
    }
  }
}
