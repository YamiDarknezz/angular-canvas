import { Type } from '@angular/core';

// Cards
import { GlassmorphismComponent } from '../../components/cards/glassmorphism/glassmorphism.component';
import { NeonCardComponent } from '../../components/cards/neon/neon.component';
import { HoverEffectsComponent } from '../../components/cards/hover-effects/hover-effects.component';
import { FlipCardComponent } from '../../components/cards/flip/flip.component';
import { Tilt3dCardComponent } from '../../components/cards/tilt-3d/tilt-3d.component';
import { GlassPanelComponent } from '../../components/cards/glass-panel/glass-panel.component';
import { MinimalCardComponent } from '../../components/cards/minimal/minimal.component';
import { DarkCorporateComponent } from '../../components/cards/dark-corporate/dark-corporate.component';

// Buttons
import { GlowButtonComponent } from '../../components/buttons/glow/glow.component';
import { GradientButtonComponent } from '../../components/buttons/gradient/gradient.component';
import { NeumorphismButtonComponent } from '../../components/buttons/neumorphism/neumorphism.component';
import { PillButtonComponent } from '../../components/buttons/pill/pill.component';
import { AnimatedButtonComponent } from '../../components/buttons/animated/animated.component';
import { Button3dComponent } from '../../components/buttons/3d/3d.component';
import { ButtonGlassComponent } from '../../components/buttons/glass/glass.component';

// Backgrounds
import { BgGradientComponent } from '../../components/backgrounds/gradient/gradient.component';
import { BgParticleComponent } from '../../components/backgrounds/particle/particle.component';
import { BgGridComponent } from '../../components/backgrounds/grid/grid.component';
import { BgAnimatedMeshComponent } from '../../components/backgrounds/animated-mesh/animated-mesh.component';
import { BgAuroraComponent } from '../../components/backgrounds/aurora/aurora.component';

// Typography
import { GlowTextComponent } from '../../components/typography/glow-text/glow-text.component';
import { GradientTextComponent } from '../../components/typography/gradient-text/gradient-text.component';
import { TypewriterComponent } from '../../components/typography/typewriter/typewriter.component';
import { Text3dComponent } from '../../components/typography/3d-text/3d-text.component';

// Navigation
import { SidebarNavComponent } from '../../components/navigation/sidebar/sidebar.component';
import { TopbarNavComponent } from '../../components/navigation/topbar/topbar.component';
import { DockNavComponent } from '../../components/navigation/dock/dock.component';
import { GlassTabsComponent } from '../../components/navigation/glass-tabs/glass-tabs.component';
import { BreadcrumbsComponent } from '../../components/navigation/breadcrumbs/breadcrumbs.component';
import { PaginationComponent } from '../../components/navigation/pagination/pagination.component';
import { StepperComponent } from '../../components/navigation/stepper/stepper.component';

// Forms
import { GlassInputComponent } from '../../components/forms/glass-input/glass-input.component';
import { ToggleComponent } from '../../components/forms/toggle/toggle.component';
import { CheckboxComponent } from '../../components/forms/checkbox/checkbox.component';
import { SegmentedComponent } from '../../components/forms/segmented/segmented.component';
import { OtpComponent } from '../../components/forms/otp/otp.component';
import { RatingComponent } from '../../components/forms/rating/rating.component';
import { RangeComponent } from '../../components/forms/range/range.component';

// Modals
import { GlassModalComponent } from '../../components/modals/glass-modal/glass-modal.component';
import { SlideInModalComponent } from '../../components/modals/slide-in/slide-in.component';
import { CommandPaletteComponent } from '../../components/modals/command-palette/command-palette.component';
import { ConfirmModalComponent } from '../../components/modals/confirm/confirm.component';
import { BottomSheetComponent } from '../../components/modals/bottom-sheet/bottom-sheet.component';
import { LightboxComponent } from '../../components/modals/lightbox/lightbox.component';

// Animations
import { SkeletonComponent } from '../../components/animations/skeleton/skeleton.component';
import { SpinnerComponent } from '../../components/animations/spinner/spinner.component';
import { PageFlipComponent } from '../../components/animations/page-flip/page-flip.component';

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
 * `@switch` gigante ni instanciar los 52 componentes a la vez — solo se crea el
 * que se está viendo, que es justo lo que aísla los entornos entre sí.
 */
const ENTRY_COMPONENTS: ReadonlyMap<string, Type<unknown>> = new Map<string, Type<unknown>>([
  // Cards
  ['cards/glassmorphism', GlassmorphismComponent],
  ['cards/neon', NeonCardComponent],
  ['cards/hover-effects', HoverEffectsComponent],
  ['cards/flip', FlipCardComponent],
  ['cards/tilt-3d', Tilt3dCardComponent],
  ['cards/glass-panel', GlassPanelComponent],
  ['cards/minimal', MinimalCardComponent],
  ['cards/dark-corporate', DarkCorporateComponent],
  // Buttons
  ['buttons/glow', GlowButtonComponent],
  ['buttons/gradient', GradientButtonComponent],
  ['buttons/neumorphism', NeumorphismButtonComponent],
  ['buttons/pill', PillButtonComponent],
  ['buttons/animated', AnimatedButtonComponent],
  ['buttons/3d', Button3dComponent],
  ['buttons/glass', ButtonGlassComponent],
  // Backgrounds
  ['backgrounds/gradient', BgGradientComponent],
  ['backgrounds/particle', BgParticleComponent],
  ['backgrounds/grid', BgGridComponent],
  ['backgrounds/animated-mesh', BgAnimatedMeshComponent],
  ['backgrounds/aurora', BgAuroraComponent],
  // Typography
  ['typography/glow-text', GlowTextComponent],
  ['typography/gradient-text', GradientTextComponent],
  ['typography/typewriter', TypewriterComponent],
  ['typography/3d-text', Text3dComponent],
  // Navigation
  ['navigation/sidebar', SidebarNavComponent],
  ['navigation/topbar', TopbarNavComponent],
  ['navigation/dock', DockNavComponent],
  ['navigation/glass-tabs', GlassTabsComponent],
  ['navigation/breadcrumbs', BreadcrumbsComponent],
  ['navigation/pagination', PaginationComponent],
  ['navigation/stepper', StepperComponent],
  // Forms
  ['forms/glass-input', GlassInputComponent],
  ['forms/toggle', ToggleComponent],
  ['forms/checkbox', CheckboxComponent],
  ['forms/segmented', SegmentedComponent],
  ['forms/otp', OtpComponent],
  ['forms/rating', RatingComponent],
  ['forms/range', RangeComponent],
  // Modals
  ['modals/glass-modal', GlassModalComponent],
  ['modals/slide-in', SlideInModalComponent],
  ['modals/command-palette', CommandPaletteComponent],
  ['modals/confirm', ConfirmModalComponent],
  ['modals/bottom-sheet', BottomSheetComponent],
  ['modals/lightbox', LightboxComponent],
  // Animations
  ['animations/skeleton', SkeletonComponent],
  ['animations/spinner', SpinnerComponent],
  ['animations/page-flip', PageFlipComponent],
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
