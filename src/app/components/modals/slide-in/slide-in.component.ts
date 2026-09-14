import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slide-in-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide-in.component.html',
  styleUrl: './slide-in.component.scss'
})
export class SlideInModalComponent {
  isOpen = signal(false);

  open() { this.isOpen.set(true); }
  close() { this.isOpen.set(false); }
}
