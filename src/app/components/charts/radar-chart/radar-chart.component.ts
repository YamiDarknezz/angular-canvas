import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  input,
  signal,
  viewChild,
} from '@angular/core';
import gsap from 'gsap';

export interface RadarAxis {
  readonly label: string;
  readonly angle: number; // en radianes
  readonly valueA: number; // 0 a 100
  readonly valueB: number; // 0 a 100
}

@Component({
  selector: 'app-chart-radar',
  imports: [],
  templateUrl: './radar-chart.component.html',
  styleUrl: './radar-chart.component.scss',
})
export class RadarChartComponent implements OnInit, OnDestroy {
  readonly variant = input<string>('polygon');

  readonly chartBox = viewChild<ElementRef<HTMLElement>>('chartBox');
  readonly polyARef = viewChild<ElementRef<SVGPolygonElement>>('polyA');
  readonly polyBRef = viewChild<ElementRef<SVGPolygonElement>>('polyB');
  readonly scanBeam = viewChild<ElementRef<SVGLineElement>>('scanBeam');

  // Centro y radio del radar
  readonly cx = 160;
  readonly cy = 160;
  readonly maxR = 110;

  // 6 ejes equidistantes
  readonly axes = signal<RadarAxis[]>([
    { label: 'Rendimiento', angle: (0 * Math.PI) / 3 - Math.PI / 2, valueA: 90, valueB: 65 },
    { label: 'Seguridad', angle: (1 * Math.PI) / 3 - Math.PI / 2, valueA: 85, valueB: 95 },
    { label: 'Escalabilidad', angle: (2 * Math.PI) / 3 - Math.PI / 2, valueA: 95, valueB: 70 },
    { label: 'UX / UI', angle: (3 * Math.PI) / 3 - Math.PI / 2, valueA: 78, valueB: 88 },
    { label: 'Fiabilidad', angle: (4 * Math.PI) / 3 - Math.PI / 2, valueA: 92, valueB: 80 },
    { label: 'Mantenibilidad', angle: (5 * Math.PI) / 3 - Math.PI / 2, valueA: 88, valueB: 85 },
  ]);

  // Círculos/anillos concéntricos de fondo (20%, 40%, 60%, 80%, 100%)
  readonly rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Líneas poligonales concéntricas
  ringPolygonPoints(fraction: number): string {
    return this.axes()
      .map((ax) => {
        const r = this.maxR * fraction;
        const x = this.cx + r * Math.cos(ax.angle);
        const y = this.cy + r * Math.sin(ax.angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  // Puntos del polígono de datos A
  readonly pointsA = computed(() => {
    return this.axes()
      .map((ax) => {
        const r = this.maxR * (ax.valueA / 100);
        const x = this.cx + r * Math.cos(ax.angle);
        const y = this.cy + r * Math.sin(ax.angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  });

  // Puntos del polígono de datos B
  readonly pointsB = computed(() => {
    return this.axes()
      .map((ax) => {
        const r = this.maxR * (ax.valueB / 100);
        const x = this.cx + r * Math.cos(ax.angle);
        const y = this.cy + r * Math.sin(ax.angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  });

  private timeline?: gsap.core.Timeline;
  private scanTween?: gsap.core.Tween;

  ngOnInit(): void {
    setTimeout(() => this.animate(), 60);
  }

  ngOnDestroy(): void {
    this.timeline?.kill();
    this.scanTween?.kill();
  }

  animate(): void {
    this.timeline?.kill();
    this.scanTween?.kill();
    this.timeline = gsap.timeline();

    const polyA = this.polyARef()?.nativeElement;
    const polyB = this.polyBRef()?.nativeElement;
    const beam = this.scanBeam()?.nativeElement;

    if (polyA) {
      gsap.fromTo(
        polyA,
        { scale: 0, transformOrigin: `${this.cx}px ${this.cy}px` },
        { scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.75)' },
      );
    }

    if (polyB) {
      gsap.fromTo(
        polyB,
        { scale: 0, transformOrigin: `${this.cx}px ${this.cy}px` },
        { scale: 1, duration: 1.2, delay: 0.15, ease: 'elastic.out(1, 0.75)' },
      );
    }

    if (this.variant() === 'scanner' && beam) {
      this.scanTween = gsap.to(beam, {
        rotation: 360,
        transformOrigin: `${this.cx}px ${this.cy}px`,
        duration: 3,
        repeat: -1,
        ease: 'none',
      });
    }
  }

  // Métodos auxiliares para la plantilla
  mathCos(angle: number): number {
    return Math.cos(angle);
  }

  mathSin(angle: number): number {
    return Math.sin(angle);
  }

  randomize(): void {
    const updated = this.axes().map((ax) => ({
      ...ax,
      valueA: Math.floor(55 + Math.random() * 42),
      valueB: Math.floor(50 + Math.random() * 45),
    }));
    this.axes.set(updated);
    setTimeout(() => this.animate(), 30);
  }
}
