import { Component, input } from '@angular/core';

@Component({
  selector: 'app-text-gradient',
  templateUrl: './gradient-text.component.html',
  styleUrl: './gradient-text.component.scss',
})
export class GradientTextComponent {
  readonly variant = input<string>();
}
