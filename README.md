# 🎨 AngularCanvas — Diccionario de Estilos y Galería de Efectos

Biblioteca viva de **efectos y diseños para Angular** estructurada como un **Diccionario de Estilos Jerárquico**.  
Cada componente y sub-estilo cuenta con un **código numérico unívoco** (ej. `9.4.2.1`), vive en su propia carpeta (`.ts`, `.html`, `.scss`), y se puede extraer o jalar con una sola instrucción sin ambigüedades.

Construido con **Angular 22** (standalone components, signals, router, `@if` / `@for` y control flow reactivo).

**12 categorías · 68 componentes · 203 sub-estilos indexados · 5 temas.**

> 📖 **Consulta el Diccionario Completo en [DICTIONARY.md](DICTIONARY.md)** con la tabla maestra de todos los códigos `1.1.1.1` al `10.2.3.1`.

---

## 🎯 Protocolo de Códigos de Estilo (Style Dictionary)

Olvídate de descripciones subjetivas como "el libro del medio" o "el botón de la derecha". Ahora cada efecto se invoca con su código decimal jerárquico de 4 niveles:

```
  [Categoría] . [Componente] . [Variante] . [Subvariante]
       │              │             │             │
      (1-9)         (1-N)         (1-N)          (1)
```

- **Uso con Agentes de IA / Copilot**:  
  *"Jala el efecto `9.4.2.1` en color morado"*  
  👉 Resuelve directamente a **Animations > Book Flip > Cuaderno** (`src/app/components/animations/book-flip`, `<app-anim-book-flip variant="notebook" />`).
- **Navegación y búsqueda instantánea**:
  - Desde el navegador: `/code/9.4.2.1` o `/c/9.4.2.1` redirige directo al entorno.
  - En la galería: Presiona `⌘K` o `Ctrl+K` y escribe `9.4` o `9.4.2.1` para saltar inmediatamente.
- **Efecto Único Limpio (Single-Effect Rendering)**:
  - Cada entorno renderiza **exclusivamente el efecto activo**.
  - Si no se especifica variante, se muestra la variante base predeterminada sin encajar 3 efectos distintos en el mismo lienzo.

---

## 🧠 Cómo está pensado

La galería **no es un landing**: es un navegador de entornos.

- **Un componente = un entorno = una vista.** La navegación lateral tiene dos
  niveles (grupo → componente) y no hace scroll: cambia de ruta y monta **un
  solo componente**. Los otros 29 no existen en el DOM mientras miras uno.
- **Cada entorno tiene su URL** (`/cards/neon`, `/cards/neon/blue`): se puede
  compartir, marcar en favoritos y funciona con atrás/adelante del navegador.
- **Cada componente vive en un iframe** (`/embed/...`) dentro de una ventana
  neutra: la ventana solo aporta las herramientas (ancho y código); el diseño
  pone todo lo demás.
- **Dentro de un entorno hay sub-estilos** (variantes): se eligen con los chips
  de la cabecera o con las teclas `1`–`9`, sin ocupar un tercer nivel del
  sidebar. Con `0` se ven todos.
- **El ancho de previsualización es real**: full, tablet (834 px) o móvil
  (390 px) con marco de dispositivo. Al ser un iframe, las `@media` responden a
  ese ancho de verdad, no al de tu pantalla.
- **La galería se navega como un catálogo**: `⌘K` abre el buscador global, el
  sidebar guarda **favoritos y recientes**, cada categoría tiene su acento y la
  tipografía display y mono van self-hosted. El ancho elegido se recuerda entre
  entornos.

Ese aislamiento no es solo visual, es técnico (ver
[Aislamiento](#-aislamiento-y-sub-estilos-más-abajo)): el componente no comparte
documento con la galería, así que ni sus estilos, ni sus `@media`, ni su
`position: fixed` pueden afectar al resto de la interfaz.

---

## 📋 Requisitos

- Node.js 20.19+ / 22.12+ / 24+
- npm 10+

## 🚀 Uso local

```bash
npm install
npm start          # dev server en http://localhost:4200
npm run build      # build de producción en dist/
npm run format     # formatea con Prettier
```

---

## 🗺️ Rutas

| URL | Qué muestra |
| --- | --- |
| `/` | Portada: contadores y tarjetas de las 12 categorías, con chips a cada sub-estilo |
| `/cards/neon` | El entorno `Neon` con todas sus variantes |
| `/cards/neon/blue` | El mismo entorno filtrado a la variante `blue` |
| `/embed/cards/neon/blue` | El componente **solo**, sin galería: es lo que carga el iframe de la ventana |
| `/cards/no-existe` | Aviso de entorno inexistente con vuelta al catálogo |
| `/cards` | Redirige a `/` (una categoría sin componente no tiene página) |

El título de la pestaña sigue al entorno abierto (`Neon — AngularCanvas`).

Dentro de un entorno: `←`/`→` recorren el catálogo, `1`–`9` aíslan un
sub-estilo y `0` vuelve a verlos todos.

---

## 🗂️ Estructura del proyecto

```
public/
└── fonts/                      # Bricolage Grotesque y JetBrains Mono, self-hosted
src/
├── index.html                  # Script anti-flash de tema + preload de fuentes
├── main.ts                     # bootstrapApplication
├── styles.scss                 # Reset, tokens y estilos COMPARTIDOS de la librería
├── scss/
│   ├── _tokens.scss            # Variables CSS de los 5 temas y tipografías
│   └── _gallery.scss           # UI del andamiaje (chips, kbd). NO viaja con los componentes
└── app/
    ├── app.ts                  # Raíz: monta el shell o la vista embed según la ruta
    ├── app.config.ts           # provideRouter + component input binding
    ├── app.routes.ts           # /, /:group/:entry, /:group/:entry/:variant, /embed/…
    ├── core/
    │   ├── catalog/catalog.ts        # FUENTE ÚNICA DE VERDAD (grupos/componentes/variantes)
    │   ├── registry/component-registry.ts  # grupo/componente → clase standalone
    │   ├── library/library.service.ts  # Favoritos y recientes (localStorage)
    │   ├── theme/theme.service.ts    # Cambio de tema + persistencia
    │   ├── ui/icon.component.ts      # Set de iconos del andamiaje (SVG)
    │   └── stage/
    │       ├── stage.component.*     # La ventana neutra: ancho, dispositivo y código
    │       ├── stage-messages.ts     # Canal postMessage con el iframe
    │       ├── stage-width.service.ts # Recuerda el ancho elegido al navegar
    │       └── variant-focus.ts      # Genera el CSS que filtra sub-estilos
    ├── layout/
    │   ├── shell.component.*         # Marco: sidebar, temas, topbar y drawer móvil
    │   ├── nav-tree/nav-tree.component.*  # Navegación de 2 niveles + favoritos/recientes
    │   └── quick-switcher/quick-switcher.component.*  # Buscador global (⌘K)
    ├── views/
    │   ├── home/home.component.*     # Portada: cover aurora y capítulos por categoría
    │   ├── environment/environment.component.*  # Cabecera, chips sticky, atajos y pager
    │   └── embed/embed.component.*   # Documento desnudo que carga el iframe
    └── components/                   # 👈 LA LIBRERÍA (esto es lo que se copia)
        ├── cards/        glassmorphism/  neon/  hover-effects/  flip/
        │                 tilt-3d/  glass-panel/  minimal/  dark-corporate/
        ├── buttons/      glow/  gradient/  neumorphism/  pill/  animated/
        │                 3d/  glass/
        ├── backgrounds/  gradient/  particle/  grid/  animated-mesh/  aurora/
        ├── typography/   glow-text/  gradient-text/  typewriter/  3d-text/
        ├── navigation/   sidebar/  topbar/  dock/  glass-tabs/
        ├── forms/        glass-input/  toggle/  checkbox/  segmented/
        ├── modals/       glass-modal/  slide-in/  command-palette/
        ├── themes/       dark/  light/  hacker/  cyberpunk/  corporate/
        ├── animations/   skeleton/  spinner/  page-flip/  book-flip/  corner-fold/  marquee/
        └── charts/       line-chart/  bar-chart/
```

La separación importa: **`components/` es la librería** (autocontenida, sin
dependencias del andamiaje) y **`core/` + `layout/` + `views/` son la galería**
que la exhibe. Los estilos compartidos de la librería viven en `styles.scss` y
los de la galería en `_gallery.scss`, para que nadie confunda qué se copia.

---

## 🧩 El catálogo (fuente única de verdad)

`src/app/core/catalog/catalog.ts` describe todo: grupos, componentes y sus
sub-estilos. De ahí salen la navegación de 2 niveles, la portada, los contadores,
la ficha de código y **el CSS que filtra las variantes**. No hay una segunda
lista que mantener en sincronía.

```ts
{
  id: 'hover-effects',
  label: 'Hover Effects',
  tagline: 'Diferentes respuestas al pasar el mouse',
  selector: 'app-card-hover',
  className: 'HoverEffectsComponent',
  sourcePath: 'src/app/components/cards/hover-effects',
  variants: [
    { id: 'lift', label: 'Lift', hint: 'Elevación suave con sombra creciente' },
    { id: 'magnetic', label: 'Magnetic', hint: 'Sigue el cursor con efecto magnético' },
    // …
  ],
}
```

### ➕ Añadir un componente

1. Crea la carpeta en `src/app/components/<categoría>/<nombre>/`
   (`<nombre>.component.ts|html|scss`), standalone y con estilos propios.
2. Registra la clase en `core/registry/component-registry.ts`
   (`['<categoría>/<nombre>', MiComponente]`).
3. Añade su entrada al catálogo con códigos únicos, variantes y comandos `npmInstall` si usa paquetes externos.
4. Declara un input `variant` y úsalo para elegir el efecto dentro del componente.
5. Ejecuta `npm run dictionary` para publicar los códigos para el extractor.

Con eso ya tiene URL, aparece en el sidebar (con contador si tiene 2+ variantes),
en la portada, y su ficha de código sale sola.

---

## 🔒 Aislamiento y sub-estilos

Tres mecanismos, cada uno resolviendo un problema concreto:

**1. Cambiar de entorno destruye el anterior.** El router monta un componente por
vez (`component-registry` + `ngComponentOutlet`), así que nada sobrevive: ni
timers, ni listeners, ni observadores.

**2. El iframe es la frontera.** Cada componente se monta en su propio
documento (`/embed/...`), fuera del DOM de la galería. Consecuencias reales y
verificadas: el `position: fixed` del modal se resuelve **dentro de la pantalla
del dispositivo** (no cubre la galería), las `@media` responden al ancho de la
ventana de previsualización y no al de tu monitor, y ningún `z-index` puede
saltar de un documento a otro. Galería e iframe solo se hablan por
`postMessage` (`ac:variant`, `ac:theme`).

**3. El input `variant` selecciona el efecto.** La vista embebida pasa el id
del catálogo al componente. Usa ese mismo input al copiar el efecto a otra app.
Si omites el input, los efectos de múltiples muestras muestran su galería local
y las escenas Three.js muestran el nudo por defecto.

---

## ♻️ Reutilizar un componente en otro proyecto

Cada componente se anuncia en su ficha de código (botón **Código** dentro de la
ventana) y se copia con el botón **Copiar**. El resumen:

1. Copia la carpeta, por ejemplo `src/app/components/cards/neon/`.
2. Consulta las dependencias en la ficha **Código** o con `node scripts/extract.cjs <código>`.
   Los gráficos y Dynamic Island usan GSAP. Glass Input requiere `@angular/forms` en la misma versión que `@angular/core`.
3. Úsalo como standalone (sin NgModule):

```ts
import { Component } from '@angular/core';
import { NeonCardComponent } from './components/cards/neon/neon.component';

@Component({
  selector: 'app-mi-pagina',
  imports: [NeonCardComponent],
  template: `<app-card-neon variant="blue" />`,
})
export class MiPaginaComponent {}
```

Los estilos de presentación viajan en la carpeta de cada efecto. Si quieres replicar
los colores de la galería y sus cinco temas, copia también `src/scss/_tokens.scss`.
El proyecto se verifica con Angular 22.

### Escenas Three.js

| Código | Variante | Escena |
| --- | --- | --- |
| `12.4.1.1` | `sculpture` | Nudo toroidal iluminado |
| `12.4.2.1` | `orbit` | Anillos y satélites alrededor de un núcleo facetado |
| `12.4.3.1` | `waves` | Onda radial en una cuadrícula de 289 columnas |
| `12.4.4.1` | `dunes` | Superficie ondulante con relieve y malla visible |
| `12.4.5.1` | `nebula` | Nebulosa de 1 800 partículas en espiral |
| `12.4.6.1` | `helix` | Doble hélice giratoria |
| `12.4.7.1` | `tiles` | Mosaico de 81 baldosas que se levantan y giran |
| `12.4.8.1` | `pendulums` | Trece péndulos que oscilan con periodos distintos |
| `12.4.9.1` | `light-trails` | Luces en trayectorias curvas |
| `12.4.10.1` | `exploded` | Rotor que se abre para mostrar sus piezas |
| `12.4.11.1` | `warehouse` | Dos camiones, portones sincronizados y zonas seleccionables |
| `12.4.12.1` | `sales` | Embudo que separa la etapa seleccionada y muestra sus cifras de ejemplo |
| `12.4.13.1` | `teams` | Grupos de talento, desarrollo y bienestar seleccionables |

Desde AngularCanvas, copia la carpeta completa con el extractor.

```bash
node scripts/extract.cjs 12.4.3.1 --dest ../mi-app/src/app/components
```

En el proyecto destino, instala las dependencias e importa `ThreeScenesComponent`.

```bash
npm install three@^0.184.0
npm install -D @types/three@^0.184.1
```

```html
<app-media-three-scenes variant="waves" accent="#5ce2bd" />
```

El visor requiere WebGL 2 y carga Three.js al montarse en el navegador. El input
`animate` admite `false` para una vista fija y usa la preferencia de movimiento
reducido del sistema por defecto. Para añadir otra escena, amplía `SceneVariant`
y `buildDesign()` en `three-scene.ts`, añade su nombre y color en el componente,
y registra su variante en el catálogo. Libera en `dispose()` las geometrías,
materiales y texturas que cree la escena.

Las tres escenas seleccionables emiten `(choiceSelected)` con `label` y `detail`
al elegir una pieza en el lienzo o con sus botones.

### Login 3D

Usa `12.5.1.1` para ondas, `12.5.2.1` para nebulosa o `12.5.3.1` para mosaico.
Los portales por área son `12.5.4.1` para Operaciones (`operations`),
`12.5.5.1` para Comercial (`commercial`) y `12.5.6.1` para RR. HH. (`hr`).
Puedes personalizar el encabezado y la descripción con `title` y `description`.
El extractor copia `three-login` y `three-scenes` como carpetas hermanas.
Instala los paquetes de Three.js de la sección anterior.

```bash
node scripts/extract.cjs 12.5.1.1 --dest ../mi-app/src/app/components
```

Importa `ThreeLoginComponent` en el array `imports` de tu página standalone.

```html
<app-media-three-login
  variant="waves"
  [authenticate]="iniciarSesion"
  recoveryUrl="/recuperar-contrasena"
/>
```

Pasa en `iniciarSesion` una función `(credentials: LoginCredentials) => Promise<void>`
que llame a tu servicio de sesión. Resuelve la promesa cuando se confirme el acceso
y recházala si falla. Tu aplicación decide cómo continuar después de iniciar sesión.
Si omites el callback, el formulario funciona en modo demo y valida los campos
localmente. `[animate]="false"` deja el fondo fijo.

---

## 🎨 Sistema de temas

Los 5 temas (dark, light, hacker, cyberpunk, corporate) se aplican cambiando el
atributo `data-theme` en `<html>`. Las variables viven en `src/scss/_tokens.scss`:

| Variable | Uso |
| --- | --- |
| `--ac-bg` / `--ac-bg-deep` | Fondo de página |
| `--ac-surface` / `--ac-surface-2` | Superficies elevadas |
| `--ac-border` | Bordes y separadores |
| `--ac-text` / `--ac-text-muted` / `--ac-text-faint` | Jerarquía de texto |
| `--ac-primary` / `--ac-primary-soft` | Color de acento y foco |

`ThemeService` sincroniza el signal del tema con el atributo y lo persiste en
`localStorage`, así que la elección sobrevive a la recarga. Además, la ventana
de entorno avisa al iframe por `postMessage` cuando el tema cambia: el diseño de
dentro se re-tematiza en vivo, sin recargar.

---

## 🧩 Componentes

Formato: **grupo (n)** → componente (`sub-estilos`).

**🃏 Cards (8)** — Glassmorphism (3), Neon (3), Hover Effects (6: lift, scale,
rotate, border-draw, glow, magnetic), Flip 3D (3), 3D Tilt (3: tilt + brillo,
profundidad, holo), Glass Panels (3: métricas, perfil, superposición), Minimal
(3), Dark Corporate (2)

**🔘 Buttons (7)** — Glow (5 colores), Gradient (5), Neumorphism (4: soft,
pressed, flat, convex), Pill (6: outline, solid, ghost, gradient, with-icon,
small), Animated (6: ripple, pulse, shake, fill-up, slide-bg, magnetic), 3D (3:
push, flip, levitación), Glass (3: glass, frost, borde degradado)

**🌌 Backgrounds (5)** — Gradient (6), Particle (1), Grid (3: dots, lines,
gradient), Animated Mesh (1), Aurora (3: aurora, haces, vidrio)

**🔤 Typography (4)** — Glow Text (4), Gradient Text (4: static, animated,
rainbow, subtle), Typewriter (1, sobre una terminal), 3D Text (3: extrude,
isométrico, floating)

**🧭 Navigation (7)** — Sidebar colapsable (1), Topbar responsiva (1), Dock
inferior (3: flotante, cristal, barra), Glass Tabs (2: vidrio, subrayado),
Breadcrumbs (3: chevron, slash, vidrio), Pagination (3: números, compacta,
vidrio), Stepper (3: horizontal, vertical, progreso)

**📝 Forms (7)** — Glass Input (1), Toggle Switch (1), Checkbox (1), Segmented
(2: vidrio, sólido), OTP Input (2: cajas, subrayado), Rating (2: estrellas,
segmentos), Range Slider (2: degradado, vidrio)

**🪟 Modals (6)** — Glass Modal (1), Slide-in Panel (1), Command Palette (1,
búsqueda + teclado), Confirm Dialog (2: peligro, vidrio), Bottom Sheet (2:
sólido, vidrio), Lightbox (2: foto, vidrio)

**🎨 Themes (5)** — Dark (3), Light (3), Hacker (2: terminal, paleta),
Cyberpunk (3: glitch, subtítulo, paleta), Corporate (2)

**✨ Animations (6)** — Skeleton (3: shimmer, pulso, onda), Spinner (3: anillo,
puntos, barra), Page Flip (3: tarjeta, editorial, brillo), Book Flip (3: clásico,
cuaderno, pergamino), Corner Fold (3: nota, documento, despegue), Marquee (3:
texto, bidireccional, logos)

---

## ✅ Convenciones del código

- **Standalone components** — sin `NgModule`. En Angular 19+ es el comportamiento
  por defecto, así que no se escribe `standalone: true`.
- **Signals** para estado local (`signal()`, `computed()`, `input()`, `effect()`).
- **Control flow nativo** `@if` / `@for` / `@switch` en lugar de `*ngIf` /
  `*ngFor`, con `track` obligatorio. Por eso no se importa `CommonModule`.
- **Estilos encapsulados**. Los componentes incluyen sus reglas de presentación y usan
  las variables de tema como personalización opcional.
- **Sin fugas de memoria** — todo `requestAnimationFrame`, `ResizeObserver`,
  `setTimeout`, listener o clase añadida al `<body>` se libera en `ngOnDestroy` o
  con `DestroyRef`.
- **Accesibilidad** — roles ARIA donde corresponde (`role="switch"`,
  `role="checkbox"`, `role="dialog"`), `aria-label` en botones de sólo icono,
  `aria-current` en navegación, `aria-expanded`/`aria-controls` en el árbol,
  cierre con `Escape`, `inert` en overlays cerrados y `:focus-visible` visible.
- **`type="button"`** explícito en todos los botones.
- Los efectos visuales están **siempre activos**: no se desactivan por
  `prefers-reduced-motion`.

---

## 🚀 CI/CD y despliegue

El sitio vive en **https://canvas.darknezz.dev** y se despliega solo en cada push
a `main` mediante [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

**Job `build`** (GitHub Actions): `npm ci` → `prettier --check` → `ng build`.
El artefacto se sube solo para inspección; el deploy no lo usa.

**Job `deploy`** (por SSH al VPS): hace `git pull`, **reconstruye en el VPS** el
commit que pasó el build, sincroniza el resultado y recarga nginx:

```
git pull → npm ci → npm run build
  → rsync dist/angular-canvas/browser/ → ~/data/deploy/angular-canvas/dist/
  → docker compose up -d → nginx -s reload → smoke test dentro del contenedor
```

Si el smoke test falla, el job falla: no se declara un deploy en verde sin
comprobar que nginx sirve el sitio.

### Estructura en el VPS

- `~/data/repos/angular-canvas/` — este repo (código fuente).
- `~/data/deploy/angular-canvas/` — `docker-compose.yml`, `conf.d/default.conf`
  y `.env` con el dominio. **No es un repo git**: por eso el `.env` vive aquí.
- `~/data/deploy/angular-canvas/dist/` — artefactos compilados, en un
  **subdirectorio** del proyecto. El `rsync --delete` del CI apunta ahí y por eso
  no puede borrar `conf.d/` ni el compose: cuando el destino era la raíz de la
  carpeta, un `--delete` se llevó por delante la config de nginx del portfolio.

nginx sirve el SPA con `try_files … /index.html`, así que las rutas profundas
(`/cards/neon/blue`) se pueden abrir directamente, y el `index.html` nunca se
cachea para que un deploy nuevo se vea al instante.

### Secretos

El workflow solo consume secretos de GitHub, nunca valores en el repo:

`DEPLOY_KEY` (llave privada de despliegue), `VPS_HOST`, `VPS_USER`.

Para re-desplegar sin cambiar código: `gh workflow run CI`.

---

## 🧪 Tests

El proyecto se creó con `--skip-tests`, así que **no hay tests configurados** ni
target de test en `angular.json` (por eso `package.json` no expone `npm test`).
La verificación actual es el build de producción y la revisión visual navegando
el catálogo. El CI tampoco ejecuta tests: no hay nada que ejecutar todavía.

---

## 📄 Licencia

MIT — ver [LICENSE](./LICENSE).
