import { Component, input } from '@angular/core';

@Component({
  selector: 'app-btn-pill',
  templateUrl: './pill.component.html',
  styleUrl: './pill.component.scss',
})
export class PillButtonComponent {
  readonly variant = input<string>();
}
