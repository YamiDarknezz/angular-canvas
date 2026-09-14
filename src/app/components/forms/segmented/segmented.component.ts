import { Component, signal } from '@angular/core';

interface SegmentOption {
  readonly id: string;
  readonly label: string;
}

/**
 * Control segmentado con indicador deslizante en dos acabados: vidrio sobre
 * color y sólido sobre oscuro.
 *
 * Autocontenido: sin dependencias de la galería.
 */
@Component({
  selector: 'app-form-segmented',
  templateUrl: './segmented.component.html',
  styleUrl: './segmented.component.scss',
})
export class SegmentedComponent {
  readonly active = signal(1);

  readonly variants = [{ id: 'glass' }, { id: 'solid' }] as const;

  readonly options: readonly SegmentOption[] = [
    { id: 'dia', label: 'Día' },
    { id: 'semana', label: 'Semana' },
    { id: 'mes', label: 'Mes' },
    { id: 'anio', label: 'Año' },
  ];

  select(index: number): void {
    this.active.set(index);
  }
}
