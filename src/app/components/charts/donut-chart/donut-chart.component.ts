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

export interface DonutSegment {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly color: string;
  pct?: number;
  dashOffset?: number;
  dashLength?: number;
}

@Component({
  selector: 'app-chart-donut',
  imports: [DecimalPipe],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.scss',
})
export class DonutChartComponent implements OnInit, OnDestroy {
  readonly variant = input<string>('ring');

  readonly chartBox = viewChild<ElementRef<HTMLElement>>('chartBox');
  readonly mainRing = viewChild<ElementRef<SVGCircleElement>>('mainRing');
  readonly gaugeArc = viewChild<ElementRef<SVGPathElement>>('gaugeArc');
  readonly counterEl = viewChild<ElementRef<HTMLElement>>('counterText');

  // Valor para el modo 'ring' y 'gauge' (0 a 100)
  readonly mainPercent = signal<number>(78);

  // Segmentos para el modo multi-segmento
  readonly segments = signal<DonutSegment[]>([
    { id: '1', label: 'Desarrollo', value: 45, color: '#06b6d4' },
    { id: '2', label: 'Diseño UX', value: 25, color: '#8b5cf6' },
    { id: '3', label: 'Pruebas QA', value: 18, color: '#ec4899' },
    { id: '4', label: 'DevOps & Infra', value: 12, color: '#10b981' },
  ]);

  // Radio y circunferencia para el anillo SVG
  readonly radius = 75;
  readonly circumference = 2 * Math.PI * 75; // ~471.24

  // Circunferencia del semicírculo para el velocímetro
  readonly gaugeRadius = 85;
  readonly gaugeArcLength = Math.PI * 85; // ~267.03

  // Cálculo de offsets para el modo segmentado
  readonly computedSegments = computed(() => {
    const list = this.segments();
    const total = list.reduce((sum, s) => sum + s.value, 0) || 1;
    const circ = this.circumference;
    let accumulated = 0;

    return list.map((s) => {
      const pct = (s.value / total) * 100;
      const length = (pct / 100) * circ;
      const offset = circ - accumulated;
      accumulated += length;
      return {
        ...s,
        pct,
        dashLength: Math.max(length - 4, 1), // gap sutil de 4px
        dashOffset: offset,
      };
    });
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
    this.timeline = gsap.timeline();

    const ring = this.mainRing()?.nativeElement;
    const gauge = this.gaugeArc()?.nativeElement;
    const counter = this.counterEl()?.nativeElement;
    const box = this.chartBox()?.nativeElement;

    // Animación de contador numérico
    if (counter) {
      const targetVal = this.mainPercent();
      const proxy = { val: 0 };
      gsap.to(proxy, {
        val: targetVal,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => {
          counter.textContent = Math.round(proxy.val).toString();
        },
      });
    }

    if (this.variant() === 'gauge') {
      if (gauge) {
        const len = this.gaugeArcLength;
        const targetOffset = len * (1 - this.mainPercent() / 100);
        gsap.fromTo(
          gauge,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: targetOffset, duration: 1.3, ease: 'elastic.out(1, 0.7)' },
        );
      }
    } else if (this.variant() === 'segmented') {
      if (box) {
        const segCircles = box.querySelectorAll<SVGCircleElement>('.seg-circle');
        gsap.fromTo(
          segCircles,
          { strokeDashoffset: this.circumference },
          {
            strokeDashoffset: (i, el) => el.getAttribute('data-target-offset') || '0',
            duration: 1.1,
            stagger: 0.1,
            ease: 'power3.out',
          },
        );
      }
    } else {
      // Modo Anillo Neón
      if (ring) {
        const targetOffset = this.circumference * (1 - this.mainPercent() / 100);
        gsap.fromTo(
          ring,
          { strokeDashoffset: this.circumference },
          { strokeDashoffset: targetOffset, duration: 1.3, ease: 'power3.out' },
        );
      }
    }
  }

  randomize(): void {
    if (this.variant() === 'segmented') {
      const colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
      const labels = ['Desarrollo', 'Diseño UX', 'Pruebas QA', 'DevOps & Infra'];
      const newSegs = labels.map((l, i) => ({
        id: String(i + 1),
        label: l,
        value: Math.floor(15 + Math.random() * 45),
        color: colors[i % colors.length],
      }));
      this.segments.set(newSegs);
    } else {
      this.mainPercent.set(Math.floor(40 + Math.random() * 55));
    }
    setTimeout(() => this.animate(), 30);
  }
}
