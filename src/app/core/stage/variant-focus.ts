import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { CATALOG } from '../catalog/catalog';

/** Id del `<style>` que este servicio inyecta una sola vez. */
const STYLE_ID = 'ac-variant-focus';

/**
 * Filtrado de sub-estilos (variantes) de la galería.
 *
 * Problema: los sub-estilos viven dentro de cada componente, así que cualquier
 * regla que los muestre u oculte tiene que ser **global** — Angular encapsula
 * los estilos de componente y no se puede (ni se debe) usar `::ng-deep`.
 *
 * Solución: el CSS se **genera desde el catálogo** al arrancar la app. Un solo
 * `<style>` con una regla por variante:
 *
 * ```css
 * .ac-viewport[data-focus='lift'] [data-variant]:not([data-variant='lift']) {
 *   display: none !important;
 * }
 * ```
 *
 * Reglas de diseño:
 * - El CSS nunca se escribe a mano: si el catálogo y las plantillas se separan,
 *   el filtro deja de ocultar y se ve de inmediato. Cero duplicación.
 * - Los componentes solo llevan `data-variant="id"` en su HTML: es un dato
 *   inerte. Si copias un componente a otro proyecto, el atributo no molesta y
 *   no arrastra ninguna dependencia.
 * - La vista de entorno solo pone `data-focus` en el viewport; al no haber
 *   `data-focus` (modo "todas"), ninguna regla coincide y se ve todo.
 */
@Injectable({ providedIn: 'root' })
export class VariantFocusStyles {
  private readonly document = inject(DOCUMENT);

  /** Inyecta el `<style>`. Idempotente: si ya está, no hace nada. */
  install(): void {
    const root = this.document.documentElement;
    if (this.document.getElementById(STYLE_ID)) {
      return;
    }
    const style = this.document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = this.buildCss();
    root.appendChild(style);
  }

  /** Reglas de foco para todas las variantes del catálogo, sin repetir ids. */
  private buildCss(): string {
    const ids = new Set<string>();
    for (const group of CATALOG) {
      for (const entry of group.components) {
        for (const variant of entry.variants) {
          ids.add(variant.id);
        }
      }
    }

    return [...ids]
      .map(
        (id) =>
          `.ac-viewport[data-focus='${id}'] [data-variant]:not([data-variant='${id}']) { display: none !important; }`,
      )
      .join('\n');
  }
}
