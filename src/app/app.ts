import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { VariantFocusStyles } from './core/stage/variant-focus';

/**
 * Raíz de la aplicación.
 *
 * Solo decide qué se ve según la ruta: el catálogo completo (`<app-shell>`) o
 * la vista desnuda de un componente (`/embed/...`), que es la que se carga
 * dentro del iframe de la ventana de entorno.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {
  constructor() {
    // El filtro de sub-estilos (`.ac-viewport[data-focus]`) es CSS global
    // generado desde el catálogo: se instala una sola vez, antes de montar
    // ningún entorno, y así el CSS y los datos no pueden desincronizarse.
    // Ojo: cada documento (galería e iframe) instala el suyo.
    inject(VariantFocusStyles).install();
  }
}
