import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card-glassmorphism',
  templateUrl: './glassmorphism.component.html',
  styleUrl: './glassmorphism.component.scss',
})
export class GlassmorphismComponent {
  readonly variant = input<string>();
}
