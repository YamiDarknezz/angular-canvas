import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { TOTAL_COMPONENTS, TOTAL_VARIANTS } from '../core/catalog/catalog';
import { ThemeService } from '../core/theme/theme.service';
import { NavTreeComponent } from './nav-tree/nav-tree.component';

/**
 * Marco de la aplicación: navegación a un lado, contenido (un entorno) al otro.
 *
 * En pantallas anchas la navegación es una columna fija; en móvil se convierte
 * en un panel deslizante que se cierra con Escape, con el botón ✕ o al
 * navegar — nunca queda tapando el entorno que acabas de abrir.
 */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, NavTreeComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  host: {
    '(document:keydown.escape)': 'closeDrawer()',
  },
})
export class ShellComponent {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);

  readonly themes = this.themeService.themes;
  readonly activeTheme = this.themeService.theme;

  readonly totalComponents = TOTAL_COMPONENTS;
  readonly totalVariants = TOTAL_VARIANTS;

  readonly drawerOpen = signal(false);

  constructor() {
    // Navegar cierra el panel: en móvil, si no, el menú se queda encima del
    // entorno que el usuario acaba de elegir.
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.drawerOpen.set(false));

    // Con el panel abierto el fondo no debe hacer scroll. La clase va en el
    // <body> (no se puede hacer con estilos encapsulados) y se limpia siempre
    // al destruir el componente para no dejar la página bloqueada.
    effect(() => {
      this.document.body.classList.toggle('ac-drawer-open', this.drawerOpen());
    });
    this.destroyRef.onDestroy(() => this.document.body.classList.remove('ac-drawer-open'));
  }

  setTheme(theme: (typeof this.themes)[number]['id']): void {
    this.themeService.setTheme(theme);
  }

  toggleDrawer(): void {
    this.drawerOpen.update((open) => !open);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }
}
