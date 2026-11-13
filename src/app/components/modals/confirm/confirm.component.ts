import { Component, input, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

/**
 * Diálogo de confirmación con variantes de peligro y vidrio. Cada variante
 * tiene su propio trigger y overlay; solo uno puede estar abierto a la vez.
 *
 * Autocontenido: sin dependencias de la galería.
 */
@Component({
  selector: 'app-modal-confirm',
  imports: [NgTemplateOutlet],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
})
export class ConfirmModalComponent {
  private static nextId = 0;
  protected readonly instanceId = 'ac-confirm-' + ConfirmModalComponent.nextId++;

  readonly variant = input<string>();

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
