import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss'
})
export class ToggleComponent {
  toggles = [
    { id: 't1', label: 'Modo Oscuro', checked: signal(true) },
    { id: 't2', label: 'Notificaciones', checked: signal(false) },
    { id: 't3', label: 'Animaciones', checked: signal(true) },
  ];

  toggle(t: { checked: { set: (v: boolean) => void; (): boolean } }) {
    t.checked.set(!t.checked());
  }
}
