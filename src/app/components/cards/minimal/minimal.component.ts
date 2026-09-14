import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-minimal-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './minimal.component.html',
  styleUrl: './minimal.component.scss'
})
export class MinimalCardComponent {}
