import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarNavComponent {
  collapsed = signal(false);
  activeItem = signal('dashboard');

  menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'users', icon: '👥', label: 'Usuarios' },
    { id: 'settings', icon: '⚙️', label: 'Configuración' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'messages', icon: '💬', label: 'Mensajes' },
  ];

  toggle() {
    this.collapsed.update(v => !v);
  }

  setActive(id: string) {
    this.activeItem.set(id);
  }
}
