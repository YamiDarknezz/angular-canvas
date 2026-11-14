import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

/** Angular standalone. Sus variables CSS también se heredan en el contenido proyectado. */
@Component({
  selector: 'app-theme-editorial',
  templateUrl: './editorial.component.html',
  styleUrl: './editorial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-variant]': 'variant()' },
})
export class EditorialThemeComponent {
  readonly variant = input<'paper' | 'night'>('paper');
  readonly bookmarksChange = output<readonly string[]>();
  protected readonly bookmarks = signal<readonly string[]>([]);
  protected readonly filtered = signal(false);
  private readonly articles = [
    {
      id: 'operations',
      section: 'Operaciones',
      title: 'Inventario al día',
      detail: 'Cruza el mínimo de reposición con las salidas de la semana.',
    },
    {
      id: 'sales',
      section: 'Comercial',
      title: 'Visitas a bodegas',
      detail: 'Agrupa los pedidos por zona antes de preparar el reparto.',
    },
    {
      id: 'people',
      section: 'Personas',
      title: 'Primer día',
      detail: 'Prepara accesos, acompañamiento y materiales para el equipo nuevo.',
    },
  ] as const;
  protected readonly visible = computed(() =>
    this.filtered()
      ? this.articles.filter((article) => this.bookmarks().includes(article.id))
      : this.articles,
  );

  protected toggle(id: string): void {
    this.bookmarks.update((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
    this.bookmarksChange.emit(this.bookmarks());
  }

  protected toggleFilter(): void {
    this.filtered.update((value) => !value);
  }
}
