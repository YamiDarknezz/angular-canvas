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
  readonly code: string;
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
  readonly npmInstall?: readonly string[];
  /** Carpetas de apoyo que necesita el componente al extraerse. */
  readonly supportingFolders?: readonly string[];
  /** Respeta la ruta bajo components cuando los imports cruzan categorías. */
  readonly preserveSourceLayout?: boolean;
  /** El entorno admite tinte y movimiento mediante inputs. */
  readonly sceneControls?: boolean;
  readonly variants: readonly CatalogVariant[];
  readonly code: string;
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
  readonly code: string;
}

export const CATALOG: readonly CatalogGroup[] = [
  {
    id: 'cards',
    code: '1',
    label: 'Cards',
    icon: 'cards',
    accent: '#6366f1',
    tagline: 'Tarjetas con vidrio, neón, volteo 3D y estilos sobrios',
    components: [
      {
        id: 'glassmorphism',
        code: '1.1',
        label: 'Glassmorphism',
        tagline: 'Vidrio esmerilado con transparencia y blur',
        selector: 'app-card-glassmorphism',
        className: 'GlassmorphismComponent',
        sourcePath: 'src/app/components/cards/glassmorphism',
        variants: [
          {
            code: '1.1.1.1',
            id: 'default',
            label: 'Base',
            hint: 'La tarjeta de vidrio por defecto',
          },
          {
            code: '1.1.2.1',
            id: 'secondary',
            label: 'Secondary',
            hint: 'Segundo nivel de jerarquía',
          },
          {
            code: '1.1.3.1',
            id: 'accent',
            label: 'Accent',
            hint: 'Acento de color para destacar una tarjeta',
          },
        ],
      },
      {
        id: 'neon',
        code: '1.2',
        label: 'Neon',
        tagline: 'Bordes luminosos con efecto de neón brillante',
        selector: 'app-card-neon',
        className: 'NeonCardComponent',
        sourcePath: 'src/app/components/cards/neon',
        variants: [
          {
            code: '1.2.1.1',
            id: 'blue',
            label: 'Neón azul',
            hint: 'El clásico para interfaces tech y gaming',
          },
          {
            code: '1.2.2.1',
            id: 'pink',
            label: 'Neón rosa',
            hint: 'Energía vibrante para dashboards',
          },
          {
            code: '1.2.3.1',
            id: 'green',
            label: 'Neón verde',
            hint: 'Inspiración Matrix para herramientas dev',
          },
        ],
      },
      {
        id: 'hover-effects',
        code: '1.3',
        label: 'Hover Effects',
        tagline: 'Diferentes respuestas al pasar el mouse',
        selector: 'app-card-hover',
        className: 'HoverEffectsComponent',
        sourcePath: 'src/app/components/cards/hover-effects',
        variants: [
          {
            code: '1.3.1.1',
            id: 'lift',
            label: 'Lift',
            hint: 'Elevación suave con sombra creciente',
          },
          { code: '1.3.2.1', id: 'scale', label: 'Scale', hint: 'Escalado con cambio de fondo' },
          { code: '1.3.3.1', id: 'rotate', label: 'Rotate', hint: 'Rotación 3D sutil' },
          {
            code: '1.3.4.1',
            id: 'border-draw',
            label: 'Border Draw',
            hint: 'Borde que se dibuja alrededor',
          },
          {
            code: '1.3.5.1',
            id: 'glow',
            label: 'Glow',
            hint: 'Brillo expansivo con sombra de color',
          },
          {
            code: '1.3.6.1',
            id: 'magnetic',
            label: 'Magnetic',
            hint: 'Sigue el cursor con efecto magnético',
          },
        ],
      },
      {
        id: 'flip',
        code: '1.4',
        label: 'Flip 3D',
        tagline: 'Tarjetas que giran en 3D al hacer click',
        selector: 'app-card-flip',
        className: 'FlipCardComponent',
        sourcePath: 'src/app/components/cards/flip',
        variants: [
          {
            code: '1.4.1.1',
            id: 'classic',
            label: 'Clásica',
            hint: 'Frente y reverso con el tema actual',
          },
          {
            code: '1.4.2.1',
            id: 'gradient',
            label: 'Gradiente',
            hint: 'Fondos degradados en ambas caras',
          },
          {
            code: '1.4.3.1',
            id: 'stats',
            label: 'Con métricas',
            hint: 'Contenido denso frente y reverso',
          },
        ],
      },
      {
        id: 'tilt-3d',
        code: '1.5',
        label: '3D Tilt',
        tagline: 'Perspectiva, profundidad y brillo que siguen al cursor',
        selector: 'app-card-tilt3d',
        className: 'Tilt3dCardComponent',
        sourcePath: 'src/app/components/cards/tilt-3d',
        variants: [
          {
            code: '1.5.1.1',
            id: 'tilt',
            label: 'Tilt + brillo',
            hint: 'Rota en 3D y el reflejo sigue al cursor',
          },
          {
            code: '1.5.2.1',
            id: 'depth',
            label: 'Profundidad',
            hint: 'Capas a distinta altura sobre el eje Z',
          },
          {
            code: '1.5.3.1',
            id: 'shine',
            label: 'Holo',
            hint: 'Tornasol con destello que se desplaza',
          },
        ],
      },
      {
        id: 'glass-panel',
        code: '1.6',
        label: 'Glass Panels',
        tagline: 'Superficies de vidrio sobre color con blur y brillo interior',
        selector: 'app-card-glass-panel',
        className: 'GlassPanelComponent',
        sourcePath: 'src/app/components/cards/glass-panel',
        variants: [
          {
            code: '1.6.1.1',
            id: 'stats',
            label: 'Métricas',
            hint: 'Panel de resumen con barras translúcidas',
          },
          {
            code: '1.6.2.1',
            id: 'profile',
            label: 'Perfil',
            hint: 'Tarjeta de persona con acciones',
          },
          {
            code: '1.6.3.1',
            id: 'overlay',
            label: 'Superposición',
            hint: 'Texto legible sobre cualquier fondo',
          },
        ],
      },
      {
        id: 'minimal',
        code: '1.7',
        label: 'Minimal',
        tagline: 'Limpio, elegante, sin distracciones',
        selector: 'app-card-minimal',
        className: 'MinimalCardComponent',
        sourcePath: 'src/app/components/cards/minimal',
        variants: [
          { code: '1.7.1.1', id: 'default', label: 'Con acento', hint: 'Barra de acento lateral' },
          {
            code: '1.7.2.1',
            id: 'bordered',
            label: 'Solo bordes',
            hint: 'Sin sombras ni fondos extra',
          },
          {
            code: '1.7.3.1',
            id: 'with-tag',
            label: 'Con etiqueta',
            hint: 'Tag sutil de categoría',
          },
        ],
      },
      {
        id: 'dark-corporate',
        code: '1.8',
        label: 'Dark Corporate',
        tagline: 'Elegancia corporativa en modo oscuro',
        selector: 'app-card-corporate',
        className: 'DarkCorporateComponent',
        sourcePath: 'src/app/components/cards/dark-corporate',
        variants: [
          { code: '1.8.1.1', id: 'default', label: 'Estándar', hint: 'Cabecera, métricas y CTA' },
          {
            code: '1.8.2.1',
            id: 'variant',
            label: 'Con badge accent',
            hint: 'Badge de acento y otra densidad',
          },
        ],
      },
      {
        id: 'delivery-timeline',
        code: '1.9',
        label: 'Seguimiento de entrega',
        tagline: 'Tarjeta de pedido con ruta, etapas consultables y detalle animado',
        selector: 'app-card-delivery-timeline',
        className: 'DeliveryTimelineCardComponent',
        sourcePath: 'src/app/components/cards/delivery-timeline',
        variants: [
          {
            id: 'in-transit',
            code: '1.9.1.1',
            label: 'En ruta',
            hint: 'Consulta las etapas y la ventana estimada de entrega',
          },
          {
            id: 'delivered',
            code: '1.9.2.1',
            label: 'Entregado',
            hint: 'Revisa la recepción confirmada y las horas de cada hito',
          },
        ],
      },
      {
        id: 'stock-status',
        code: '1.10',
        label: 'Estado del inventario',
        tagline: 'Tarjeta con existencias, umbral de reposición y filtro de artículos',
        selector: 'app-card-stock-status',
        className: 'StockStatusCardComponent',
        sourcePath: 'src/app/components/cards/stock-status',
        variants: [
          {
            id: 'warehouse',
            code: '1.10.1.1',
            label: 'Almacén',
            hint: 'Compara existencias con el mínimo de reposición',
          },
          {
            id: 'store',
            code: '1.10.2.1',
            label: 'Bodega',
            hint: 'Filtra los productos bajo mínimo y los agotados',
          },
        ],
      },
    ],
  },
  {
    id: 'buttons',
    code: '2',
    label: 'Buttons',
    icon: 'buttons',
    accent: '#06b6d4',
    tagline: 'Botones con brillo, degradado, neumorfismo y animación',
    components: [
      {
        id: 'glow',
        code: '2.1',
        label: 'Glow',
        tagline: 'Botones con efecto de brillo expansivo',
        selector: 'app-btn-glow',
        className: 'GlowButtonComponent',
        sourcePath: 'src/app/components/buttons/glow',
        variants: [
          { code: '2.1.1.1', id: 'blue', label: 'Azul', hint: '.glow-blue' },
          { code: '2.1.2.1', id: 'purple', label: 'Púrpura', hint: '.glow-purple' },
          { code: '2.1.3.1', id: 'pink', label: 'Rosa', hint: '.glow-pink' },
          { code: '2.1.4.1', id: 'green', label: 'Verde', hint: '.glow-green' },
          { code: '2.1.5.1', id: 'orange', label: 'Naranja', hint: '.glow-orange' },
        ],
      },
      {
        id: 'gradient',
        code: '2.2',
        label: 'Gradient',
        tagline: 'Botones con degradados animados y estáticos',
        selector: 'app-btn-gradient',
        className: 'GradientButtonComponent',
        sourcePath: 'src/app/components/buttons/gradient',
        variants: [
          { code: '2.2.1.1', id: 'sunset', label: 'Sunset', hint: 'Naranja a magenta' },
          { code: '2.2.2.1', id: 'ocean', label: 'Ocean', hint: 'Azules profundos' },
          { code: '2.2.3.1', id: 'aurora', label: 'Aurora', hint: 'Verde-cyan degradado' },
          { code: '2.2.4.1', id: 'fire', label: 'Fire', hint: 'Rojo y ámbar' },
          {
            code: '2.2.5.1',
            id: 'mesh',
            label: 'Mesh animado',
            hint: 'Malla de color en movimiento',
          },
        ],
      },
      {
        id: 'neumorphism',
        code: '2.3',
        label: 'Neumorphism',
        tagline: 'Relieve suave tipo neumorfismo',
        selector: 'app-btn-neumorphism',
        className: 'NeumorphismButtonComponent',
        sourcePath: 'src/app/components/buttons/neumorphism',
        variants: [
          { code: '2.3.1.1', id: 'soft', label: 'Suave', hint: 'Relieve estándar' },
          {
            code: '2.3.2.1',
            id: 'pressed',
            label: 'Presionado',
            hint: 'Estado hundido permanente',
          },
          { code: '2.3.3.1', id: 'flat', label: 'Flat', hint: 'Superficie plana' },
          { code: '2.3.4.1', id: 'convex', label: 'Convexo', hint: 'Relieve saliente marcado' },
        ],
      },
      {
        id: 'pill',
        code: '2.4',
        label: 'Pill',
        tagline: 'Botones redondeados tipo píldora',
        selector: 'app-btn-pill',
        className: 'PillButtonComponent',
        sourcePath: 'src/app/components/buttons/pill',
        variants: [
          { code: '2.4.1.1', id: 'outline', label: 'Outline', hint: 'Borde sin relleno' },
          { code: '2.4.2.1', id: 'solid', label: 'Solid', hint: 'Relleno plano' },
          { code: '2.4.3.1', id: 'ghost', label: 'Ghost', hint: 'Transparente hasta el hover' },
          { code: '2.4.4.1', id: 'gradient', label: 'Gradient', hint: 'Degradado de acento' },
          { code: '2.4.5.1', id: 'with-icon', label: 'Con icono', hint: 'Icono + texto' },
          { code: '2.4.6.1', id: 'small', label: 'Pequeño', hint: 'Tamaño compacto' },
        ],
      },
      {
        id: 'animated',
        code: '2.5',
        label: 'Animated',
        tagline: 'Botones con animaciones al interactuar',
        selector: 'app-btn-animated',
        className: 'AnimatedButtonComponent',
        sourcePath: 'src/app/components/buttons/animated',
        variants: [
          { code: '2.5.1.1', id: 'ripple', label: 'Ripple', hint: 'Onda desde el punto de click' },
          { code: '2.5.2.1', id: 'pulse', label: 'Pulse', hint: 'Latido continuo' },
          { code: '2.5.3.1', id: 'shake', label: 'Shake', hint: 'Sacudida al hacer hover' },
          { code: '2.5.4.1', id: 'fill-up', label: 'Fill up', hint: 'Relleno que sube' },
          { code: '2.5.5.1', id: 'slide-bg', label: 'Slide BG', hint: 'Fondo que se desliza' },
          { code: '2.5.6.1', id: 'magnetic', label: 'Magnetic', hint: 'Sigue el cursor' },
        ],
      },
      {
        id: '3d',
        code: '2.6',
        label: '3D',
        tagline: 'Relieve que se hunde, volteo y levitación por capas',
        selector: 'app-btn-3d',
        className: 'Button3dComponent',
        sourcePath: 'src/app/components/buttons/3d',
        variants: [
          {
            code: '2.6.1.1',
            id: 'push',
            label: 'Push',
            hint: 'Se hunde hasta apoyarse en su base',
          },
          { code: '2.6.2.1', id: 'flip', label: 'Flip', hint: 'Voltea en 3D al pasar el cursor' },
          {
            code: '2.6.3.1',
            id: 'levitate',
            label: 'Levitación',
            hint: 'Pila de capas que se separa del suelo',
          },
        ],
      },
      {
        id: 'glass',
        code: '2.7',
        label: 'Glass',
        tagline: 'Botones translúcidos con blur y bordes luminosos',
        selector: 'app-btn-glass',
        className: 'ButtonGlassComponent',
        sourcePath: 'src/app/components/buttons/glass',
        variants: [
          {
            code: '2.7.1.1',
            id: 'glass',
            label: 'Glass',
            hint: 'Vidrio suave con brillo interior',
          },
          { code: '2.7.2.1', id: 'frost', label: 'Frost', hint: 'Escarchado con blur intenso' },
          {
            id: 'gradient-border',
            code: '2.7.3.1',
            label: 'Borde degradado',
            hint: 'Contorno tornasol sobre vidrio',
          },
        ],
      },
      {
        id: 'hold-confirm',
        code: '2.8',
        label: 'Mantener para confirmar',
        tagline:
          'Confirmación con barra de progreso, cancelación al soltar y alternativa de dos pasos',
        selector: 'app-btn-hold-confirm',
        className: 'HoldConfirmButtonComponent',
        sourcePath: 'src/app/components/buttons/hold-confirm',
        variants: [
          {
            id: 'dispatch',
            code: '2.8.1.1',
            label: 'Liberar pedido',
            hint: 'Mantén pulsado y suelta para confirmar la salida',
          },
          {
            id: 'publish',
            code: '2.8.2.1',
            label: 'Publicar cambios',
            hint: 'Confirma la publicación con una alternativa de dos pasos',
          },
        ],
      },
    ],
  },
  {
    id: 'backgrounds',
    code: '3',
    label: 'Backgrounds',
    icon: 'backgrounds',
    accent: '#a855f7',
    tagline: 'Fondos degradados, partículas, grillas y mallas animadas',
    components: [
      {
        id: 'gradient',
        code: '3.1',
        label: 'Gradient',
        tagline: 'Degradados para secciones completas',
        selector: 'app-bg-gradient',
        className: 'BgGradientComponent',
        sourcePath: 'src/app/components/backgrounds/gradient',
        variants: [
          { code: '3.1.1.1', id: 'sunset', label: 'Sunset', hint: 'Cálido, atardecer' },
          { code: '3.1.2.1', id: 'aurora', label: 'Aurora', hint: 'Verdes y violetas' },
          { code: '3.1.3.1', id: 'deep-ocean', label: 'Deep Ocean', hint: 'Azules profundos' },
          { code: '3.1.4.1', id: 'mesh', label: 'Mesh', hint: 'Malla de color suave' },
          { code: '3.1.5.1', id: 'radial', label: 'Radial Focus', hint: 'Foco radial centrado' },
          { code: '3.1.6.1', id: 'conic', label: 'Conic', hint: 'Degradado cónico' },
        ],
      },
      {
        id: 'particle',
        code: '3.2',
        label: 'Particle',
        tagline: 'Canvas de partículas conectadas en red',
        selector: 'app-bg-particle',
        className: 'BgParticleComponent',
        sourcePath: 'src/app/components/backgrounds/particle',
        variants: [
          {
            code: '3.2.1.1',
            id: 'default',
            label: 'Red de partículas',
            hint: 'Canvas con enlaces por cercanía',
          },
        ],
      },
      {
        id: 'grid',
        code: '3.3',
        label: 'Grid',
        tagline: 'Patrones de cuadrícula para fondos',
        selector: 'app-bg-grid',
        className: 'BgGridComponent',
        sourcePath: 'src/app/components/backgrounds/grid',
        variants: [
          { code: '3.3.1.1', id: 'dots', label: 'Dot Grid', hint: 'Puntos regulares' },
          { code: '3.3.2.1', id: 'lines', label: 'Line Grid', hint: 'Líneas ortogonales' },
          { code: '3.3.3.1', id: 'gradient', label: 'Fade Grid', hint: 'Grilla que se desvanece' },
        ],
      },
      {
        id: 'animated-mesh',
        code: '3.4',
        label: 'Animated Mesh',
        tagline: 'Malla animada con colores fluidos',
        selector: 'app-bg-mesh',
        className: 'BgAnimatedMeshComponent',
        sourcePath: 'src/app/components/backgrounds/animated-mesh',
        variants: [
          {
            code: '3.4.1.1',
            id: 'default',
            label: 'Mesh animado',
            hint: 'Blobs de color en movimiento',
          },
        ],
      },
      {
        id: 'aurora',
        code: '3.5',
        label: 'Aurora',
        tagline: 'Blobs de color, haces de luz y vidrio sobre aurora',
        selector: 'app-bg-aurora',
        className: 'BgAuroraComponent',
        sourcePath: 'src/app/components/backgrounds/aurora',
        variants: [
          {
            code: '3.5.1.1',
            id: 'aurora',
            label: 'Aurora',
            hint: 'Blobs difusos que derivan en diagonal',
          },
          {
            code: '3.5.2.1',
            id: 'beams',
            label: 'Haces',
            hint: 'Columnas de luz que barren el fondo',
          },
          {
            code: '3.5.3.1',
            id: 'glass',
            label: 'Con vidrio',
            hint: 'Panel translúcido sobre la aurora',
          },
        ],
      },
      {
        id: 'topographic',
        code: '3.6',
        label: 'Fondo topográfico',
        tagline: 'Curvas vectoriales animadas para encabezados, portadas y paneles',
        selector: 'app-bg-topographic',
        className: 'TopographicComponent',
        sourcePath: 'src/app/components/backgrounds/topographic',
        sceneControls: true,
        variants: [
          {
            id: 'terrain',
            code: '3.6.1.1',
            label: 'Sierra central',
            hint: 'Curvas de elevación sobre un fondo verde',
          },
          {
            id: 'bathymetry',
            code: '3.6.2.1',
            label: 'Cuenca oceánica',
            hint: 'Anillos de profundidad en azul',
          },
          {
            id: 'plateau',
            code: '3.6.3.1',
            label: 'Meseta mineral',
            hint: 'Relieve con tonos de arcilla',
          },
        ],
      },
    ],
  },
  {
    id: 'typography',
    code: '4',
    label: 'Typography',
    icon: 'typography',
    accent: '#ec4899',
    tagline: 'Texto con neón, degradados y efecto máquina de escribir',
    components: [
      {
        id: 'glow-text',
        code: '4.1',
        label: 'Glow Text',
        tagline: 'Texto con efecto de neón brillante',
        selector: 'app-text-glow',
        className: 'GlowTextComponent',
        sourcePath: 'src/app/components/typography/glow-text',
        variants: [
          { code: '4.1.1.1', id: 'cyan', label: 'Cyan', hint: '.glow-cyan' },
          { code: '4.1.2.1', id: 'pink', label: 'Rosa', hint: '.glow-pink' },
          { code: '4.1.3.1', id: 'green', label: 'Verde Matrix', hint: '.glow-green' },
          { code: '4.1.4.1', id: 'pulse', label: 'Con pulso', hint: '.glow-pulse' },
        ],
      },
      {
        id: 'gradient-text',
        code: '4.2',
        label: 'Gradient Text',
        tagline: 'Degradados animados y estáticos en texto',
        selector: 'app-text-gradient',
        className: 'GradientTextComponent',
        sourcePath: 'src/app/components/typography/gradient-text',
        variants: [
          { code: '4.2.1.1', id: 'static', label: 'Estático', hint: '.grad-static' },
          { code: '4.2.2.1', id: 'animated', label: 'Animado', hint: '.grad-animated' },
          { code: '4.2.3.1', id: 'rainbow', label: 'Arcoíris', hint: '.grad-rainbow' },
          { code: '4.2.4.1', id: 'subtle', label: 'Sutil', hint: '.grad-subtle, para párrafos' },
        ],
      },
      {
        id: 'typewriter',
        code: '4.3',
        label: 'Typewriter',
        tagline: 'Efecto de máquina de escribir sobre una terminal',
        selector: 'app-text-typewriter',
        className: 'TypewriterComponent',
        sourcePath: 'src/app/components/typography/typewriter',
        variants: [
          {
            code: '4.3.1.1',
            id: 'default',
            label: 'Terminal',
            hint: 'Cursor, prompt y escribido secuencial',
          },
        ],
      },
      {
        id: '3d-text',
        code: '4.4',
        label: '3D Text',
        tagline: 'Extrusión, perspectiva isométrica y levitación',
        selector: 'app-text-3d',
        className: 'Text3dComponent',
        sourcePath: 'src/app/components/typography/3d-text',
        variants: [
          {
            code: '4.4.1.1',
            id: 'extrude',
            label: 'Extrude',
            hint: 'Canto sólido por capas de sombra',
          },
          {
            code: '4.4.2.1',
            id: 'isometric',
            label: 'Isométrico',
            hint: 'Texto recostado con perspectiva',
          },
          {
            code: '4.4.3.1',
            id: 'floating',
            label: 'Floating',
            hint: 'Flota con su sombra en movimiento',
          },
        ],
      },
      {
        id: 'reveal-heading',
        code: '4.5',
        label: 'Revelado tipográfico',
        tagline: 'Entradas de texto por palabra con control para repetir la animación',
        selector: 'app-type-reveal-heading',
        className: 'RevealHeadingComponent',
        sourcePath: 'src/app/components/typography/reveal-heading',
        sceneControls: true,
        variants: [
          {
            id: 'mask',
            code: '4.5.1.1',
            label: 'Cortina ascendente',
            hint: 'Las palabras suben desde una máscara',
          },
          {
            id: 'shutter',
            code: '4.5.2.1',
            label: 'Barrido lateral',
            hint: 'El título aparece con un corte horizontal',
          },
          {
            id: 'underline',
            code: '4.5.3.1',
            label: 'Subrayado por palabras',
            hint: 'Un trazo se dibuja debajo de cada palabra',
          },
        ],
      },
    ],
  },
  {
    id: 'navigation',
    code: '5',
    label: 'Navigation',
    icon: 'navigation',
    accent: '#14b8a6',
    tagline: 'Sidebar colapsable y topbar responsiva',
    components: [
      {
        id: 'sidebar',
        code: '5.1',
        label: 'Sidebar',
        tagline: 'Navegación lateral colapsable, navegable por teclado',
        selector: 'app-nav-sidebar',
        className: 'SidebarNavComponent',
        sourcePath: 'src/app/components/navigation/sidebar',
        variants: [
          {
            code: '5.1.1.1',
            id: 'default',
            label: 'Colapsable',
            hint: 'Colapsa con ☰ y recuerda el item activo',
          },
        ],
      },
      {
        id: 'topbar',
        code: '5.2',
        label: 'Topbar',
        tagline: 'Barra superior responsiva con menú mobile accesible',
        selector: 'app-nav-topbar',
        className: 'TopbarNavComponent',
        sourcePath: 'src/app/components/navigation/topbar',
        variants: [
          {
            code: '5.2.1.1',
            id: 'default',
            label: 'Con menú mobile',
            hint: 'Menú ☰ accesible por teclado',
          },
        ],
      },
      {
        id: 'dock',
        code: '5.3',
        label: 'Dock',
        tagline: 'Dock inferior flotante, de cristal o barra completa',
        selector: 'app-nav-dock',
        className: 'DockNavComponent',
        sourcePath: 'src/app/components/navigation/dock',
        variants: [
          {
            id: 'floating',
            code: '5.3.1.1',
            label: 'Flotante',
            hint: 'Píldora flotante con magnificación al pasar el cursor',
          },
          {
            code: '5.3.2.1',
            id: 'glass',
            label: 'Cristal',
            hint: 'Vidrio transparente sobre color',
          },
          { code: '5.3.3.1', id: 'bar', label: 'Barra', hint: 'Barra inferior a ancho completo' },
        ],
      },
      {
        id: 'glass-tabs',
        code: '5.4',
        label: 'Glass Tabs',
        tagline: 'Pestañas translúcidas con indicador deslizante',
        selector: 'app-nav-tabs',
        className: 'GlassTabsComponent',
        sourcePath: 'src/app/components/navigation/glass-tabs',
        variants: [
          {
            code: '5.4.1.1',
            id: 'glass',
            label: 'Vidrio',
            hint: 'Barra de vidrio con pastilla que se desliza',
          },
          {
            code: '5.4.2.1',
            id: 'underline',
            label: 'Subrayado',
            hint: 'Línea luminosa que sigue a la pestaña',
          },
        ],
      },
      {
        id: 'breadcrumbs',
        code: '5.5',
        label: 'Breadcrumbs',
        tagline: 'Migas de pan con chevron, slash y vidrio',
        selector: 'app-nav-breadcrumbs',
        className: 'BreadcrumbsComponent',
        sourcePath: 'src/app/components/navigation/breadcrumbs',
        variants: [
          { code: '5.5.1.1', id: 'chevron', label: 'Chevron', hint: 'Flechas entre niveles' },
          { code: '5.5.2.1', id: 'slash', label: 'Slash', hint: 'Barra monoespaciada' },
          {
            code: '5.5.3.1',
            id: 'glass',
            label: 'Vidrio',
            hint: 'Píldora translúcida sobre color',
          },
        ],
      },
      {
        id: 'pagination',
        code: '5.6',
        label: 'Pagination',
        tagline: 'Paginación numérica, compacta y de vidrio',
        selector: 'app-nav-pagination',
        className: 'PaginationComponent',
        sourcePath: 'src/app/components/navigation/pagination',
        variants: [
          {
            code: '5.6.1.1',
            id: 'numbers',
            label: 'Números',
            hint: 'Página activa con elipsis dinámico',
          },
          {
            code: '5.6.2.1',
            id: 'compact',
            label: 'Compacta',
            hint: '"Página X de Y" con flechas',
          },
          {
            code: '5.6.3.1',
            id: 'glass',
            label: 'Vidrio',
            hint: 'Píldora translucida sobre color',
          },
        ],
      },
      {
        id: 'stepper',
        code: '5.7',
        label: 'Stepper',
        tagline: 'Pasos en horizontal, vertical y barra de progreso',
        selector: 'app-nav-stepper',
        className: 'StepperComponent',
        sourcePath: 'src/app/components/navigation/stepper',
        variants: [
          {
            code: '5.7.1.1',
            id: 'horizontal',
            label: 'Horizontal',
            hint: 'Pasos en fila con conectores',
          },
          {
            code: '5.7.2.1',
            id: 'vertical',
            label: 'Vertical',
            hint: 'Pasos apilados con línea izquierda',
          },
          {
            code: '5.7.3.1',
            id: 'progress',
            label: 'Progreso',
            hint: 'Barra de progreso con puntos',
          },
        ],
      },
      {
        id: 'tree-explorer',
        code: '5.8',
        label: 'Explorador de archivos',
        tagline: 'Árbol de proyecto con carpetas, teclado y vista previa',
        selector: 'app-nav-tree-explorer',
        className: 'TreeExplorerComponent',
        sourcePath: 'src/app/components/navigation/tree-explorer',
        variants: [
          {
            id: 'midnight',
            code: '5.8.1.1',
            label: 'Terminal oscura',
            hint: 'Abre carpetas con las flechas y selecciona archivos',
          },
          {
            id: 'paper',
            code: '5.8.2.1',
            label: 'Papel claro',
            hint: 'Explorador claro con navegación jerárquica y vista previa',
          },
        ],
      },
    ],
  },
  {
    id: 'forms',
    code: '6',
    label: 'Forms',
    icon: 'forms',
    accent: '#f59e0b',
    tagline: 'Inputs de vidrio, toggles y checkboxes accesibles',
    components: [
      {
        id: 'glass-input',
        code: '6.1',
        label: 'Glass Input',
        tagline: 'Inputs con estilo glassmorphism',
        selector: 'app-form-glass-input',
        className: 'GlassInputComponent',
        sourcePath: 'src/app/components/forms/glass-input',
        requiresForms: true,
        variants: [
          {
            code: '6.1.1.1',
            id: 'default',
            label: 'Formulario',
            hint: 'Input, email y textarea con highlight',
          },
        ],
      },
      {
        id: 'toggle',
        code: '6.2',
        label: 'Toggle',
        tagline: 'Interruptores animados con rol switch',
        selector: 'app-form-toggle',
        className: 'ToggleComponent',
        sourcePath: 'src/app/components/forms/toggle',
        variants: [
          {
            code: '6.2.1.1',
            id: 'default',
            label: 'Switches',
            hint: 'aria-checked y navegable por teclado',
          },
        ],
      },
      {
        id: 'checkbox',
        code: '6.3',
        label: 'Checkbox',
        tagline: 'Checkboxes personalizados y accesibles',
        selector: 'app-form-checkbox',
        className: 'CheckboxComponent',
        sourcePath: 'src/app/components/forms/checkbox',
        variants: [
          {
            code: '6.3.1.1',
            id: 'default',
            label: 'Checkboxes',
            hint: 'Con icono de check animado',
          },
        ],
      },
      {
        id: 'segmented',
        code: '6.4',
        label: 'Segmented',
        tagline: 'Selector segmentado con indicador deslizante',
        selector: 'app-form-segmented',
        className: 'SegmentedComponent',
        sourcePath: 'src/app/components/forms/segmented',
        variants: [
          {
            code: '6.4.1.1',
            id: 'glass',
            label: 'Vidrio',
            hint: 'Translúcido con pulgar que se desliza',
          },
          {
            code: '6.4.2.1',
            id: 'solid',
            label: 'Sólido',
            hint: 'Pulgar sólido sobre panel oscuro',
          },
        ],
      },
      {
        id: 'otp',
        code: '6.5',
        label: 'OTP Input',
        tagline: 'Código de verificación con avance automático',
        selector: 'app-form-otp',
        className: 'OtpComponent',
        sourcePath: 'src/app/components/forms/otp',
        requiresForms: false,
        variants: [
          {
            code: '6.5.1.1',
            id: 'boxes',
            label: 'Cajas',
            hint: 'Dígitos en cajas de vidrio con blur',
          },
          {
            code: '6.5.2.1',
            id: 'underline',
            label: 'Subrayado',
            hint: 'Dígitos mono sobre línea de color',
          },
        ],
      },
      {
        id: 'rating',
        code: '6.6',
        label: 'Rating',
        tagline: 'Valoración por estrellas y segmentos',
        selector: 'app-form-rating',
        className: 'RatingComponent',
        sourcePath: 'src/app/components/forms/rating',
        variants: [
          {
            code: '6.6.1.1',
            id: 'stars',
            label: 'Estrellas',
            hint: '5 estrellas con hover dorado',
          },
          {
            code: '6.6.2.1',
            id: 'segments',
            label: 'Segmentos',
            hint: 'Botones 1–5 con etiquetas',
          },
        ],
      },
      {
        id: 'range',
        code: '6.7',
        label: 'Range Slider',
        tagline: 'Selector de rango con pista de degradado',
        selector: 'app-form-range',
        className: 'RangeComponent',
        sourcePath: 'src/app/components/forms/range',
        variants: [
          {
            code: '6.7.1.1',
            id: 'gradient',
            label: 'Degradado',
            hint: 'Pista indigo→rosa con pulgar blanco',
          },
          {
            code: '6.7.2.1',
            id: 'glass',
            label: 'Vidrio',
            hint: 'Pulgar translúcido con borde luminoso',
          },
        ],
      },
      {
        id: 'password-strength',
        code: '6.8',
        label: 'Requisitos de contraseña',
        tagline: 'Campo con validación visual, contador de requisitos y control de visibilidad',
        selector: 'app-form-password-strength',
        className: 'PasswordStrengthComponent',
        sourcePath: 'src/app/components/forms/password-strength',
        variants: [
          {
            id: 'security',
            code: '6.8.1.1',
            label: 'Panel oscuro',
            hint: 'Indicador por segmentos y requisitos en vivo',
          },
          {
            id: 'compact',
            code: '6.8.2.1',
            label: 'Compacto claro',
            hint: 'Validación en una ficha clara de menor altura',
          },
        ],
      },
      {
        id: 'file-drop',
        code: '6.9',
        label: 'Zona para adjuntar archivos',
        tagline: 'Selector local con arrastre, lista y validación de tamaño y formato',
        selector: 'app-form-file-drop',
        className: 'FileDropComponent',
        sourcePath: 'src/app/components/forms/file-drop',
        variants: [
          {
            id: 'documents',
            code: '6.9.1.1',
            label: 'Documentos',
            hint: 'Adjunta PDF, CSV y XLSX y revisa el tamaño',
          },
          {
            id: 'images',
            code: '6.9.2.1',
            label: 'Imágenes',
            hint: 'Selecciona imágenes en una zona de arrastre oscura',
          },
        ],
      },
    ],
  },
  {
    id: 'modals',
    code: '7',
    label: 'Modals',
    icon: 'modals',
    accent: '#3b82f6',
    tagline: 'Modal de vidrio y panel lateral con foco gestionado',
    components: [
      {
        id: 'glass-modal',
        code: '7.1',
        label: 'Glass Modal',
        tagline: 'Modal glassmorphism con Escape y click fuera',
        selector: 'app-modal-glass',
        className: 'GlassModalComponent',
        sourcePath: 'src/app/components/modals/glass-modal',
        variants: [
          {
            id: 'default',
            code: '7.1.1.1',
            label: 'Modal',
            hint: 'Se abre dentro del entorno, no sobre toda la app',
          },
        ],
      },
      {
        id: 'slide-in',
        code: '7.2',
        label: 'Slide-in Panel',
        tagline: 'Panel lateral con animación de entrada',
        selector: 'app-modal-slide-in',
        className: 'SlideInModalComponent',
        sourcePath: 'src/app/components/modals/slide-in',
        variants: [
          {
            id: 'default',
            code: '7.2.1.1',
            label: 'Panel lateral',
            hint: 'Entra desde la derecha, cierra con Escape',
          },
        ],
      },
      {
        id: 'command-palette',
        code: '7.3',
        label: 'Command Palette',
        tagline: 'Paleta translúcida con búsqueda y teclado',
        selector: 'app-modal-palette',
        className: 'CommandPaletteComponent',
        sourcePath: 'src/app/components/modals/command-palette',
        variants: [
          {
            id: 'default',
            code: '7.3.1.1',
            label: 'Paleta de comandos',
            hint: 'Flechas para moverse, Enter para ejecutar, Escape para cerrar',
          },
        ],
      },
      {
        id: 'confirm',
        code: '7.4',
        label: 'Confirm Dialog',
        tagline: 'Diálogo de confirmación con peligro y vidrio',
        selector: 'app-modal-confirm',
        className: 'ConfirmModalComponent',
        sourcePath: 'src/app/components/modals/confirm',
        variants: [
          {
            code: '7.4.1.1',
            id: 'danger',
            label: 'Peligro',
            hint: 'Acento rojo con icono de advertencia',
          },
          { code: '7.4.2.1', id: 'glass', label: 'Vidrio', hint: 'Panel translúcido con blur' },
        ],
      },
      {
        id: 'bottom-sheet',
        code: '7.5',
        label: 'Bottom Sheet',
        tagline: 'Panel inferior con manija y acciones',
        selector: 'app-modal-sheet',
        className: 'BottomSheetComponent',
        sourcePath: 'src/app/components/modals/bottom-sheet',
        variants: [
          { code: '7.5.1.1', id: 'solid', label: 'Sólido', hint: 'Panel oscuro desde abajo' },
          { code: '7.5.2.1', id: 'glass', label: 'Vidrio', hint: 'Panel translúcido con blur' },
        ],
      },
      {
        id: 'lightbox',
        code: '7.6',
        label: 'Lightbox',
        tagline: 'Visor de fotos con prev/next y vidrio',
        selector: 'app-modal-lightbox',
        className: 'LightboxComponent',
        sourcePath: 'src/app/components/modals/lightbox',
        variants: [
          { code: '7.6.1.1', id: 'photo', label: 'Foto', hint: 'Visor oscuro con flechas' },
          {
            code: '7.6.2.1',
            id: 'glass',
            label: 'Vidrio',
            hint: 'Miniaturas con efecto de vidrio',
          },
        ],
      },
      {
        id: 'report-wizard',
        code: '7.7',
        label: 'Asistente de informes',
        tagline: 'Diálogo con formulario, validación y revisión de la solicitud',
        selector: 'app-modal-report-wizard',
        className: 'ReportWizardComponent',
        sourcePath: 'src/app/components/modals/report-wizard',
        variants: [
          {
            id: 'paper',
            code: '7.7.1.1',
            label: 'Papel claro',
            hint: 'Configura área y periodo y revisa los datos antes de solicitar',
          },
          {
            id: 'night',
            code: '7.7.2.1',
            label: 'Verde nocturno',
            hint: 'Asistente oscuro con diálogo nativo y confirmación',
          },
        ],
      },
      {
        id: 'share-access',
        code: '7.8',
        label: 'Compartir acceso',
        tagline: 'Gestiona colaboradores, permisos y el enlace de un documento',
        selector: 'app-modal-share-access',
        className: 'ShareAccessComponent',
        sourcePath: 'src/app/components/modals/share-access',
        variants: [
          {
            id: 'studio',
            code: '7.8.1.1',
            label: 'Estudio violeta',
            hint: 'Agrega colaboradores, cambia sus permisos y copia el enlace',
          },
          {
            id: 'paper',
            code: '7.8.2.1',
            label: 'Papel claro',
            hint: 'Gestiona el acceso desde un diálogo en tonos claros',
          },
        ],
      },
    ],
  },
  {
    id: 'themes',
    code: '8',
    label: 'Themes',
    icon: 'themes',
    accent: '#f43f5e',
    tagline: 'Cinco temas completos basados en variables CSS',
    components: [
      {
        id: 'dark',
        code: '8.1',
        label: 'Dark',
        tagline: 'Paleta completa para modo oscuro',
        selector: 'app-theme-dark',
        className: 'ThemeDarkComponent',
        sourcePath: 'src/app/components/themes/dark',
        variants: [
          { code: '8.1.1.1', id: 'surfaces', label: 'Superficies', hint: 'Fondos y capas' },
          { code: '8.1.2.1', id: 'accent', label: 'Acento', hint: 'Indigo de marca' },
          { code: '8.1.3.1', id: 'neutrals', label: 'Neutros', hint: 'Escala de grises' },
        ],
      },
      {
        id: 'light',
        code: '8.2',
        label: 'Light',
        tagline: 'Paleta limpia para modo claro',
        selector: 'app-theme-light',
        className: 'ThemeLightComponent',
        sourcePath: 'src/app/components/themes/light',
        variants: [
          {
            code: '8.2.1.1',
            id: 'surfaces',
            label: 'Superficies',
            hint: 'Blancos y grises claros',
          },
          { code: '8.2.2.1', id: 'accent', label: 'Acento', hint: 'Azules de marca' },
          { code: '8.2.3.1', id: 'neutrals', label: 'Neutros', hint: 'Texto y bordes' },
        ],
      },
      {
        id: 'hacker',
        code: '8.3',
        label: 'Hacker',
        tagline: 'Estilo Matrix / terminal verde sobre negro',
        selector: 'app-theme-hacker',
        className: 'ThemeHackerComponent',
        sourcePath: 'src/app/components/themes/hacker',
        variants: [
          {
            code: '8.3.1.1',
            id: 'terminal',
            label: 'Terminal',
            hint: 'Simulación de shell con cursor',
          },
          { code: '8.3.2.1', id: 'palette', label: 'Paleta', hint: 'Verdes fosforescentes' },
        ],
      },
      {
        id: 'cyberpunk',
        code: '8.4',
        label: 'Cyberpunk',
        tagline: 'Futurista con neón rosa, cyan y amarillo',
        selector: 'app-theme-cyberpunk',
        className: 'ThemeCyberpunkComponent',
        sourcePath: 'src/app/components/themes/cyberpunk',
        variants: [
          {
            code: '8.4.1.1',
            id: 'glitch',
            label: 'Título glitch',
            hint: 'Texto con desplazamiento RGB',
          },
          { code: '8.4.2.1', id: 'subtitle', label: 'Subtítulo', hint: 'Línea monoespaciada' },
          { code: '8.4.3.1', id: 'palette', label: 'Paleta', hint: 'Neones saturados' },
        ],
      },
      {
        id: 'corporate',
        code: '8.5',
        label: 'Corporate',
        tagline: 'Profesional y sobrio para empresas',
        selector: 'app-theme-corporate',
        className: 'ThemeCorporateComponent',
        sourcePath: 'src/app/components/themes/corporate',
        variants: [
          { code: '8.5.1.1', id: 'header', label: 'Cabecera', hint: 'Logo y jerarquía' },
          { code: '8.5.2.1', id: 'palette', label: 'Paleta', hint: 'Azules corporativos y grises' },
        ],
      },
      {
        id: 'editorial',
        code: '8.6',
        label: 'Tema editorial',
        tagline: 'Bitácora con tipografía editorial, lectura y marcadores locales',
        selector: 'app-theme-editorial',
        className: 'EditorialThemeComponent',
        sourcePath: 'src/app/components/themes/editorial',
        variants: [
          {
            id: 'paper',
            code: '8.6.1.1',
            label: 'Papel cálido',
            hint: 'Consulta la bitácora y guarda artículos sobre una superficie clara',
          },
          {
            id: 'night',
            code: '8.6.2.1',
            label: 'Lectura nocturna',
            hint: 'Explora la misma bitácora en verde oscuro',
          },
        ],
      },
    ],
  },
  {
    id: 'animations',
    code: '9',
    label: 'Animations',
    icon: 'animations',
    accent: '#a78bfa',
    tagline: 'Skeleton, spinner, giro de página, libro 3D, esquina doblada y marquee',
    components: [
      {
        id: 'skeleton',
        code: '9.1',
        label: 'Skeleton',
        tagline: 'Estados de carga con shimmer, pulso y onda',
        selector: 'app-anim-skeleton',
        className: 'SkeletonComponent',
        sourcePath: 'src/app/components/animations/skeleton',
        variants: [
          {
            id: 'shimmer',
            code: '9.1.1.1',
            label: 'Shimmer',
            hint: 'Brillo que se desplaza de izquierda a derecha',
          },
          {
            code: '9.1.2.1',
            id: 'pulse',
            label: 'Pulso',
            hint: 'Opacidad que sube y baja suavemente',
          },
          {
            code: '9.1.3.1',
            id: 'wave',
            label: 'Onda',
            hint: 'Ola azul que avanza por las líneas',
          },
        ],
      },
      {
        id: 'spinner',
        code: '9.2',
        label: 'Spinner',
        tagline: 'Indicadores de carga: anillo, puntos y barra',
        selector: 'app-anim-spinner',
        className: 'SpinnerComponent',
        sourcePath: 'src/app/components/animations/spinner',
        variants: [
          {
            code: '9.2.1.1',
            id: 'ring',
            label: 'Anillo',
            hint: 'Círculo que gira con borde de color',
          },
          { code: '9.2.2.1', id: 'dots', label: 'Puntos', hint: 'Tres puntos que rebotan' },
          { code: '9.2.3.1', id: 'bar', label: 'Barra', hint: 'Barra con degradado que avanza' },
        ],
      },
      {
        id: 'page-flip',
        code: '9.3',
        label: 'Page Flip',
        tagline: 'Giro de página individual con bisagra lateral y perspectiva 3D',
        selector: 'app-anim-page-flip',
        className: 'PageFlipComponent',
        sourcePath: 'src/app/components/animations/page-flip',
        variants: [
          {
            code: '9.3.1.1',
            id: 'card',
            label: 'Tarjeta',
            hint: 'Hoja interactiva frontal y reverso con click',
          },
          {
            id: 'editorial',
            code: '9.3.2.1',
            label: 'Editorial',
            hint: 'Estilo página de revista con tipografía y número',
          },
          {
            code: '9.3.3.1',
            id: 'glossy',
            label: 'Brillo',
            hint: 'Efecto satinado con reflejo de luz al voltear',
          },
        ],
      },
      {
        id: 'book-flip',
        code: '9.4',
        label: 'Book Flip',
        tagline: 'Libro abierto interactivo con paso de páginas bidireccional y lomo 3D',
        selector: 'app-anim-book-flip',
        className: 'BookFlipComponent',
        sourcePath: 'src/app/components/animations/book-flip',
        variants: [
          {
            id: 'classic',
            code: '9.4.1.1',
            label: 'Clásico',
            hint: 'Lomo realista, sombras de pliegue y navegación completa',
          },
          {
            id: 'notebook',
            code: '9.4.2.1',
            label: 'Cuaderno',
            hint: 'Estilo cuadrícula con tipografía monoespaciada',
          },
          {
            code: '9.4.3.1',
            id: 'parchment',
            label: 'Pergamino',
            hint: 'Tono editorial cálido y bordes dorados',
          },
        ],
      },
      {
        id: 'corner-fold',
        code: '9.5',
        label: 'Corner Fold',
        tagline: 'Dobla la esquina del papel y revela la superficie inferior',
        selector: 'app-anim-corner-fold',
        className: 'CornerFoldComponent',
        sourcePath: 'src/app/components/animations/corner-fold',
        sceneControls: true,
        variants: [
          {
            id: 'note',
            code: '9.5.1.1',
            label: 'Nota',
            hint: 'Arrastra el doblez diagonal y descubre el reverso de la nota',
          },
          {
            id: 'document',
            code: '9.5.2.1',
            label: 'Documento',
            hint: 'Levanta la esquina del acta para revelar el sello de muestra',
          },
          {
            id: 'peel',
            code: '9.5.3.1',
            label: 'Despegue',
            hint: 'Despega la etiqueta y observa el reverso curvado y su sombra',
          },
        ],
      },
      {
        id: 'marquee',
        code: '9.6',
        label: 'Marquee',
        tagline: 'Desplazamiento horizontal infinito, sin cortes ni saltos',
        selector: 'app-anim-marquee',
        className: 'MarqueeComponent',
        sourcePath: 'src/app/components/animations/marquee',
        variants: [
          {
            id: 'text',
            code: '9.6.1.1',
            label: 'Texto',
            hint: 'Palabras en loop con separadores y estilos alternados',
          },
          {
            id: 'dual',
            code: '9.6.2.1',
            label: 'Bidireccional',
            hint: 'Dos filas en direcciones opuestas a distinta velocidad',
          },
          {
            id: 'logos',
            code: '9.6.3.1',
            label: 'Logos',
            hint: 'Fila de marcas que se pausa al pasar el cursor',
          },
        ],
      },
      {
        id: 'count-up',
        code: '9.7',
        label: 'Contador animado',
        tagline: 'Anima cantidades y porcentajes con opción de repetir',
        selector: 'app-anim-count-up',
        className: 'CountUpComponent',
        sourcePath: 'src/app/components/animations/count-up',
        sceneControls: true,
        variants: [
          {
            id: 'fulfillment',
            code: '9.7.1.1',
            label: 'Pedidos despachados',
            hint: 'Reproduce un conteo entero con barra de progreso',
          },
          {
            id: 'conversion',
            code: '9.7.2.1',
            label: 'Tasa de conversión',
            hint: 'Anima el valor de un porcentaje con decimales',
          },
        ],
      },
    ],
  },
  {
    id: 'charts',
    code: '10',
    label: 'Charts',
    icon: 'charts',
    accent: '#06b6d4',
    tagline: 'Gráficos interactivos animados con GSAP y renderizado SVG/Canvas reactivo',
    components: [
      {
        id: 'line-chart',
        code: '10.1',
        label: 'Line Chart',
        tagline: 'Trazados continuos, áreas degradadas y puntos animados con GSAP',
        selector: 'app-chart-line',
        className: 'LineChartComponent',
        npmInstall: ['npm install gsap@^3.15.1'],
        sourcePath: 'src/app/components/charts/line-chart',
        variants: [
          {
            id: 'smooth',
            code: '10.1.1.1',
            label: 'Curva Spline',
            hint: 'Curva Bézier continua con área degradada y trazado GSAP',
          },
          {
            id: 'cyber',
            code: '10.1.2.1',
            label: 'Cyber Stepped',
            hint: 'Línea escalonada digital tech con radar scan y grid',
          },
          {
            id: 'multi',
            code: '10.1.3.1',
            label: 'Doble Serie',
            hint: 'Series comparativas superpuestas con leyenda y tooltips',
          },
        ],
      },
      {
        id: 'bar-chart',
        code: '10.2',
        label: 'Bar Chart',
        tagline: 'Barras elásticas con rebote GSAP, glassmorphism y contadores numéricos',
        selector: 'app-chart-bar',
        className: 'BarChartComponent',
        npmInstall: ['npm install gsap@^3.15.1'],
        sourcePath: 'src/app/components/charts/bar-chart',
        variants: [
          {
            id: 'columns',
            code: '10.2.1.1',
            label: 'Columnas Neón',
            hint: 'Columnas verticales con rebote elástico y contador numérico',
          },
          {
            id: 'glass',
            code: '10.2.2.1',
            label: 'Cristal Glass',
            hint: 'Barras translúcidas con reflejos especulares y blur',
          },
          {
            id: 'horizontal',
            code: '10.2.3.1',
            label: 'Progreso Ranking',
            hint: 'Barras horizontales fluidas ideales para métricas y rankings',
          },
        ],
      },
      {
        id: 'histogram',
        code: '10.3',
        label: 'Histogram',
        tagline: 'Distribución de frecuencias estadísticas, campana de Gauss y ojivas con GSAP',
        selector: 'app-chart-histogram',
        className: 'HistogramComponent',
        npmInstall: ['npm install gsap@^3.15.1'],
        sourcePath: 'src/app/components/charts/histogram',
        variants: [
          {
            id: 'gauss',
            code: '10.3.1.1',
            label: 'Gauss Normal',
            hint: 'Campana de Gauss con ajuste de densidad normal suave vía GSAP',
          },
          {
            id: 'bins',
            code: '10.3.2.1',
            label: 'Bins de Frecuencia',
            hint: 'Bins discretos con gradientes de densidad según frecuencia',
          },
          {
            id: 'cumulative',
            code: '10.3.3.1',
            label: 'Ojiva Acumulada',
            hint: 'Curva sigmoide de distribución acumulativa y percentiles',
          },
        ],
      },
      {
        id: 'donut-chart',
        code: '10.4',
        label: 'Donut & Gauge',
        tagline: 'Indicadores radiales proporcionales, anillos de neón y velocímetro semicircular',
        selector: 'app-chart-donut',
        className: 'DonutChartComponent',
        npmInstall: ['npm install gsap@^3.15.1'],
        sourcePath: 'src/app/components/charts/donut-chart',
        variants: [
          {
            id: 'ring',
            code: '10.4.1.1',
            label: 'Anillo Neón',
            hint: 'Anillo radial continuo con porcentaje central animado y glow',
          },
          {
            id: 'gauge',
            code: '10.4.2.1',
            label: 'Semi-Gauge',
            hint: 'Velocímetro / tacómetro de 180° con rebote elástico vía GSAP',
          },
          {
            id: 'segmented',
            code: '10.4.3.1',
            label: 'Dona Segmentada',
            hint: 'Múltiples rebanadas categóricas proporcionales con leyenda reactiva',
          },
        ],
      },
      {
        id: 'radar-chart',
        code: '10.5',
        label: 'Radar & Spider',
        tagline: 'Análisis multiaxial hexagonal, polígonos de aptitudes y escáner sonar cyber',
        selector: 'app-chart-radar',
        className: 'RadarChartComponent',
        npmInstall: ['npm install gsap@^3.15.1'],
        sourcePath: 'src/app/components/charts/radar-chart',
        variants: [
          {
            id: 'polygon',
            code: '10.5.1.1',
            label: 'Polígono Cyber',
            hint: 'Polígono radial hexagonal con rebote elástico en vértices vía GSAP',
          },
          {
            id: 'dual',
            code: '10.5.2.1',
            label: 'Comparativa Dual',
            hint: 'Dos perfiles superpuestos A vs B con áreas semitransparentes',
          },
          {
            id: 'scanner',
            code: '10.5.3.1',
            label: 'Escáner Sonar',
            hint: 'Barrido rotatorio continuo 360° con nodos de datos iluminados',
          },
        ],
      },
      {
        id: 'waterfall-chart',
        code: '10.6',
        label: 'Gráfico de cascada',
        tagline: 'Desglosa el cambio del saldo entre aumentos y reducciones seleccionables',
        selector: 'app-chart-waterfall',
        className: 'WaterfallChartComponent',
        sourcePath: 'src/app/components/charts/waterfall-chart',
        variants: [
          {
            id: 'finance',
            code: '10.6.1.1',
            label: 'Flujo financiero',
            hint: 'Rastrea el impacto de ventas y gastos en el saldo',
          },
          {
            id: 'inventory',
            code: '10.6.2.1',
            label: 'Movimientos de inventario',
            hint: 'Compara compras, salidas, retornos y mermas',
          },
        ],
      },
    ],
  },
  {
    id: 'feedback',
    code: '11',
    label: 'Feedback',
    icon: 'feedback',
    accent: '#f43f5e',
    tagline: 'Microinteracciones, islas dinámicas, toasts apilables y efectos de celebración',
    components: [
      {
        id: 'dynamic-island',
        code: '11.1',
        label: 'Dynamic Island',
        tagline: 'Cápsula flotante interactiva expandible con estados de música, timer y llamadas',
        selector: 'app-dynamic-island',
        className: 'DynamicIslandComponent',
        npmInstall: ['npm install gsap@^3.15.1'],
        sourcePath: 'src/app/components/feedback/dynamic-island',
        variants: [
          {
            id: 'music',
            code: '11.1.1.1',
            label: 'Player Música',
            hint: 'Mini reproductor con ecualizador animado y controles expandibles',
          },
          {
            id: 'timer',
            code: '11.1.2.1',
            label: 'Timer de Enfoque',
            hint: 'Temporizador con cuenta regresiva circular y barra de progreso',
          },
          {
            id: 'call',
            code: '11.1.3.1',
            label: 'Llamada Entrante',
            hint: 'Alerta de llamada con pulso de estado y botones de acción',
          },
        ],
      },
      {
        id: 'toast',
        code: '11.2',
        label: 'Stacked Toast',
        tagline: 'Notificaciones flotantes apiladas en cascada 3D con descarte táctil',
        selector: 'app-toast-stack',
        className: 'ToastComponent',
        sourcePath: 'src/app/components/feedback/toast',
        variants: [
          {
            id: 'stacked',
            code: '11.2.1.1',
            label: 'Pila 3D',
            hint: 'Notificaciones apiladas en perspectiva con descarte interactivo',
          },
          {
            id: 'swipe',
            code: '11.2.2.1',
            label: 'Swipe Descarte',
            hint: 'Descarte lateral de notificaciones con feedback táctil',
          },
          {
            id: 'morph',
            code: '11.2.3.1',
            label: 'Morph Check',
            hint: 'Transición morphing de spinner a checkmark de éxito animado',
          },
        ],
      },
      {
        id: 'confetti',
        code: '11.3',
        label: 'Confetti & Bursts',
        tagline: 'Explosiones de partículas y confeti Canvas 2D a 60 FPS para celebraciones',
        selector: 'app-confetti-burst',
        className: 'ConfettiComponent',
        sourcePath: 'src/app/components/feedback/confetti',
        variants: [
          {
            id: 'explosion',
            code: '11.3.1.1',
            label: 'Explosión Radial',
            hint: 'Estallido radial de 110 partículas multicolor con física de gravedad',
          },
          {
            id: 'cannons',
            code: '11.3.2.1',
            label: 'Doble Cañón',
            hint: 'Disparo cruzado en arco desde las esquinas inferiores',
          },
          {
            id: 'fireworks',
            code: '11.3.3.1',
            label: 'Fuegos Artificiales',
            hint: 'Estallidos múltiples en cascada superior con estelas luminosas',
          },
        ],
      },
      {
        id: 'task-progress',
        code: '11.4',
        label: 'Progreso por etapas',
        tagline: 'Muestra el avance de una tarea con cancelación y reinicio',
        selector: 'app-feedback-task-progress',
        className: 'TaskProgressComponent',
        sourcePath: 'src/app/components/feedback/task-progress',
        variants: [
          {
            id: 'report',
            code: '11.4.1.1',
            label: 'Generar informe',
            hint: 'Sigue la generación simulada de un informe',
          },
          {
            id: 'sync',
            code: '11.4.2.1',
            label: 'Sincronizar inventario',
            hint: 'Sigue las etapas de una sincronización de existencias',
          },
        ],
      },
    ],
  },
  {
    id: 'media-3d',
    code: '12',
    label: 'Media & 3D',
    icon: 'media-3d',
    accent: '#8b5cf6',
    tagline:
      'Experiencias inmersivas, giroscopio 3D, comparadores visuales y visualizadores de audio',
    components: [
      {
        id: 'tilt-card',
        code: '12.1',
        label: 'Tilt Card 3D',
        tagline:
          'Tarjeta con inclinación 3D en tiempo real siguiendo el cursor con inercia y brillo',
        selector: 'app-media-tilt-card',
        className: 'TiltCardComponent',
        sourcePath: 'src/app/components/media-3d/tilt-card',
        variants: [
          {
            id: 'gyro',
            code: '12.1.1.1',
            label: 'Giroscopio 3D',
            hint: 'Inclinación reactiva según el puntero con reflejo especular dinámico',
          },
          {
            id: 'layers',
            code: '12.1.2.1',
            label: 'Capas Parallax Z',
            hint: 'Capas desacopladas flotando en el eje Z con sensación de profundidad',
          },
          {
            id: 'hologram',
            code: '12.1.3.1',
            label: 'Prisma Holográfico',
            hint: 'Gradiente iridiscente que muta de tono según el ángulo de inclinación',
          },
        ],
      },
      {
        id: 'before-after',
        code: '12.2',
        label: 'Before & After',
        tagline:
          'Compara la estructura y el acabado de una misma pieza con divisor, fundido o barrido',
        selector: 'app-media-before-after',
        className: 'BeforeAfterComponent',
        sourcePath: 'src/app/components/media-3d/before-after',
        sceneControls: true,
        variants: [
          {
            id: 'split',
            code: '12.2.1.1',
            label: 'Split Slider',
            hint: 'Arrastra el divisor o usa el control para revelar el acabado',
          },
          {
            id: 'fade',
            code: '12.2.2.1',
            label: 'Cross-Fade',
            hint: 'Mezcla la estructura y el acabado de la misma pieza',
          },
          {
            id: 'scanner',
            code: '12.2.3.1',
            label: 'Escáner Automático',
            hint: 'Explora la pieza con un barrido automático que puedes pausar',
          },
        ],
      },
      {
        id: 'audio-visualizer',
        code: '12.3',
        label: 'Audio Visualizer',
        tagline: 'Ecualizador de ondas sonoras y barras de neón a 60 FPS con Canvas 2D',
        selector: 'app-media-audio-visualizer',
        className: 'AudioVisualizerComponent',
        sourcePath: 'src/app/components/media-3d/audio-visualizer',
        variants: [
          {
            id: 'bars',
            code: '12.3.1.1',
            label: 'Ecualizador Estéreo',
            hint: '32 bandas de frecuencia con oscilación reactiva y reflejo de piso',
          },
          {
            id: 'radial',
            code: '12.3.2.1',
            label: 'Anillos de Pulso',
            hint: 'Ondas circulares concéntricas de pulso radial acústico',
          },
          {
            id: 'wave',
            code: '12.3.3.1',
            label: 'Onda Sinusoidal',
            hint: 'Trazado continuo suave con oscilación espectral y resplandor neón',
          },
        ],
      },
      {
        id: 'three-scenes',
        code: '12.4',
        label: 'Escenas Three.js',
        tagline: 'Escenas WebGL 2 con iluminación, cámara orbital y control de animación',
        selector: 'app-media-three-scenes',
        className: 'ThreeScenesComponent',
        sourcePath: 'src/app/components/media-3d/three-scenes',
        sceneControls: true,
        npmInstall: ['npm install three@^0.184.0', 'npm install -D @types/three@^0.184.1'],
        variants: [
          {
            id: 'sculpture',
            code: '12.4.1.1',
            label: 'Nudo escultórico',
            hint: 'Nudo toroidal giratorio con iluminación cálida y contraluz',
          },
          {
            id: 'orbit',
            code: '12.4.2.1',
            label: 'Anillos orbitales',
            hint: 'Tres satélites recorren órbitas inclinadas alrededor de un núcleo facetado',
          },
          {
            id: 'waves',
            code: '12.4.3.1',
            label: 'Campo de ondas',
            hint: 'Una onda radial recorre 289 columnas renderizadas con InstancedMesh',
          },
          {
            id: 'dunes',
            code: '12.4.4.1',
            label: 'Dunas de luz',
            hint: 'Una superficie ondulante combina relieve iluminado y una malla de alambre',
          },
          {
            id: 'nebula',
            code: '12.4.5.1',
            label: 'Nebulosa espiral',
            hint: '1 800 partículas forman cuatro brazos alrededor de un núcleo luminoso',
          },
          {
            id: 'helix',
            code: '12.4.6.1',
            label: 'Doble hélice',
            hint: 'Dos hebras de esferas facetadas giran alrededor de un eje común',
          },
          {
            id: 'tiles',
            code: '12.4.7.1',
            label: 'Mosaico cinético',
            hint: '81 baldosas se levantan y giran siguiendo una onda diagonal',
          },
          {
            id: 'pendulums',
            code: '12.4.8.1',
            label: 'Onda de péndulos',
            hint: 'Trece péndulos de distintas longitudes forman patrones al oscilar',
          },
          {
            id: 'light-trails',
            code: '12.4.9.1',
            label: 'Trayectorias de luz',
            hint: 'Tres puntos luminosos recorren curvas cerradas en el espacio',
          },
          {
            id: 'exploded',
            code: '12.4.10.1',
            label: 'Ensamble en despiece',
            hint: 'Las piezas de un rotor se separan y vuelven a ensamblarse mientras giran',
          },
          {
            id: 'warehouse',
            code: '12.4.11.1',
            label: 'Almacén interactivo',
            hint: 'Dos camiones entran y salen por muelles distintos. Selecciona un camión o una zona',
          },
          {
            id: 'sales',
            code: '12.4.12.1',
            label: 'Embudo comercial',
            hint: 'Embudo con anillos abiertos, partículas y cifras de prospectos, propuestas y cierres',
          },
          {
            id: 'teams',
            code: '12.4.13.1',
            label: 'Mapa de equipos',
            hint: 'Campus colaborativo con puestos ultrawide, tablero Kanban de talento y lounge biofílico',
          },
          {
            id: 'negotiation',
            code: '12.4.14.1',
            label: 'Sala de negociación',
            hint: 'Sala de ventas con pantalla de cotización y propuesta que se mueve entre las dos partes',
          },
          {
            id: 'delivery',
            code: '12.4.15.1',
            label: 'Ruta de entrega',
            hint: 'Furgoneta con ruedas animadas que reparte pedidos al mercado, al café o a la farmacia',
          },
          {
            id: 'showroom',
            code: '12.4.16.1',
            label: 'Catálogo de productos',
            hint: 'Escaparate de tienda con productos modelados, precios y vitrina que gira hacia tu selección',
          },
          {
            id: 'office',
            code: '12.4.17.1',
            label: 'Equipo y áreas',
            hint: 'Espacios de oficina divididos para Talento, Desarrollo y Bienestar',
          },
          {
            id: 'onboarding',
            code: '12.4.18.1',
            label: 'Recorrido de incorporación',
            hint: 'Recorrido interactivo con avatar que se desplaza entre cuatro estaciones de bienvenida',
          },
          {
            id: 'team-calendar',
            code: '12.4.19.1',
            label: 'Agenda de equipo',
            hint: 'Agenda semanal 3D con bloques de citas interactivos y reprogramación visual',
          },
          {
            id: 'cash-flow',
            code: '12.4.20.1',
            label: 'Flujo de caja',
            hint: 'Simulación de flujo de caja con columnas de liquidez y monedas circulando en tiempo real',
          },
          {
            id: 'financial-board',
            code: '12.4.21.1',
            label: 'Panel financiero',
            hint: 'Bóveda, mesa de operaciones con gráficos de ejemplo y servidores de auditoría',
          },
          {
            id: 'budget',
            code: '12.4.22.1',
            label: 'Distribución de presupuesto',
            hint: 'Barras de presupuesto proporcionales que se redistribuyen según el escenario seleccionado',
          },
          {
            id: 'checkout',
            code: '12.4.23.1',
            label: 'Caja y punto de venta',
            hint: 'Mostrador con cinta y lector. Escanea un pedido, cobra y emite el recibo',
          },
          {
            id: 'bodega',
            code: '12.4.24.1',
            label: 'Bodega de barrio',
            hint: 'Visita comercial a una bodega. Revisa el surtido, registra el pedido y entrega las cajas',
          },
        ],
      },
      {
        id: 'three-login',
        code: '12.5',
        label: 'Login 3D',
        tagline:
          'Formulario de acceso con fondo animado, validación y conexión a tu servicio de sesión',
        selector: 'app-media-three-login',
        className: 'ThreeLoginComponent',
        sourcePath: 'src/app/components/media-3d/three-login',
        supportingFolders: ['src/app/components/media-3d/three-scenes'],
        sceneControls: true,
        npmInstall: ['npm install three@^0.184.0', 'npm install -D @types/three@^0.184.1'],
        variants: [
          {
            id: 'waves',
            code: '12.5.1.1',
            label: 'Acceso con ondas',
            hint: 'Formulario junto al campo de ondas 3D en color menta',
          },
          {
            id: 'nebula',
            code: '12.5.2.1',
            label: 'Acceso con nebulosa',
            hint: 'Partículas en espiral con una paleta violeta',
          },
          {
            id: 'tiles',
            code: '12.5.3.1',
            label: 'Acceso con mosaico',
            hint: 'Baldosas animadas sobre un fondo azul',
          },
          {
            id: 'operations',
            code: '12.5.4.1',
            label: 'Acceso de Operaciones',
            hint: 'Portal de inventario y despachos con almacén isométrico y camiones en movimiento',
          },
          {
            id: 'commercial',
            code: '12.5.5.1',
            label: 'Acceso Comercial',
            hint: 'Portal comercial con embudo de conversión cónico 3D y flujo de prospectos',
          },
          {
            id: 'finance',
            code: '12.5.6.1',
            label: 'Acceso Financiero',
            hint: 'Portal financiero con bóveda de lingotes de oro, trading con velas 3D y servidores',
          },
          {
            id: 'hr',
            code: '12.5.7.1',
            label: 'Acceso de RR. HH.',
            hint: 'Portal de talento con estaciones ágiles ultrawide, muro Kanban y lounge biofílico',
          },
        ],
      },
    ],
  },
  {
    id: 'workflows',
    code: '13',
    label: 'Flujos de trabajo',
    icon: 'workflows',
    accent: '#6fbc9b',
    tagline: 'Pantallas interactivas para practicar tareas de principio a fin',
    components: [
      {
        id: 'order-workbench',
        code: '13.1',
        label: 'Mesa de pedidos',
        tagline:
          'Filtra pedidos, revisa sus productos y avanza cada uno por las etapas de despacho',
        selector: 'app-workflow-order-workbench',
        className: 'OrderWorkbenchComponent',
        sourcePath: 'src/app/components/workflows/order-workbench',
        variants: [
          {
            id: 'warehouse',
            code: '13.1.1.1',
            label: 'Despacho de almacén',
            hint: 'Prepara pedidos y registra su salida',
          },
          {
            id: 'retail',
            code: '13.1.2.1',
            label: 'Reposición de bodegas',
            hint: 'Revisa los pedidos de una bodega y administra su despacho',
          },
        ],
      },
      {
        id: 'replenishment-flow',
        code: '13.2',
        label: 'Reposición conectada',
        tagline: 'Pasa de un faltante en inventario a un pedido y registra su recepción',
        selector: 'app-workflow-replenishment-flow',
        className: 'ReplenishmentFlowComponent',
        sourcePath: 'src/app/components/workflows/replenishment-flow',
        supportingFolders: [
          'src/app/components/data/inventory-table',
          'src/app/components/cards/stock-status',
          'src/app/components/workflows/order-workbench',
        ],
        preserveSourceLayout: true,
        variants: [
          {
            id: 'retail',
            code: '13.2.1.1',
            label: 'Inventario, pedido y recepción',
            hint: 'Solicita reposición, despacha el pedido, recibe las unidades y actualiza el stock',
          },
        ],
      },
    ],
  },
  {
    id: 'data',
    code: '14',
    label: 'Tablas y datos',
    icon: 'data',
    accent: '#74bdb6',
    tagline: 'Herramientas para consultar, filtrar y editar datos de trabajo',
    components: [
      {
        id: 'inventory-table',
        code: '14.1',
        label: 'Inventario por sede',
        tagline: 'Consulta stock por producto y sede, ordénalo y edita las existencias en línea',
        selector: 'app-data-inventory-table',
        className: 'InventoryTableComponent',
        sourcePath: 'src/app/components/data/inventory-table',
        variants: [
          {
            id: 'store',
            code: '14.1.1.1',
            label: 'Inventario por bodega',
            hint: 'Compara el stock de tres bodegas y solicita reposición de productos bajo mínimo',
          },
          {
            id: 'warehouse',
            code: '14.1.2.1',
            label: 'Inventario por almacén',
            hint: 'Filtra existencias por almacén y ajusta cantidades en la tabla',
          },
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
