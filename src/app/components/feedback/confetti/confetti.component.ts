import { Component, ElementRef, OnDestroy, OnInit, input, viewChild } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  alpha: number;
  life: number;
}

@Component({
  selector: 'app-confetti-burst',
  templateUrl: './confetti.component.html',
  styleUrl: './confetti.component.scss',
})
export class ConfettiComponent implements OnInit, OnDestroy {
  readonly variant = input<string>('explosion');

  readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('confettiCanvas');

  private ctx?: CanvasRenderingContext2D | null;
  private animId?: number;
  private particles: Particle[] = [];

  readonly colors = ['#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#3b82f6', '#e11d48'];

  ngOnInit(): void {
    setTimeout(() => {
      this.initCanvas();
      this.trigger();
    }, 50);
  }

  ngOnDestroy(): void {
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  private initCanvas(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;
    this.ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement?.clientWidth || 700;
    canvas.height = 320;
    this.loop();
  }

  trigger(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    if (this.variant() === 'cannons') {
      // Doble cañón desde abajo a la izquierda y derecha
      for (let i = 0; i < 70; i++) {
        this.createParticle(0, h, Math.random() * 8 + 4, -(Math.random() * 12 + 6));
        this.createParticle(w, h, -(Math.random() * 8 + 4), -(Math.random() * 12 + 6));
      }
    } else if (this.variant() === 'fireworks') {
      // Cohetes que estallan arriba
      for (let burst = 0; burst < 3; burst++) {
        const bx = w * 0.25 + Math.random() * (w * 0.5);
        const by = h * 0.2 + Math.random() * (h * 0.3);
        for (let i = 0; i < 45; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 7 + 2;
          this.createParticle(bx, by, Math.cos(angle) * speed, Math.sin(angle) * speed);
        }
      }
    } else {
      // Explosión radial central
      const cx = w / 2;
      const cy = h / 2;
      for (let i = 0; i < 110; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 10 + 2;
        this.createParticle(cx, cy, Math.cos(angle) * speed, Math.sin(angle) * speed);
      }
    }
  }

  private createParticle(x: number, y: number, vx: number, vy: number): void {
    this.particles.push({
      x,
      y,
      vx,
      vy,
      size: Math.random() * 7 + 4,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      alpha: 1,
      life: 1,
    });
  }

  private loop = (): void => {
    if (!this.ctx) return;
    const canvas = this.ctx.canvas;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // Gravedad
      p.vx *= 0.98; // Fricción
      p.rotation += p.vRot;
      p.life -= 0.012;
      p.alpha = Math.max(p.life, 0);

      if (p.alpha <= 0 || p.y > canvas.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.ctx.restore();
    }

    this.animId = requestAnimationFrame(this.loop);
  };
}
