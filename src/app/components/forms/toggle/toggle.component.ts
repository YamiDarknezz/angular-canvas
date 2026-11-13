import { Component, signal, WritableSignal, input } from '@angular/core';

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
  readonly variant = input<string>();

  private static nextId = 0;
  protected readonly instanceId = 'ac-toggle-' + ToggleComponent.nextId++;

  readonly toggles: readonly ToggleItem[] = [
    { id: 'dark-mode', label: 'Modo Oscuro', checked: signal(true) },
    { id: 'notifications', label: 'Notificaciones', checked: signal(false) },
    { id: 'animations', label: 'Animaciones', checked: signal(true) },
  ];

  toggle(item: ToggleItem): void {
    item.checked.update((value) => !value);
  }
}
