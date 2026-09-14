import { Component } from '@angular/core';
import { ShowcaseComponent } from './components/showcase/showcase.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShowcaseComponent],
  template: '<app-showcase></app-showcase>',
  styles: []
})
export class App {}
