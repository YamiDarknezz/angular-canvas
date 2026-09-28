/**
 * Catálogo de AngularCanvas — fuente única de verdad.
 *
 * Todo lo que se ve en la galería se deriva de esta lista: la navegación
 * lateral de dos niveles (grupo → componente), las tarjetas de la portada, los
 * contadores, los chips de sub-estilos y la ficha de código de cada entorno.
 *
 * Reglas del modelo:
 * - Un **grupo** es una categoría (Cards, Buttons, …) y agrupa componentes.
 * - Un **componente** es un entorno aislado: vive en su carpeta, se muestra solo
 *   en su propia vista y se puede copiar sin arrastrar nada más.
 * - Una **variante** es un sub-estilo dentro del componente (el `data-variant`
 *   de su plantilla). No ocupa un nivel en el sidebar: se elige dentro del
 *   entorno con los chips (o con las teclas 1–9).
 *
 * Al añadir un componente: crea la carpeta, regístralo en `component-registry`
 * y añade su entrada aquí. Nada más.
 */

/** Sub-estilo dentro de un componente. El `id` es el valor de `data-variant`. */
export interface CatalogVariant {
  readonly id: string;
  readonly label: string;
  /** Qué muestra esa variante, en una línea. */
  readonly hint: string;
}

/** Un componente = un entorno aislado con su propia vista. */
export interface CatalogEntry {
  /** Id de ruta y de carpeta: `/cards/glassmorphism`. */
  readonly id: string;
  readonly label: string;
  /** Resumen corto, también usado en la portada y en la ficha. */
  readonly tagline: string;
  /** Selector real del componente standalone. */
  readonly selector: string;
  /** Clase exportada, para el snippet de importación. */
  readonly className: string;
  /** Carpeta a copiar, relativa a la raíz del repo. */
  readonly sourcePath: string;
  /** `true` si la plantilla importa `FormsModule` (necesita `@angular/forms`). */
  readonly requiresForms?: boolean;
  readonly variants: readonly CatalogVariant[];
}

/** Categoría de componentes. */
export interface CatalogGroup {
  readonly id: string;
  readonly label: string;
  /** Nombre del icono del set de la galería (`ac-icon`). */
  readonly icon: string;
  /** Acento de la categoría para el andamiaje (los componentes no lo usan). */
  readonly accent: string;
  readonly tagline: string;
  readonly components: readonly CatalogEntry[];
}

export const CATALOG: readonly CatalogGroup[] = [
  {
    id: 'cards',
    label: 'Cards',
    icon: 'cards',
    accent: '#6366f1',
    tagline: 'Tarjetas con vidrio, neón, volteo 3D y estilos sobrios',
    components: [
      {
        id: 'glassmorphism',
        label: 'Glassmorphism',
        tagline: 'Vidrio esmerilado con transparencia y blur',
        selector: 'app-card-glassmorphism',
        className: 'GlassmorphismComponent',
        sourcePath: 'src/app/components/cards/glassmorphism',
        variants: [
          { id: 'default', label: 'Base', hint: 'La tarjeta de vidrio por defecto' },
          { id: 'secondary', label: 'Secondary', hint: 'Segundo nivel de jerarquía' },
          { id: 'accent', label: 'Accent', hint: 'Acento de color para destacar una tarjeta' },
        ],
      },
      {
        id: 'neon',
        label: 'Neon',
        tagline: 'Bordes luminosos con efecto de neón brillante',
        selector: 'app-card-neon',
        className: 'NeonCardComponent',
        sourcePath: 'src/app/components/cards/neon',
        variants: [
          { id: 'blue', label: 'Neón azul', hint: 'El clásico para interfaces tech y gaming' },
          { id: 'pink', label: 'Neón rosa', hint: 'Energía vibrante para dashboards' },
          { id: 'green', label: 'Neón verde', hint: 'Inspiración Matrix para herramientas dev' },
        ],
      },
      {
        id: 'hover-effects',
        label: 'Hover Effects',
        tagline: 'Diferentes respuestas al pasar el mouse',
        selector: 'app-card-hover',
        className: 'HoverEffectsComponent',
        sourcePath: 'src/app/components/cards/hover-effects',
        variants: [
          { id: 'lift', label: 'Lift', hint: 'Elevación suave con sombra creciente' },
          { id: 'scale', label: 'Scale', hint: 'Escalado con cambio de fondo' },
          { id: 'rotate', label: 'Rotate', hint: 'Rotación 3D sutil' },
          { id: 'border-draw', label: 'Border Draw', hint: 'Borde que se dibuja alrededor' },
          { id: 'glow', label: 'Glow', hint: 'Brillo expansivo con sombra de color' },
          { id: 'magnetic', label: 'Magnetic', hint: 'Sigue el cursor con efecto magnético' },
        ],
      },
      {
        id: 'flip',
        label: 'Flip 3D',
        tagline: 'Tarjetas que giran en 3D al hacer click',
        selector: 'app-card-flip',
        className: 'FlipCardComponent',
        sourcePath: 'src/app/components/cards/flip',
        variants: [
          { id: 'classic', label: 'Clásica', hint: 'Frente y reverso con el tema actual' },
          { id: 'gradient', label: 'Gradiente', hint: 'Fondos degradados en ambas caras' },
          { id: 'stats', label: 'Con métricas', hint: 'Contenido denso frente y reverso' },
        ],
      },
      {
        id: 'tilt-3d',
        label: '3D Tilt',
        tagline: 'Perspectiva, profundidad y brillo que siguen al cursor',
        selector: 'app-card-tilt3d',
        className: 'Tilt3dCardComponent',
        sourcePath: 'src/app/components/cards/tilt-3d',
        variants: [
          { id: 'tilt', label: 'Tilt + brillo', hint: 'Rota en 3D y el reflejo sigue al cursor' },
          { id: 'depth', label: 'Profundidad', hint: 'Capas a distinta altura sobre el eje Z' },
          { id: 'shine', label: 'Holo', hint: 'Tornasol con destello que se desplaza' },
        ],
      },
      {
        id: 'glass-panel',
        label: 'Glass Panels',
        tagline: 'Superficies de vidrio sobre color con blur y brillo interior',
        selector: 'app-card-glass-panel',
        className: 'GlassPanelComponent',
        sourcePath: 'src/app/components/cards/glass-panel',
        variants: [
          { id: 'stats', label: 'Métricas', hint: 'Panel de resumen con barras translúcidas' },
          { id: 'profile', label: 'Perfil', hint: 'Tarjeta de persona con acciones' },
          { id: 'overlay', label: 'Superposición', hint: 'Texto legible sobre cualquier fondo' },
        ],
      },
      {
        id: 'minimal',
        label: 'Minimal',
        tagline: 'Limpio, elegante, sin distracciones',
        selector: 'app-card-minimal',
        className: 'MinimalCardComponent',
        sourcePath: 'src/app/components/cards/minimal',
        variants: [
          { id: 'default', label: 'Con acento', hint: 'Barra de acento lateral' },
          { id: 'bordered', label: 'Solo bordes', hint: 'Sin sombras ni fondos extra' },
          { id: 'with-tag', label: 'Con etiqueta', hint: 'Tag sutil de categoría' },
        ],
      },
      {
        id: 'dark-corporate',
        label: 'Dark Corporate',
        tagline: 'Elegancia corporativa en modo oscuro',
        selector: 'app-card-corporate',
        className: 'DarkCorporateComponent',
        sourcePath: 'src/app/components/cards/dark-corporate',
        variants: [
          { id: 'default', label: 'Estándar', hint: 'Cabecera, métricas y CTA' },
          { id: 'variant', label: 'Con badge accent', hint: 'Badge de acento y otra densidad' },
        ],
      },
    ],
  },
  {
    id: 'buttons',
    label: 'Buttons',
    icon: 'buttons',
    accent: '#06b6d4',
    tagline: 'Botones con brillo, degradado, neumorfismo y animación',
    components: [
      {
        id: 'glow',
        label: 'Glow',
        tagline: 'Botones con efecto de brillo expansivo',
        selector: 'app-btn-glow',
        className: 'GlowButtonComponent',
        sourcePath: 'src/app/components/buttons/glow',
        variants: [
          { id: 'blue', label: 'Azul', hint: '.glow-blue' },
          { id: 'purple', label: 'Púrpura', hint: '.glow-purple' },
          { id: 'pink', label: 'Rosa', hint: '.glow-pink' },
          { id: 'green', label: 'Verde', hint: '.glow-green' },
          { id: 'orange', label: 'Naranja', hint: '.glow-orange' },
        ],
      },
      {
        id: 'gradient',
        label: 'Gradient',
        tagline: 'Botones con degradados animados y estáticos',
        selector: 'app-btn-gradient',
        className: 'GradientButtonComponent',
        sourcePath: 'src/app/components/buttons/gradient',
        variants: [
          { id: 'sunset', label: 'Sunset', hint: 'Naranja a magenta' },
          { id: 'ocean', label: 'Ocean', hint: 'Azules profundos' },
          { id: 'aurora', label: 'Aurora', hint: 'Verde-cyan degradado' },
          { id: 'fire', label: 'Fire', hint: 'Rojo y ámbar' },
          { id: 'mesh', label: 'Mesh animado', hint: 'Malla de color en movimiento' },
        ],
      },
      {
        id: 'neumorphism',
        label: 'Neumorphism',
        tagline: 'Relieve suave tipo neumorfismo',
        selector: 'app-btn-neumorphism',
        className: 'NeumorphismButtonComponent',
        sourcePath: 'src/app/components/buttons/neumorphism',
        variants: [
          { id: 'soft', label: 'Suave', hint: 'Relieve estándar' },
          { id: 'pressed', label: 'Presionado', hint: 'Estado hundido permanente' },
          { id: 'flat', label: 'Flat', hint: 'Superficie plana' },
          { id: 'convex', label: 'Convexo', hint: 'Relieve saliente marcado' },
        ],
      },
      {
        id: 'pill',
        label: 'Pill',
        tagline: 'Botones redondeados tipo píldora',
        selector: 'app-btn-pill',
        className: 'PillButtonComponent',
        sourcePath: 'src/app/components/buttons/pill',
        variants: [
          { id: 'outline', label: 'Outline', hint: 'Borde sin relleno' },
          { id: 'solid', label: 'Solid', hint: 'Relleno plano' },
          { id: 'ghost', label: 'Ghost', hint: 'Transparente hasta el hover' },
          { id: 'gradient', label: 'Gradient', hint: 'Degradado de acento' },
          { id: 'with-icon', label: 'Con icono', hint: 'Icono + texto' },
          { id: 'small', label: 'Pequeño', hint: 'Tamaño compacto' },
        ],
      },
      {
        id: 'animated',
        label: 'Animated',
        tagline: 'Botones con animaciones al interactuar',
        selector: 'app-btn-animated',
        className: 'AnimatedButtonComponent',
        sourcePath: 'src/app/components/buttons/animated',
        variants: [
          { id: 'ripple', label: 'Ripple', hint: 'Onda desde el punto de click' },
          { id: 'pulse', label: 'Pulse', hint: 'Latido continuo' },
          { id: 'shake', label: 'Shake', hint: 'Sacudida al hacer hover' },
          { id: 'fill-up', label: 'Fill up', hint: 'Relleno que sube' },
          { id: 'slide-bg', label: 'Slide BG', hint: 'Fondo que se desliza' },
          { id: 'magnetic', label: 'Magnetic', hint: 'Sigue el cursor' },
        ],
      },
      {
        id: '3d',
        label: '3D',
        tagline: 'Relieve que se hunde, volteo y levitación por capas',
        selector: 'app-btn-3d',
        className: 'Button3dComponent',
        sourcePath: 'src/app/components/buttons/3d',
        variants: [
          { id: 'push', label: 'Push', hint: 'Se hunde hasta apoyarse en su base' },
          { id: 'flip', label: 'Flip', hint: 'Voltea en 3D al pasar el cursor' },
          { id: 'levitate', label: 'Levitación', hint: 'Pila de capas que se separa del suelo' },
        ],
      },
      {
        id: 'glass',
        label: 'Glass',
        tagline: 'Botones translúcidos con blur y bordes luminosos',
        selector: 'app-btn-glass',
        className: 'ButtonGlassComponent',
        sourcePath: 'src/app/components/buttons/glass',
        variants: [
          { id: 'glass', label: 'Glass', hint: 'Vidrio suave con brillo interior' },
          { id: 'frost', label: 'Frost', hint: 'Escarchado con blur intenso' },
          {
            id: 'gradient-border',
            label: 'Borde degradado',
            hint: 'Contorno tornasol sobre vidrio',
          },
        ],
      },
    ],
  },
  {
    id: 'backgrounds',
    label: 'Backgrounds',
    icon: 'backgrounds',
    accent: '#a855f7',
    tagline: 'Fondos degradados, partículas, grillas y mallas animadas',
    components: [
      {
        id: 'gradient',
        label: 'Gradient',
        tagline: 'Degradados para secciones completas',
        selector: 'app-bg-gradient',
        className: 'BgGradientComponent',
        sourcePath: 'src/app/components/backgrounds/gradient',
        variants: [
          { id: 'sunset', label: 'Sunset', hint: 'Cálido, atardecer' },
          { id: 'aurora', label: 'Aurora', hint: 'Verdes y violetas' },
          { id: 'deep-ocean', label: 'Deep Ocean', hint: 'Azules profundos' },
          { id: 'mesh', label: 'Mesh', hint: 'Malla de color suave' },
          { id: 'radial', label: 'Radial Focus', hint: 'Foco radial centrado' },
          { id: 'conic', label: 'Conic', hint: 'Degradado cónico' },
        ],
      },
      {
        id: 'particle',
        label: 'Particle',
        tagline: 'Canvas de partículas conectadas en red',
        selector: 'app-bg-particle',
        className: 'BgParticleComponent',
        sourcePath: 'src/app/components/backgrounds/particle',
        variants: [
          { id: 'default', label: 'Red de partículas', hint: 'Canvas con enlaces por cercanía' },
        ],
      },
      {
        id: 'grid',
        label: 'Grid',
        tagline: 'Patrones de cuadrícula para fondos',
        selector: 'app-bg-grid',
        className: 'BgGridComponent',
        sourcePath: 'src/app/components/backgrounds/grid',
        variants: [
          { id: 'dots', label: 'Dot Grid', hint: 'Puntos regulares' },
          { id: 'lines', label: 'Line Grid', hint: 'Líneas ortogonales' },
          { id: 'gradient', label: 'Fade Grid', hint: 'Grilla que se desvanece' },
        ],
      },
      {
        id: 'animated-mesh',
        label: 'Animated Mesh',
        tagline: 'Malla animada con colores fluidos',
        selector: 'app-bg-mesh',
        className: 'BgAnimatedMeshComponent',
        sourcePath: 'src/app/components/backgrounds/animated-mesh',
        variants: [{ id: 'default', label: 'Mesh animado', hint: 'Blobs de color en movimiento' }],
      },
      {
        id: 'aurora',
        label: 'Aurora',
        tagline: 'Blobs de color, haces de luz y vidrio sobre aurora',
        selector: 'app-bg-aurora',
        className: 'BgAuroraComponent',
        sourcePath: 'src/app/components/backgrounds/aurora',
        variants: [
          { id: 'aurora', label: 'Aurora', hint: 'Blobs difusos que derivan en diagonal' },
          { id: 'beams', label: 'Haces', hint: 'Columnas de luz que barren el fondo' },
          { id: 'glass', label: 'Con vidrio', hint: 'Panel translúcido sobre la aurora' },
        ],
      },
    ],
  },
  {
    id: 'typography',
    label: 'Typography',
    icon: 'typography',
    accent: '#ec4899',
    tagline: 'Texto con neón, degradados y efecto máquina de escribir',
    components: [
      {
        id: 'glow-text',
        label: 'Glow Text',
        tagline: 'Texto con efecto de neón brillante',
        selector: 'app-text-glow',
        className: 'GlowTextComponent',
        sourcePath: 'src/app/components/typography/glow-text',
        variants: [
          { id: 'cyan', label: 'Cyan', hint: '.glow-cyan' },
          { id: 'pink', label: 'Rosa', hint: '.glow-pink' },
          { id: 'green', label: 'Verde Matrix', hint: '.glow-green' },
          { id: 'pulse', label: 'Con pulso', hint: '.glow-pulse' },
        ],
      },
      {
        id: 'gradient-text',
        label: 'Gradient Text',
        tagline: 'Degradados animados y estáticos en texto',
        selector: 'app-text-gradient',
        className: 'GradientTextComponent',
        sourcePath: 'src/app/components/typography/gradient-text',
        variants: [
          { id: 'static', label: 'Estático', hint: '.grad-static' },
          { id: 'animated', label: 'Animado', hint: '.grad-animated' },
          { id: 'rainbow', label: 'Arcoíris', hint: '.grad-rainbow' },
          { id: 'subtle', label: 'Sutil', hint: '.grad-subtle, para párrafos' },
        ],
      },
      {
        id: 'typewriter',
        label: 'Typewriter',
        tagline: 'Efecto de máquina de escribir sobre una terminal',
        selector: 'app-text-typewriter',
        className: 'TypewriterComponent',
        sourcePath: 'src/app/components/typography/typewriter',
        variants: [
          { id: 'default', label: 'Terminal', hint: 'Cursor, prompt y escribido secuencial' },
        ],
      },
      {
        id: '3d-text',
        label: '3D Text',
        tagline: 'Extrusión, perspectiva isométrica y levitación',
        selector: 'app-text-3d',
        className: 'Text3dComponent',
        sourcePath: 'src/app/components/typography/3d-text',
        variants: [
          { id: 'extrude', label: 'Extrude', hint: 'Canto sólido por capas de sombra' },
          { id: 'isometric', label: 'Isométrico', hint: 'Texto recostado con perspectiva' },
          { id: 'floating', label: 'Floating', hint: 'Flota con su sombra en movimiento' },
        ],
      },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    icon: 'navigation',
    accent: '#14b8a6',
    tagline: 'Sidebar colapsable y topbar responsiva',
    components: [
      {
        id: 'sidebar',
        label: 'Sidebar',
        tagline: 'Navegación lateral colapsable, navegable por teclado',
        selector: 'app-nav-sidebar',
        className: 'SidebarNavComponent',
        sourcePath: 'src/app/components/navigation/sidebar',
        variants: [
          { id: 'default', label: 'Colapsable', hint: 'Colapsa con ☰ y recuerda el item activo' },
        ],
      },
      {
        id: 'topbar',
        label: 'Topbar',
        tagline: 'Barra superior responsiva con menú mobile accesible',
        selector: 'app-nav-topbar',
        className: 'TopbarNavComponent',
        sourcePath: 'src/app/components/navigation/topbar',
        variants: [
          { id: 'default', label: 'Con menú mobile', hint: 'Menú ☰ accesible por teclado' },
        ],
      },
      {
        id: 'dock',
        label: 'Dock',
        tagline: 'Dock inferior flotante, de cristal o barra completa',
        selector: 'app-nav-dock',
        className: 'DockNavComponent',
        sourcePath: 'src/app/components/navigation/dock',
        variants: [
          {
            id: 'floating',
            label: 'Flotante',
            hint: 'Píldora flotante con magnificación al pasar el cursor',
          },
          { id: 'glass', label: 'Cristal', hint: 'Vidrio transparente sobre color' },
          { id: 'bar', label: 'Barra', hint: 'Barra inferior a ancho completo' },
        ],
      },
      {
        id: 'glass-tabs',
        label: 'Glass Tabs',
        tagline: 'Pestañas translúcidas con indicador deslizante',
        selector: 'app-nav-tabs',
        className: 'GlassTabsComponent',
        sourcePath: 'src/app/components/navigation/glass-tabs',
        variants: [
          { id: 'glass', label: 'Vidrio', hint: 'Barra de vidrio con pastilla que se desliza' },
          { id: 'underline', label: 'Subrayado', hint: 'Línea luminosa que sigue a la pestaña' },
        ],
      },
      {
        id: 'breadcrumbs',
        label: 'Breadcrumbs',
        tagline: 'Migas de pan con chevron, slash y vidrio',
        selector: 'app-nav-breadcrumbs',
        className: 'BreadcrumbsComponent',
        sourcePath: 'src/app/components/navigation/breadcrumbs',
        variants: [
          { id: 'chevron', label: 'Chevron', hint: 'Flechas entre niveles' },
          { id: 'slash', label: 'Slash', hint: 'Barra monoespaciada' },
          { id: 'glass', label: 'Vidrio', hint: 'Píldora translúcida sobre color' },
        ],
      },
      {
        id: 'pagination',
        label: 'Pagination',
        tagline: 'Paginación numérica, compacta y de vidrio',
        selector: 'app-nav-pagination',
        className: 'PaginationComponent',
        sourcePath: 'src/app/components/navigation/pagination',
        variants: [
          { id: 'numbers', label: 'Números', hint: 'Página activa con elipsis dinámico' },
          { id: 'compact', label: 'Compacta', hint: '"Página X de Y" con flechas' },
          { id: 'glass', label: 'Vidrio', hint: 'Píldora translucida sobre color' },
        ],
      },
      {
        id: 'stepper',
        label: 'Stepper',
        tagline: 'Pasos en horizontal, vertical y barra de progreso',
        selector: 'app-nav-stepper',
        className: 'StepperComponent',
        sourcePath: 'src/app/components/navigation/stepper',
        variants: [
          { id: 'horizontal', label: 'Horizontal', hint: 'Pasos en fila con conectores' },
          { id: 'vertical', label: 'Vertical', hint: 'Pasos apilados con línea izquierda' },
          { id: 'progress', label: 'Progreso', hint: 'Barra de progreso con puntos' },
        ],
      },
    ],
  },
  {
    id: 'forms',
    label: 'Forms',
    icon: 'forms',
    accent: '#f59e0b',
    tagline: 'Inputs de vidrio, toggles y checkboxes accesibles',
    components: [
      {
        id: 'glass-input',
        label: 'Glass Input',
        tagline: 'Inputs con estilo glassmorphism',
        selector: 'app-form-glass-input',
        className: 'GlassInputComponent',
        sourcePath: 'src/app/components/forms/glass-input',
        requiresForms: true,
        variants: [
          { id: 'default', label: 'Formulario', hint: 'Input, email y textarea con highlight' },
        ],
      },
      {
        id: 'toggle',
        label: 'Toggle',
        tagline: 'Interruptores animados con rol switch',
        selector: 'app-form-toggle',
        className: 'ToggleComponent',
        sourcePath: 'src/app/components/forms/toggle',
        variants: [
          { id: 'default', label: 'Switches', hint: 'aria-checked y navegable por teclado' },
        ],
      },
      {
        id: 'checkbox',
        label: 'Checkbox',
        tagline: 'Checkboxes personalizados y accesibles',
        selector: 'app-form-checkbox',
        className: 'CheckboxComponent',
        sourcePath: 'src/app/components/forms/checkbox',
        variants: [{ id: 'default', label: 'Checkboxes', hint: 'Con icono de check animado' }],
      },
      {
        id: 'segmented',
        label: 'Segmented',
        tagline: 'Selector segmentado con indicador deslizante',
        selector: 'app-form-segmented',
        className: 'SegmentedComponent',
        sourcePath: 'src/app/components/forms/segmented',
        variants: [
          { id: 'glass', label: 'Vidrio', hint: 'Translúcido con pulgar que se desliza' },
          { id: 'solid', label: 'Sólido', hint: 'Pulgar sólido sobre panel oscuro' },
        ],
      },
      {
        id: 'otp',
        label: 'OTP Input',
        tagline: 'Código de verificación con avance automático',
        selector: 'app-form-otp',
        className: 'OtpComponent',
        sourcePath: 'src/app/components/forms/otp',
        requiresForms: false,
        variants: [
          { id: 'boxes', label: 'Cajas', hint: 'Dígitos en cajas de vidrio con blur' },
          { id: 'underline', label: 'Subrayado', hint: 'Dígitos mono sobre línea de color' },
        ],
      },
      {
        id: 'rating',
        label: 'Rating',
        tagline: 'Valoración por estrellas y segmentos',
        selector: 'app-form-rating',
        className: 'RatingComponent',
        sourcePath: 'src/app/components/forms/rating',
        variants: [
          { id: 'stars', label: 'Estrellas', hint: '5 estrellas con hover dorado' },
          { id: 'segments', label: 'Segmentos', hint: 'Botones 1–5 con etiquetas' },
        ],
      },
      {
        id: 'range',
        label: 'Range Slider',
        tagline: 'Selector de rango con pista de degradado',
        selector: 'app-form-range',
        className: 'RangeComponent',
        sourcePath: 'src/app/components/forms/range',
        variants: [
          { id: 'gradient', label: 'Degradado', hint: 'Pista indigo→rosa con pulgar blanco' },
          { id: 'glass', label: 'Vidrio', hint: 'Pulgar translúcido con borde luminoso' },
        ],
      },
    ],
  },
  {
    id: 'modals',
    label: 'Modals',
    icon: 'modals',
    accent: '#3b82f6',
    tagline: 'Modal de vidrio y panel lateral con foco gestionado',
    components: [
      {
        id: 'glass-modal',
        label: 'Glass Modal',
        tagline: 'Modal glassmorphism con Escape y click fuera',
        selector: 'app-modal-glass',
        className: 'GlassModalComponent',
        sourcePath: 'src/app/components/modals/glass-modal',
        variants: [
          {
            id: 'default',
            label: 'Modal',
            hint: 'Se abre dentro del entorno, no sobre toda la app',
          },
        ],
      },
      {
        id: 'slide-in',
        label: 'Slide-in Panel',
        tagline: 'Panel lateral con animación de entrada',
        selector: 'app-modal-slide-in',
        className: 'SlideInModalComponent',
        sourcePath: 'src/app/components/modals/slide-in',
        variants: [
          {
            id: 'default',
            label: 'Panel lateral',
            hint: 'Entra desde la derecha, cierra con Escape',
          },
        ],
      },
      {
        id: 'command-palette',
        label: 'Command Palette',
        tagline: 'Paleta translúcida con búsqueda y teclado',
        selector: 'app-modal-palette',
        className: 'CommandPaletteComponent',
        sourcePath: 'src/app/components/modals/command-palette',
        variants: [
          {
            id: 'default',
            label: 'Paleta de comandos',
            hint: 'Flechas para moverse, Enter para ejecutar, Escape para cerrar',
          },
        ],
      },
      {
        id: 'confirm',
        label: 'Confirm Dialog',
        tagline: 'Diálogo de confirmación con peligro y vidrio',
        selector: 'app-modal-confirm',
        className: 'ConfirmModalComponent',
        sourcePath: 'src/app/components/modals/confirm',
        variants: [
          { id: 'danger', label: 'Peligro', hint: 'Acento rojo con icono de advertencia' },
          { id: 'glass', label: 'Vidrio', hint: 'Panel translúcido con blur' },
        ],
      },
      {
        id: 'bottom-sheet',
        label: 'Bottom Sheet',
        tagline: 'Panel inferior con manija y acciones',
        selector: 'app-modal-sheet',
        className: 'BottomSheetComponent',
        sourcePath: 'src/app/components/modals/bottom-sheet',
        variants: [
          { id: 'solid', label: 'Sólido', hint: 'Panel oscuro desde abajo' },
          { id: 'glass', label: 'Vidrio', hint: 'Panel translúcido con blur' },
        ],
      },
      {
        id: 'lightbox',
        label: 'Lightbox',
        tagline: 'Visor de fotos con prev/next y vidrio',
        selector: 'app-modal-lightbox',
        className: 'LightboxComponent',
        sourcePath: 'src/app/components/modals/lightbox',
        variants: [
          { id: 'photo', label: 'Foto', hint: 'Visor oscuro con flechas' },
          { id: 'glass', label: 'Vidrio', hint: 'Miniaturas con efecto de vidrio' },
        ],
      },
    ],
  },
  {
    id: 'themes',
    label: 'Themes',
    icon: 'themes',
    accent: '#f43f5e',
    tagline: 'Cinco temas completos basados en variables CSS',
    components: [
      {
        id: 'dark',
        label: 'Dark',
        tagline: 'Paleta completa para modo oscuro',
        selector: 'app-theme-dark',
        className: 'ThemeDarkComponent',
        sourcePath: 'src/app/components/themes/dark',
        variants: [
          { id: 'surfaces', label: 'Superficies', hint: 'Fondos y capas' },
          { id: 'accent', label: 'Acento', hint: 'Indigo de marca' },
          { id: 'neutrals', label: 'Neutros', hint: 'Escala de grises' },
        ],
      },
      {
        id: 'light',
        label: 'Light',
        tagline: 'Paleta limpia para modo claro',
        selector: 'app-theme-light',
        className: 'ThemeLightComponent',
        sourcePath: 'src/app/components/themes/light',
        variants: [
          { id: 'surfaces', label: 'Superficies', hint: 'Blancos y grises claros' },
          { id: 'accent', label: 'Acento', hint: 'Azules de marca' },
          { id: 'neutrals', label: 'Neutros', hint: 'Texto y bordes' },
        ],
      },
      {
        id: 'hacker',
        label: 'Hacker',
        tagline: 'Estilo Matrix / terminal verde sobre negro',
        selector: 'app-theme-hacker',
        className: 'ThemeHackerComponent',
        sourcePath: 'src/app/components/themes/hacker',
        variants: [
          { id: 'terminal', label: 'Terminal', hint: 'Simulación de shell con cursor' },
          { id: 'palette', label: 'Paleta', hint: 'Verdes fosforescentes' },
        ],
      },
      {
        id: 'cyberpunk',
        label: 'Cyberpunk',
        tagline: 'Futurista con neón rosa, cyan y amarillo',
        selector: 'app-theme-cyberpunk',
        className: 'ThemeCyberpunkComponent',
        sourcePath: 'src/app/components/themes/cyberpunk',
        variants: [
          { id: 'glitch', label: 'Título glitch', hint: 'Texto con desplazamiento RGB' },
          { id: 'subtitle', label: 'Subtítulo', hint: 'Línea monoespaciada' },
          { id: 'palette', label: 'Paleta', hint: 'Neones saturados' },
        ],
      },
      {
        id: 'corporate',
        label: 'Corporate',
        tagline: 'Profesional y sobrio para empresas',
        selector: 'app-theme-corporate',
        className: 'ThemeCorporateComponent',
        sourcePath: 'src/app/components/themes/corporate',
        variants: [
          { id: 'header', label: 'Cabecera', hint: 'Logo y jerarquía' },
          { id: 'palette', label: 'Paleta', hint: 'Azules corporativos y grises' },
        ],
      },
    ],
  },
  {
    id: 'animations',
    label: 'Animations',
    icon: 'animations',
    accent: '#a78bfa',
    tagline: 'Skeleton, spinner y transiciones tipo libro',
    components: [
      {
        id: 'skeleton',
        label: 'Skeleton',
        tagline: 'Estados de carga con shimmer, pulso y onda',
        selector: 'app-anim-skeleton',
        className: 'SkeletonComponent',
        sourcePath: 'src/app/components/animations/skeleton',
        variants: [
          {
            id: 'shimmer',
            label: 'Shimmer',
            hint: 'Brillo que se desplaza de izquierda a derecha',
          },
          { id: 'pulse', label: 'Pulso', hint: 'Opacidad que sube y baja suavemente' },
          { id: 'wave', label: 'Onda', hint: 'Ola azul que avanza por las líneas' },
        ],
      },
      {
        id: 'spinner',
        label: 'Spinner',
        tagline: 'Indicadores de carga: anillo, puntos y barra',
        selector: 'app-anim-spinner',
        className: 'SpinnerComponent',
        sourcePath: 'src/app/components/animations/spinner',
        variants: [
          { id: 'ring', label: 'Anillo', hint: 'Círculo que gira con borde de color' },
          { id: 'dots', label: 'Puntos', hint: 'Tres puntos que rebotan' },
          { id: 'bar', label: 'Barra', hint: 'Barra con degradado que avanza' },
        ],
      },
      {
        id: 'page-flip',
        label: 'Page Flip',
        tagline: 'Efecto libro: giro, libro abierto y esquina doblada',
        selector: 'app-anim-page-flip',
        className: 'PageFlipComponent',
        sourcePath: 'src/app/components/animations/page-flip',
        variants: [
          { id: 'page', label: 'Página', hint: 'Front/back con giro en el eje Y' },
          { id: 'book', label: 'Libro', hint: 'Dos páginas abiertas con giro' },
          { id: 'fold', label: 'Esquina', hint: 'Esquina que se levanta al pasar el cursor' },
        ],
      },
    ],
  },
];

/** Categorías del catálogo. */
export const TOTAL_GROUPS = CATALOG.length;

/** Componentes: cada uno es un entorno aislado con su vista. */
export const TOTAL_COMPONENTS = CATALOG.reduce(
  (total, group) => total + group.components.length,
  0,
);

/** Sub-estilos navegables entre todos los componentes. */
export const TOTAL_VARIANTS = CATALOG.reduce(
  (total, group) => total + group.components.reduce((sum, entry) => sum + entry.variants.length, 0),
  0,
);

/** Componentes con más de una variante (los que muestran selector de sub-estilos). */
export function hasMultipleVariants(entry: CatalogEntry): boolean {
  return entry.variants.length > 1;
}

/** Lista plana de componentes, en el orden del catálogo (para prev/next). */
export const FLAT_ENTRIES: readonly { group: CatalogGroup; entry: CatalogEntry }[] =
  CATALOG.flatMap((group) => group.components.map((entry) => ({ group, entry })));

export function findGroup(groupId: string | undefined): CatalogGroup | undefined {
  return CATALOG.find((group) => group.id === groupId);
}

export function findEntry(
  groupId: string | undefined,
  entryId: string | undefined,
): { group: CatalogGroup; entry: CatalogEntry } | undefined {
  return FLAT_ENTRIES.find((item) => item.group.id === groupId && item.entry.id === entryId);
}

export function findVariant(
  entry: CatalogEntry,
  variantId: string | undefined,
): CatalogVariant | undefined {
  return entry.variants.find((variant) => variant.id === variantId);
}
