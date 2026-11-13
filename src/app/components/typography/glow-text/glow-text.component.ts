import { Component, input } from '@angular/core';

@Component({
  selector: 'app-text-glow',
  templateUrl: './glow-text.component.html',
  styleUrl: './glow-text.component.scss',
})
export class GlowTextComponent {
  readonly variant = input<string>();
}
