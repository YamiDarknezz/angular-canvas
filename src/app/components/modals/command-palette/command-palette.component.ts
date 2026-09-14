import { Component, computed, effect, signal, viewChild, ElementRef } from '@angular/core';

interface PaletteCommand {
  readonly id: string;
  readonly icon: string;
  readonly label: string;
  readonly hint: string;
}

/**
 * Paleta de comandos translúcida: búsqueda, navegación con flechas, `Enter`
 * para ejecutar y `Escape` para cerrar. Se monta dentro del iframe, así que el
 * overlay cubre solo la ventana del componente.
 *
 * Autocontenido: sin dependencias de la galería.
 */
@Component({
  selector: 'app-modal-palette',
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.scss',
  host: {
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class CommandPaletteComponent {
  private readonly search = viewChild<ElementRef<HTMLInputElement>>('search');

  readonly open = signal(false);
  readonly query = signal('');
  readonly cursor = signal(0);
  readonly lastRun = signal<string | null>(null);

  readonly commands: readonly PaletteCommand[] = [
    { id: 'dashboard', icon: '📊', label: 'Ir al dashboard', hint: 'Vista general' },
    { id: 'proyecto', icon: '✨', label: 'Crear proyecto', hint: 'Nuevo espacio' },
    { id: 'invitar', icon: '👥', label: 'Invitar a alguien', hint: 'Equipo' },
    { id: 'buscar', icon: '🔎', label: 'Buscar archivos', hint: 'Global' },
    { id: 'tema', icon: '🌗', label: 'Cambiar de tema', hint: 'Apariencia' },
    { id: 'atajos', icon: '⌨️', label: 'Ver atajos', hint: 'Ayuda' },
    { id: 'exportar', icon: '📦', label: 'Exportar datos', hint: 'JSON' },
    { id: 'salir', icon: '🚪', label: 'Cerrar sesión', hint: 'Cuenta' },
  ];

  readonly results = computed(() => {
    const query = this.query().trim().toLowerCase();
    if (!query) {
      return this.commands;
    }
    return this.commands.filter((command) =>
      `${command.label} ${command.hint}`.toLowerCase().includes(query),
    );
  });

  constructor() {
    // Al abrir, el foco va al buscador (el input aparece al pintar el overlay).
    effect(() => {
      if (this.open()) {
        this.search()?.nativeElement.focus();
      }
    });
  }

  show(): void {
    this.query.set('');
    this.cursor.set(0);
    this.open.set(true);
  }

  close(): void {
    this.open.set(false);
  }

  onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.cursor.set(0);
  }

  run(command: PaletteCommand): void {
    this.lastRun.set(command.label);
    this.open.set(false);
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.open()) {
      return;
    }

    if (event.key === 'Escape') {
      this.close();
      return;
    }

    const total = this.results().length;
    if (!total) {
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      this.cursor.update((index) => (index + delta + total) % total);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const command = this.results()[this.cursor()];
      if (command) {
        this.run(command);
      }
    }
  }
}
