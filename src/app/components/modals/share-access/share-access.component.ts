import {
  ChangeDetectionStrategy,
  Component,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';

export type AccessRole = 'viewer' | 'editor';

export interface Collaborator {
  readonly email: string;
  readonly name?: string;
  readonly role: AccessRole;
}

const DEMO_COLLABORATORS: readonly Collaborator[] = [
  { email: 'ana@estudio.example', name: 'Ana Ruiz', role: 'editor' },
  { email: 'leo@estudio.example', name: 'Leo Martínez', role: 'viewer' },
];

/** Gestor de acceso autocontenido. La aplicación puede persistir los cambios con accessChanged. */
@Component({
  selector: 'app-modal-share-access',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './share-access.component.html',
  styleUrl: './share-access.component.scss',
})
export class ShareAccessComponent {
  readonly variant = input<string>();
  readonly documentName = input('Plan trimestral');
  readonly shareLink = input('https://estudio.example/plan-trimestral');
  readonly initialCollaborators = input(DEMO_COLLABORATORS);
  readonly accessChanged = output<readonly Collaborator[]>();

  protected readonly collaborators = linkedSignal(this.initialCollaborators);
  protected readonly feedback = signal('');

  protected add(
    event: SubmitEvent,
    emailField: HTMLInputElement,
    roleField: HTMLSelectElement,
  ): void {
    event.preventDefault();
    const email = emailField.value.trim();
    if (!email) return;

    if (this.collaborators().some((person) => this.sameEmail(person.email, email))) {
      emailField.setCustomValidity('Este correo ya tiene acceso.');
      emailField.reportValidity();
      return;
    }
    this.commit([...this.collaborators(), { email, role: this.toRole(roleField.value) }]);
    this.feedback.set('Acceso agregado para ' + email + '.');
    emailField.value = '';
    emailField.focus();
  }

  protected changeRole(email: string, field: HTMLSelectElement): void {
    const role = this.toRole(field.value);
    this.commit(
      this.collaborators().map((person) =>
        this.sameEmail(person.email, email) ? { ...person, role } : person,
      ),
    );
    this.feedback.set(email + (role === 'editor' ? ' puede editar.' : ' puede ver.'));
  }

  protected remove(email: string, emailField: HTMLInputElement): void {
    this.commit(this.collaborators().filter((person) => !this.sameEmail(person.email, email)));
    this.feedback.set('Se retiró el acceso de ' + email + '.');
    emailField.focus();
  }

  protected async copy(field: HTMLInputElement): Promise<void> {
    const clipboard = field.ownerDocument.defaultView?.navigator.clipboard;
    try {
      if (!clipboard) throw new Error('Clipboard no disponible');
      await clipboard.writeText(field.value);
      this.feedback.set('Enlace copiado.');
    } catch {
      field.focus();
      field.select();
      this.feedback.set('Enlace seleccionado para copiarlo manualmente.');
    }
  }

  private sameEmail(first: string, second: string): boolean {
    return first.toLowerCase() === second.toLowerCase();
  }

  private toRole(value: string): AccessRole {
    return value === 'editor' ? 'editor' : 'viewer';
  }

  private commit(collaborators: readonly Collaborator[]): void {
    this.collaborators.set(collaborators);
    this.accessChanged.emit(collaborators);
  }
}
