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
  readonly activeCodeTab = signal<'snippet' | 'html' | 'ts'>('snippet');
  readonly fps = signal<number>(60);

  private readonly frame = viewChild<ElementRef<HTMLIFrameElement>>('frame');

  private resetTimer?: ReturnType<typeof setTimeout>;
  private fpsAnimId?: number;

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
    const files = [`${id}.component.ts`, `${id}.component.html`, `${id}.component.scss`];
    return this.isThreeScene()
      ? [
          ...files,
          'three-scene.ts',
          'interactive-scenes.ts',
          'warehouse-scene.ts',
          'department-scenes.ts',
        ]
      : files;
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
    const tintAttr = this.tintAttribute(tint);
    const code = active?.code ?? entry.code;

    const lines: string[] = [
      `// DICCIONARIO DE ESTILOS — CÓDIGO: [${code}]`,
      `// Categoría: ${group.label} [${group.code}] · Componente: ${entry.label} [${entry.code}]${active ? ` · Sub-estilo: ${active.label} [${active.code}]` : ''}`,
      tint ? `// Color de acento personalizado: ${tint}` : '',
      '// Copia la carpeta completa y ajusta la ruta de importación:',
      `//    ${entry.sourcePath}/`,
      `//    ${this.fileNames().join(' · ')}`,
      ...(entry.supportingFolders ?? []).map(
        (folder) => `// Copia como carpeta hermana: ${folder}/`,
      ),
      ...this.installCommands().map((command) => `// ${command}`),
      '',
      "import { Component } from '@angular/core';",
      `import { ${entry.className} } from './components/${group.id}/${entry.id}/${entry.id}.component';`,
      '',
      '@Component({',
      "  selector: 'app-mi-pagina',",
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

    return lines.join('\n');
  });

  /** Solo el tag HTML para usar directamente en la plantilla */
  readonly htmlSnippet = computed(() => {
    const entry = this.entry();
    const active = this.activeVariant();
    const selectorAttr = active ? ` variant="${active.id}"` : '';
    const tint = this.selectedColor();
    const tintAttr = this.tintAttribute(tint);
    return `<${entry.selector}${selectorAttr}${tintAttr} />`;
  });

  /** Solo el bloque TypeScript */
  readonly tsSnippet = computed(() => {
    const entry = this.entry();
    const group = this.group();
    return [
      ...this.installCommands().map((command) => `// ${command}`),
      "import { Component } from '@angular/core';",
      `import { ${entry.className} } from './components/${group.id}/${entry.id}/${entry.id}.component';`,
      '',
      '@Component({',
      "  selector: 'app-mi-pagina',",
      `  imports: [${entry.className}],`,
      `  template: \`${this.htmlSnippet()}\`,`,
      '})',
      'export class MiComponente {}',
    ].join('\n');
  });

  private isThreeScene(): boolean {
    return this.group().id === 'media-3d' && this.entry().id === 'three-scenes';
  }

  private tintAttribute(tint: string): string {
    if (!tint) return '';
    return this.entry().sceneControls ? ` accent="${tint}"` : ` [style.--ac-accent]="'${tint}'"`;
  }

  private installCommands(): readonly string[] {
    const entry = this.entry();
    return entry.requiresForms
      ? ['Instala @angular/forms en la misma versión que @angular/core.']
      : (entry.npmInstall ?? []);
  }

  readonly currentCode = computed(() => {
    switch (this.activeCodeTab()) {
      case 'html':
        return this.htmlSnippet();
      case 'ts':
        return this.tsSnippet();
      default:
        return this.snippet();
    }
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

    this.destroyRef.onDestroy(() => {
      clearTimeout(this.resetTimer);
      if (this.fpsAnimId) cancelAnimationFrame(this.fpsAnimId);
    });

    // Monitor de FPS en tiempo real
    let lastTime = performance.now();
    let frames = 0;
    const calcFps = () => {
      frames++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        this.fps.set(Math.min(60, Math.round((frames * 1000) / (now - lastTime))));
        frames = 0;
        lastTime = now;
      }
      this.fpsAnimId = requestAnimationFrame(calcFps);
    };
    this.fpsAnimId = requestAnimationFrame(calcFps);
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
      await navigator.clipboard.writeText(this.currentCode());
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
