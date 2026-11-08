import { Component, input, signal } from '@angular/core';

export interface ToastItem {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly time: string;
  readonly type: 'success' | 'info' | 'warning';
}

@Component({
  selector: 'app-toast-stack',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  readonly variant = input<string>('stacked');

  readonly toasts = signal<ToastItem[]>([
    {
      id: '1',
      title: 'Despliegue Exitoso',
      message: 'La versión v2.1.0 ya está activa en producción.',
      time: 'Hace 2m',
      type: 'success',
    },
    {
      id: '2',
      title: 'Nueva Conexión',
      message: 'Cliente autenticado desde Madrid (IP: 192.168.1.1).',
      time: 'Hace 5m',
      type: 'info',
    },
    {
      id: '3',
      title: 'Métrica Alcanzada',
      message: 'Has superado los 1,000 requerimientos procesados.',
      time: 'Hace 12m',
      type: 'warning',
    },
  ]);

  readonly morphDone = signal<boolean>(false);

  dismissTop(): void {
    this.toasts.update((list) => (list.length > 1 ? list.slice(1) : list));
  }

  resetToasts(): void {
    this.toasts.set([
      {
        id: '1',
        title: 'Despliegue Exitoso',
        message: 'La versión v2.1.0 ya está activa en producción.',
        time: 'Hace 2m',
        type: 'success',
      },
      {
        id: '2',
        title: 'Nueva Conexión',
        message: 'Cliente autenticado desde Madrid (IP: 192.168.1.1).',
        time: 'Hace 5m',
        type: 'info',
      },
      {
        id: '3',
        title: 'Métrica Alcanzada',
        message: 'Has superado los 1,000 requerimientos procesados.',
        time: 'Hace 12m',
        type: 'warning',
      },
    ]);
  }

  triggerMorph(): void {
    this.morphDone.set(false);
    setTimeout(() => this.morphDone.set(true), 1200);
  }
}
