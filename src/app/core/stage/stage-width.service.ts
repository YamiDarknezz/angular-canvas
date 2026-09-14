import { Injectable, signal } from '@angular/core';

/** Tamaños de previsualización de la ventana de entorno. */
export type StageWidth = 'full' | 'tablet' | 'mobile';

/**
 * Recuerda el tamaño de previsualización elegido (ancho completo, tablet,
 * móvil) mientras se navega el catálogo.
 *
 * Vive en un servicio porque pasar de «Todos» a una variante cambia de
 * configuración de ruta y Angular recrea el entorno: sin esto, el preset
 * volvería a «ancho completo» y habría que reelegirlo en cada click.
 */
@Injectable({ providedIn: 'root' })
export class StageWidthService {
  readonly width = signal<StageWidth>('full');
}
