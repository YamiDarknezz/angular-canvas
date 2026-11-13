import { Component, input } from '@angular/core';

@Component({
  selector: 'app-bg-mesh',
  templateUrl: './animated-mesh.component.html',
  styleUrl: './animated-mesh.component.scss',
})
export class BgAnimatedMeshComponent {
  readonly variant = input<string>();
}
