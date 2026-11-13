import { Component, input } from '@angular/core';

@Component({
  selector: 'app-btn-animated',
  templateUrl: './animated.component.html',
  styleUrl: './animated.component.scss',
})
export class AnimatedButtonComponent {
  readonly variant = input<string>();
}
