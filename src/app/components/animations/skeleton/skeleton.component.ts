import { Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

/**
 * Estados de carga (skeleton): shimmer con brillo deslizante, pulso suave y
 * onda de progreso. Cada variante usa la misma estructura de contenido falso.
 *
 * Autocontenido: sin dependencias de la galería.
 */
@Component({
  selector: 'app-anim-skeleton',
  imports: [NgTemplateOutlet],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
})
export class SkeletonComponent {
  readonly variant = input<string>();
}
