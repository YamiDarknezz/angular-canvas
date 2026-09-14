import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Cards
import { GlassmorphismComponent } from '../cards/glassmorphism/glassmorphism.component';
import { NeonCardComponent } from '../cards/neon/neon.component';
import { HoverEffectsComponent } from '../cards/hover-effects/hover-effects.component';
import { FlipCardComponent } from '../cards/flip/flip.component';
import { MinimalCardComponent } from '../cards/minimal/minimal.component';
import { DarkCorporateComponent } from '../cards/dark-corporate/dark-corporate.component';

// Buttons
import { GlowButtonComponent } from '../buttons/glow/glow.component';
import { GradientButtonComponent } from '../buttons/gradient/gradient.component';
import { NeumorphismButtonComponent } from '../buttons/neumorphism/neumorphism.component';
import { PillButtonComponent } from '../buttons/pill/pill.component';
import { AnimatedButtonComponent } from '../buttons/animated/animated.component';

// Backgrounds
import { BgGradientComponent } from '../backgrounds/gradient/gradient.component';
import { BgParticleComponent } from '../backgrounds/particle/particle.component';
import { BgGridComponent } from '../backgrounds/grid/grid.component';
import { BgAnimatedMeshComponent } from '../backgrounds/animated-mesh/animated-mesh.component';

// Typography
import { GlowTextComponent } from '../typography/glow-text/glow-text.component';
import { GradientTextComponent } from '../typography/gradient-text/gradient-text.component';
import { TypewriterComponent } from '../typography/typewriter/typewriter.component';

// Navigation
import { SidebarNavComponent } from '../navigation/sidebar/sidebar.component';
import { TopbarNavComponent } from '../navigation/topbar/topbar.component';

// Forms
import { GlassInputComponent } from '../forms/glass-input/glass-input.component';
import { ToggleComponent } from '../forms/toggle/toggle.component';
import { CheckboxComponent } from '../forms/checkbox/checkbox.component';

// Modals
import { GlassModalComponent } from '../modals/glass-modal/glass-modal.component';
import { SlideInModalComponent } from '../modals/slide-in/slide-in.component';

// Themes
import { ThemeDarkComponent } from '../themes/dark/dark.component';
import { ThemeLightComponent } from '../themes/light/light.component';
import { ThemeHackerComponent } from '../themes/hacker/hacker.component';
import { ThemeCyberpunkComponent } from '../themes/cyberpunk/cyberpunk.component';
import { ThemeCorporateComponent } from '../themes/corporate/corporate.component';

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [
    CommonModule,
    // Cards
    GlassmorphismComponent, NeonCardComponent, HoverEffectsComponent,
    FlipCardComponent, MinimalCardComponent, DarkCorporateComponent,
    // Buttons
    GlowButtonComponent, GradientButtonComponent, NeumorphismButtonComponent,
    PillButtonComponent, AnimatedButtonComponent,
    // Backgrounds
    BgGradientComponent, BgParticleComponent, BgGridComponent, BgAnimatedMeshComponent,
    // Typography
    GlowTextComponent, GradientTextComponent, TypewriterComponent,
    // Navigation
    SidebarNavComponent, TopbarNavComponent,
    // Forms
    GlassInputComponent, ToggleComponent, CheckboxComponent,
    // Modals
    GlassModalComponent, SlideInModalComponent,
    // Themes
    ThemeDarkComponent, ThemeLightComponent, ThemeHackerComponent,
    ThemeCyberpunkComponent, ThemeCorporateComponent,
  ],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss'
})
export class ShowcaseComponent {
  categories = [
    { id: 'cards', label: '🃏 Cards', icon: '🃏' },
    { id: 'buttons', label: '🔘 Buttons', icon: '🔘' },
    { id: 'backgrounds', label: '🌌 Backgrounds', icon: '🌌' },
    { id: 'typography', label: '🔤 Typography', icon: '🔤' },
    { id: 'navigation', label: '🧭 Navigation', icon: '🧭' },
    { id: 'forms', label: '📝 Forms', icon: '📝' },
    { id: 'modals', label: '🪟 Modals', icon: '🪟' },
    { id: 'themes', label: '🎨 Themes', icon: '🎨' },
  ];

  activeCategory = 'cards';

  scrollTo(id: string) {
    this.activeCategory = id;
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
