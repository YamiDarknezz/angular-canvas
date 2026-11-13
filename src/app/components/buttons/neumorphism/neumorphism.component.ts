import { Component, input } from '@angular/core';

@Component({
  selector: 'app-btn-neumorphism',
  templateUrl: './neumorphism.component.html',
  styleUrl: './neumorphism.component.scss',
})
export class NeumorphismButtonComponent {
  readonly variant = input<string>();
}
