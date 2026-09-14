import { Component, signal } from '@angular/core';

interface Step {
  readonly label: string;
  readonly hint: string;
}

/**
 * Indicador de pasos en horizontal, vertical y barra de progreso. Se puede
 * hacer click en cualquier paso para mover el estado.
 *
 * Autocontenido: sin dependencias de la galería.
 */
@Component({
  selector: 'app-nav-stepper',
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
})
export class StepperComponent {
  readonly steps: readonly Step[] = [
    { label: 'Datos', hint: 'Nombre y correo' },
    { label: 'Cuenta', hint: 'Usuario y contraseña' },
    { label: 'Plan', hint: 'Elige tu plan' },
    { label: 'Listo', hint: 'Confirmación' },
  ];

  readonly current = signal(1);

  select(index: number): void {
    this.current.set(index);
  }
}
