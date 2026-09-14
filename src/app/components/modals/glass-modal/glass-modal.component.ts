import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-glass-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './glass-modal.component.html',
  styleUrl: './glass-modal.component.scss'
})
export class GlassModalComponent {
  isOpen = signal(false);

  open() { this.isOpen.set(true); }
  close() { this.isOpen.set(false); }
}
