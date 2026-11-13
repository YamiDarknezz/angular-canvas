import { Component, input } from '@angular/core';

@Component({
  selector: 'app-theme-corporate',
  templateUrl: './corporate.component.html',
  styleUrl: './corporate.component.scss',
})
export class ThemeCorporateComponent {
  readonly variant = input<string>();
}
