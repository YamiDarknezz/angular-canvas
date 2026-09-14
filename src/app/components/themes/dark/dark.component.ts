import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-dark',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dark.component.html',
  styleUrl: './dark.component.scss'
})
export class ThemeDarkComponent {}
