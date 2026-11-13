import { Component, input } from '@angular/core';

@Component({
  selector: 'app-theme-cyberpunk',
  templateUrl: './cyberpunk.component.html',
  styleUrl: './cyberpunk.component.scss',
})
export class ThemeCyberpunkComponent {
  readonly variant = input<string>();
}
