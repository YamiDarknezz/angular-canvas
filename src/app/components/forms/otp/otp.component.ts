import { Component, computed, signal } from '@angular/core';

/**
 * Código OTP de 6 dígitos con avance automático, retroceso al borrar y
 * navegación con flechas. Dos acabados: cajas de vidrio y subrayado mono.
 *
 * Autocontenido: sin dependencias de la galería.
 */
@Component({
  selector: 'app-form-otp',
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
})
export class OtpComponent {
  readonly digits = signal<readonly string[]>(['2', '0', '2', '6', '', '']);

  readonly filled = computed(() => this.digits().filter((digit) => digit !== '').length);
  readonly code = computed(() => this.digits().join('') || '······');

  onInput(input: HTMLInputElement, index: number): void {
    const value = input.value.replace(/\D/g, '').slice(-1);
    input.value = value;
    this.digits.update((digits) => digits.map((digit, i) => (i === index ? value : digit)));

    if (value) {
      (input.nextElementSibling as HTMLElement | null)?.focus();
    }
  }

  onKeydown(input: HTMLInputElement, index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.digits()[index] && index > 0) {
      event.preventDefault();
      this.digits.update((digits) => digits.map((digit, i) => (i === index - 1 ? '' : digit)));
      (input.previousElementSibling as HTMLElement | null)?.focus();
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      (input.previousElementSibling as HTMLElement | null)?.focus();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      (input.nextElementSibling as HTMLElement | null)?.focus();
    }
  }
}
