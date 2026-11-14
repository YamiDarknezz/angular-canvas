import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

/** Campo autónomo. Emite el valor para que el formulario anfitrión aplique su propia política. */
@Component({
  selector: 'app-form-password-strength',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './password-strength.component.html',
  styleUrl: './password-strength.component.scss',
})
export class PasswordStrengthComponent {
  readonly variant = input<string>('security');
  readonly label = input('Nueva contraseña');
  readonly valueChange = output<string>();
  readonly visible = signal(false);
  private readonly password = signal('');

  protected readonly criteria = computed(() => {
    const value = this.password();
    return [
      { label: 'Al menos 12 caracteres', met: [...value].length >= 12 },
      {
        label: 'Una letra minúscula y una mayúscula',
        met: /\p{Ll}/u.test(value) && /\p{Lu}/u.test(value),
      },
      { label: 'Al menos un número', met: /\p{Nd}/u.test(value) },
      { label: 'Al menos un símbolo', met: /[\p{P}\p{S}]/u.test(value) },
    ];
  });
  protected readonly completed = computed(
    () => this.criteria().filter((criterion) => criterion.met).length,
  );

  protected onInput(value: string): void {
    this.password.set(value);
    this.valueChange.emit(value);
  }
}
