import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

export interface DeliveryMilestone {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
  readonly time: string;
}

export interface DeliveryTrip {
  readonly order: string;
  readonly origin: string;
  readonly destination: string;
  readonly reference: string;
  readonly current: number;
  readonly milestones: readonly DeliveryMilestone[];
}

const IN_TRANSIT: DeliveryTrip = {
  order: 'PED-1842',
  origin: 'Centro de distribución',
  destination: 'Bodega San Martín',
  reference: 'Lima · 3 cajas',
  current: 2,
  milestones: [
    {
      id: 'received',
      label: 'Pedido recibido',
      detail: 'Se registraron 3 cajas de abarrotes y bebidas.',
      time: '08:15',
    },
    {
      id: 'prepared',
      label: 'Preparado',
      detail: 'Las cajas fueron verificadas y cargadas en la furgoneta.',
      time: '09:40',
    },
    {
      id: 'transit',
      label: 'En ruta',
      detail: 'La furgoneta salió hacia la bodega. Llegada estimada entre las 11:30 y las 12:00.',
      time: '10:20',
    },
    {
      id: 'delivered',
      label: 'Entregado',
      detail: 'La entrega aparecerá aquí cuando la bodega confirme la recepción.',
      time: 'Pendiente',
    },
  ],
};

const DELIVERED: DeliveryTrip = {
  ...IN_TRANSIT,
  order: 'PED-1831',
  destination: 'Bodega La Esquina',
  reference: 'Lima · 5 cajas',
  current: 3,
  milestones: [
    {
      id: 'received',
      label: 'Pedido recibido',
      detail: 'Se registraron 5 cajas de productos de reposición.',
      time: '07:50',
    },
    {
      id: 'prepared',
      label: 'Preparado',
      detail: 'Se verificó la carga y se imprimió la guía de remisión.',
      time: '08:35',
    },
    {
      id: 'transit',
      label: 'En ruta',
      detail: 'La furgoneta salió del centro de distribución.',
      time: '09:00',
    },
    {
      id: 'delivered',
      label: 'Entregado',
      detail: 'La bodega recibió las 5 cajas y confirmó la entrega.',
      time: '10:12',
    },
  ],
};

@Component({
  selector: 'app-card-delivery-timeline',
  templateUrl: './delivery-timeline.component.html',
  styleUrl: './delivery-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryTimelineCardComponent {
  readonly variant = input<string>();
  readonly trip = input<DeliveryTrip>();
  readonly milestoneSelected = output<DeliveryMilestone>();
  private readonly selection = signal<{ trip: DeliveryTrip; id: string } | undefined>(undefined);

  readonly data = computed(
    () => this.trip() ?? (this.variant() === 'delivered' ? DELIVERED : IN_TRANSIT),
  );
  readonly current = computed(() => this.data().milestones[this.data().current]);
  readonly selected = computed(() => {
    const data = this.data();
    const selection = this.selection();
    return (
      (selection?.trip === data
        ? data.milestones.find((stage) => stage.id === selection.id)
        : undefined) ??
      this.current() ??
      data.milestones[0]
    );
  });
  readonly progress = computed(() => {
    const { current, milestones } = this.data();
    if (milestones.length < 2) return 0;
    return Math.min(1, Math.max(0, current / (milestones.length - 1)));
  });

  select(milestone: DeliveryMilestone): void {
    this.selection.set({ trip: this.data(), id: milestone.id });
    this.milestoneSelected.emit(milestone);
  }
}
