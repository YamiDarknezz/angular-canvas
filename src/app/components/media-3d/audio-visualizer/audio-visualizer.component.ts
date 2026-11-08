import { Component, ElementRef, OnDestroy, OnInit, input, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-media-audio-visualizer',
  templateUrl: './audio-visualizer.component.html',
  styleUrl: './audio-visualizer.component.scss',
})
export class AudioVisualizerComponent implements OnInit, OnDestroy {
  readonly variant = input<string>('bars');

  readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('visCanvas');
  readonly isPlaying = signal<boolean>(true);

  private ctx?: CanvasRenderingContext2D | null;
  private animId?: number;
  private phase = 0;

  // 32 bandas de frecuencia
  private readonly barCount = 32;
  private readonly barHeights = new Float32Array(32);

  ngOnInit(): void {
    setTimeout(() => {
      this.initCanvas();
    }, 50);
  }

  ngOnDestroy(): void {
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  togglePlay(): void {
    this.isPlaying.update((p) => !p);
  }

  private initCanvas(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;
    this.ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement?.clientWidth || 700;
    canvas.height = 260;
    this.loop();
  }

  private loop = (): void => {
    if (!this.ctx) return;
    const canvas = this.ctx.canvas;
    const w = canvas.width;
    const h = canvas.height;

    this.ctx.clearRect(0, 0, w, h);

    if (this.isPlaying()) {
      this.phase += 0.05;
      // Actualizar frecuencias simuladas
      for (let i = 0; i < this.barCount; i++) {
        const target =
          Math.sin(this.phase + i * 0.3) * 0.4 +
          Math.cos(this.phase * 1.5 + i * 0.2) * 0.3 +
          0.3 +
          Math.random() * 0.15;
        this.barHeights[i] += (target - this.barHeights[i]) * 0.2;
      }
    }

    if (this.variant() === 'radial') {
      this.renderRadial(w, h);
    } else if (this.variant() === 'wave') {
      this.renderWave(w, h);
    } else {
      this.renderBars(w, h);
    }

    this.animId = requestAnimationFrame(this.loop);
  };

  private renderBars(w: number, h: number): void {
    if (!this.ctx) return;
    const barWidth = (w / this.barCount) * 0.65;
    const gap = (w / this.barCount) * 0.35;
    const maxBarH = h * 0.7;

    for (let i = 0; i < this.barCount; i++) {
      const x = i * (barWidth + gap) + gap / 2;
      const barH = this.barHeights[i] * maxBarH;
      const y = h * 0.75 - barH;

      // Barra superior
      const grad = this.ctx.createLinearGradient(0, y, 0, h * 0.75);
      grad.addColorStop(0, '#06b6d4');
      grad.addColorStop(0.6, '#3b82f6');
      grad.addColorStop(1, '#8b5cf6');

      this.ctx.fillStyle = grad;
      this.ctx.fillRect(x, y, barWidth, barH);

      // Reflejo suelo (con opacidad atenuada)
      this.ctx.fillStyle = 'rgba(6, 182, 212, 0.18)';
      this.ctx.fillRect(x, h * 0.77, barWidth, barH * 0.35);
    }
  }

  private renderRadial(w: number, h: number): void {
    if (!this.ctx) return;
    const cx = w / 2;
    const cy = h / 2;

    for (let ring = 1; ring <= 4; ring++) {
      const radius = 30 * ring + Math.sin(this.phase * 2 + ring) * 12;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(6, 182, 212, ${0.8 - ring * 0.18})`;
      this.ctx.lineWidth = 2.5;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = '#06b6d4';
      this.ctx.stroke();
    }
  }

  private renderWave(w: number, h: number): void {
    if (!this.ctx) return;
    const cy = h / 2;

    this.ctx.beginPath();
    this.ctx.moveTo(0, cy);

    for (let x = 0; x < w; x += 10) {
      const y =
        cy +
        Math.sin(x * 0.02 + this.phase * 2) * 35 * Math.sin(this.phase) +
        Math.cos(x * 0.04 + this.phase) * 18;
      this.ctx.lineTo(x, y);
    }

    this.ctx.strokeStyle = '#06b6d4';
    this.ctx.lineWidth = 3.5;
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = '#06b6d4';
    this.ctx.stroke();
  }
}
