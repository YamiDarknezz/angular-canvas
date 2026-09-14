import { Component, computed, signal } from '@angular/core';

interface TabItem {
  readonly id: string;
  readonly label: string;
  readonly body: string;
}

/**
 * Pestañas con indicador deslizante en dos acabados: barra de vidrio y
 * subrayado luminoso. El indicador se mueve con CSS (`--tab-index`), sin
 * recrear nodos.
 *
 * Autocontenido: sin dependencias de la galería.
 */
@Component({
  selector: 'app-nav-tabs',
  templateUrl: './glass-tabs.component.html',
  styleUrl: './glass-tabs.component.scss',
})
export class GlassTabsComponent {
  readonly active = signal(0);

  readonly variants = [{ id: 'glass' }, { id: 'underline' }] as const;

  readonly tabs: readonly TabItem[] = [
    { id: 'resumen', label: 'Resumen', body: 'Métricas clave del mes en una sola vista.' },
    { id: 'actividad', label: 'Actividad', body: 'Últimos movimientos del equipo y del proyecto.' },
    { id: 'equipo', label: 'Equipo', body: 'Personas, roles y permisos del espacio.' },
    { id: 'ajustes', label: 'Ajustes', body: 'Preferencias, notificaciones e integraciones.' },
  ];

  readonly activeTab = computed(() => this.tabs[this.active()]);

  select(index: number): void {
    this.active.set(index);
  }
}
