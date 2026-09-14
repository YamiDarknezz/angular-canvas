import { Type } from '@angular/core';

// Cards
import { GlassmorphismComponent } from '../../components/cards/glassmorphism/glassmorphism.component';
import { NeonCardComponent } from '../../components/cards/neon/neon.component';
import { HoverEffectsComponent } from '../../components/cards/hover-effects/hover-effects.component';
import { FlipCardComponent } from '../../components/cards/flip/flip.component';
import { MinimalCardComponent } from '../../components/cards/minimal/minimal.component';
import { DarkCorporateComponent } from '../../components/cards/dark-corporate/dark-corporate.component';

// Buttons
import { GlowButtonComponent } from '../../components/buttons/glow/glow.component';
import { GradientButtonComponent } from '../../components/buttons/gradient/gradient.component';
import { NeumorphismButtonComponent } from '../../components/buttons/neumorphism/neumorphism.component';
import { PillButtonComponent } from '../../components/buttons/pill/pill.component';
import { AnimatedButtonComponent } from '../../components/buttons/animated/animated.component';

// Backgrounds
import { BgGradientComponent } from '../../components/backgrounds/gradient/gradient.component';
import { BgParticleComponent } from '../../components/backgrounds/particle/particle.component';
import { BgGridComponent } from '../../components/backgrounds/grid/grid.component';
import { BgAnimatedMeshComponent } from '../../components/backgrounds/animated-mesh/animated-mesh.component';

// Typography
import { GlowTextComponent } from '../../components/typography/glow-text/glow-text.component';
import { GradientTextComponent } from '../../components/typography/gradient-text/gradient-text.component';
import { TypewriterComponent } from '../../components/typography/typewriter/typewriter.component';

// Navigation
import { SidebarNavComponent } from '../../components/navigation/sidebar/sidebar.component';
import { TopbarNavComponent } from '../../components/navigation/topbar/topbar.component';

// Forms
import { GlassInputComponent } from '../../components/forms/glass-input/glass-input.component';
import { ToggleComponent } from '../../components/forms/toggle/toggle.component';
import { CheckboxComponent } from '../../components/forms/checkbox/checkbox.component';

// Modals
import { GlassModalComponent } from '../../components/modals/glass-modal/glass-modal.component';
import { SlideInModalComponent } from '../../components/modals/slide-in/slide-in.component';

// Themes
import { ThemeDarkComponent } from '../../components/themes/dark/dark.component';
import { ThemeLightComponent } from '../../components/themes/light/light.component';
import { ThemeHackerComponent } from '../../components/themes/hacker/hacker.component';
import { ThemeCyberpunkComponent } from '../../components/themes/cyberpunk/cyberpunk.component';
import { ThemeCorporateComponent } from '../../components/themes/corporate/corporate.component';

/**
 * Mapa `grupo/componente` → clase standalone.
 *
 * Es el único punto donde el catálogo (datos) toca código: la vista de entorno
 * busca aquí el componente que debe montar. Con esto la galería no necesita un
 * `@switch` gigante ni instanciar los 30 componentes a la vez — solo se crea el
 * que se está viendo, que es justo lo que aísla los entornos entre sí.
 */
const ENTRY_COMPONENTS: ReadonlyMap<string, Type<unknown>> = new Map<string, Type<unknown>>([
  // Cards
  ['cards/glassmorphism', GlassmorphismComponent],
  ['cards/neon', NeonCardComponent],
  ['cards/hover-effects', HoverEffectsComponent],
  ['cards/flip', FlipCardComponent],
  ['cards/minimal', MinimalCardComponent],
  ['cards/dark-corporate', DarkCorporateComponent],
  // Buttons
  ['buttons/glow', GlowButtonComponent],
  ['buttons/gradient', GradientButtonComponent],
  ['buttons/neumorphism', NeumorphismButtonComponent],
  ['buttons/pill', PillButtonComponent],
  ['buttons/animated', AnimatedButtonComponent],
  // Backgrounds
  ['backgrounds/gradient', BgGradientComponent],
  ['backgrounds/particle', BgParticleComponent],
  ['backgrounds/grid', BgGridComponent],
  ['backgrounds/animated-mesh', BgAnimatedMeshComponent],
  // Typography
  ['typography/glow-text', GlowTextComponent],
  ['typography/gradient-text', GradientTextComponent],
  ['typography/typewriter', TypewriterComponent],
  // Navigation
  ['navigation/sidebar', SidebarNavComponent],
  ['navigation/topbar', TopbarNavComponent],
  // Forms
  ['forms/glass-input', GlassInputComponent],
  ['forms/toggle', ToggleComponent],
  ['forms/checkbox', CheckboxComponent],
  // Modals
  ['modals/glass-modal', GlassModalComponent],
  ['modals/slide-in', SlideInModalComponent],
  // Themes
  ['themes/dark', ThemeDarkComponent],
  ['themes/light', ThemeLightComponent],
  ['themes/hacker', ThemeHackerComponent],
  ['themes/cyberpunk', ThemeCyberpunkComponent],
  ['themes/corporate', ThemeCorporateComponent],
]);

/** Componente que corresponde a un entorno del catálogo. */
export function componentFor(
  groupId: string | undefined,
  entryId: string | undefined,
): Type<unknown> | undefined {
  if (!groupId || !entryId) {
    return undefined;
  }
  return ENTRY_COMPONENTS.get(`${groupId}/${entryId}`);
}
