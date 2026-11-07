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

export interface DataPoint {
  readonly label: string;
  readonly value: number;
  readonly value2?: number;
}

@Component({
  selector: 'app-chart-line',
  imports: [DecimalPipe],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements OnInit, OnDestroy {
  readonly variant = input<string>('smooth');

  readonly pathRef = viewChild<ElementRef<SVGPathElement>>('chartPath');
  readonly path2Ref = viewChild<ElementRef<SVGPathElement>>('chartPath2');
  readonly areaRef = viewChild<ElementRef<SVGPathElement>>('chartArea');
  readonly chartSvg = viewChild<ElementRef<SVGSVGElement>>('chartSvg');

  readonly points = signal<DataPoint[]>([
    { label: 'Ene', value: 34, value2: 20 },
    { label: 'Feb', value: 68, value2: 45 },
    { label: 'Mar', value: 52, value2: 60 },
    { label: 'Abr', value: 95, value2: 70 },
    { label: 'May', value: 80, value2: 85 },
    { label: 'Jun', value: 124, value2: 110 },
    { label: 'Jul', value: 110, value2: 95 },
    { label: 'Ago', value: 155, value2: 130 },
  ]);

  readonly activePoint = signal<{ point: DataPoint; x: number; y: number } | null>(null);

  private tweenTimeline?: gsap.core.Timeline;

  readonly width = 800;
  readonly height = 360;
  readonly padding = { top: 40, right: 40, bottom: 50, left: 60 };

  readonly chartArea = computed(() => ({
    x: this.padding.left,
    y: this.padding.top,
    w: this.width - this.padding.left - this.padding.right,
    h: this.height - this.padding.top - this.padding.bottom,
  }));

  readonly maxValue = computed(() => {
    const pts = this.points();
    const max1 = Math.max(...pts.map((p) => p.value));
    const max2 = Math.max(...pts.map((p) => p.value2 ?? 0));
    return Math.max(max1, max2, 100);
  });

  readonly coords = computed(() => {
    const pts = this.points();
    const { x, y, w, h } = this.chartArea();
    const max = this.maxValue();
    const step = pts.length > 1 ? w / (pts.length - 1) : 0;

    return pts.map((pt, i) => {
      const px = x + i * step;
      const py = y + h - (pt.value / max) * h;
      const py2 = pt.value2 !== undefined ? y + h - (pt.value2 / max) * h : undefined;
      return { ...pt, px, py, py2 };
    });
  });

  readonly pathD = computed(() => {
    const coords = this.coords();
    if (coords.length === 0) return '';
    const v = this.variant();

    if (v === 'cyber') {
      // Stepped path
      let d = `M ${coords[0].px} ${coords[0].py}`;
      for (let i = 1; i < coords.length; i++) {
        const midX = (coords[i - 1].px + coords[i].px) / 2;
        d += ` H ${midX} V ${coords[i].py} H ${coords[i].px}`;
      }
      return d;
    }

    // Smooth Bezier spline
    let d = `M ${coords[0].px} ${coords[0].py}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cx = (p0.px + p1.px) / 2;
      d += ` C ${cx} ${p0.py}, ${cx} ${p1.py}, ${p1.px} ${p1.py}`;
    }
    return d;
  });

  readonly path2D = computed(() => {
    const coords = this.coords();
    if (coords.length === 0) return '';
    let d = `M ${coords[0].px} ${coords[0].py2 ?? coords[0].py}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const y0 = p0.py2 ?? p0.py;
      const y1 = p1.py2 ?? p1.py;
      const cx = (p0.px + p1.px) / 2;
      d += ` C ${cx} ${y0}, ${cx} ${y1}, ${p1.px} ${y1}`;
    }
    return d;
  });

  readonly areaD = computed(() => {
    const path = this.pathD();
    if (!path) return '';
    const coords = this.coords();
    const { y, h } = this.chartArea();
    const bottomY = y + h;
    const lastX = coords[coords.length - 1]?.px ?? 0;
    const firstX = coords[0]?.px ?? 0;
    return `${path} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  });

  ngOnInit(): void {
    setTimeout(() => this.animateChart(), 50);
  }

  ngOnDestroy(): void {
    this.tweenTimeline?.kill();
  }

  animateChart(): void {
    this.tweenTimeline?.kill();
    const path = this.pathRef()?.nativeElement;
    const path2 = this.path2Ref()?.nativeElement;
    const area = this.areaRef()?.nativeElement;
    const svg = this.chartSvg()?.nativeElement;

    if (!path) return;

    const length = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    this.tweenTimeline = gsap.timeline();

    this.tweenTimeline.to(path, {
      strokeDashoffset: 0,
      duration: 1.4,
      ease: 'power3.out',
    });

    if (path2) {
      const len2 = path2.getTotalLength();
      gsap.set(path2, { strokeDasharray: len2, strokeDashoffset: len2 });
      this.tweenTimeline.to(
        path2,
        {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: 'power3.out',
        },
        '-=1.2',
      );
    }

    if (area) {
      gsap.set(area, { opacity: 0 });
      this.tweenTimeline.to(
        area,
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.8',
      );
    }

    if (svg) {
      const dots = svg.querySelectorAll('.chart-dot');
      gsap.fromTo(
        dots,
        { scale: 0, transformOrigin: 'center' },
        { scale: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(2)' },
      );
    }
  }

  randomizeData(): void {
    const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'];
    const newPts = labels.map((l) => ({
      label: l,
      value: Math.floor(30 + Math.random() * 140),
      value2: Math.floor(20 + Math.random() * 120),
    }));
    this.points.set(newPts);
    setTimeout(() => this.animateChart(), 20);
  }

  selectPoint(pt: DataPoint, x: number, y: number): void {
    this.activePoint.set({ point: pt, x, y });
  }

  clearPoint(): void {
    this.activePoint.set(null);
  }
}
