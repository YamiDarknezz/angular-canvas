import { Component, input } from '@angular/core';

@Component({
  selector: 'app-theme-dark',
  templateUrl: './dark.component.html',
  styleUrl: './dark.component.scss',
})
export class ThemeDarkComponent {
  readonly variant = input<string>();
}
