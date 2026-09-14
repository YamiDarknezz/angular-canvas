import { Component, signal, WritableSignal } from '@angular/core';

interface CheckboxItem {
  readonly id: string;
  readonly label: string;
  readonly checked: WritableSignal<boolean>;
}

@Component({
  selector: 'app-form-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent {
  readonly items: readonly CheckboxItem[] = [
    { id: 'typescript', label: 'TypeScript', checked: signal(true) },
    { id: 'angular', label: 'Angular', checked: signal(true) },
    { id: 'react', label: 'React', checked: signal(false) },
    { id: 'vue', label: 'Vue', checked: signal(false) },
  ];

  toggle(item: CheckboxItem): void {
    item.checked.update((value) => !value);
  }
}
