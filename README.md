# 🎨 AngularCanvas

Biblioteca viva de **efectos y diseños para Angular**. Es un catálogo navegable
de componentes visuales pensado para copiar y pegar: cada efecto vive aislado en
su propia carpeta, con su `.ts`, `.html` y `.scss`, listo para llevarlo a
cualquier otro proyecto.

Construido con **Angular 22** (standalone components, signals y control flow
nativo `@if` / `@for`).

---

## 📋 Requisitos

- Node.js 20.19+ / 22.12+ / 24+
- npm 10+

## 🚀 Uso local

```bash
npm install
npm start          # servidor de desarrollo en http://localhost:4200
npm run build      # build de producción en dist/
npm run format     # formatea con Prettier
```

---

## 🗂️ Estructura del proyecto

```
src/
├── index.html                  # Incluye un script anti-flash de tema
├── main.ts                     # bootstrapApplication
├── styles.scss                 # Reset, tokens globales y estilos de la galería
├── scss/
│   └── _tokens.scss            # Variables CSS de los 5 temas
└── app/
    ├── app.ts                  # Shell: sólo monta <app-showcase />
    ├── app.config.ts
    ├── core/
    │   ├── catalog/catalog.ts       # Fuente única de verdad del catálogo
    │   └── theme/theme.service.ts   # Cambio de tema + persistencia
    └── components/
        ├── cards/          hover-effects/  glassmorphism/  neon/
        │                   flip/           minimal/        dark-corporate/
        ├── buttons/        glow/  gradient/  neumorphism/  pill/  animated/
        ├── backgrounds/    gradient/  particle/  grid/  animated-mesh/
        ├── typography/     glow-text/  gradient-text/  typewriter/
        ├── navigation/     sidebar/  topbar/
        ├── forms/          glass-input/  toggle/  checkbox/
        ├── modals/         glass-modal/  slide-in/
        ├── themes/         dark/  light/  hacker/  cyberpunk/  corporate/
        └── showcase/       # Orquestador: navegación + todas las secciones
```

**Cómo funciona el catálogo:** `core/catalog/catalog.ts` es la única fuente de
verdad. La navegación lateral, las anclas y el contador del hero se calculan a
partir de esa lista. Para añadir un componente nuevo basta con registrarlo allí.

---

## ♻️ Cómo reutilizar un componente en otro proyecto

1. Copia la carpeta del efecto, por ejemplo
   `src/app/components/cards/neon/` a tu proyecto.
2. Si el componente importa `FormsModule` (los de `forms/`), asegúrate de tener
   `@angular/forms` instalado.
3. Úsalo en tu plantilla importándolo como standalone:

```ts
import { NeonCardComponent } from './components/cards/neon/neon.component';

@Component({
  selector: 'app-mi-pagina',
  imports: [NeonCardComponent],
  template: `<app-card-neon />`,
})
export class MiPaginaComponent {}
```

Los estilos de cada componente son **autocontenidos**: no dependen de
`styles.scss`, salvo los que usan variables de tema (`var(--ac-*)`) para
integrarse con el sistema de temas.

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
`localStorage`, así que la elección sobrevive a la recarga.

---

## 🧩 Componentes (30)

**🃏 Cards (6)** — Glassmorphism, Neon, Hover Effects (lift, scale, rotate,
border-draw, glow, magnetic), Flip 3D, Minimal, Dark Corporate

**🔘 Buttons (5)** — Glow, Gradient, Neumorphism, Pill, Animated
(ripple, pulse, shake, fill-up, slide-bg)

**🌌 Backgrounds (4)** — Gradient (6 variantes), Particle Canvas, Grid Patterns,
Animated Mesh

**🔤 Typography (3)** — Glow Text, Gradient Text, Typewriter

**🧭 Navigation (2)** — Sidebar colapsable, Topbar responsiva

**📝 Forms (3)** — Glass Input, Toggle Switch, Checkbox

**🪟 Modals (2)** — Glass Modal, Slide-in Panel

**🎨 Themes (5)** — Dark, Light, Hacker, Cyberpunk, Corporate

---

## ✅ Convenciones del código

- **Standalone components** — sin `NgModule`. En Angular 19+ es el comportamiento
  por defecto, así que no se escribe `standalone: true`.
- **Signals** para estado local (`signal()`, `computed()`, `viewChild()`).
- **Control flow nativo** `@if` / `@for` / `@switch` en lugar de `*ngIf` /
  `*ngFor`, con `track` obligatorio. Por eso no se importa `CommonModule`.
- **Sin `::ng-deep`** — los estilos compartidos de la galería viven en
  `styles.scss` como estilos globales.
- **Sin fugas de memoria** — todo `requestAnimationFrame`,
  `ResizeObserver` o `setTimeout` se cancela en `ngOnDestroy`.
- **Accesibilidad** — roles ARIA donde corresponde (`role="switch"`,
  `role="checkbox"`, `role="dialog"`), `aria-label` en botones de sólo icono,
  `aria-current` en navegación, cierre con `Escape`, `inert` en overlays
  cerrados y `:focus-visible` visible.
- **`type="button"`** explícito en todos los botones.
- Los efectos visuales están **siempre activos**: no se desactivan por
  `prefers-reduced-motion`.

## 🚀 CI/CD y despliegue

El sitio vive en **https://canvas.darknezz.dev** y se despliega solo en cada push
a `main` mediante [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

**Job `build`** (GitHub Actions): `npm ci` → `prettier --check` → `ng build`.
El artefacto se sube solo para inspección; el deploy no lo usa.

**Job `deploy`** (por SSH al VPS): hace `git pull`, **reconstruye en el VPS** el
commit que pasó el build, sincroniza el resultado y recarga nginx:

```
git pull → npm ci → npm run build
  → rsync dist/angular-canvas/browser/ → ~/data/deploy/angular-canvas-dist/
  → docker compose up -d → nginx -s reload → smoke test dentro del contenedor
```

Si el smoke test falla, el job falla: no se declara un deploy en verde sin
comprobar que nginx sirve el sitio.

### Estructura en el VPS

- `~/data/repos/angular-canvas/` — este repo (código fuente).
- `~/data/deploy/angular-canvas/` — `docker-compose.yml`, `conf.d/default.conf`
  y `.env` con el dominio. **No es un repo git**: por eso el `.env` vive aquí.
- `~/data/deploy/angular-canvas-dist/` — artefactos compilados. Es lo único que
  el `rsync --delete` toca, así que no puede borrar la config del servidor.

### Secretos

El workflow solo consume secretos de GitHub, nunca valores en el repo:

`DEPLOY_KEY` (llave privada de despliegue), `VPS_HOST`, `VPS_USER`.

Para re-desplegar sin cambiar código: `gh workflow run CI`.

---

## 🧪 Tests

El proyecto se creó con `--skip-tests`, así que **no hay tests configurados** ni
target de test en `angular.json` (por eso `package.json` no expone `npm test`).
La verificación actual es el build de producción y la revisión visual. El CI
tampoco ejecuta tests: no hay nada que ejecutar todavía.

---

## 📄 Licencia

MIT — ver [LICENSE](./LICENSE).
