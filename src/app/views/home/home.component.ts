import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  CATALOG,
  TOTAL_COMPONENTS,
  TOTAL_GROUPS,
  TOTAL_VARIANTS,
} from '../../core/catalog/catalog';
import { ThemeService } from '../../core/theme/theme.service';

/** Portada: los números del catálogo y las tarjetas de entrada por categoría. */
@Component({
  selector: 'ac-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly themeService = inject(ThemeService);

  readonly catalog = CATALOG;
  readonly totalGroups = TOTAL_GROUPS;
  readonly totalComponents = TOTAL_COMPONENTS;
  readonly totalVariants = TOTAL_VARIANTS;
  readonly totalThemes = this.themeService.themes.length;
}
