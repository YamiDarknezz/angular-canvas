import { DecimalPipe } from '@angular/common';
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

export interface HistogramBin {
  readonly range: string;
  readonly count: number;
  readonly pct: number;
}

@Component({
  selector: 'app-chart-histogram',
  imports: [DecimalPipe],
  templateUrl: './histogram.component.html',
  styleUrl: './histogram.component.scss',
})
export class HistogramComponent implements OnInit, OnDestroy {
  private static nextId = 0;
  protected readonly instanceId = 'ac-histogram-' + HistogramComponent.nextId++;

  readonly variant = input<string>('gauss');

  readonly containerRef = viewChild<ElementRef<HTMLElement>>('histBox');
  readonly curveRef = viewChild<ElementRef<SVGPathElement>>('bellCurve');

  // Distribución normal simulada (mu=50, sigma=15) con 14 intervalos
  readonly bins = signal<HistogramBin[]>([
    { range: '10-18', count: 4, pct: 4 },
    { range: '18-26', count: 12, pct: 12 },
    { range: '26-34', count: 32, pct: 32 },
    { range: '34-42', count: 68, pct: 68 },
    { range: '42-50', count: 110, pct: 110 },
    { range: '50-58', count: 135, pct: 135 },
    { range: '58-66', count: 112, pct: 112 },
    { range: '66-74', count: 75, pct: 75 },
    { range: '74-82', count: 42, pct: 42 },
    { range: '82-90', count: 18, pct: 18 },
    { range: '90-98', count: 6, pct: 6 },
  ]);

  readonly maxCount = computed(() => {
    const counts = this.bins().map((b) => b.count);
    return Math.max(...counts, 10);
  });

  readonly totalSamples = computed(() => {
    return this.bins().reduce((acc, b) => acc + b.count, 0);
  });

  // Curva matemática normal suave (SVG path)
  readonly bellCurvePath = computed(() => {
    const list = this.bins();
    if (list.length === 0) return '';
    const w = 700;
    const h = 200;
    const step = w / (list.length - 1);
    const max = this.maxCount();

    const points = list.map((b, i) => {
      const x = i * step;
      const y = h - (b.count / max) * (h * 0.9);
      return { x, y };
    });

    // Spline suave
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const mx = (p0.x + p1.x) / 2;
      d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  });

  // Curva de distribución acumulativa (escalonada / sigmoide)
  readonly cumulativePath = computed(() => {
    const list = this.bins();
    const total = this.totalSamples();
    if (total === 0) return '';
    const w = 700;
    const h = 200;
    const step = w / (list.length - 1);

    let running = 0;
    const points = list.map((b, i) => {
      running += b.count;
      const x = i * step;
      const y = h - (running / total) * (h * 0.9);
      return { x, y };
    });

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const mx = (p0.x + p1.x) / 2;
      d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  });

  private timeline?: gsap.core.Timeline;

  ngOnInit(): void {
    setTimeout(() => this.animate(), 60);
  }

  ngOnDestroy(): void {
    this.timeline?.kill();
  }

  animate(): void {
    this.timeline?.kill();
    const box = this.containerRef()?.nativeElement;
    if (!box) return;

    const bars = box.querySelectorAll<HTMLElement>('.bin-bar');
    const curve = this.curveRef()?.nativeElement;

    this.timeline = gsap.timeline();

    // Animación de barras
    this.timeline.fromTo(
      bars,
      { scaleY: 0, transformOrigin: 'bottom center' },
      {
        scaleY: 1,
        duration: 0.9,
        stagger: 0.04,
        ease: 'power3.out',
      },
    );

    // Animación de trazado de curva overlay
    if (curve) {
      const len = curve.getTotalLength();
      gsap.fromTo(
        curve,
        { strokeDasharray: len, strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' },
      );
    }
  }

  randomizeData(): void {
    // Generar muestra normal aleatoria usando Box-Muller
    const sampleSize = 600 + Math.floor(Math.random() * 400);
    const mean = 50 + (Math.random() * 10 - 5);
    const stdDev = 12 + Math.random() * 6;

    const counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const ranges = [
      '10-18',
      '18-26',
      '26-34',
      '34-42',
      '42-50',
      '50-58',
      '58-66',
      '66-74',
      '74-82',
      '82-90',
      '90-98',
    ];

    for (let i = 0; i < sampleSize; i++) {
      // Box-Muller
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1 || 0.0001)) * Math.cos(2.0 * Math.PI * u2);
      const val = mean + z0 * stdDev;
      const idx = Math.floor((val - 10) / 8);
      if (idx >= 0 && idx < counts.length) {
        counts[idx]++;
      }
    }

    const updated: HistogramBin[] = ranges.map((r, i) => ({
      range: r,
      count: Math.max(counts[i], 2),
      pct: 0,
    }));

    this.bins.set(updated);
    setTimeout(() => this.animate(), 30);
  }
}
