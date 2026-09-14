import { Component, signal } from '@angular/core';

interface DockItem {
  readonly id: string;
  readonly label: string;
  /** Trazos del icono SVG (viewBox 24×24, solo contorno). */
  readonly paths: readonly string[];
  /** Contador de la insignia; `0` = sin insignia. */
  readonly badge?: number;
}

/**
 * Dock de navegación inferior con tres variantes: flotante oscuro, vidrio
 * transparente y barra completa. El elemento activo se marca con click y los
 * iconos se magnifican al pasar el cursor.
 *
 * Autocontenido: no depende de nada de la galería. Los escenarios llevan su
 * propio fondo para que la transparencia del vidrio se vea siempre, sin
 * depender del tema activo.
 */
@Component({
  selector: 'app-nav-dock',
  templateUrl: './dock.component.html',
  styleUrl: './dock.component.scss',
})
export class DockNavComponent {
  readonly active = signal('inicio');

  /** Escenarios que se ven (y se filtran) como variantes del componente. */
  readonly scenes = [
    { id: 'floating', label: 'Dock flotante' },
    { id: 'glass', label: 'Dock de cristal' },
    { id: 'bar', label: 'Barra inferior' },
  ] as const;

  readonly items: readonly DockItem[] = [
    {
      id: 'inicio',
      label: 'Inicio',
      paths: ['M3 10.8 12 3.5l9 7.3', 'M5.4 9.6V20a.9.9 0 0 0 .9.9h11.4a.9.9 0 0 0 .9-.9V9.6'],
    },
    {
      id: 'buscar',
      label: 'Buscar',
      paths: ['M11 18.4a7.4 7.4 0 1 0 0-14.8 7.4 7.4 0 0 0 0 14.8Z', 'm20.5 20.5-4.1-4.1'],
    },
    {
      id: 'alertas',
      label: 'Alertas',
      badge: 3,
      paths: [
        'M18 8.5a6 6 0 1 0-12 0c0 6-2.5 8-2.5 8h17S18 14.5 18 8.5',
        'M13.7 20.5a2 2 0 0 1-3.4 0',
      ],
    },
    {
      id: 'mensajes',
      label: 'Mensajes',
      paths: [
        'M20.5 15.5a2.5 2.5 0 0 1-2.5 2.5H8l-4 3.5V5.5A2.5 2.5 0 0 1 6.5 3h11.5a2.5 2.5 0 0 1 2.5 2.5z',
      ],
    },
    {
      id: 'perfil',
      label: 'Perfil',
      paths: [
        'M12 12.2a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Z',
        'M4.8 20.8c1.1-3.3 3.9-5.2 7.2-5.2s6.1 1.9 7.2 5.2',
      ],
    },
  ];

  setActive(id: string): void {
    this.active.set(id);
  }
}
