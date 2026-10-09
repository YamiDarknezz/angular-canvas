import { Component } from '@angular/core';

type MarqueeMark = 'triangle' | 'diamond' | 'ring' | 'hex' | 'wave' | 'square';

interface MarqueeLogo {
  readonly name: string;
  readonly mark: MarqueeMark;
}

@Component({
  selector: 'app-anim-marquee',
  templateUrl: './marquee.component.html',
  styleUrl: './marquee.component.scss',
})
export class MarqueeComponent {
  readonly copies = [0, 1];

  readonly displayWords = ['Angular', 'Diseño', 'Animación', 'Señales', 'Canvas'];

  readonly topChips = ['Signals', 'Standalone', 'Zoneless', 'SSR', 'Hydration'];

  readonly bottomChips = ['Animaciones', 'Temas', 'Accesible', 'Sin dependencias', 'Copia y pega'];

  readonly logos: readonly MarqueeLogo[] = [
    { name: 'Nova', mark: 'triangle' },
    { name: 'Vertex', mark: 'diamond' },
    { name: 'Orbit', mark: 'ring' },
    { name: 'Halo', mark: 'hex' },
    { name: 'Pulse', mark: 'wave' },
    { name: 'Frame', mark: 'square' },
  ];
}
