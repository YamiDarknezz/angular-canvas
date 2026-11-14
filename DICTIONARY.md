# Diccionario de Estilos y Efectos — AngularCanvas

> **Catálogo de Referencia Jerárquico para Desarrolladores y Agentes de IA**  
> Total: **12 Categorías** · **82 Componentes** · **245 Efectos / Sub-estilos Únicos**
> Formato JSON disponible en [`public/dictionary.json`](public/dictionary.json) o en la web vía `https://canvas.darknezz.dev/dictionary.json`

---

## 🎯 Protocolo de Identificación y Extracción por Código

Cada efecto visual o componente en este repositorio posee un **código numérico jerárquico unívoco** estructurado en 4 niveles:

```
  [Categoría] . [Componente] . [Variante] . [Subvariante]
       │              │             │             │
     (1-N)          (1-N)         (1-N)          (1)
```

### 📌 Ejemplos de uso con tu Agente de IA o Pair Programmer:
- **"Jala el efecto 9.4.2.1 en color morado"**  
  👉 El agente busca directamente el código **9.4.2.1**: Categoría **Animations (9)**, Componente **Book Flip (9.4)**, Variante **Cuaderno (9.4.2.1)**.  
  👉 Ubicación: `src/app/components/animations/book-flip/`  
  👉 Selector: `<app-anim-book-flip [variant]="'notebook'" [style.--ac-accent]="'#a855f7'" />`  
  👉 No requiere descripciones subjetivas como "el libro del medio" ni "el de la derecha".

- **"Jala el gráfico 10.3.1.1 en color esmeralda"**  
  👉 El agente busca directamente el código **10.3.1.1**: Categoría **Charts (10)**, Componente **Histogram (10.3)**, Variante **Gauss Normal (10.3.1.1)**.  
  👉 Ubicación: `src/app/components/charts/histogram/`  
  👉 Selector: `<app-chart-histogram [variant]="'gauss'" [style.--ac-accent]="'#10b981'" />`

- **"Extrae el botón 2.6.2.1 y agrégalo a mi navbar"**  
  👉 El agente copia `src/app/components/buttons/3d/` y monta `<app-btn-3d [variant]="'flip'" />`.

---

## 📦 Autocontención y Reglas de Extracción

1. **Carpeta de origen**. Copia la carpeta completa de cada efecto y consulta sus dependencias en el extractor o en la ficha de código.
2. **Aislamiento de Efecto**: Cuando un componente incluye múltiples sub-estilos, se activa mediante el input reactivo `[variant]="'id'"`. Si no se especifica variante, muestra la variante principal por defecto sin amontonar efectos en el mismo lienzo.
3. **Standalone Angular**: Todos los componentes se exportan como standalone components (verificados con Angular 22), listos para importar directamente en el array `imports: [...]` de cualquier componente destino.
4. **Navegación Directa por Código**: Puedes navegar a cualquier componente o variante directamente escribiendo la URL `/c/[codigo]` o `/code/[codigo]`, por ejemplo `https://canvas.darknezz.dev/c/10.3.1.1`.

---

## 1. Cards

*Tarjetas con vidrio, neón, volteo 3D y estilos sobrios*

| Código | Componente | Sub-estilo / Efecto | Selector | Carpeta a copiar | Uso Standalone |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **`1.1.1.1`** | Glassmorphism (`1.1`) | **Base**<br><sub>La tarjeta de vidrio por defecto</sub> | `<app-card-glassmorphism>` | `src/app/components/cards/glassmorphism` | `<app-card-glassmorphism [variant]="'default'" />` |
| **`1.1.2.1`** | Glassmorphism (`1.1`) | **Secondary**<br><sub>Segundo nivel de jerarquía</sub> | `<app-card-glassmorphism>` | `src/app/components/cards/glassmorphism` | `<app-card-glassmorphism [variant]="'secondary'" />` |
| **`1.1.3.1`** | Glassmorphism (`1.1`) | **Accent**<br><sub>Acento de color para destacar una tarjeta</sub> | `<app-card-glassmorphism>` | `src/app/components/cards/glassmorphism` | `<app-card-glassmorphism [variant]="'accent'" />` |
| **`1.2.1.1`** | Neon (`1.2`) | **Neón azul**<br><sub>El clásico para interfaces tech y gaming</sub> | `<app-card-neon>` | `src/app/components/cards/neon` | `<app-card-neon [variant]="'blue'" />` |
| **`1.2.2.1`** | Neon (`1.2`) | **Neón rosa**<br><sub>Energía vibrante para dashboards</sub> | `<app-card-neon>` | `src/app/components/cards/neon` | `<app-card-neon [variant]="'pink'" />` |
| **`1.2.3.1`** | Neon (`1.2`) | **Neón verde**<br><sub>Inspiración Matrix para herramientas dev</sub> | `<app-card-neon>` | `src/app/components/cards/neon` | `<app-card-neon [variant]="'green'" />` |
| **`1.3.1.1`** | Hover Effects (`1.3`) | **Lift**<br><sub>Elevación suave con sombra creciente</sub> | `<app-card-hover>` | `src/app/components/cards/hover-effects` | `<app-card-hover [variant]="'lift'" />` |
| **`1.3.2.1`** | Hover Effects (`1.3`) | **Scale**<br><sub>Escalado con cambio de fondo</sub> | `<app-card-hover>` | `src/app/components/cards/hover-effects` | `<app-card-hover [variant]="'scale'" />` |
| **`1.3.3.1`** | Hover Effects (`1.3`) | **Rotate**<br><sub>Rotación 3D sutil</sub> | `<app-card-hover>` | `src/app/components/cards/hover-effects` | `<app-card-hover [variant]="'rotate'" />` |
| **`1.3.4.1`** | Hover Effects (`1.3`) | **Border Draw**<br><sub>Borde que se dibuja alrededor</sub> | `<app-card-hover>` | `src/app/components/cards/hover-effects` | `<app-card-hover [variant]="'border-draw'" />` |
| **`1.3.5.1`** | Hover Effects (`1.3`) | **Glow**<br><sub>Brillo expansivo con sombra de color</sub> | `<app-card-hover>` | `src/app/components/cards/hover-effects` | `<app-card-hover [variant]="'glow'" />` |
| **`1.3.6.1`** | Hover Effects (`1.3`) | **Magnetic**<br><sub>Sigue el cursor con efecto magnético</sub> | `<app-card-hover>` | `src/app/components/cards/hover-effects` | `<app-card-hover [variant]="'magnetic'" />` |
| **`1.4.1.1`** | Flip 3D (`1.4`) | **Clásica**<br><sub>Frente y reverso con el tema actual</sub> | `<app-card-flip>` | `src/app/components/cards/flip` | `<app-card-flip [variant]="'classic'" />` |
| **`1.4.2.1`** | Flip 3D (`1.4`) | **Gradiente**<br><sub>Fondos degradados en ambas caras</sub> | `<app-card-flip>` | `src/app/components/cards/flip` | `<app-card-flip [variant]="'gradient'" />` |
| **`1.4.3.1`** | Flip 3D (`1.4`) | **Con métricas**<br><sub>Contenido denso frente y reverso</sub> | `<app-card-flip>` | `src/app/components/cards/flip` | `<app-card-flip [variant]="'stats'" />` |
| **`1.5.1.1`** | 3D Tilt (`1.5`) | **Tilt + brillo**<br><sub>Rota en 3D y el reflejo sigue al cursor</sub> | `<app-card-tilt3d>` | `src/app/components/cards/tilt-3d` | `<app-card-tilt3d [variant]="'tilt'" />` |
| **`1.5.2.1`** | 3D Tilt (`1.5`) | **Profundidad**<br><sub>Capas a distinta altura sobre el eje Z</sub> | `<app-card-tilt3d>` | `src/app/components/cards/tilt-3d` | `<app-card-tilt3d [variant]="'depth'" />` |
| **`1.5.3.1`** | 3D Tilt (`1.5`) | **Holo**<br><sub>Tornasol con destello que se desplaza</sub> | `<app-card-tilt3d>` | `src/app/components/cards/tilt-3d` | `<app-card-tilt3d [variant]="'shine'" />` |
| **`1.6.1.1`** | Glass Panels (`1.6`) | **Métricas**<br><sub>Panel de resumen con barras translúcidas</sub> | `<app-card-glass-panel>` | `src/app/components/cards/glass-panel` | `<app-card-glass-panel [variant]="'stats'" />` |
| **`1.6.2.1`** | Glass Panels (`1.6`) | **Perfil**<br><sub>Tarjeta de persona con acciones</sub> | `<app-card-glass-panel>` | `src/app/components/cards/glass-panel` | `<app-card-glass-panel [variant]="'profile'" />` |
| **`1.6.3.1`** | Glass Panels (`1.6`) | **Superposición**<br><sub>Texto legible sobre cualquier fondo</sub> | `<app-card-glass-panel>` | `src/app/components/cards/glass-panel` | `<app-card-glass-panel [variant]="'overlay'" />` |
| **`1.7.1.1`** | Minimal (`1.7`) | **Con acento**<br><sub>Barra de acento lateral</sub> | `<app-card-minimal>` | `src/app/components/cards/minimal` | `<app-card-minimal [variant]="'default'" />` |
| **`1.7.2.1`** | Minimal (`1.7`) | **Solo bordes**<br><sub>Sin sombras ni fondos extra</sub> | `<app-card-minimal>` | `src/app/components/cards/minimal` | `<app-card-minimal [variant]="'bordered'" />` |
| **`1.7.3.1`** | Minimal (`1.7`) | **Con etiqueta**<br><sub>Tag sutil de categoría</sub> | `<app-card-minimal>` | `src/app/components/cards/minimal` | `<app-card-minimal [variant]="'with-tag'" />` |
| **`1.8.1.1`** | Dark Corporate (`1.8`) | **Estándar**<br><sub>Cabecera, métricas y CTA</sub> | `<app-card-corporate>` | `src/app/components/cards/dark-corporate` | `<app-card-corporate [variant]="'default'" />` |
| **`1.8.2.1`** | Dark Corporate (`1.8`) | **Con badge accent**<br><sub>Badge de acento y otra densidad</sub> | `<app-card-corporate>` | `src/app/components/cards/dark-corporate` | `<app-card-corporate [variant]="'variant'" />` |
| **`1.9.1.1`** | Seguimiento de entrega (`1.9`) | **En ruta**<br><sub>Consulta las etapas y la ventana estimada de entrega</sub> | `<app-card-delivery-timeline>` | `src/app/components/cards/delivery-timeline` | `<app-card-delivery-timeline [variant]="'in-transit'" />` |
| **`1.9.2.1`** | Seguimiento de entrega (`1.9`) | **Entregado**<br><sub>Revisa la recepción confirmada y las horas de cada hito</sub> | `<app-card-delivery-timeline>` | `src/app/components/cards/delivery-timeline` | `<app-card-delivery-timeline [variant]="'delivered'" />` |
| **`1.10.1.1`** | Estado del inventario (`1.10`) | **Almacén**<br><sub>Compara existencias con el mínimo de reposición</sub> | `<app-card-stock-status>` | `src/app/components/cards/stock-status` | `<app-card-stock-status [variant]="'warehouse'" />` |
| **`1.10.2.1`** | Estado del inventario (`1.10`) | **Bodega**<br><sub>Filtra los productos bajo mínimo y los agotados</sub> | `<app-card-stock-status>` | `src/app/components/cards/stock-status` | `<app-card-stock-status [variant]="'store'" />` |

---

## 2. Buttons

*Botones con brillo, degradado, neumorfismo y animación*

| Código | Componente | Sub-estilo / Efecto | Selector | Carpeta a copiar | Uso Standalone |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **`2.1.1.1`** | Glow (`2.1`) | **Azul**<br><sub>.glow-blue</sub> | `<app-btn-glow>` | `src/app/components/buttons/glow` | `<app-btn-glow [variant]="'blue'" />` |
| **`2.1.2.1`** | Glow (`2.1`) | **Púrpura**<br><sub>.glow-purple</sub> | `<app-btn-glow>` | `src/app/components/buttons/glow` | `<app-btn-glow [variant]="'purple'" />` |
| **`2.1.3.1`** | Glow (`2.1`) | **Rosa**<br><sub>.glow-pink</sub> | `<app-btn-glow>` | `src/app/components/buttons/glow` | `<app-btn-glow [variant]="'pink'" />` |
| **`2.1.4.1`** | Glow (`2.1`) | **Verde**<br><sub>.glow-green</sub> | `<app-btn-glow>` | `src/app/components/buttons/glow` | `<app-btn-glow [variant]="'green'" />` |
| **`2.1.5.1`** | Glow (`2.1`) | **Naranja**<br><sub>.glow-orange</sub> | `<app-btn-glow>` | `src/app/components/buttons/glow` | `<app-btn-glow [variant]="'orange'" />` |
| **`2.2.1.1`** | Gradient (`2.2`) | **Sunset**<br><sub>Naranja a magenta</sub> | `<app-btn-gradient>` | `src/app/components/buttons/gradient` | `<app-btn-gradient [variant]="'sunset'" />` |
| **`2.2.2.1`** | Gradient (`2.2`) | **Ocean**<br><sub>Azules profundos</sub> | `<app-btn-gradient>` | `src/app/components/buttons/gradient` | `<app-btn-gradient [variant]="'ocean'" />` |
| **`2.2.3.1`** | Gradient (`2.2`) | **Aurora**<br><sub>Verde-cyan degradado</sub> | `<app-btn-gradient>` | `src/app/components/buttons/gradient` | `<app-btn-gradient [variant]="'aurora'" />` |
| **`2.2.4.1`** | Gradient (`2.2`) | **Fire**<br><sub>Rojo y ámbar</sub> | `<app-btn-gradient>` | `src/app/components/buttons/gradient` | `<app-btn-gradient [variant]="'fire'" />` |
| **`2.2.5.1`** | Gradient (`2.2`) | **Mesh animado**<br><sub>Malla de color en movimiento</sub> | `<app-btn-gradient>` | `src/app/components/buttons/gradient` | `<app-btn-gradient [variant]="'mesh'" />` |
| **`2.3.1.1`** | Neumorphism (`2.3`) | **Suave**<br><sub>Relieve estándar</sub> | `<app-btn-neumorphism>` | `src/app/components/buttons/neumorphism` | `<app-btn-neumorphism [variant]="'soft'" />` |
| **`2.3.2.1`** | Neumorphism (`2.3`) | **Presionado**<br><sub>Estado hundido permanente</sub> | `<app-btn-neumorphism>` | `src/app/components/buttons/neumorphism` | `<app-btn-neumorphism [variant]="'pressed'" />` |
| **`2.3.3.1`** | Neumorphism (`2.3`) | **Flat**<br><sub>Superficie plana</sub> | `<app-btn-neumorphism>` | `src/app/components/buttons/neumorphism` | `<app-btn-neumorphism [variant]="'flat'" />` |
| **`2.3.4.1`** | Neumorphism (`2.3`) | **Convexo**<br><sub>Relieve saliente marcado</sub> | `<app-btn-neumorphism>` | `src/app/components/buttons/neumorphism` | `<app-btn-neumorphism [variant]="'convex'" />` |
| **`2.4.1.1`** | Pill (`2.4`) | **Outline**<br><sub>Borde sin relleno</sub> | `<app-btn-pill>` | `src/app/components/buttons/pill` | `<app-btn-pill [variant]="'outline'" />` |
| **`2.4.2.1`** | Pill (`2.4`) | **Solid**<br><sub>Relleno plano</sub> | `<app-btn-pill>` | `src/app/components/buttons/pill` | `<app-btn-pill [variant]="'solid'" />` |
| **`2.4.3.1`** | Pill (`2.4`) | **Ghost**<br><sub>Transparente hasta el hover</sub> | `<app-btn-pill>` | `src/app/components/buttons/pill` | `<app-btn-pill [variant]="'ghost'" />` |
| **`2.4.4.1`** | Pill (`2.4`) | **Gradient**<br><sub>Degradado de acento</sub> | `<app-btn-pill>` | `src/app/components/buttons/pill` | `<app-btn-pill [variant]="'gradient'" />` |
| **`2.4.5.1`** | Pill (`2.4`) | **Con icono**<br><sub>Icono + texto</sub> | `<app-btn-pill>` | `src/app/components/buttons/pill` | `<app-btn-pill [variant]="'with-icon'" />` |
| **`2.4.6.1`** | Pill (`2.4`) | **Pequeño**<br><sub>Tamaño compacto</sub> | `<app-btn-pill>` | `src/app/components/buttons/pill` | `<app-btn-pill [variant]="'small'" />` |
| **`2.5.1.1`** | Animated (`2.5`) | **Ripple**<br><sub>Onda desde el punto de click</sub> | `<app-btn-animated>` | `src/app/components/buttons/animated` | `<app-btn-animated [variant]="'ripple'" />` |
| **`2.5.2.1`** | Animated (`2.5`) | **Pulse**<br><sub>Latido continuo</sub> | `<app-btn-animated>` | `src/app/components/buttons/animated` | `<app-btn-animated [variant]="'pulse'" />` |
| **`2.5.3.1`** | Animated (`2.5`) | **Shake**<br><sub>Sacudida al hacer hover</sub> | `<app-btn-animated>` | `src/app/components/buttons/animated` | `<app-btn-animated [variant]="'shake'" />` |
| **`2.5.4.1`** | Animated (`2.5`) | **Fill up**<br><sub>Relleno que sube</sub> | `<app-btn-animated>` | `src/app/components/buttons/animated` | `<app-btn-animated [variant]="'fill-up'" />` |
| **`2.5.5.1`** | Animated (`2.5`) | **Slide BG**<br><sub>Fondo que se desliza</sub> | `<app-btn-animated>` | `src/app/components/buttons/animated` | `<app-btn-animated [variant]="'slide-bg'" />` |
| **`2.5.6.1`** | Animated (`2.5`) | **Magnetic**<br><sub>Sigue el cursor</sub> | `<app-btn-animated>` | `src/app/components/buttons/animated` | `<app-btn-animated [variant]="'magnetic'" />` |
| **`2.6.1.1`** | 3D (`2.6`) | **Push**<br><sub>Se hunde hasta apoyarse en su base</sub> | `<app-btn-3d>` | `src/app/components/buttons/3d` | `<app-btn-3d [variant]="'push'" />` |
| **`2.6.2.1`** | 3D (`2.6`) | **Flip**<br><sub>Voltea en 3D al pasar el cursor</sub> | `<app-btn-3d>` | `src/app/components/buttons/3d` | `<app-btn-3d [variant]="'flip'" />` |
| **`2.6.3.1`** | 3D (`2.6`) | **Levitación**<br><sub>Pila de capas que se separa del suelo</sub> | `<app-btn-3d>` | `src/app/components/buttons/3d` | `<app-btn-3d [variant]="'levitate'" />` |
| **`2.7.1.1`** | Glass (`2.7`) | **Glass**<br><sub>Vidrio suave con brillo interior</sub> | `<app-btn-glass>` | `src/app/components/buttons/glass` | `<app-btn-glass [variant]="'glass'" />` |
| **`2.7.2.1`** | Glass (`2.7`) | **Frost**<br><sub>Escarchado con blur intenso</sub> | `<app-btn-glass>` | `src/app/components/buttons/glass` | `<app-btn-glass [variant]="'frost'" />` |
| **`2.7.3.1`** | Glass (`2.7`) | **Borde degradado**<br><sub>Contorno tornasol sobre vidrio</sub> | `<app-btn-glass>` | `src/app/components/buttons/glass` | `<app-btn-glass [variant]="'gradient-border'" />` |
| **`2.8.1.1`** | Mantener para confirmar (`2.8`) | **Liberar pedido**<br><sub>Mantén pulsado y suelta para confirmar la salida</sub> | `<app-btn-hold-confirm>` | `src/app/components/buttons/hold-confirm` | `<app-btn-hold-confirm [variant]="'dispatch'" />` |
| **`2.8.2.1`** | Mantener para confirmar (`2.8`) | **Publicar cambios**<br><sub>Confirma la publicación con una alternativa de dos pasos</sub> | `<app-btn-hold-confirm>` | `src/app/components/buttons/hold-confirm` | `<app-btn-hold-confirm [variant]="'publish'" />` |

---

## 3. Backgrounds

*Fondos degradados, partículas, grillas y mallas animadas*

| Código | Componente | Sub-estilo / Efecto | Selector | Carpeta a copiar | Uso Standalone |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **`3.1.1.1`** | Gradient (`3.1`) | **Sunset**<br><sub>Cálido, atardecer</sub> | `<app-bg-gradient>` | `src/app/components/backgrounds/gradient` | `<app-bg-gradient [variant]="'sunset'" />` |
| **`3.1.2.1`** | Gradient (`3.1`) | **Aurora**<br><sub>Verdes y violetas</sub> | `<app-bg-gradient>` | `src/app/components/backgrounds/gradient` | `<app-bg-gradient [variant]="'aurora'" />` |
| **`3.1.3.1`** | Gradient (`3.1`) | **Deep Ocean**<br><sub>Azules profundos</sub> | `<app-bg-gradient>` | `src/app/components/backgrounds/gradient` | `<app-bg-gradient [variant]="'deep-ocean'" />` |
| **`3.1.4.1`** | Gradient (`3.1`) | **Mesh**<br><sub>Malla de color suave</sub> | `<app-bg-gradient>` | `src/app/components/backgrounds/gradient` | `<app-bg-gradient [variant]="'mesh'" />` |
| **`3.1.5.1`** | Gradient (`3.1`) | **Radial Focus**<br><sub>Foco radial centrado</sub> | `<app-bg-gradient>` | `src/app/components/backgrounds/gradient` | `<app-bg-gradient [variant]="'radial'" />` |
| **`3.1.6.1`** | Gradient (`3.1`) | **Conic**<br><sub>Degradado cónico</sub> | `<app-bg-gradient>` | `src/app/components/backgrounds/gradient` | `<app-bg-gradient [variant]="'conic'" />` |
| **`3.2.1.1`** | Particle (`3.2`) | **Red de partículas**<br><sub>Canvas con enlaces por cercanía</sub> | `<app-bg-particle>` | `src/app/components/backgrounds/particle` | `<app-bg-particle [variant]="'default'" />` |
| **`3.3.1.1`** | Grid (`3.3`) | **Dot Grid**<br><sub>Puntos regulares</sub> | `<app-bg-grid>` | `src/app/components/backgrounds/grid` | `<app-bg-grid [variant]="'dots'" />` |
| **`3.3.2.1`** | Grid (`3.3`) | **Line Grid**<br><sub>Líneas ortogonales</sub> | `<app-bg-grid>` | `src/app/components/backgrounds/grid` | `<app-bg-grid [variant]="'lines'" />` |
| **`3.3.3.1`** | Grid (`3.3`) | **Fade Grid**<br><sub>Grilla que se desvanece</sub> | `<app-bg-grid>` | `src/app/components/backgrounds/grid` | `<app-bg-grid [variant]="'gradient'" />` |
| **`3.4.1.1`** | Animated Mesh (`3.4`) | **Mesh animado**<br><sub>Blobs de color en movimiento</sub> | `<app-bg-mesh>` | `src/app/components/backgrounds/animated-mesh` | `<app-bg-mesh [variant]="'default'" />` |
| **`3.5.1.1`** | Aurora (`3.5`) | **Aurora**<br><sub>Blobs difusos que derivan en diagonal</sub> | `<app-bg-aurora>` | `src/app/components/backgrounds/aurora` | `<app-bg-aurora [variant]="'aurora'" />` |
| **`3.5.2.1`** | Aurora (`3.5`) | **Haces**<br><sub>Columnas de luz que barren el fondo</sub> | `<app-bg-aurora>` | `src/app/components/backgrounds/aurora` | `<app-bg-aurora [variant]="'beams'" />` |
| **`3.5.3.1`** | Aurora (`3.5`) | **Con vidrio**<br><sub>Panel translúcido sobre la aurora</sub> | `<app-bg-aurora>` | `src/app/components/backgrounds/aurora` | `<app-bg-aurora [variant]="'glass'" />` |
| **`3.6.1.1`** | Fondo topográfico (`3.6`) | **Sierra central**<br><sub>Curvas de elevación sobre un fondo verde</sub> | `<app-bg-topographic>` | `src/app/components/backgrounds/topographic` | `<app-bg-topographic [variant]="'terrain'" />` |
| **`3.6.2.1`** | Fondo topográfico (`3.6`) | **Cuenca oceánica**<br><sub>Anillos de profundidad en azul</sub> | `<app-bg-topographic>` | `src/app/components/backgrounds/topographic` | `<app-bg-topographic [variant]="'bathymetry'" />` |
| **`3.6.3.1`** | Fondo topográfico (`3.6`) | **Meseta mineral**<br><sub>Relieve con tonos de arcilla</sub> | `<app-bg-topographic>` | `src/app/components/backgrounds/topographic` | `<app-bg-topographic [variant]="'plateau'" />` |

---

## 4. Typography

*Texto con neón, degradados y efecto máquina de escribir*

| Código | Componente | Sub-estilo / Efecto | Selector | Carpeta a copiar | Uso Standalone |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **`4.1.1.1`** | Glow Text (`4.1`) | **Cyan**<br><sub>.glow-cyan</sub> | `<app-text-glow>` | `src/app/components/typography/glow-text` | `<app-text-glow [variant]="'cyan'" />` |
| **`4.1.2.1`** | Glow Text (`4.1`) | **Rosa**<br><sub>.glow-pink</sub> | `<app-text-glow>` | `src/app/components/typography/glow-text` | `<app-text-glow [variant]="'pink'" />` |
| **`4.1.3.1`** | Glow Text (`4.1`) | **Verde Matrix**<br><sub>.glow-green</sub> | `<app-text-glow>` | `src/app/components/typography/glow-text` | `<app-text-glow [variant]="'green'" />` |
| **`4.1.4.1`** | Glow Text (`4.1`) | **Con pulso**<br><sub>.glow-pulse</sub> | `<app-text-glow>` | `src/app/components/typography/glow-text` | `<app-text-glow [variant]="'pulse'" />` |
| **`4.2.1.1`** | Gradient Text (`4.2`) | **Estático**<br><sub>.grad-static</sub> | `<app-text-gradient>` | `src/app/components/typography/gradient-text` | `<app-text-gradient [variant]="'static'" />` |
| **`4.2.2.1`** | Gradient Text (`4.2`) | **Animado**<br><sub>.grad-animated</sub> | `<app-text-gradient>` | `src/app/components/typography/gradient-text` | `<app-text-gradient [variant]="'animated'" />` |
| **`4.2.3.1`** | Gradient Text (`4.2`) | **Arcoíris**<br><sub>.grad-rainbow</sub> | `<app-text-gradient>` | `src/app/components/typography/gradient-text` | `<app-text-gradient [variant]="'rainbow'" />` |
| **`4.2.4.1`** | Gradient Text (`4.2`) | **Sutil**<br><sub>.grad-subtle, para párrafos</sub> | `<app-text-gradient>` | `src/app/components/typography/gradient-text` | `<app-text-gradient [variant]="'subtle'" />` |
| **`4.3.1.1`** | Typewriter (`4.3`) | **Terminal**<br><sub>Cursor, prompt y escribido secuencial</sub> | `<app-text-typewriter>` | `src/app/components/typography/typewriter` | `<app-text-typewriter [variant]="'default'" />` |
| **`4.4.1.1`** | 3D Text (`4.4`) | **Extrude**<br><sub>Canto sólido por capas de sombra</sub> | `<app-text-3d>` | `src/app/components/typography/3d-text` | `<app-text-3d [variant]="'extrude'" />` |
| **`4.4.2.1`** | 3D Text (`4.4`) | **Isométrico**<br><sub>Texto recostado con perspectiva</sub> | `<app-text-3d>` | `src/app/components/typography/3d-text` | `<app-text-3d [variant]="'isometric'" />` |
| **`4.4.3.1`** | 3D Text (`4.4`) | **Floating**<br><sub>Flota con su sombra en movimiento</sub> | `<app-text-3d>` | `src/app/components/typography/3d-text` | `<app-text-3d [variant]="'floating'" />` |
| **`4.5.1.1`** | Revelado tipográfico (`4.5`) | **Cortina ascendente**<br><sub>Las palabras suben desde una máscara</sub> | `<app-type-reveal-heading>` | `src/app/components/typography/reveal-heading` | `<app-type-reveal-heading [variant]="'mask'" />` |
| **`4.5.2.1`** | Revelado tipográfico (`4.5`) | **Barrido lateral**<br><sub>El título aparece con un corte horizontal</sub> | `<app-type-reveal-heading>` | `src/app/components/typography/reveal-heading` | `<app-type-reveal-heading [variant]="'shutter'" />` |
| **`4.5.3.1`** | Revelado tipográfico (`4.5`) | **Subrayado por palabras**<br><sub>Un trazo se dibuja debajo de cada palabra</sub> | `<app-type-reveal-heading>` | `src/app/components/typography/reveal-heading` | `<app-type-reveal-heading [variant]="'underline'" />` |

---

## 5. Navigation

*Sidebar colapsable y topbar responsiva*

| Código | Componente | Sub-estilo / Efecto | Selector | Carpeta a copiar | Uso Standalone |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **`5.1.1.1`** | Sidebar (`5.1`) | **Colapsable**<br><sub>Colapsa con ☰ y recuerda el item activo</sub> | `<app-nav-sidebar>` | `src/app/components/navigation/sidebar` | `<app-nav-sidebar [variant]="'default'" />` |
| **`5.2.1.1`** | Topbar (`5.2`) | **Con menú mobile**<br><sub>Menú ☰ accesible por teclado</sub> | `<app-nav-topbar>` | `src/app/components/navigation/topbar` | `<app-nav-topbar [variant]="'default'" />` |
| **`5.3.1.1`** | Dock (`5.3`) | **Flotante**<br><sub>Píldora flotante con magnificación al pasar el cursor</sub> | `<app-nav-dock>` | `src/app/components/navigation/dock` | `<app-nav-dock [variant]="'floating'" />` |
| **`5.3.2.1`** | Dock (`5.3`) | **Cristal**<br><sub>Vidrio transparente sobre color</sub> | `<app-nav-dock>` | `src/app/components/navigation/dock` | `<app-nav-dock [variant]="'glass'" />` |
| **`5.3.3.1`** | Dock (`5.3`) | **Barra**<br><sub>Barra inferior a ancho completo</sub> | `<app-nav-dock>` | `src/app/components/navigation/dock` | `<app-nav-dock [variant]="'bar'" />` |
| **`5.4.1.1`** | Glass Tabs (`5.4`) | **Vidrio**<br><sub>Barra de vidrio con pastilla que se desliza</sub> | `<app-nav-tabs>` | `src/app/components/navigation/glass-tabs` | `<app-nav-tabs [variant]="'glass'" />` |
| **`5.4.2.1`** | Glass Tabs (`5.4`) | **Subrayado**<br><sub>Línea luminosa que sigue a la pestaña</sub> | `<app-nav-tabs>` | `src/app/components/navigation/glass-tabs` | `<app-nav-tabs [variant]="'underline'" />` |
| **`5.5.1.1`** | Breadcrumbs (`5.5`) | **Chevron**<br><sub>Flechas entre niveles</sub> | `<app-nav-breadcrumbs>` | `src/app/components/navigation/breadcrumbs` | `<app-nav-breadcrumbs [variant]="'chevron'" />` |
| **`5.5.2.1`** | Breadcrumbs (`5.5`) | **Slash**<br><sub>Barra monoespaciada</sub> | `<app-nav-breadcrumbs>` | `src/app/components/navigation/breadcrumbs` | `<app-nav-breadcrumbs [variant]="'slash'" />` |
| **`5.5.3.1`** | Breadcrumbs (`5.5`) | **Vidrio**<br><sub>Píldora translúcida sobre color</sub> | `<app-nav-breadcrumbs>` | `src/app/components/navigation/breadcrumbs` | `<app-nav-breadcrumbs [variant]="'glass'" />` |
| **`5.6.1.1`** | Pagination (`5.6`) | **Números**<br><sub>Página activa con elipsis dinámico</sub> | `<app-nav-pagination>` | `src/app/components/navigation/pagination` | `<app-nav-pagination [variant]="'numbers'" />` |
| **`5.6.2.1`** | Pagination (`5.6`) | **Compacta**<br><sub>"Página X de Y" con flechas</sub> | `<app-nav-pagination>` | `src/app/components/navigation/pagination` | `<app-nav-pagination [variant]="'compact'" />` |
| **`5.6.3.1`** | Pagination (`5.6`) | **Vidrio**<br><sub>Píldora translucida sobre color</sub> | `<app-nav-pagination>` | `src/app/components/navigation/pagination` | `<app-nav-pagination [variant]="'glass'" />` |
| **`5.7.1.1`** | Stepper (`5.7`) | **Horizontal**<br><sub>Pasos en fila con conectores</sub> | `<app-nav-stepper>` | `src/app/components/navigation/stepper` | `<app-nav-stepper [variant]="'horizontal'" />` |
| **`5.7.2.1`** | Stepper (`5.7`) | **Vertical**<br><sub>Pasos apilados con línea izquierda</sub> | `<app-nav-stepper>` | `src/app/components/navigation/stepper` | `<app-nav-stepper [variant]="'vertical'" />` |
| **`5.7.3.1`** | Stepper (`5.7`) | **Progreso**<br><sub>Barra de progreso con puntos</sub> | `<app-nav-stepper>` | `src/app/components/navigation/stepper` | `<app-nav-stepper [variant]="'progress'" />` |
| **`5.8.1.1`** | Explorador de archivos (`5.8`) | **Terminal oscura**<br><sub>Abre carpetas con las flechas y selecciona archivos</sub> | `<app-nav-tree-explorer>` | `src/app/components/navigation/tree-explorer` | `<app-nav-tree-explorer [variant]="'midnight'" />` |
| **`5.8.2.1`** | Explorador de archivos (`5.8`) | **Papel claro**<br><sub>Explorador claro con navegación jerárquica y vista previa</sub> | `<app-nav-tree-explorer>` | `src/app/components/navigation/tree-explorer` | `<app-nav-tree-explorer [variant]="'paper'" />` |

---

## 6. Forms

*Inputs de vidrio, toggles y checkboxes accesibles*

| Código | Componente | Sub-estilo / Efecto | Selector | Carpeta a copiar | Uso Standalone |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **`6.1.1.1`** | Glass Input (`6.1`) | **Formulario**<br><sub>Input, email y textarea con highlight</sub> | `<app-form-glass-input>` | `src/app/components/forms/glass-input` | `<app-form-glass-input [variant]="'default'" />` |
| **`6.2.1.1`** | Toggle (`6.2`) | **Switches**<br><sub>aria-checked y navegable por teclado</sub> | `<app-form-toggle>` | `src/app/components/forms/toggle` | `<app-form-toggle [variant]="'default'" />` |
| **`6.3.1.1`** | Checkbox (`6.3`) | **Checkboxes**<br><sub>Con icono de check animado</sub> | `<app-form-checkbox>` | `src/app/components/forms/checkbox` | `<app-form-checkbox [variant]="'default'" />` |
| **`6.4.1.1`** | Segmented (`6.4`) | **Vidrio**<br><sub>Translúcido con pulgar que se desliza</sub> | `<app-form-segmented>` | `src/app/components/forms/segmented` | `<app-form-segmented [variant]="'glass'" />` |
| **`6.4.2.1`** | Segmented (`6.4`) | **Sólido**<br><sub>Pulgar sólido sobre panel oscuro</sub> | `<app-form-segmented>` | `src/app/components/forms/segmented` | `<app-form-segmented [variant]="'solid'" />` |
| **`6.5.1.1`** | OTP Input (`6.5`) | **Cajas**<br><sub>Dígitos en cajas de vidrio con blur</sub> | `<app-form-otp>` | `src/app/components/forms/otp` | `<app-form-otp [variant]="'boxes'" />` |
| **`6.5.2.1`** | OTP Input (`6.5`) | **Subrayado**<br><sub>Dígitos mono sobre línea de color</sub> | `<app-form-otp>` | `src/app/components/forms/otp` | `<app-form-otp [variant]="'underline'" />` |
| **`6.6.1.1`** | Rating (`6.6`) | **Estrellas**<br><sub>5 estrellas con hover dorado</sub> | `<app-form-rating>` | `src/app/components/forms/rating` | `<app-form-rating [variant]="'stars'" />` |
| **`6.6.2.1`** | Rating (`6.6`) | **Segmentos**<br><sub>Botones 1–5 con etiquetas</sub> | `<app-form-rating>` | `src/app/components/forms/rating` | `<app-form-rating [variant]="'segments'" />` |
| **`6.7.1.1`** | Range Slider (`6.7`) | **Degradado**<br><sub>Pista indigo→rosa con pulgar blanco</sub> | `<app-form-range>` | `src/app/components/forms/range` | `<app-form-range [variant]="'gradient'" />` |
| **`6.7.2.1`** | Range Slider (`6.7`) | **Vidrio**<br><sub>Pulgar translúcido con borde luminoso</sub> | `<app-form-range>` | `src/app/components/forms/range` | `<app-form-range [variant]="'glass'" />` |
| **`6.8.1.1`** | Requisitos de contraseña (`6.8`) | **Panel oscuro**<br><sub>Indicador por segmentos y requisitos en vivo</sub> | `<app-form-password-strength>` | `src/app/components/forms/password-strength` | `<app-form-password-strength [variant]="'security'" />` |
| **`6.8.2.1`** | Requisitos de contraseña (`6.8`) | **Compacto claro**<br><sub>Validación en una ficha clara de menor altura</sub> | `<app-form-password-strength>` | `src/app/components/forms/password-strength` | `<app-form-password-strength [variant]="'compact'" />` |
| **`6.9.1.1`** | Zona para adjuntar archivos (`6.9`) | **Documentos**<br><sub>Adjunta PDF, CSV y XLSX y revisa el tamaño</sub> | `<app-form-file-drop>` | `src/app/components/forms/file-drop` | `<app-form-file-drop [variant]="'documents'" />` |
| **`6.9.2.1`** | Zona para adjuntar archivos (`6.9`) | **Imágenes**<br><sub>Selecciona imágenes en una zona de arrastre oscura</sub> | `<app-form-file-drop>` | `src/app/components/forms/file-drop` | `<app-form-file-drop [variant]="'images'" />` |

**Glass Input** requiere @angular/forms en la misma versión que @angular/core.

---

## 7. Modals

*Modal de vidrio y panel lateral con foco gestionado*

| Código | Componente | Sub-estilo / Efecto | Selector | Carpeta a copiar | Uso Standalone |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **`7.1.1.1`** | Glass Modal (`7.1`) | **Modal**<br><sub>Se abre dentro del entorno, no sobre toda la app</sub> | `<app-modal-glass>` | `src/app/components/modals/glass-modal` | `<app-modal-glass [variant]="'default'" />` |
| **`7.2.1.1`** | Slide-in Panel (`7.2`) | **Panel lateral**<br><sub>Entra desde la derecha, cierra con Escape</sub> | `<app-modal-slide-in>` | `src/app/components/modals/slide-in` | `<app-modal-slide-in [variant]="'default'" />` |
| **`7.3.1.1`** | Command Palette (`7.3`) | **Paleta de comandos**<br><sub>Flechas para moverse, Enter para ejecutar, Escape para cerrar</sub> | `<app-modal-palette>` | `src/app/components/modals/command-palette` | `<app-modal-palette [variant]="'default'" />` |
| **`7.4.1.1`** | Confirm Dialog (`7.4`) | **Peligro**<br><sub>Acento rojo con icono de advertencia</sub> | `<app-modal-confirm>` | `src/app/components/modals/confirm` | `<app-modal-confirm [variant]="'danger'" />` |
| **`7.4.2.1`** | Confirm Dialog (`7.4`) | **Vidrio**<br><sub>Panel translúcido con blur</sub> | `<app-modal-confirm>` | `src/app/components/modals/confirm` | `<app-modal-confirm [variant]="'glass'" />` |
| **`7.5.1.1`** | Bottom Sheet (`7.5`) | **Sólido**<br><sub>Panel oscuro desde abajo</sub> | `<app-modal-sheet>` | `src/app/components/modals/bottom-sheet` | `<app-modal-sheet [variant]="'solid'" />` |
| **`7.5.2.1`** | Bottom Sheet (`7.5`) | **Vidrio**<br><sub>Panel translúcido con blur</sub> | `<app-modal-sheet>` | `src/app/components/modals/bottom-sheet` | `<app-modal-sheet [variant]="'glass'" />` |
| **`7.6.1.1`** | Lightbox (`7.6`) | **Foto**<br><sub>Visor oscuro con flechas</sub> | `<app-modal-lightbox>` | `src/app/components/modals/lightbox` | `<app-modal-lightbox [variant]="'photo'" />` |
| **`7.6.2.1`** | Lightbox (`7.6`) | **Vidrio**<br><sub>Miniaturas con efecto de vidrio</sub> | `<app-modal-lightbox>` | `src/app/components/modals/lightbox` | `<app-modal-lightbox [variant]="'glass'" />` |
| **`7.7.1.1`** | Asistente de informes (`7.7`) | **Papel claro**<br><sub>Configura área y periodo y revisa los datos antes de solicitar</sub> | `<app-modal-report-wizard>` | `src/app/components/modals/report-wizard` | `<app-modal-report-wizard [variant]="'paper'" />` |
| **`7.7.2.1`** | Asistente de informes (`7.7`) | **Verde nocturno**<br><sub>Asistente oscuro con diálogo nativo y confirmación</sub> | `<app-modal-report-wizard>` | `src/app/components/modals/report-wizard` | `<app-modal-report-wizard [variant]="'night'" />` |
| **`7.8.1.1`** | Compartir acceso (`7.8`) | **Estudio violeta**<br><sub>Agrega colaboradores, cambia sus permisos y copia el enlace</sub> | `<app-modal-share-access>` | `src/app/components/modals/share-access` | `<app-modal-share-access [variant]="'studio'" />` |
| **`7.8.2.1`** | Compartir acceso (`7.8`) | **Papel claro**<br><sub>Gestiona el acceso desde un diálogo en tonos claros</sub> | `<app-modal-share-access>` | `src/app/components/modals/share-access` | `<app-modal-share-access [variant]="'paper'" />` |

---

## 8. Themes

*Cinco temas completos basados en variables CSS*

| Código | Componente | Sub-estilo / Efecto | Selector | Carpeta a copiar | Uso Standalone |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **`8.1.1.1`** | Dark (`8.1`) | **Superficies**<br><sub>Fondos y capas</sub> | `<app-theme-dark>` | `src/app/components/themes/dark` | `<app-theme-dark [variant]="'surfaces'" />` |
| **`8.1.2.1`** | Dark (`8.1`) | **Acento**<br><sub>Indigo de marca</sub> | `<app-theme-dark>` | `src/app/components/themes/dark` | `<app-theme-dark [variant]="'accent'" />` |
| **`8.1.3.1`** | Dark (`8.1`) | **Neutros**<br><sub>Escala de grises</sub> | `<app-theme-dark>` | `src/app/components/themes/dark` | `<app-theme-dark [variant]="'neutrals'" />` |
| **`8.2.1.1`** | Light (`8.2`) | **Superficies**<br><sub>Blancos y grises claros</sub> | `<app-theme-light>` | `src/app/components/themes/light` | `<app-theme-light [variant]="'surfaces'" />` |
| **`8.2.2.1`** | Light (`8.2`) | **Acento**<br><sub>Azules de marca</sub> | `<app-theme-light>` | `src/app/components/themes/light` | `<app-theme-light [variant]="'accent'" />` |
| **`8.2.3.1`** | Light (`8.2`) | **Neutros**<br><sub>Texto y bordes</sub> | `<app-theme-light>` | `src/app/components/themes/light` | `<app-theme-light [variant]="'neutrals'" />` |
| **`8.3.1.1`** | Hacker (`8.3`) | **Terminal**<br><sub>Simulación de shell con cursor</sub> | `<app-theme-hacker>` | `src/app/components/themes/hacker` | `<app-theme-hacker [variant]="'terminal'" />` |
| **`8.3.2.1`** | Hacker (`8.3`) | **Paleta**<br><sub>Verdes fosforescentes</sub> | `<app-theme-hacker>` | `src/app/components/themes/hacker` | `<app-theme-hacker [variant]="'palette'" />` |
| **`8.4.1.1`** | Cyberpunk (`8.4`) | **Título glitch**<br><sub>Texto con desplazamiento RGB</sub> | `<app-theme-cyberpunk>` | `src/app/components/themes/cyberpunk` | `<app-theme-cyberpunk [variant]="'glitch'" />` |
| **`8.4.2.1`** | Cyberpunk (`8.4`) | **Subtítulo**<br><sub>Línea monoespaciada</sub> | `<app-theme-cyberpunk>` | `src/app/components/themes/cyberpunk` | `<app-theme-cyberpunk [variant]="'subtitle'" />` |
| **`8.4.3.1`** | Cyberpunk (`8.4`) | **Paleta**<br><sub>Neones saturados</sub> | `<app-theme-cyberpunk>` | `src/app/components/themes/cyberpunk` | `<app-theme-cyberpunk [variant]="'palette'" />` |
| **`8.5.1.1`** | Corporate (`8.5`) | **Cabecera**<br><sub>Logo y jerarquía</sub> | `<app-theme-corporate>` | `src/app/components/themes/corporate` | `<app-theme-corporate [variant]="'header'" />` |
| **`8.5.2.1`** | Corporate (`8.5`) | **Paleta**<br><sub>Azules corporativos y grises</sub> | `<app-theme-corporate>` | `src/app/components/themes/corporate` | `<app-theme-corporate [variant]="'palette'" />` |
| **`8.6.1.1`** | Tema editorial (`8.6`) | **Papel cálido**<br><sub>Consulta la bitácora y guarda artículos sobre una superficie clara</sub> | `<app-theme-editorial>` | `src/app/components/themes/editorial` | `<app-theme-editorial [variant]="'paper'" />` |
| **`8.6.2.1`** | Tema editorial (`8.6`) | **Lectura nocturna**<br><sub>Explora la misma bitácora en verde oscuro</sub> | `<app-theme-editorial>` | `src/app/components/themes/editorial` | `<app-theme-editorial [variant]="'night'" />` |

---

## 9. Animations

*Skeleton, spinner, giro de página, libro 3D, esquina doblada y marquee*

| Código | Componente | Sub-estilo / Efecto | Selector | Carpeta a copiar | Uso Standalone |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **`9.1.1.1`** | Skeleton (`9.1`) | **Shimmer**<br><sub>Brillo que se desplaza de izquierda a derecha</sub> | `<app-anim-skeleton>` | `src/app/components/animations/skeleton` | `<app-anim-skeleton [variant]="'shimmer'" />` |
| **`9.1.2.1`** | Skeleton (`9.1`) | **Pulso**<br><sub>Opacidad que sube y baja suavemente</sub> | `<app-anim-skeleton>` | `src/app/components/animations/skeleton` | `<app-anim-skeleton [variant]="'pulse'" />` |
| **`9.1.3.1`** | Skeleton (`9.1`) | **Onda**<br><sub>Ola azul que avanza por las líneas</sub> | `<app-anim-skeleton>` | `src/app/components/animations/skeleton` | `<app-anim-skeleton [variant]="'wave'" />` |
| **`9.2.1.1`** | Spinner (`9.2`) | **Anillo**<br><sub>Círculo que gira con borde de color</sub> | `<app-anim-spinner>` | `src/app/components/animations/spinner` | `<app-anim-spinner [variant]="'ring'" />` |
| **`9.2.2.1`** | Spinner (`9.2`) | **Puntos**<br><sub>Tres puntos que rebotan</sub> | `<app-anim-spinner>` | `src/app/components/animations/spinner` | `<app-anim-spinner [variant]="'dots'" />` |
| **`9.2.3.1`** | Spinner (`9.2`) | **Barra**<br><sub>Barra con degradado que avanza</sub> | `<app-anim-spinner>` | `src/app/components/animations/spinner` | `<app-anim-spinner [variant]="'bar'" />` |
| **`9.3.1.1`** | Page Flip (`9.3`) | **Tarjeta**<br><sub>Hoja interactiva frontal y reverso con click</sub> | `<app-anim-page-flip>` | `src/app/components/animations/page-flip` | `<app-anim-page-flip [variant]="'card'" />` |
| **`9.3.2.1`** | Page Flip (`9.3`) | **Editorial**<br><sub>Estilo página de revista con tipografía y número</sub> | `<app-anim-page-flip>` | `src/app/components/animations/page-flip` | `<app-anim-page-flip [variant]="'editorial'" />` |
| **`9.3.3.1`** | Page Flip (`9.3`) | **Brillo**<br><sub>Efecto satinado con reflejo de luz al voltear</sub> | `<app-anim-page-flip>` | `src/app/components/animations/page-flip` | `<app-anim-page-flip [variant]="'glossy'" />` |
| **`9.4.1.1`** | Book Flip (`9.4`) | **Clásico**<br><sub>Lomo realista, sombras de pliegue y navegación completa</sub> | `<app-anim-book-flip>` | `src/app/components/animations/book-flip` | `<app-anim-book-flip [variant]="'classic'" />` |
| **`9.4.2.1`** | Book Flip (`9.4`) | **Cuaderno**<br><sub>Estilo cuadrícula con tipografía monoespaciada</sub> | `<app-anim-book-flip>` | `src/app/components/animations/book-flip` | `<app-anim-book-flip [variant]="'notebook'" />` |
| **`9.4.3.1`** | Book Flip (`9.4`) | **Pergamino**<br><sub>Tono editorial cálido y bordes dorados</sub> | `<app-anim-book-flip>` | `src/app/components/animations/book-flip` | `<app-anim-book-flip [variant]="'parchment'" />` |
| **`9.5.1.1`** | Corner Fold (`9.5`) | **Nota**<br><sub>Esquina superior derecha doblada con elevación al hover</sub> | `<app-anim-corner-fold>` | `src/app/components/animations/corner-fold` | `<app-anim-corner-fold [variant]="'note'" />` |
| **`9.5.2.1`** | Corner Fold (`9.5`) | **Documento**<br><sub>Hoja técnica con pliegue pronunciado y sello de verificación</sub> | `<app-anim-corner-fold>` | `src/app/components/animations/corner-fold` | `<app-anim-corner-fold [variant]="'document'" />` |
| **`9.5.3.1`** | Corner Fold (`9.5`) | **Despegue**<br><sub>Efecto pegatina o sticker que se levanta interactivamente</sub> | `<app-anim-corner-fold>` | `src/app/components/animations/corner-fold` | `<app-anim-corner-fold [variant]="'peel'" />` |
| **`9.6.1.1`** | Marquee (`9.6`) | **Texto**<br><sub>Palabras en loop con separadores y estilos alternados</sub> | `<app-anim-marquee>` | `src/app/components/animations/marquee` | `<app-anim-marquee [variant]="'text'" />` |
| **`9.6.2.1`** | Marquee (`9.6`) | **Bidireccional**<br><sub>Dos filas en direcciones opuestas a distinta velocidad</sub> | `<app-anim-marquee>` | `src/app/components/animations/marquee` | `<app-anim-marquee [variant]="'dual'" />` |
| **`9.6.3.1`** | Marquee (`9.6`) | **Logos**<br><sub>Fila de marcas que se pausa al pasar el cursor</sub> | `<app-anim-marquee>` | `src/app/components/animations/marquee` | `<app-anim-marquee [variant]="'logos'" />` |
| **`9.7.1.1`** | Contador animado (`9.7`) | **Pedidos despachados**<br><sub>Reproduce un conteo entero con barra de progreso</sub> | `<app-anim-count-up>` | `src/app/components/animations/count-up` | `<app-anim-count-up [variant]="'fulfillment'" />` |
| **`9.7.2.1`** | Contador animado (`9.7`) | **Tasa de conversión**<br><sub>Anima el valor de un porcentaje con decimales</sub> | `<app-anim-count-up>` | `src/app/components/animations/count-up` | `<app-anim-count-up [variant]="'conversion'" />` |

---

## 10. Charts

*Gráficos interactivos animados con GSAP y renderizado SVG/Canvas reactivo*

| Código | Componente | Sub-estilo / Efecto | Selector | Carpeta a copiar | Uso Standalone |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **`10.1.1.1`** | Line Chart (`10.1`) | **Curva Spline**<br><sub>Curva Bézier continua con área degradada y trazado GSAP</sub> | `<app-chart-line>` | `src/app/components/charts/line-chart` | `<app-chart-line [variant]="'smooth'" />` |
| **`10.1.2.1`** | Line Chart (`10.1`) | **Cyber Stepped**<br><sub>Línea escalonada digital tech con radar scan y grid</sub> | `<app-chart-line>` | `src/app/components/charts/line-chart` | `<app-chart-line [variant]="'cyber'" />` |
| **`10.1.3.1`** | Line Chart (`10.1`) | **Doble Serie**<br><sub>Series comparativas superpuestas con leyenda y tooltips</sub> | `<app-chart-line>` | `src/app/components/charts/line-chart` | `<app-chart-line [variant]="'multi'" />` |
| **`10.2.1.1`** | Bar Chart (`10.2`) | **Columnas Neón**<br><sub>Columnas verticales con rebote elástico y contador numérico</sub> | `<app-chart-bar>` | `src/app/components/charts/bar-chart` | `<app-chart-bar [variant]="'columns'" />` |
| **`10.2.2.1`** | Bar Chart (`10.2`) | **Cristal Glass**<br><sub>Barras translúcidas con reflejos especulares y blur</sub> | `<app-chart-bar>` | `src/app/components/charts/bar-chart` | `<app-chart-bar [variant]="'glass'" />` |
| **`10.2.3.1`** | Bar Chart (`10.2`) | **Progreso Ranking**<br><sub>Barras horizontales fluidas ideales para métricas y rankings</sub> | `<app-chart-bar>` | `src/app/components/charts/bar-chart` | `<app-chart-bar [variant]="'horizontal'" />` |
| **`10.3.1.1`** | Histogram (`10.3`) | **Gauss Normal**<br><sub>Campana de Gauss con ajuste de densidad normal suave vía GSAP</sub> | `<app-chart-histogram>` | `src/app/components/charts/histogram` | `<app-chart-histogram [variant]="'gauss'" />` |
| **`10.3.2.1`** | Histogram (`10.3`) | **Bins de Frecuencia**<br><sub>Bins discretos con gradientes de densidad según frecuencia</sub> | `<app-chart-histogram>` | `src/app/components/charts/histogram` | `<app-chart-histogram [variant]="'bins'" />` |
| **`10.3.3.1`** | Histogram (`10.3`) | **Ojiva Acumulada**<br><sub>Curva sigmoide de distribución acumulativa y percentiles</sub> | `<app-chart-histogram>` | `src/app/components/charts/histogram` | `<app-chart-histogram [variant]="'cumulative'" />` |
| **`10.4.1.1`** | Donut & Gauge (`10.4`) | **Anillo Neón**<br><sub>Anillo radial continuo con porcentaje central animado y glow</sub> | `<app-chart-donut>` | `src/app/components/charts/donut-chart` | `<app-chart-donut [variant]="'ring'" />` |
| **`10.4.2.1`** | Donut & Gauge (`10.4`) | **Semi-Gauge**<br><sub>Velocímetro / tacómetro de 180° con rebote elástico vía GSAP</sub> | `<app-chart-donut>` | `src/app/components/charts/donut-chart` | `<app-chart-donut [variant]="'gauge'" />` |
| **`10.4.3.1`** | Donut & Gauge (`10.4`) | **Dona Segmentada**<br><sub>Múltiples rebanadas categóricas proporcionales con leyenda reactiva</sub> | `<app-chart-donut>` | `src/app/components/charts/donut-chart` | `<app-chart-donut [variant]="'segmented'" />` |
| **`10.5.1.1`** | Radar & Spider (`10.5`) | **Polígono Cyber**<br><sub>Polígono radial hexagonal con rebote elástico en vértices vía GSAP</sub> | `<app-chart-radar>` | `src/app/components/charts/radar-chart` | `<app-chart-radar [variant]="'polygon'" />` |
| **`10.5.2.1`** | Radar & Spider (`10.5`) | **Comparativa Dual**<br><sub>Dos perfiles superpuestos A vs B con áreas semitransparentes</sub> | `<app-chart-radar>` | `src/app/components/charts/radar-chart` | `<app-chart-radar [variant]="'dual'" />` |
| **`10.5.3.1`** | Radar & Spider (`10.5`) | **Escáner Sonar**<br><sub>Barrido rotatorio continuo 360° con nodos de datos iluminados</sub> | `<app-chart-radar>` | `src/app/components/charts/radar-chart` | `<app-chart-radar [variant]="'scanner'" />` |
| **`10.6.1.1`** | Gráfico de cascada (`10.6`) | **Flujo financiero**<br><sub>Rastrea el impacto de ventas y gastos en el saldo</sub> | `<app-chart-waterfall>` | `src/app/components/charts/waterfall-chart` | `<app-chart-waterfall [variant]="'finance'" />` |
| **`10.6.2.1`** | Gráfico de cascada (`10.6`) | **Movimientos de inventario**<br><sub>Compara compras, salidas, retornos y mermas</sub> | `<app-chart-waterfall>` | `src/app/components/charts/waterfall-chart` | `<app-chart-waterfall [variant]="'inventory'" />` |

**Line Chart** · `npm install gsap@^3.15.1`

**Bar Chart** · `npm install gsap@^3.15.1`

**Histogram** · `npm install gsap@^3.15.1`

**Donut & Gauge** · `npm install gsap@^3.15.1`

**Radar & Spider** · `npm install gsap@^3.15.1`

---

## 11. Feedback

*Microinteracciones, islas dinámicas, toasts apilables y efectos de celebración*

| Código | Componente | Sub-estilo / Efecto | Selector | Carpeta a copiar | Uso Standalone |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **`11.1.1.1`** | Dynamic Island (`11.1`) | **Player Música**<br><sub>Mini reproductor con ecualizador animado y controles expandibles</sub> | `<app-dynamic-island>` | `src/app/components/feedback/dynamic-island` | `<app-dynamic-island [variant]="'music'" />` |
| **`11.1.2.1`** | Dynamic Island (`11.1`) | **Timer de Enfoque**<br><sub>Temporizador con cuenta regresiva circular y barra de progreso</sub> | `<app-dynamic-island>` | `src/app/components/feedback/dynamic-island` | `<app-dynamic-island [variant]="'timer'" />` |
| **`11.1.3.1`** | Dynamic Island (`11.1`) | **Llamada Entrante**<br><sub>Alerta de llamada con pulso de estado y botones de acción</sub> | `<app-dynamic-island>` | `src/app/components/feedback/dynamic-island` | `<app-dynamic-island [variant]="'call'" />` |
| **`11.2.1.1`** | Stacked Toast (`11.2`) | **Pila 3D**<br><sub>Notificaciones apiladas en perspectiva con descarte interactivo</sub> | `<app-toast-stack>` | `src/app/components/feedback/toast` | `<app-toast-stack [variant]="'stacked'" />` |
| **`11.2.2.1`** | Stacked Toast (`11.2`) | **Swipe Descarte**<br><sub>Descarte lateral de notificaciones con feedback táctil</sub> | `<app-toast-stack>` | `src/app/components/feedback/toast` | `<app-toast-stack [variant]="'swipe'" />` |
| **`11.2.3.1`** | Stacked Toast (`11.2`) | **Morph Check**<br><sub>Transición morphing de spinner a checkmark de éxito animado</sub> | `<app-toast-stack>` | `src/app/components/feedback/toast` | `<app-toast-stack [variant]="'morph'" />` |
| **`11.3.1.1`** | Confetti & Bursts (`11.3`) | **Explosión Radial**<br><sub>Estallido radial de 110 partículas multicolor con física de gravedad</sub> | `<app-confetti-burst>` | `src/app/components/feedback/confetti` | `<app-confetti-burst [variant]="'explosion'" />` |
| **`11.3.2.1`** | Confetti & Bursts (`11.3`) | **Doble Cañón**<br><sub>Disparo cruzado en arco desde las esquinas inferiores</sub> | `<app-confetti-burst>` | `src/app/components/feedback/confetti` | `<app-confetti-burst [variant]="'cannons'" />` |
| **`11.3.3.1`** | Confetti & Bursts (`11.3`) | **Fuegos Artificiales**<br><sub>Estallidos múltiples en cascada superior con estelas luminosas</sub> | `<app-confetti-burst>` | `src/app/components/feedback/confetti` | `<app-confetti-burst [variant]="'fireworks'" />` |
| **`11.4.1.1`** | Progreso por etapas (`11.4`) | **Generar informe**<br><sub>Sigue la generación simulada de un informe</sub> | `<app-feedback-task-progress>` | `src/app/components/feedback/task-progress` | `<app-feedback-task-progress [variant]="'report'" />` |
| **`11.4.2.1`** | Progreso por etapas (`11.4`) | **Sincronizar inventario**<br><sub>Sigue las etapas de una sincronización de existencias</sub> | `<app-feedback-task-progress>` | `src/app/components/feedback/task-progress` | `<app-feedback-task-progress [variant]="'sync'" />` |

**Dynamic Island** · `npm install gsap@^3.15.1`

---

## 12. Media & 3D

*Experiencias inmersivas, giroscopio 3D, comparadores visuales y visualizadores de audio*

| Código | Componente | Sub-estilo / Efecto | Selector | Carpeta a copiar | Uso Standalone |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **`12.1.1.1`** | Tilt Card 3D (`12.1`) | **Giroscopio 3D**<br><sub>Inclinación reactiva según el puntero con reflejo especular dinámico</sub> | `<app-media-tilt-card>` | `src/app/components/media-3d/tilt-card` | `<app-media-tilt-card [variant]="'gyro'" />` |
| **`12.1.2.1`** | Tilt Card 3D (`12.1`) | **Capas Parallax Z**<br><sub>Capas desacopladas flotando en el eje Z con sensación de profundidad</sub> | `<app-media-tilt-card>` | `src/app/components/media-3d/tilt-card` | `<app-media-tilt-card [variant]="'layers'" />` |
| **`12.1.3.1`** | Tilt Card 3D (`12.1`) | **Prisma Holográfico**<br><sub>Gradiente iridiscente que muta de tono según el ángulo de inclinación</sub> | `<app-media-tilt-card>` | `src/app/components/media-3d/tilt-card` | `<app-media-tilt-card [variant]="'hologram'" />` |
| **`12.2.1.1`** | Before & After (`12.2`) | **Split Slider**<br><sub>Arrastra el divisor o usa el control para revelar el acabado</sub> | `<app-media-before-after>` | `src/app/components/media-3d/before-after` | `<app-media-before-after [variant]="'split'" />` |
| **`12.2.2.1`** | Before & After (`12.2`) | **Cross-Fade**<br><sub>Mezcla la estructura y el acabado de la misma pieza</sub> | `<app-media-before-after>` | `src/app/components/media-3d/before-after` | `<app-media-before-after [variant]="'fade'" />` |
| **`12.2.3.1`** | Before & After (`12.2`) | **Escáner Automático**<br><sub>Explora la pieza con un barrido automático que puedes pausar</sub> | `<app-media-before-after>` | `src/app/components/media-3d/before-after` | `<app-media-before-after [variant]="'scanner'" />` |
| **`12.3.1.1`** | Audio Visualizer (`12.3`) | **Ecualizador Estéreo**<br><sub>32 bandas de frecuencia con oscilación reactiva y reflejo de piso</sub> | `<app-media-audio-visualizer>` | `src/app/components/media-3d/audio-visualizer` | `<app-media-audio-visualizer [variant]="'bars'" />` |
| **`12.3.2.1`** | Audio Visualizer (`12.3`) | **Anillos de Pulso**<br><sub>Ondas circulares concéntricas de pulso radial acústico</sub> | `<app-media-audio-visualizer>` | `src/app/components/media-3d/audio-visualizer` | `<app-media-audio-visualizer [variant]="'radial'" />` |
| **`12.3.3.1`** | Audio Visualizer (`12.3`) | **Onda Sinusoidal**<br><sub>Trazado continuo suave con oscilación espectral y resplandor neón</sub> | `<app-media-audio-visualizer>` | `src/app/components/media-3d/audio-visualizer` | `<app-media-audio-visualizer [variant]="'wave'" />` |
| **`12.4.1.1`** | Escenas Three.js (`12.4`) | **Nudo escultórico**<br><sub>Nudo toroidal giratorio con iluminación cálida y contraluz</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'sculpture'" />` |
| **`12.4.2.1`** | Escenas Three.js (`12.4`) | **Anillos orbitales**<br><sub>Tres satélites recorren órbitas inclinadas alrededor de un núcleo facetado</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'orbit'" />` |
| **`12.4.3.1`** | Escenas Three.js (`12.4`) | **Campo de ondas**<br><sub>Una onda radial recorre 289 columnas renderizadas con InstancedMesh</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'waves'" />` |
| **`12.4.4.1`** | Escenas Three.js (`12.4`) | **Dunas de luz**<br><sub>Una superficie ondulante combina relieve iluminado y una malla de alambre</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'dunes'" />` |
| **`12.4.5.1`** | Escenas Three.js (`12.4`) | **Nebulosa espiral**<br><sub>1 800 partículas forman cuatro brazos alrededor de un núcleo luminoso</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'nebula'" />` |
| **`12.4.6.1`** | Escenas Three.js (`12.4`) | **Doble hélice**<br><sub>Dos hebras de esferas facetadas giran alrededor de un eje común</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'helix'" />` |
| **`12.4.7.1`** | Escenas Three.js (`12.4`) | **Mosaico cinético**<br><sub>81 baldosas se levantan y giran siguiendo una onda diagonal</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'tiles'" />` |
| **`12.4.8.1`** | Escenas Three.js (`12.4`) | **Onda de péndulos**<br><sub>Trece péndulos de distintas longitudes forman patrones al oscilar</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'pendulums'" />` |
| **`12.4.9.1`** | Escenas Three.js (`12.4`) | **Trayectorias de luz**<br><sub>Tres puntos luminosos recorren curvas cerradas en el espacio</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'light-trails'" />` |
| **`12.4.10.1`** | Escenas Three.js (`12.4`) | **Ensamble en despiece**<br><sub>Las piezas de un rotor se separan y vuelven a ensamblarse mientras giran</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'exploded'" />` |
| **`12.4.11.1`** | Escenas Three.js (`12.4`) | **Almacén interactivo**<br><sub>Dos camiones entran y salen por muelles distintos. Selecciona un camión o una zona</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'warehouse'" />` |
| **`12.4.12.1`** | Escenas Three.js (`12.4`) | **Embudo comercial**<br><sub>Embudo con anillos abiertos, partículas y cifras de prospectos, propuestas y cierres</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'sales'" />` |
| **`12.4.13.1`** | Escenas Three.js (`12.4`) | **Mapa de equipos**<br><sub>Campus colaborativo con puestos ultrawide, tablero Kanban de talento y lounge biofílico</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'teams'" />` |
| **`12.4.14.1`** | Escenas Three.js (`12.4`) | **Sala de negociación**<br><sub>Sala de ventas con pantalla de cotización y propuesta que se mueve entre las dos partes</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'negotiation'" />` |
| **`12.4.15.1`** | Escenas Three.js (`12.4`) | **Ruta de entrega**<br><sub>Furgoneta con ruedas animadas que reparte pedidos al mercado, al café o a la farmacia</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'delivery'" />` |
| **`12.4.16.1`** | Escenas Three.js (`12.4`) | **Catálogo de productos**<br><sub>Escaparate de tienda con productos modelados, precios y vitrina que gira hacia tu selección</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'showroom'" />` |
| **`12.4.17.1`** | Escenas Three.js (`12.4`) | **Equipo y áreas**<br><sub>Espacios de oficina divididos para Talento, Desarrollo y Bienestar</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'office'" />` |
| **`12.4.18.1`** | Escenas Three.js (`12.4`) | **Recorrido de incorporación**<br><sub>Recorrido interactivo con avatar que se desplaza entre cuatro estaciones de bienvenida</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'onboarding'" />` |
| **`12.4.19.1`** | Escenas Three.js (`12.4`) | **Agenda de equipo**<br><sub>Agenda semanal 3D con bloques de citas interactivos y reprogramación visual</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'team-calendar'" />` |
| **`12.4.20.1`** | Escenas Three.js (`12.4`) | **Flujo de caja**<br><sub>Simulación de flujo de caja con columnas de liquidez y monedas circulando en tiempo real</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'cash-flow'" />` |
| **`12.4.21.1`** | Escenas Three.js (`12.4`) | **Panel financiero**<br><sub>Bóveda, mesa de operaciones con gráficos de ejemplo y servidores de auditoría</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'financial-board'" />` |
| **`12.4.22.1`** | Escenas Three.js (`12.4`) | **Distribución de presupuesto**<br><sub>Barras de presupuesto proporcionales que se redistribuyen según el escenario seleccionado</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'budget'" />` |
| **`12.4.23.1`** | Escenas Three.js (`12.4`) | **Caja y punto de venta**<br><sub>Mostrador con cinta y lector. Escanea un pedido, cobra y emite el recibo</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'checkout'" />` |
| **`12.4.24.1`** | Escenas Three.js (`12.4`) | **Bodega de barrio**<br><sub>Visita comercial a una bodega. Revisa el surtido, registra el pedido y entrega las cajas</sub> | `<app-media-three-scenes>` | `src/app/components/media-3d/three-scenes` | `<app-media-three-scenes [variant]="'bodega'" />` |
| **`12.5.1.1`** | Login 3D (`12.5`) | **Acceso con ondas**<br><sub>Formulario junto al campo de ondas 3D en color menta</sub> | `<app-media-three-login>` | `src/app/components/media-3d/three-login` | `<app-media-three-login [variant]="'waves'" />` |
| **`12.5.2.1`** | Login 3D (`12.5`) | **Acceso con nebulosa**<br><sub>Partículas en espiral con una paleta violeta</sub> | `<app-media-three-login>` | `src/app/components/media-3d/three-login` | `<app-media-three-login [variant]="'nebula'" />` |
| **`12.5.3.1`** | Login 3D (`12.5`) | **Acceso con mosaico**<br><sub>Baldosas animadas sobre un fondo azul</sub> | `<app-media-three-login>` | `src/app/components/media-3d/three-login` | `<app-media-three-login [variant]="'tiles'" />` |
| **`12.5.4.1`** | Login 3D (`12.5`) | **Acceso de Operaciones**<br><sub>Portal de inventario y despachos con almacén isométrico y camiones en movimiento</sub> | `<app-media-three-login>` | `src/app/components/media-3d/three-login` | `<app-media-three-login [variant]="'operations'" />` |
| **`12.5.5.1`** | Login 3D (`12.5`) | **Acceso Comercial**<br><sub>Portal comercial con embudo de conversión cónico 3D y flujo de prospectos</sub> | `<app-media-three-login>` | `src/app/components/media-3d/three-login` | `<app-media-three-login [variant]="'commercial'" />` |
| **`12.5.6.1`** | Login 3D (`12.5`) | **Acceso Financiero**<br><sub>Portal financiero con bóveda de lingotes de oro, trading con velas 3D y servidores</sub> | `<app-media-three-login>` | `src/app/components/media-3d/three-login` | `<app-media-three-login [variant]="'finance'" />` |
| **`12.5.7.1`** | Login 3D (`12.5`) | **Acceso de RR. HH.**<br><sub>Portal de talento con estaciones ágiles ultrawide, muro Kanban y lounge biofílico</sub> | `<app-media-three-login>` | `src/app/components/media-3d/three-login` | `<app-media-three-login [variant]="'hr'" />` |

**Escenas Three.js** · `npm install three@^0.184.0` · `npm install -D @types/three@^0.184.1`

**Login 3D** · `npm install three@^0.184.0` · `npm install -D @types/three@^0.184.1`

Login 3D requiere estas carpetas hermanas: `src/app/components/media-3d/three-scenes`.

---

