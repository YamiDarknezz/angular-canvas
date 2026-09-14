import { Component, computed, signal } from '@angular/core';

/**
 * Valoración por estrellas y por segmentos numéricos, con previsualización
 * al pasar el cursor y navegación por teclado.
 *
 * Autocontenido: sin dependencias de la galería.
 */
@Component({
  selector: 'app-form-rating',
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
})
export class RatingComponent {
  readonly stars = [1, 2, 3, 4, 5];
  readonly segments = [
    { value: 1, label: 'Malo' },
    { value: 2, label: 'Regular' },
    { value: 3, label: 'Bueno' },
    { value: 4, label: 'Muy bueno' },
    { value: 5, label: 'Excelente' },
  ];

  readonly value = signal(4);
  readonly hover = signal(0);

  readonly display = computed(() => this.hover() || this.value());

  setValue(n: number): void {
    this.value.set(n);
    this.hover.set(0);
  }

  setHover(n: number): void {
    this.hover.set(n);
  }

  clearHover(): void {
    this.hover.set(0);
  }
}
