import { Component, signal } from '@angular/core';

interface MenuItem {
  readonly id: string;
  readonly icon: string;
  readonly label: string;
}

@Component({
  selector: 'app-nav-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarNavComponent {
  readonly collapsed = signal(false);
  readonly activeItem = signal('dashboard');

  readonly menuItems: readonly MenuItem[] = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'users', icon: '👥', label: 'Usuarios' },
    { id: 'settings', icon: '⚙️', label: 'Configuración' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'messages', icon: '💬', label: 'Mensajes' },
  ];

  toggle(): void {
    this.collapsed.update((value) => !value);
  }

  setActive(id: string): void {
    this.activeItem.set(id);
  }
}
