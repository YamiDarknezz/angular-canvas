import { Component, inject } from '@angular/core';

import { VariantFocusStyles } from './core/stage/variant-focus';
import { ShellComponent } from './layout/shell.component';

@Component({
  selector: 'app-root',
  imports: [ShellComponent],
  template: '<app-shell />',
})
export class App {
  constructor() {
    // El filtro de sub-estilos (`.ac-viewport[data-focus]`) es CSS global
    // generado desde el catálogo: se instala una sola vez, antes de montar
    // ningún entorno, y así el CSS y los datos no pueden desincronizarse.
    inject(VariantFocusStyles).install();
  }
}
