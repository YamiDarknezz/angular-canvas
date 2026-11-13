import { Component, input } from '@angular/core';

@Component({
  selector: 'app-bg-grid',
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class BgGridComponent {
  readonly variant = input<string>();
}
