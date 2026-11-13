import { Component, signal, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-glass-input',
  imports: [FormsModule],
  templateUrl: './glass-input.component.html',
  styleUrl: './glass-input.component.scss',
})
export class GlassInputComponent {
  readonly variant = input<string>();

  private static nextId = 0;
  protected readonly instanceId = 'ac-glass-input-' + GlassInputComponent.nextId++;

  readonly name = signal('');
  readonly email = signal('');
  readonly message = signal('');
}
