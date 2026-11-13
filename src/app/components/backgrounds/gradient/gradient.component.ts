import { Component, input } from '@angular/core';

@Component({
  selector: 'app-bg-gradient',
  templateUrl: './gradient.component.html',
  styleUrl: './gradient.component.scss',
})
export class BgGradientComponent {
  readonly variant = input<string>();
}
