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
import { ThemeService } from '../theme/theme.service';
import { IconComponent } from '../ui/icon.component';
import { MotionService } from './motion.service';
import { StageMessage } from './stage-messages';
import { StageWidth, StageWidthService } from './stage-width.service';

interface WidthOption {
  readonly id: StageWidth;
  readonly label: string;
  /** Nombre del icono del set de la galería. */
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
  imports: [IconComponent],
  templateUrl: './stage.component.html',
  styleUrl: './stage.component.scss',
})
export class StageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly themeService = inject(ThemeService);
  private readonly stageWidth = inject(StageWidthService);
  readonly motionService = inject(MotionService);

  /** Categoría del componente mostrado. */
  readonly group = input.required<CatalogGroup>();
  /** Entrada del catálogo que describe este entorno. */
  readonly entry = input.required<CatalogEntry>();
  /** Variante enfocada, o `null` para mostrar todas. */
  readonly activeVariant = input<CatalogVariant | null>(null);

  readonly widths: readonly WidthOption[] = [
    { id: 'full', label: 'Ancho completo', icon: 'monitor' },
    { id: 'tablet', label: 'Tablet — 834 px de ancho', icon: 'tablet' },
    { id: 'mobile', label: 'Móvil — 390 px de ancho', icon: 'phone' },
  ];

  readonly colorPresets = [
    { id: 'default', label: 'Original', hex: '' },
    { id: 'purple', label: 'Morado', hex: '#a855f7' },
    { id: 'cyan', label: 'Cian', hex: '#06b6d4' },
    { id: 'emerald', label: 'Esmeralda', hex: '#10b981' },
    { id: 'pink', label: 'Rosa', hex: '#ec4899' },
    { id: 'amber', label: 'Ámbar', hex: '#f59e0b' },
  ] as const;

  readonly selectedColor = signal<string>('');

  /** Preset de ancho elegido; sobrevive a la navegación entre entornos. */
  readonly width = this.stageWidth.width;
  readonly codeOpen = signal(false);
  readonly copyState = signal<'idle' | 'ok' | 'error'>('idle');

  private readonly frame = viewChild<ElementRef<HTMLIFrameElement>>('frame');

  private resetTimer?: ReturnType<typeof setTimeout>;

  /** `true` cuando se previsualiza en un marco de dispositivo. */
  readonly isDevice = computed(() => this.width() !== 'full');

  /** Ruta de la vista desnuda, para el iframe y para abrir en pestaña. */
  readonly embedPath = computed(() => `/embed/${this.group().id}/${this.entry().id}`);

  /** URL del iframe (saneada por Angular). */
  readonly embedUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.embedPath()),
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
    const active = this.activeVariant();
    const selectorAttr = active ? ` variant="${active.id}"` : '';
    const tint = this.selectedColor();
    const tintAttr = tint ? ` [style.--ac-accent]="'${tint}'"` : '';
    const code = active?.code ?? entry.code;

    const lines: string[] = [
      `// DICCIONARIO DE ESTILOS — CÓDIGO: [${code}]`,
      `// Categoría: ${group.label} [${group.code}] · Componente: ${entry.label} [${entry.code}]${active ? ` · Sub-estilo: ${active.label} [${active.code}]` : ''}`,
      tint ? `// Color de acento personalizado: ${tint}` : '',
      '// 1) Copia la carpeta completa (100% autocontenida):',
      `${entry.sourcePath}/`,
      `//    ${this.fileNames().join(' · ')}`,
      '',
      '// 2) Úsalo como standalone (sin NgModule). Ajusta la ruta a tu estructura:',
      `import { ${entry.className} } from './components/${group.id}/${entry.id}/${entry.id}.component';`,
      '',
      '@Component({',
      `  imports: [${entry.className}],`,
      `  template: \`<${entry.selector}${selectorAttr}${tintAttr} />\`,`,
      '})',
      'export class MiPaginaComponent {}',
    ].filter((l, i) => l !== '' || i > 2);

    if (entry.variants.length > 0) {
      lines.push(
        '',
        `// Sub-estilos disponibles: [variant]="'${this.variantIds()}'"`,
        '// Pasa el variant como input para aislar el sub-estilo deseado en tu aplicación.',
      );
    }

    if (entry.requiresForms) {
      lines.push('', '// Ojo: importa FormsModule, así que necesitas @angular/forms.');
    }

    return lines.join('\n');
  });

  constructor() {
    // Elegir sub-estilo, tema, modo de animación o color se reenvía al iframe sin recargarlo.
    effect(() => {
      const variant = this.activeVariant()?.id ?? null;
      const theme = this.themeService.theme();
      const motion = this.motionService.mode();
      const color = this.selectedColor() || null;
      this.post({ type: 'ac:variant', variant });
      this.post({ type: 'ac:theme', theme });
      this.post({ type: 'ac:motion', mode: motion });
      this.post({ type: 'ac:tint', color });
    });

    this.destroyRef.onDestroy(() => clearTimeout(this.resetTimer));
  }

  /** El iframe acaba de cargar: se pone al día con el estado de la galería. */
  onFrameLoad(): void {
    this.post({ type: 'ac:variant', variant: this.activeVariant()?.id ?? null });
    this.post({ type: 'ac:theme', theme: this.themeService.theme() });
    this.post({ type: 'ac:motion', mode: this.motionService.mode() });
    this.post({ type: 'ac:tint', color: this.selectedColor() || null });
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
