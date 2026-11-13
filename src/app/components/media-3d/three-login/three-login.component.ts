import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

import { ThreeScenesComponent } from '../three-scenes/three-scenes.component';

const THEMES = {
  waves: { scene: 'waves', accent: '#5ce2bd', panel: '#102b28' },
  nebula: { scene: 'nebula', accent: '#b4a5ff', panel: '#221c3d' },
  tiles: { scene: 'tiles', accent: '#9abaff', panel: '#172541' },
} as const;

type LoginVariant = keyof typeof THEMES;

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Copia las carpetas three-login y three-scenes como hermanas.
 * Instala three@^0.184.0 y @types/three@^0.184.1 como dependencia de desarrollo.
 * Pasa authenticate para conectar el formulario al servicio de sesión de tu app.
 * La demo valida el formulario localmente y no almacena ni transmite credenciales.
 */
@Component({
  selector: 'app-media-three-login',
  imports: [ThreeScenesComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './three-login.component.html',
  styleUrl: './three-login.component.scss',
})
export class ThreeLoginComponent {
  private static nextId = 0;
  protected readonly passwordId = `three-login-password-${ThreeLoginComponent.nextId++}`;
  readonly variant = input<LoginVariant>('waves');
  readonly accent = input<string | null>(null);
  readonly animate = input<boolean | null>(null);
  readonly authenticate = input<((credentials: LoginCredentials) => Promise<void>) | null>(null);
  readonly recoveryUrl = input<string | null>(null);

  protected readonly theme = computed(() => THEMES[this.variant()] ?? THEMES.waves);
  protected readonly revealPassword = signal(false);
  protected readonly paused = signal(false);
  protected readonly pending = signal(false);
  protected readonly message = signal('');
  protected readonly failed = signal(false);
  private readonly destroyRef = inject(DestroyRef);

  protected async submit(
    event: SubmitEvent,
    email: HTMLInputElement,
    password: HTMLInputElement,
  ): Promise<void> {
    event.preventDefault();
    if (this.pending()) return;

    this.message.set('');
    this.failed.set(false);
    const authenticate = this.authenticate();

    if (!authenticate) {
      password.value = '';
      this.revealPassword.set(false);
      this.message.set('Formulario validado. Estás en la vista de demostración.');
      return;
    }

    this.pending.set(true);
    try {
      await authenticate({ email: email.value.trim(), password: password.value });
      if (this.destroyRef.destroyed) return;
      password.value = '';
      this.revealPassword.set(false);
      this.message.set('Sesión iniciada.');
    } catch {
      if (this.destroyRef.destroyed) return;
      this.failed.set(true);
      this.message.set('No se pudo iniciar sesión. Revisa tus datos e inténtalo de nuevo.');
    } finally {
      if (!this.destroyRef.destroyed) this.pending.set(false);
    }
  }
}
