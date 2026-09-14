import { Component, signal, WritableSignal } from '@angular/core';

interface ToggleItem {
  readonly id: string;
  readonly label: string;
  readonly checked: WritableSignal<boolean>;
}

@Component({
  selector: 'app-form-toggle',
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss',
})
export class ToggleComponent {
  readonly toggles: readonly ToggleItem[] = [
    { id: 'dark-mode', label: 'Modo Oscuro', checked: signal(true) },
    { id: 'notifications', label: 'Notificaciones', checked: signal(false) },
    { id: 'animations', label: 'Animaciones', checked: signal(true) },
  ];

  toggle(item: ToggleItem): void {
    item.checked.update((value) => !value);
  }
}
