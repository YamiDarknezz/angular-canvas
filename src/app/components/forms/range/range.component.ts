import { Component, signal } from '@angular/core';

/**
 * Selector de rango con pista de degradado y pulgar de vidrio. Dos acabados:
 * gradiente vibrante y vidrio translúcido.
 *
 * Autocontenido: sin dependencias de la galería.
 */
@Component({
  selector: 'app-form-range',
  templateUrl: './range.component.html',
  styleUrl: './range.component.scss',
})
export class RangeComponent {
  readonly value = signal(64);

  onInput(event: Event): void {
    this.value.set(Number((event.target as HTMLInputElement).value));
  }
}
