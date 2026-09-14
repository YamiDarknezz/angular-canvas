import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-typewriter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './typewriter.component.html',
  styleUrl: './typewriter.component.scss'
})
export class TypewriterComponent implements OnInit, OnDestroy {
  texts = ['Hola Mundo', 'Angular Canvas', 'Diseño Infinity', 'Creative Code'];
  currentText = '';
  textIndex = 0;
  charIndex = 0;
  isDeleting = false;
  private intervalId: any;

  ngOnInit() {
    this.type();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  type() {
    const fullText = this.texts[this.textIndex];

    if (this.isDeleting) {
      this.currentText = fullText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.currentText = fullText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let speed = this.isDeleting ? 50 : 100;

    if (!this.isDeleting && this.charIndex === fullText.length) {
      speed = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      speed = 300;
    }

    this.intervalId = setTimeout(() => this.type(), speed);
  }
}
