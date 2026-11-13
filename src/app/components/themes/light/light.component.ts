import { Component, input } from '@angular/core';

@Component({
  selector: 'app-theme-light',
  templateUrl: './light.component.html',
  styleUrl: './light.component.scss',
})
export class ThemeLightComponent {
  readonly variant = input<string>();
}
