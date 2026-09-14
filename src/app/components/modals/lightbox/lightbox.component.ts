import { Component, computed, signal } from '@angular/core';

interface Photo {
  readonly id: string;
  readonly title: string;
  readonly gradient: string;
}

/**
 * Lightbox de fotos con zoom, prev/next y dos acabados: foto oscura y
 * marco de vidrio.
 *
 * Autocontenido: sin dependencias de la galería.
 */
@Component({
  selector: 'app-modal-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss',
})
export class LightboxComponent {
  readonly photos: readonly Photo[] = [
    { id: 'aurora', title: 'Aurora boreal', gradient: 'linear-gradient(135deg, #6366f1, #06b6d4)' },
    {
      id: 'sunset',
      title: 'Atardecer tropical',
      gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
    },
    {
      id: 'forest',
      title: 'Bosque nebuloso',
      gradient: 'linear-gradient(135deg, #059669, #0f766e)',
    },
  ];

  readonly open = signal<string | null>(null);
  readonly index = computed(() => this.photos.findIndex((p) => p.id === this.open()));
  readonly current = computed(() => this.photos[this.index()] ?? null);

  show(id: string): void {
    this.open.set(id);
  }

  close(): void {
    this.open.set(null);
  }

  prev(): void {
    const i = this.index();
    const prev = i > 0 ? i - 1 : this.photos.length - 1;
    this.open.set(this.photos[prev].id);
  }

  next(): void {
    const i = this.index();
    const next = i < this.photos.length - 1 ? i + 1 : 0;
    this.open.set(this.photos[next].id);
  }
}
