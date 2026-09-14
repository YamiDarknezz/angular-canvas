import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

export interface BookPage {
  num: string;
  tag: string;
  title: string;
  content: string;
  footer: string;
}

@Component({
  selector: 'app-anim-book-flip',
  imports: [NgTemplateOutlet],
  templateUrl: './book-flip.component.html',
  styleUrl: './book-flip.component.scss',
})
export class BookFlipComponent {
  readonly page1: BookPage = {
    num: '01',
    tag: 'Capítulo I',
    title: 'Estructura & Espacio',
    content:
      'Un libro físico está compuesto por hojas consecutivas montadas sobre un lomo común. Cada hoja posee dos caras que giran en el eje Y.',
    footer: 'Pág. 1 — Fundamentos',
  };

  readonly page2: BookPage = {
    num: '02',
    tag: 'Capítulo II',
    title: 'El Eje Central',
    content:
      'Al definir transform-origin en el borde izquierdo de la hoja, la rotación tridimensional describe el arco exacto del papel doblado.',
    footer: 'Pág. 2 — Bisagras',
  };

  readonly page3: BookPage = {
    num: '03',
    tag: 'Capítulo III',
    title: 'Continuidad 3D',
    content:
      'Las hojas previas permanecen en el bloque izquierdo mientras las páginas restantes descansan a la derecha, preservando la masa física.',
    footer: 'Pág. 3 — Mecánica',
  };

  readonly page4: BookPage = {
    num: '04',
    tag: 'Capítulo IV',
    title: 'Sombra & Relieve',
    content:
      'El sombreado dinámico y el pliegue central acentúan la profundidad óptica sin necesidad de librerías externas ni pesadas texturas.',
    footer: 'Pág. 4 — Profundidad',
  };

  readonly page5: BookPage = {
    num: '05',
    tag: 'Capítulo V',
    title: 'Giro Bidireccional',
    content:
      'Hojear hacia adelante y hacia atrás responde a la misma física: cada hoja conserva su orientación espacial y su orden en la pila.',
    footer: 'Pág. 5 — Navegación',
  };

  readonly page6: BookPage = {
    num: '06',
    tag: 'Capítulo VI',
    title: 'Rendimiento Nativo',
    content:
      'Ejecutado con CSS 3D Transforms acelerados por hardware y Angular Signals para un consumo de memoria mínimo y 60 FPS estables.',
    footer: 'Pág. 6 — Arquitectura',
  };

  readonly leaf1Flipped = signal(false);
  readonly leaf2Flipped = signal(false);
  readonly turningLeaf = signal<number | null>(null);

  readonly spread = computed(() => (this.leaf1Flipped() ? 1 : 0) + (this.leaf2Flipped() ? 1 : 0));
  readonly totalSpreads = 3;

  readonly hasPrev = computed(() => this.leaf1Flipped());
  readonly hasNext = computed(() => !this.leaf2Flipped());
  readonly isTurning = computed(() => this.turningLeaf() !== null);

  turnNext(): void {
    if (this.isTurning() || !this.hasNext()) return;

    if (!this.leaf1Flipped()) {
      this.turningLeaf.set(1);
      this.leaf1Flipped.set(true);
    } else if (!this.leaf2Flipped()) {
      this.turningLeaf.set(2);
      this.leaf2Flipped.set(true);
    }

    setTimeout(() => {
      this.turningLeaf.set(null);
    }, 750);
  }

  turnPrev(): void {
    if (this.isTurning() || !this.hasPrev()) return;

    if (this.leaf2Flipped()) {
      this.turningLeaf.set(2);
      this.leaf2Flipped.set(false);
    } else if (this.leaf1Flipped()) {
      this.turningLeaf.set(1);
      this.leaf1Flipped.set(false);
    }

    setTimeout(() => {
      this.turningLeaf.set(null);
    }, 750);
  }
}
