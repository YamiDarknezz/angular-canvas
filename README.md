# 🎨 AngularCanvas

Biblioteca de efectos y diseños reutilizables para Angular.

## Categorías

### 🃏 Cards
- **Glassmorphism** — Efecto vidrio esmerilado con blur y transparencia
- **Neon** — Bordes luminosos con glow pulsante
- **Hover Effects** — 6 efectos: lift, scale, rotate, border-draw, glow, magnetic
- **Flip** — Tarjetas 3D que giran al hacer hover
- **Minimal** — Limpio, elegante, sin distracciones
- **Dark Corporate** — Elegancia corporativa en modo oscuro

### 🔘 Buttons
- **Glow** — Brillo expansivo con sombra de color
- **Gradient** — Degradados animados (sunset, ocean, aurora, fire, mesh)
- **Neumorphism** — Efecto de relieve suave
- **Pill** — Botones redondeados (outline, solid, ghost, gradient)
- **Animated** — Ripple, pulse, shake, fill-up, slide-bg, magnetic

### 🌌 Backgrounds
- **Gradient** — 6 fondos degradados (sunset, aurora, deep ocean, mesh, radial, conic)
- **Particle** — Canvas con partículas conectadas (animado)
- **Grid** — Patrones de cuadrícula (dots, lines, fade)
- **Animated Mesh** — Blobs de color que se mueven fluidamente

### 🔤 Typography
- **Glow Text** — Texto neón (cyan, pink, green, pulse)
- **Gradient Text** — Degradados animados y estáticos
- **Typewriter** — Efecto máquina de escribir en terminal

### 🧭 Navigation
- **Sidebar** — Navegación lateral colapsable
- **Topbar** — Barra superior responsiva con menú mobile

### 📝 Forms
- **Glass Input** — Inputs con estilo glassmorphism y floating labels
- **Toggle** — Interruptores animados
- **Checkbox** — Checkboxes personalizados con animación pop

### 🪟 Modals
- **Glass Modal** — Modal con efecto glassmorphism
- **Slide-in Panel** — Panel lateral que se desliza desde la derecha

### 🎨 Themes
- **Dark** — Paleta completa para modo oscuro
- **Light** — Paleta limpia para modo claro
- **Hacker** — Estilo Matrix / terminal verde
- **Cyberpunk** — Futurista con neón y glitch
- **Corporate** — Profesional y sobrio

## Uso

Cada componente es standalone y se puede copiar directamente a tu proyecto Angular.

```bash
ng serve
```

Abre `http://localhost:4200` para ver la galería de todos los efectos.

## Estructura

```
src/app/
├── components/
│   ├── cards/           # 6 tipos de tarjetas
│   ├── buttons/         # 5 estilos de botones
│   ├── backgrounds/     # 4 fondos animados
│   ├── typography/      # 3 efectos de texto
│   ├── navigation/      # 2 tipos de nav
│   ├── forms/           # 3 controles de formulario
│   ├── modals/          # 2 tipos de modal
│   ├── themes/          # 5 paletas de colores
│   └── showcase/        # Componente orquestador
└── services/            # Theme service
```

## License

MIT
