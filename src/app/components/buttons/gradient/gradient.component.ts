import { Component, input } from '@angular/core';

@Component({
  selector: 'app-btn-gradient',
  templateUrl: './gradient.component.html',
  styleUrl: './gradient.component.scss',
})
export class GradientButtonComponent {
  readonly variant = input<string>();
}
