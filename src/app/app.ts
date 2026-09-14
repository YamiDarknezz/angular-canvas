import { Component } from '@angular/core';
import { ShowcaseComponent } from './components/showcase/showcase.component';

@Component({
  selector: 'app-root',
  imports: [ShowcaseComponent],
  template: '<app-showcase />',
})
export class App {}
