import { Component } from '@angular/core';

@Component({
  selector: 'app-card-hover',
  templateUrl: './hover-effects.component.html',
  styleUrl: './hover-effects.component.scss',
})
export class HoverEffectsComponent {
  /** Desplaza la tarjeta hacia el cursor (efecto magnético real). */
  onMagneticMove(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    el.style.setProperty('--mx', `${x * 16}px`);
    el.style.setProperty('--my', `${y * 16}px`);
  }

  resetMagnetic(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    el.style.removeProperty('--mx');
    el.style.removeProperty('--my');
  }
}
