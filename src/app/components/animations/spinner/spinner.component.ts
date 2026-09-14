import { Component } from '@angular/core';

/**
 * Indicadores de carga: anillo rotatorio, puntos rebotantes y barra
 * deslizante. Las animaciones se congelan con prefers-reduced-motion.
 *
 * Autocontenido: sin dependencias de la galería.
 */
@Component({
  selector: 'app-anim-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {}
