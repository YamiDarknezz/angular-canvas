import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarNavComponent {
  mobileMenuOpen = signal(false);

  toggleMobile() {
    this.mobileMenuOpen.update(v => !v);
  }
}
