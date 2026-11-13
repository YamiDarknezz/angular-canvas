import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card-neon',
  templateUrl: './neon.component.html',
  styleUrl: './neon.component.scss',
})
export class NeonCardComponent {
  readonly variant = input<string>();
}
