import { NgComponentOutlet } from '@angular/common';
import { Component, DestroyRef, Type, computed, inject, input, signal } from '@angular/core';

import { CatalogEntry, CatalogGroup, CatalogVariant } from '../catalog/catalog';

/** Anchos de previsualización que ofrece la barra de la ventana. */
type StageWidth = 'full' | 'tablet' | 'mobile';

interface WidthOption {
  readonly id: StageWidth;
  readonly label: string;
  readonly icon: string;
}

/**
 * Ventana de entorno: el marco donde vive **un solo** componente.
 *
 * Todo lo que hay aquí es andamiaje de la galería, no forma parte de los
 * componentes. Por eso puede permitirse cosas que la librería no debería tener
 * (como un `contain: paint` que encierra los `position: fixed` de cada
 * componente) sin contaminar el código que se copia a otros proyectos.
 */
@Component({
  selector: 'ac-stage',
  imports: [NgComponentOutlet],
  templateUrl: './stage.component.html',
  styleUrl: './stage.component.scss',
})
export class StageComponent {
  private readonly destroyRef = inject(DestroyRef);

  /** Categoría del componente mostrado. */
  readonly group = input.required<CatalogGroup>();
  /** Entrada del catálogo que describe este entorno. */
  readonly entry = input.required<CatalogEntry>();
  /** Variante enfocada, o `null` para mostrar todas. */
  readonly activeVariant = input<CatalogVariant | null>(null);
  /** Clase standalone que se monta dentro del viewport. */
  readonly component = input<Type<unknown>>();

  readonly widths: readonly WidthOption[] = [
    { id: 'full', label: 'Ancho completo', icon: '🖥️' },
    { id: 'tablet', label: 'Ancho tablet (834px)', icon: '📱' },
    { id: 'mobile', label: 'Ancho móvil (420px)', icon: '📲' },
  ];

  readonly width = signal<StageWidth>('full');
  readonly codeOpen = signal(false);
  readonly copyState = signal<'idle' | 'ok' | 'error'>('idle');

  private resetTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    // Nada debe quedar vivo si se cambia de entorno con el aviso visible.
    this.destroyRef.onDestroy(() => clearTimeout(this.resetTimer));
  }

  /** Nombre de los archivos que el usuario tiene que copiar. */
  readonly fileNames = computed(() => {
    const id = this.entry().id;
    return [`${id}.component.ts`, `${id}.component.html`, `${id}.component.scss`];
  });

  /** Sub-estilos de la plantilla, para la ficha de código. */
  readonly variantIds = computed(() =>
    this.entry()
      .variants.map((variant) => variant.id)
      .join(' | '),
  );

  /** Snippet listo para pegar en otro proyecto. */
  readonly snippet = computed(() => {
    const entry = this.entry();
    const group = this.group();
    const lines: string[] = [
      '// 1) Copia la carpeta completa: el componente es autocontenido.',
      `${entry.sourcePath}/`,
      `//    ${this.fileNames().join(' · ')}`,
      '',
      '// 2) Úsalo como standalone (sin NgModule). Ajusta la ruta a tu estructura.',
      `import { ${entry.className} } from './components/${group.id}/${entry.id}/${entry.id}.component';`,
      '',
      '@Component({',
      `  imports: [${entry.className}],`,
      `  template: \`<${entry.selector} />\`,`,
      '})',
      'export class MiPaginaComponent {}',
      '',
      `// Variantes de la plantilla: data-variant="${this.variantIds()}"`,
      '// Es un atributo informativo: solo lo usa el filtro de esta galería.',
    ];

    if (entry.requiresForms) {
      lines.push('', '// Ojo: importa FormsModule, así que necesitas @angular/forms.');
    }

    return lines.join('\n');
  });

  toggleCode(): void {
    this.codeOpen.update((open) => !open);
  }

  async copySnippet(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.snippet());
      this.copyState.set('ok');
    } catch {
      // clipboard puede fallar sin permisos o fuera de un contexto seguro.
      this.copyState.set('error');
    }
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => this.copyState.set('idle'), 2000);
  }
}
