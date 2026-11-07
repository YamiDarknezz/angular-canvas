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

export interface BarItem {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly color: string;
  readonly icon?: string;
}

@Component({
  selector: 'app-chart-bar',
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
})
export class BarChartComponent implements OnInit, OnDestroy {
  readonly variant = input<string>('columns');

  readonly containerRef = viewChild<ElementRef<HTMLElement>>('chartBox');

  readonly items = signal<BarItem[]>([
    { id: '1', label: 'Lunes', value: 72, color: '#06b6d4' },
    { id: '2', label: 'Martes', value: 95, color: '#3b82f6' },
    { id: '3', label: 'Miércoles', value: 120, color: '#6366f1' },
    { id: '4', label: 'Jueves', value: 84, color: '#8b5cf6' },
    { id: '5', label: 'Viernes', value: 145, color: '#d946ef' },
    { id: '6', label: 'Sábado', value: 160, color: '#f43f5e' },
    { id: '7', label: 'Domingo', value: 110, color: '#10b981' },
  ]);

  readonly maxValue = computed(() => {
    const vals = this.items().map((i) => i.value);
    return Math.max(...vals, 100);
  });

  private tweenTimeline?: gsap.core.Timeline;

  ngOnInit(): void {
    setTimeout(() => this.animateBars(), 50);
  }

  ngOnDestroy(): void {
    this.tweenTimeline?.kill();
  }

  animateBars(): void {
    this.tweenTimeline?.kill();
    const box = this.containerRef()?.nativeElement;
    if (!box) return;

    const bars = box.querySelectorAll('.bar-fill');
    const counters = box.querySelectorAll('.bar-val-text');

    this.tweenTimeline = gsap.timeline();

    const isHorizontal = this.variant() === 'horizontal';

    if (isHorizontal) {
      gsap.fromTo(
        bars,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
        },
      );
    } else {
      gsap.fromTo(
        bars,
        { scaleY: 0, transformOrigin: 'bottom center' },
        {
          scaleY: 1,
          duration: 1.2,
          stagger: 0.08,
          ease: 'elastic.out(1, 0.75)',
        },
      );
    }

    // Number counters
    counters.forEach((el, idx) => {
      const targetVal = this.items()[idx]?.value ?? 0;
      const proxy = { val: 0 };
      gsap.to(proxy, {
        val: targetVal,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.round(proxy.val).toString();
        },
      });
    });
  }

  randomizeData(): void {
    const days = [
      { label: 'Lunes', color: '#06b6d4' },
      { label: 'Martes', color: '#3b82f6' },
      { label: 'Miércoles', color: '#6366f1' },
      { label: 'Jueves', color: '#8b5cf6' },
      { label: 'Viernes', color: '#d946ef' },
      { label: 'Sábado', color: '#f43f5e' },
      { label: 'Domingo', color: '#10b981' },
    ];
    const newItems = days.map((d, i) => ({
      id: String(i + 1),
      label: d.label,
      value: Math.floor(40 + Math.random() * 130),
      color: d.color,
    }));
    this.items.set(newItems);
    setTimeout(() => this.animateBars(), 20);
  }
}
