import {
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
  ElementRef,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { CatalogEntry, CatalogGroup, CatalogVariant } from '../catalog/catalog';
import { StageMessage } from './stage-messages';
import { StageWidth, StageWidthService } from './stage-width.service';
import { ThemeService } from '../theme/theme.service';

interface WidthOption {
  readonly id: StageWidth;
  readonly label: string;
  readonly icon: string;
}

/**
 * Ventana de entorno: el marco donde vive **un solo** componente.
 *
 * La ventana es deliberadamente neutra: ni barra decorativa, ni colores de
 * tema, ni insignias. Solo herramientas discretas (ancho y código) para que lo
 * único con carácter sea el diseño de dentro.
 *
 * El componente no se monta aquí, sino en un **iframe** (`/embed/...`). Eso le
 * da un viewport real —sus `@media`, su `100vh` y su `position: fixed` se
 * comportan como en una pestaña— y convierte el aislamiento en una frontera de
 * documento, no en una regla de CSS.
 *
 * Los presets tablet/móvil cambian el ancho REAL del iframe (390 px, 834 px) y
 * lo visten con un marco de dispositivo. No se escala el iframe a propósito:
 * escalarlo rompe el pintado del documento embebido en Chromium.
 */
@Component({
  selector: 'ac-stage',
  templateUrl: './stage.component.html',
  styleUrl: './stage.component.scss',
})
export class StageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly themeService = inject(ThemeService);
  private readonly stageWidth = inject(StageWidthService);

  /** Categoría del componente mostrado. */
  readonly group = input.required<CatalogGroup>();
  /** Entrada del catálogo que describe este entorno. */
  readonly entry = input.required<CatalogEntry>();
  /** Variante enfocada, o `null` para mostrar todas. */
  readonly activeVariant = input<CatalogVariant | null>(null);

  readonly widths: readonly WidthOption[] = [
    { id: 'full', label: 'Ancho completo', icon: '🖥️' },
    { id: 'tablet', label: 'Tablet — 834 px de ancho', icon: '📱' },
    { id: 'mobile', label: 'Móvil — 390 px de ancho', icon: '📲' },
  ];

  /** Preset de ancho elegido; sobrevive a la navegación entre entornos. */
  readonly width = this.stageWidth.width;
  readonly codeOpen = signal(false);
  readonly copyState = signal<'idle' | 'ok' | 'error'>('idle');

  private readonly frame = viewChild<ElementRef<HTMLIFrameElement>>('frame');

  private resetTimer?: ReturnType<typeof setTimeout>;

  /** `true` cuando se previsualiza en un marco de dispositivo. */
  readonly isDevice = computed(() => this.width() !== 'full');

  /** URL del iframe: la vista desnuda de este componente. */
  readonly embedUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(`/embed/${this.group().id}/${this.entry().id}`),
  );

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

  constructor() {
    // Elegir sub-estilo o tema en la galería se reenvía al iframe sin recargarlo.
    effect(() => {
      const variant = this.activeVariant()?.id ?? null;
      const theme = this.themeService.theme();
      this.post({ type: 'ac:variant', variant });
      this.post({ type: 'ac:theme', theme });
    });

    this.destroyRef.onDestroy(() => clearTimeout(this.resetTimer));
  }

  /** El iframe acaba de cargar: se pone al día con el estado de la galería. */
  onFrameLoad(): void {
    this.post({ type: 'ac:variant', variant: this.activeVariant()?.id ?? null });
    this.post({ type: 'ac:theme', theme: this.themeService.theme() });
  }

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

  /** Envía un mensaje a la vista desnuda. Sin iframe todavía, no hace nada. */
  private post(message: StageMessage): void {
    const view = this.frame()?.nativeElement.contentWindow;
    view?.postMessage(message, window.location.origin);
  }
}
