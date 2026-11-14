import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

export interface ReportOption {
  readonly id: string;
  readonly label: string;
}

export interface ReportRequest {
  readonly name: string;
  readonly area: ReportOption;
  readonly period: ReportOption;
}

const AREAS = [
  { id: 'sales', label: 'Comercial' },
  { id: 'people', label: 'RR. HH.' },
  { id: 'finance', label: 'Finanzas' },
] as const;

const PERIODS = [
  { id: 'week', label: 'Últimos 7 días' },
  { id: 'month', label: 'Últimos 30 días' },
  { id: 'quarter', label: 'Últimos 90 días' },
] as const;

/** Asistente con dialog nativo. La aplicación puede crear el informe al recibir reportRequested. */
@Component({
  selector: 'app-modal-report-wizard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './report-wizard.component.html',
  styleUrl: './report-wizard.component.scss',
})
export class ReportWizardComponent {
  private readonly injector = inject(Injector);

  readonly variant = input<string>();
  readonly areas = input<readonly ReportOption[]>(AREAS);
  readonly periods = input<readonly ReportOption[]>(PERIODS);
  readonly reportRequested = output<ReportRequest>();

  protected readonly name = signal('');
  protected readonly areaId = signal('');
  protected readonly periodId = signal('');
  protected readonly review = signal(false);
  protected readonly confirmation = signal<ReportRequest | null>(null);

  protected readonly draft = computed<ReportRequest | null>(() => {
    const name = this.name().trim();
    const area = this.areas().find(({ id }) => id === this.areaId());
    const period = this.periods().find(({ id }) => id === this.periodId());
    return name && area && period ? { name, area, period } : null;
  });

  protected open(dialog: HTMLDialogElement, nameField: HTMLInputElement): void {
    this.name.set('');
    this.areaId.set(this.areas()[0]?.id ?? '');
    this.periodId.set(this.periods()[0]?.id ?? '');
    this.review.set(false);
    nameField.setCustomValidity('');
    dialog.showModal();
    this.focusAfterRender(nameField);
  }

  protected next(event: SubmitEvent, nameField: HTMLInputElement, summary: HTMLElement): void {
    event.preventDefault();
    if (!this.draft()) {
      if (!this.name().trim()) {
        nameField.setCustomValidity('Escribe un nombre para el informe.');
        nameField.reportValidity();
      }
      return;
    }

    this.review.set(true);
    this.focusAfterRender(summary);
  }

  protected back(nameField: HTMLInputElement): void {
    this.review.set(false);
    this.focusAfterRender(nameField);
  }

  protected finish(dialog: HTMLDialogElement): void {
    const report = this.draft();
    if (!report) return;
    this.confirmation.set(report);
    dialog.close();
    this.reportRequested.emit(report);
  }

  private focusAfterRender(element: HTMLElement): void {
    afterNextRender(() => element.focus(), { injector: this.injector });
  }
}
