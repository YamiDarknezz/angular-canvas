import { Component } from '@angular/core';

interface PanelMetric {
  readonly label: string;
  readonly value: string;
  readonly percent: number;
}

/**
 * Paneles de vidrio sobre color: métricas, perfil y superposición sobre una
 * "imagen" degradada. Todo translúcido, nada depende del tema activo.
 *
 * Autocontenido: sin dependencias de la galería.
 */
@Component({
  selector: 'app-card-glass-panel',
  templateUrl: './glass-panel.component.html',
  styleUrl: './glass-panel.component.scss',
})
export class GlassPanelComponent {
  readonly metrics: readonly PanelMetric[] = [
    { label: 'Ingresos', value: '24.8k', percent: 72 },
    { label: 'Usuarios', value: '8.1k', percent: 54 },
    { label: 'Retención', value: '91%', percent: 91 },
  ];
}
