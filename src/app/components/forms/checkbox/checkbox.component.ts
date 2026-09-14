import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent {
  items = [
    { id: 'c1', label: 'TypeScript', checked: signal(true) },
    { id: 'c2', label: 'Angular', checked: signal(true) },
    { id: 'c3', label: 'React', checked: signal(false) },
    { id: 'c4', label: 'Vue', checked: signal(false) },
  ];

  toggle(item: { checked: { set: (v: boolean) => void; (): boolean } }) {
    item.checked.set(!item.checked());
  }
}
