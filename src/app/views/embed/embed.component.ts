import { NgComponentOutlet } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, Type, computed, inject, input, signal } from '@angular/core';

import { findEntry } from '../../core/catalog/catalog';
import { componentFor } from '../../core/registry/component-registry';
import { StageMessage } from '../../core/stage/stage-messages';
import { ThemeService } from '../../core/theme/theme.service';

/**
 * Vista desnuda de un componente: lo que se carga dentro del iframe de la
 * ventana de entorno.
 *
 * Aquí no hay galería. Este documento tiene su propio `<body>`, sus estilos
 * globales y su propio `<html data-theme>`, así que el componente se comporta
 * como en una pestaña real: sus `@media` responden a ESTE viewport (por eso el
 * ancho móvil es ancho móvil de verdad), su `100vh` es el alto de su ventana y
 * su `position: fixed` no puede escapar a ningún sitio.
 *
 * Lo único que entra de fuera son mensajes (`ac:variant`, `ac:theme`), que
 * ajustan el filtro de sub-estilos y el tema sin recargar el iframe.
 */
@Component({
  selector: 'ac-embed',
  imports: [NgComponentOutlet],
  templateUrl: './embed.component.html',
  styleUrl: './embed.component.scss',
  host: {
    class: 'ac-viewport',
    '[attr.data-focus]': 'focus()',
  },
})
export class EmbedComponent {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly themeService = inject(ThemeService);

  /** Parámetro de ruta: categoría (`cards`). */
  readonly group = input<string>();
  /** Parámetro de ruta: componente (`neon`). */
  readonly entry = input<string>();
  /** Parámetro de ruta: sub-estilo (`blue`). Opcional. */
  readonly variant = input<string>();

  /** Variante avisada por la galería. `undefined` = aún no ha dicho nada. */
  private readonly liveVariant = signal<string | null | undefined>(undefined);

  readonly item = computed(() => findEntry(this.group(), this.entry()));
  readonly component = computed<Type<unknown> | undefined>(() =>
    componentFor(this.group(), this.entry()),
  );

  /**
   * Valor de `data-focus`. Solo se enfoca una variante que exista: si la URL o
   * el mensaje traen un id inventado, se ve el componente entero en vez de un
   * lienzo vacío.
   */
  readonly focus = computed(() => {
    const entry = this.item()?.entry;
    const requested =
      this.liveVariant() !== undefined ? this.liveVariant() : (this.variant() ?? null);
    if (!entry || !requested) {
      return null;
    }
    return entry.variants.some((variant) => variant.id === requested) ? requested : null;
  });

  constructor() {
    const view = this.document.defaultView;
    if (!view) {
      return;
    }

    const onMessage = (event: MessageEvent<StageMessage | null>) => {
      if (event.origin !== view.location.origin || !event.data) {
        return;
      }
      if (event.data.type === 'ac:variant') {
        this.liveVariant.set(event.data.variant);
      }
      if (event.data.type === 'ac:theme') {
        this.themeService.setTheme(event.data.theme);
      }
    };

    view.addEventListener('message', onMessage);
    this.destroyRef.onDestroy(() => view.removeEventListener('message', onMessage));
  }
}
