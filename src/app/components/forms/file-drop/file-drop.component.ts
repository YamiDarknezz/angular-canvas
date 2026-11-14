import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

const byteFormat = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 1 });

/** Selecciona archivos locales y entrega la lista al componente anfitrión. */
@Component({
  selector: 'app-form-file-drop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './file-drop.component.html',
  styleUrl: './file-drop.component.scss',
})
export class FileDropComponent {
  readonly variant = input<string>('documents');
  /** Extensiones, tipos MIME o familias como image/*, separados por comas. */
  readonly accept = input<string | null>(null);
  readonly maxBytes = input(10 * 1024 * 1024);
  readonly filesChange = output<readonly File[]>();

  protected readonly files = signal<readonly File[]>([]);
  protected readonly dragging = signal(false);
  protected readonly message = signal('');
  protected readonly photos = computed(() => this.variant() === 'images');
  protected readonly allowed = computed(
    () => this.accept() ?? (this.photos() ? 'image/*' : '.pdf,.csv,.xlsx'),
  );
  protected readonly limit = computed(() =>
    Number.isFinite(this.maxBytes()) && this.maxBytes() > 0 ? this.maxBytes() : 10 * 1024 * 1024,
  );
  private dragTargets = 0;

  protected dragEnter(event: DragEvent): void {
    if (!event.dataTransfer?.types.includes('Files')) return;
    event.preventDefault();
    this.dragTargets++;
    this.dragging.set(true);
  }

  protected dragOver(event: DragEvent): void {
    if (!event.dataTransfer?.types.includes('Files')) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  protected dragLeave(): void {
    this.dragTargets = Math.max(0, this.dragTargets - 1);
    this.dragging.set(this.dragTargets > 0);
  }

  protected drop(event: DragEvent): void {
    event.preventDefault();
    this.dragTargets = 0;
    this.dragging.set(false);
    this.add(event.dataTransfer?.files);
  }

  protected choose(inputElement: HTMLInputElement): void {
    this.add(inputElement.files);
    inputElement.value = '';
  }

  protected remove(index: number): void {
    const removed = this.files()[index];
    if (!removed) return;
    this.updateFiles(this.files().filter((_, current) => current !== index));
    this.message.set(`Se quitó ${removed.name}.`);
  }

  protected formatSize(bytes: number): string {
    if (bytes >= 1024 * 1024) return `${byteFormat.format(bytes / (1024 * 1024))} MB`;
    if (bytes >= 1024) return `${byteFormat.format(bytes / 1024)} KB`;
    return `${byteFormat.format(bytes)} B`;
  }

  private add(incoming: FileList | null | undefined): void {
    if (!incoming?.length) return;
    const tokens = this.allowed()
      .toLowerCase()
      .split(',')
      .map((token) => token.trim())
      .filter(Boolean);
    const next = [...this.files()];
    const rejected: string[] = [];
    let accepted = 0;
    for (const file of Array.from(incoming)) {
      const filename = file.name.toLowerCase();
      const type = file.type.toLowerCase();
      const matches =
        tokens.length === 0 ||
        tokens.some((token) => {
          if (token.startsWith('.')) return filename.endsWith(token);
          if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
          return type === token;
        });
      if (!matches) {
        rejected.push(`${file.name}: formato no permitido`);
        continue;
      }
      if (file.size > this.limit()) {
        rejected.push(`${file.name}: supera el tamaño máximo`);
        continue;
      }
      if (
        next.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified,
        )
      ) {
        rejected.push(`${file.name}: ya seleccionado`);
        continue;
      }
      next.push(file);
      accepted++;
    }
    if (accepted) this.updateFiles(next);
    const added = accepted === 1 ? 'Se añadió un archivo.' : `Se añadieron ${accepted} archivos.`;
    this.message.set([...(accepted ? [added] : []), ...rejected].join(' · '));
  }

  private updateFiles(files: readonly File[]): void {
    this.files.set(files);
    this.filesChange.emit(files);
  }
}
