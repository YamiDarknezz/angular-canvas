import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  CATALOG,
  TOTAL_COMPONENTS,
  TOTAL_GROUPS,
  TOTAL_VARIANTS,
} from '../../core/catalog/catalog';
import { ThemeService } from '../../core/theme/theme.service';
import { IconComponent } from '../../core/ui/icon.component';

/** Portada: la vitrina del catálogo, por capítulos de categoría. */
@Component({
  selector: 'ac-home',
  imports: [RouterLink, IconComponent],
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
