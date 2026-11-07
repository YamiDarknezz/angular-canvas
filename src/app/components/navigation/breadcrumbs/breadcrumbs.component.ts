import { Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

/**
 * Migas de pan en tres acabados: chevron, barra monoespaciada con slash y
 * píldora de vidrio sobre color.
 *
 * Autocontenido: sin dependencias de la galería.
 */
@Component({
  selector: 'app-nav-breadcrumbs',
  imports: [NgTemplateOutlet],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
})
export class BreadcrumbsComponent {
  readonly variant = input<string>();
  readonly crumbs: readonly string[] = ['Inicio', 'Proyectos', 'AngularCanvas', 'Componentes'];
}
