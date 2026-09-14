import { Component, computed, input } from '@angular/core';

interface IconDefinition {
  readonly paths: readonly string[];
  /** Iconos que se pintan rellenos (estrella activa, por ejemplo). */
  readonly filled?: boolean;
}

/**
 * Iconos del andamiaje de la galería: un set propio, de un solo trazo y peso,
 * para no depender de emojis ni de librerías externas.
 *
 * Es andamiaje: los componentes de la librería no lo importan.
 */
const ICONS: Readonly<Record<string, IconDefinition>> = {
  // Categorías
  cards: {
    paths: [
      'M6.5 7.5h11a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-9.5a2 2 0 0 1 2-2Z',
      'M8 4.5h9a2 2 0 0 1 2 2',
    ],
  },
  buttons: {
    paths: [
      'M5.5 4.5h7a3 3 0 0 1 0 6h-7a3 3 0 0 1 0-6Z',
      'M11.5 13.5h7a3 3 0 0 1 0 6h-7a3 3 0 0 1 0-6Z',
    ],
  },
  backgrounds: {
    paths: ['M8.5 4.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z', 'M15.5 10.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z'],
  },
  typography: { paths: ['M4 6.5h16', 'M4 12h10', 'M4 17.5h6'] },
  navigation: {
    paths: [
      'M4.5 5.5h15a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17V7a1.5 1.5 0 0 1 1.5-1.5Z',
      'M9.5 5.5V18.5',
      'M5.8 9h1.4',
      'M5.8 12.5h1.4',
    ],
  },
  forms: {
    paths: [
      'M5.5 5.5h13A2.5 2.5 0 0 1 21 8v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16V8a2.5 2.5 0 0 1 2.5-2.5Z',
      'M7 10h10',
      'M7 14h5',
    ],
  },
  modals: {
    paths: [
      'M5 4.5h14A2.5 2.5 0 0 1 21.5 7v10a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 17V7A2.5 2.5 0 0 1 5 4.5Z',
      'M8.5 8.5h7a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2Z',
    ],
  },
  themes: {
    paths: [
      'M9 4.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z',
      'M15 10.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z',
    ],
  },
  animations: { paths: ['M8 5.5v13l11-6.5z'] },

  // Acciones
  search: { paths: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z', 'm20 20-3.8-3.8'] },
  bolt: { paths: ['M13 2.5 4.5 13.5H11l-1 8L18.5 10H12l1-7.5Z'] },
  chevron: { paths: ['m6.5 9.5 5.5 5.5 5.5-5.5'] },
  star: {
    paths: ['m12 3.6 2.6 5.4 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.9L12 3.6Z'],
  },
  'star-filled': {
    filled: true,
    paths: ['m12 3.6 2.6 5.4 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.9L12 3.6Z'],
  },
  clock: { paths: ['M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z', 'M12 7.5V12l3 1.8'] },
  external: {
    paths: [
      'M14 4h6v6',
      'm20 4-8.5 8.5',
      'M18 13.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V7.5A1.5 1.5 0 0 1 5.5 6H11',
    ],
  },
  code: { paths: ['m9 8-4 4 4 4', 'm15 8 4 4-4 4'] },
  monitor: {
    paths: [
      'M4.5 4.5h15A2 2 0 0 1 21.5 6.5v8a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z',
      'M9 20h6',
      'M12 16.5V20',
    ],
  },
  tablet: {
    paths: [
      'M6.5 3.5h11a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z',
      'M11 17.5h2',
    ],
  },
  phone: {
    paths: ['M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z', 'M11 17.5h2'],
  },
  copy: {
    paths: [
      'M9.5 9.5h8a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 8 19v-8a1.5 1.5 0 0 1 1.5-1.5Z',
      'M5 15h-.5A1.5 1.5 0 0 1 3 13.5v-8A1.5 1.5 0 0 1 4.5 4h8A1.5 1.5 0 0 1 14 5.5V6',
    ],
  },
  'arrow-left': { paths: ['M19 12H5', 'm11 6-6 6 6 6'] },
  'arrow-right': { paths: ['M5 12h14', 'm13 6 6 6-6 6'] },
  close: { paths: ['m6 6 12 12', 'M18 6 6 18'] },
  check: { paths: ['m5 12.5 4.5 4.5L19 7'] },
  dot: { filled: true, paths: ['M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'] },
};

@Component({
  selector: 'ac-icon',
  template: `
    <svg
      viewBox="0 0 24 24"
      [attr.fill]="definition().filled ? 'currentColor' : 'none'"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @for (path of definition().paths; track path) {
        <path [attr.d]="path" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      line-height: 0;
    }

    svg {
      width: 1em;
      height: 1em;
    }
  `,
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly strokeWidth = input(1.8);

  readonly definition = computed<IconDefinition>(() => ICONS[this.name()] ?? ICONS['dot']!);
}
