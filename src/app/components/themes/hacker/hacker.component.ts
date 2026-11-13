import { Component, input } from '@angular/core';

@Component({
  selector: 'app-theme-hacker',
  templateUrl: './hacker.component.html',
  styleUrl: './hacker.component.scss',
})
export class ThemeHackerComponent {
  readonly variant = input<string>();
}
