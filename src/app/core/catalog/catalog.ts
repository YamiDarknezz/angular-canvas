/**
 * Catálogo de la galería.
 *
 * Fuente única de verdad: la navegación lateral, el conteo del hero y las
 * secciones renderizadas se derivan de esta lista. Al añadir un componente,
 * solo hay que registrarlo aquí.
 */
export interface CatalogGroup {
  /** Id usado como ancla (#cards) y en `track`. */
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  /** Nombres de los componentes de diseño que contiene el grupo. */
  readonly components: readonly string[];
}

export const CATALOG: readonly CatalogGroup[] = [
  {
    id: 'cards',
    label: 'Cards',
    icon: '🃏',
    components: ['Glassmorphism', 'Neon', 'Hover Effects', 'Flip 3D', 'Minimal', 'Dark Corporate'],
  },
  {
    id: 'buttons',
    label: 'Buttons',
    icon: '🔘',
    components: ['Glow', 'Gradient', 'Neumorphism', 'Pill', 'Animated'],
  },
  {
    id: 'backgrounds',
    label: 'Backgrounds',
    icon: '🌌',
    components: ['Gradient', 'Particle Canvas', 'Grid Patterns', 'Animated Mesh'],
  },
  {
    id: 'typography',
    label: 'Typography',
    icon: '🔤',
    components: ['Glow Text', 'Gradient Text', 'Typewriter'],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    icon: '🧭',
    components: ['Sidebar', 'Topbar'],
  },
  {
    id: 'forms',
    label: 'Forms',
    icon: '📝',
    components: ['Glass Input', 'Toggle Switch', 'Checkbox'],
  },
  {
    id: 'modals',
    label: 'Modals',
    icon: '🪟',
    components: ['Glass Modal', 'Slide-in Panel'],
  },
  {
    id: 'themes',
    label: 'Themes',
    icon: '🎨',
    components: ['Dark', 'Light', 'Hacker', 'Cyberpunk', 'Corporate'],
  },
] as const;

/** Total de componentes de diseño del catálogo. */
export const TOTAL_COMPONENTS = CATALOG.reduce(
  (total, group) => total + group.components.length,
  0,
);
