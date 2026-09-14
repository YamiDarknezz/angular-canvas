import { Component } from '@angular/core';

/**
 * Migas de pan en tres acabados: chevron, barra monoespaciada con slash y
 * píldora de vidrio sobre color.
 *
 * Autocontenido: sin dependencias de la galería.
 */
@Component({
  selector: 'app-nav-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
})
export class BreadcrumbsComponent {
  readonly crumbs: readonly string[] = ['Inicio', 'Proyectos', 'AngularCanvas', 'Componentes'];
}
