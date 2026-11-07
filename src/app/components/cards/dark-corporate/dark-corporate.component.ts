import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card-corporate',
  templateUrl: './dark-corporate.component.html',
  styleUrl: './dark-corporate.component.scss',
})
export class DarkCorporateComponent {
  readonly variant = input<string>();
}
