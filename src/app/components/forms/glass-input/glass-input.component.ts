import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-glass-input',
  imports: [FormsModule],
  templateUrl: './glass-input.component.html',
  styleUrl: './glass-input.component.scss',
})
export class GlassInputComponent {
  readonly name = signal('');
  readonly email = signal('');
  readonly message = signal('');
}
