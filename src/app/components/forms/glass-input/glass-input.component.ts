import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-glass-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './glass-input.component.html',
  styleUrl: './glass-input.component.scss'
})
export class GlassInputComponent {
  name = '';
  email = '';
  message = '';
}
