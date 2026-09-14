import { Component, signal } from '@angular/core';

/**
 * Diálogo de confirmación con variantes de peligro y vidrio. Cada variante
 * tiene su propio trigger y overlay; solo uno puede estar abierto a la vez.
 *
 * Autocontenido: sin dependencias de la galería.
 */
@Component({
  selector: 'app-modal-confirm',
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
})
export class ConfirmModalComponent {
  readonly open = signal<string | null>(null);
  readonly confirmed = signal<string | null>(null);

  show(id: string): void {
    this.open.set(id);
  }

  close(): void {
    this.open.set(null);
  }

  confirm(id: string): void {
    this.confirmed.set(id);
    this.open.set(null);
  }
}
