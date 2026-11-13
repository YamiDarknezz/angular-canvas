import { Component, signal, input } from '@angular/core';

@Component({
  selector: 'app-nav-topbar',
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarNavComponent {
  readonly variant = input<string>();

  private static nextId = 0;
  protected readonly instanceId = 'ac-topbar-' + TopbarNavComponent.nextId++;

  readonly mobileMenuOpen = signal(false);
  readonly activeLink = signal('Inicio');

  readonly links = ['Inicio', 'Componentes', 'Templates', 'Documentación'] as const;

  toggleMobile(): void {
    this.mobileMenuOpen.update((value) => !value);
  }

  select(link: string): void {
    this.activeLink.set(link);
    this.mobileMenuOpen.set(false);
  }
}
