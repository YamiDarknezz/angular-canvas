import { Component } from '@angular/core';

/**
 * Tarjetas con perspectiva 3D: se inclinan hacia el cursor y el brillo
 * responde a dónde apunta el puntero (`--tilt-x/y`, `--glare-x/y`).
 *
 * Solo reacciona a ratón o lápiz: en táctil no hay hover que simular, así que
 * la tarjeta se queda quieta en vez de quedarse inclinada al tocar.
 *
 * Autocontenido: no depende de nada de la galería.
 */
@Component({
  selector: 'app-card-tilt3d',
  templateUrl: './tilt-3d.component.html',
  styleUrl: './tilt-3d.component.scss',
})
export class Tilt3dCardComponent {
  onPointerMove(event: PointerEvent): void {
    if (event.pointerType === 'touch') {
      return;
    }
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    el.style.setProperty('--tilt-x', `${(0.5 - y) * 12}deg`);
    el.style.setProperty('--tilt-y', `${(x - 0.5) * 16}deg`);
    el.style.setProperty('--glare-x', `${x * 100}%`);
    el.style.setProperty('--glare-y', `${y * 100}%`);
  }

  onPointerLeave(event: PointerEvent): void {
    const el = event.currentTarget as HTMLElement;
    el.style.removeProperty('--tilt-x');
    el.style.removeProperty('--tilt-y');
    el.style.removeProperty('--glare-x');
    el.style.removeProperty('--glare-y');
  }
}
