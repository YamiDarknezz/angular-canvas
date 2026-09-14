# 🎨 AngularCanvas

Biblioteca viva de **efectos y diseños para Angular**. Es un catálogo navegable
de 30 componentes visuales pensados para copiar y pegar: cada efecto vive aislado
en su propia carpeta, con su `.ts`, su `.html` y su `.scss`, listo para llevarlo
a cualquier otro proyecto.

Construido con **Angular 22** (standalone components, signals, router y control
flow nativo `@if` / `@for`).

**8 categorías · 30 componentes · 86 sub-estilos · 5 temas.**

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
| `/` | Portada: contadores y tarjetas de los 8 grupos, con chips a cada sub-estilo |
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
src/
├── index.html                  # Script anti-flash de tema
├── main.ts                     # bootstrapApplication
├── styles.scss                 # Reset, tokens y estilos COMPARTIDOS de la librería
├── scss/
│   ├── _tokens.scss            # Variables CSS de los 5 temas
│   └── _gallery.scss           # UI del andamiaje (chips). NO viaja con los componentes
└── app/
    ├── app.ts                  # Raíz: monta el shell o la vista embed según la ruta
    ├── app.config.ts           # provideRouter + component input binding
    ├── app.routes.ts           # /, /:group/:entry, /:group/:entry/:variant, /embed/…
    ├── core/
    │   ├── catalog/catalog.ts        # FUENTE ÚNICA DE VERDAD (grupos/componentes/variantes)
    │   ├── registry/component-registry.ts  # grupo/componente → clase standalone
    │   ├── theme/theme.service.ts    # Cambio de tema + persistencia
    │   └── stage/
    │       ├── stage.component.*     # La ventana neutra: ancho, dispositivo y código
    │       ├── stage-messages.ts     # Canal postMessage con el iframe
    │       ├── stage-width.service.ts # Recuerda el ancho elegido al navegar
    │       └── variant-focus.ts      # Genera el CSS que filtra sub-estilos
    ├── layout/
    │   ├── shell.component.*         # Marco: sidebar, temas, topbar y drawer móvil
    │   └── nav-tree/nav-tree.component.*  # Navegación de 2 niveles + buscador
    ├── views/
    │   ├── home/home.component.*     # Portada
    │   ├── environment/environment.component.*  # Cabecera, chips, atajos y pager
    │   └── embed/embed.component.*   # Documento desnudo que carga el iframe
    └── components/                   # 👈 LA LIBRERÍA (esto es lo que se copia)
        ├── cards/        glassmorphism/  neon/  hover-effects/  flip/
        │                 minimal/  dark-corporate/
        ├── buttons/      glow/  gradient/  neumorphism/  pill/  animated/
        ├── backgrounds/  gradient/  particle/  grid/  animated-mesh/
        ├── typography/   glow-text/  gradient-text/  typewriter/
        ├── navigation/   sidebar/  topbar/
        ├── forms/        glass-input/  toggle/  checkbox/
        ├── modals/       glass-modal/  slide-in/
        └── themes/       dark/  light/  hacker/  cyberpunk/  corporate/
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

### ➕ Añadir un componente (3 pasos + 1)

1. Crea la carpeta en `src/app/components/<categoría>/<nombre>/`
   (`<nombre>.component.ts|html|scss`), standalone y con estilos propios.
2. Registra la clase en `core/registry/component-registry.ts`
   (`['<categoría>/<nombre>', MiComponente]`).
3. Añade su entrada al catálogo con sus variantes.
4. Marca cada sub-estilo en la plantilla con `data-variant="<id>"`.

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

**3. Las variantes se filtran con CSS generado, no con DOM.**
Cada sub-estilo de la plantilla lleva `data-variant="id"`. Al arrancar,
`VariantFocusStyles` inyecta un único `<style>` con una regla por variante:

```css
.ac-viewport[data-focus='magnetic'] [data-variant]:not([data-variant='magnetic']) {
  display: none !important;
}
```

El CSS tiene que ser global (los nodos están dentro de componentes y Angular
encapsula los estilos), pero se **genera desde el catálogo**, así que no puede
desincronizarse ni duplicarse. Y `data-variant` es un atributo **inerte**: no
arrastra ninguna dependencia si copias el componente a otro proyecto. En la
galería, `.ac-viewport` es el host de la vista `/embed/...` (cada documento
instala su propio `<style>`).

---

## ♻️ Reutilizar un componente en otro proyecto

Cada componente se anuncia en su ficha de código (botón **Código** dentro de la
ventana) y se copia con el botón **Copiar**. El resumen:

1. Copia la carpeta, por ejemplo `src/app/components/cards/neon/`.
2. Si el componente importa `FormsModule` (el de `forms/glass-input`), necesitas
   `@angular/forms` instalado.
3. Úsalo como standalone (sin NgModule):

```ts
import { NeonCardComponent } from './components/cards/neon/neon.component';

@Component({
  imports: [NeonCardComponent],
  template: `<app-card-neon />`,
})
export class MiPaginaComponent {}
```

Los estilos de cada componente son **autocontenidos**: no dependen de
`styles.scss`, salvo las clases compartidas (`.card-grid`, `.btn-showcase`) y las
variables de tema (`var(--ac-*)`). Si quieres los 5 temas, copia también
`src/scss/_tokens.scss`.

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

## 🧩 Componentes (30)

Formato: **grupo (n)** → componente (`sub-estilos`).

**🃏 Cards (6)** — Glassmorphism (3), Neon (3), Hover Effects (6: lift, scale,
rotate, border-draw, glow, magnetic), Flip 3D (3), Minimal (3), Dark Corporate (2)

**🔘 Buttons (5)** — Glow (5 colores), Gradient (5), Neumorphism (4: soft,
pressed, flat, convex), Pill (6: outline, solid, ghost, gradient, with-icon,
small), Animated (6: ripple, pulse, shake, fill-up, slide-bg, magnetic)

**🌌 Backgrounds (4)** — Gradient (6), Particle (1), Grid (3: dots, lines,
gradient), Animated Mesh (1)

**🔤 Typography (3)** — Glow Text (4), Gradient Text (4: static, animated,
rainbow, subtle), Typewriter (1, sobre una terminal)

**🧭 Navigation (2)** — Sidebar colapsable (1), Topbar responsiva (1)

**📝 Forms (3)** — Glass Input (1), Toggle Switch (1), Checkbox (1)

**🪟 Modals (2)** — Glass Modal (1), Slide-in Panel (1)

**🎨 Themes (5)** — Dark (3), Light (3), Hacker (2: terminal, paleta),
Cyberpunk (3: glitch, subtítulo, paleta), Corporate (2)

---

## ✅ Convenciones del código

- **Standalone components** — sin `NgModule`. En Angular 19+ es el comportamiento
  por defecto, así que no se escribe `standalone: true`.
- **Signals** para estado local (`signal()`, `computed()`, `input()`, `effect()`).
- **Control flow nativo** `@if` / `@for` / `@switch` en lugar de `*ngIf` /
  `*ngFor`, con `track` obligatorio. Por eso no se importa `CommonModule`.
- **Sin `::ng-deep`** — los estilos compartidos son globales (`styles.scss`), y el
  filtrado de variantes usa CSS generado en runtime.
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
