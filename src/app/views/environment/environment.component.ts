import { Component, Type, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import {
  CatalogEntry,
  CatalogGroup,
  FLAT_ENTRIES,
  findEntry,
  findVariant,
  hasSubmenu,
} from '../../core/catalog/catalog';
import { componentFor } from '../../core/registry/component-registry';
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
 * `data-focus` y el CSS generado por `VariantFocusStyles` oculta el resto.
 */
@Component({
  selector: 'ac-environment',
  imports: [RouterLink, StageComponent],
  templateUrl: './environment.component.html',
  styleUrl: './environment.component.scss',
})
export class EnvironmentComponent {
  private readonly title = inject(Title);

  /** Parámetro de ruta: categoría (`cards`). */
  readonly group = input<string>();
  /** Parámetro de ruta: componente (`neon`). */
  readonly entry = input<string>();
  /** Parámetro de ruta: sub-estilo (`blue`). Opcional. */
  readonly variant = input<string>();

  readonly item = computed(() => findEntry(this.group(), this.entry()));
  readonly groupData = computed<CatalogGroup | undefined>(() => this.item()?.group);
  readonly entryData = computed<CatalogEntry | undefined>(() => this.item()?.entry);
  readonly component = computed<Type<unknown> | undefined>(() =>
    componentFor(this.group(), this.entry()),
  );
  readonly hasVariants = computed(() => {
    const entry = this.entryData();
    return entry ? hasSubmenu(entry) : false;
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
}
