import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const PARTICLE_COUNT = 80;
const LINK_DISTANCE = 120;
const RGB = '99, 102, 241';

@Component({
  selector: 'app-bg-particle',
  templateUrl: './particle.component.html',
  styleUrl: './particle.component.scss',
})
export class BgParticleComponent implements AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas', { static: true })
  private readonly canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx?: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private resizeObserver?: ResizeObserver;
  private rafId = 0;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    this.ctx = ctx;

    this.resize(canvas);
    this.seed(canvas);

    // ResizeObserver en lugar de window.resize: se limpia con el componente.
    this.resizeObserver = new ResizeObserver(() => {
      this.resize(canvas);
      this.seed(canvas);
    });
    this.resizeObserver.observe(canvas);

    this.rafId = requestAnimationFrame(this.frame);
  }

  ngOnDestroy(): void {
    // Sin esto el loop seguía animando un canvas ya desmontado.
    cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
  }

  private readonly frame = (): void => {
    this.draw();
    this.rafId = requestAnimationFrame(this.frame);
  };

  private resize(canvas: HTMLCanvasElement): void {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  private seed(canvas: HTMLCanvasElement): void {
    this.particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1,
    }));
  }

  private draw(): void {
    const ctx = this.ctx;
    const canvas = this.canvasRef.nativeElement;
    if (!ctx || !canvas.width || !canvas.height) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${RGB}, 0.6)`;
      ctx.fill();

      for (let j = i + 1; j < this.particles.length; j++) {
        const other = this.particles[j];
        const dist = Math.hypot(p.x - other.x, p.y - other.y);

        if (dist < LINK_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(${RGB}, ${0.2 * (1 - dist / LINK_DISTANCE)})`;
          ctx.stroke();
        }
      }
    });
  }
}
