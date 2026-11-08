import { Component, ElementRef, input, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-media-tilt-card',
  templateUrl: './tilt-card.component.html',
  styleUrl: './tilt-card.component.scss',
})
export class TiltCardComponent {
  readonly variant = input<string>('gyro');

  readonly cardRef = viewChild<ElementRef<HTMLElement>>('cardEl');

  readonly rotateX = signal<number>(0);
  readonly rotateY = signal<number>(0);
  readonly shineX = signal<number>(50);
  readonly shineY = signal<number>(50);
  readonly isHovered = signal<boolean>(false);

  onPointerMove(e: MouseEvent): void {
    const card = this.cardRef()?.nativeElement;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Ángulos de rotación (-15 a 15 grados)
    const rotX = -((y - centerY) / centerY) * 16;
    const rotY = ((x - centerX) / centerX) * 16;

    // Coordenadas de brillo reflejo en porcentaje (0% a 100%)
    const sX = (x / rect.width) * 100;
    const sY = (y / rect.height) * 100;

    this.rotateX.set(rotX);
    this.rotateY.set(rotY);
    this.shineX.set(sX);
    this.shineY.set(sY);
    this.isHovered.set(true);
  }

  onPointerLeave(): void {
    this.rotateX.set(0);
    this.rotateY.set(0);
    this.shineX.set(50);
    this.shineY.set(50);
    this.isHovered.set(false);
  }
}
