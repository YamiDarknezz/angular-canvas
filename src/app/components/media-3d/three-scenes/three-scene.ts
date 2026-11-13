// Dependencia de ejecución: three. OrbitControls viene incluido en el mismo paquete.
import {
  AmbientLight,
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  DynamicDrawUsage,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Raycaster,
  Scene,
  SphereGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { type SceneChoice } from './interactive-scenes';
import { buildWarehouseDesign } from './warehouse-scene';
import { buildSalesDesign } from './sales-scene';
import { buildFinanceDesign } from './finance-scene';
import { buildHrDesign } from './hr-scene';
import { buildDepartmentDesign, type DepartmentVariant } from './department-scenes';
import { buildRetailDesign, type RetailVariant } from './retail-scenes';

export type SceneVariant =
  | 'sculpture'
  | 'orbit'
  | 'waves'
  | 'dunes'
  | 'nebula'
  | 'helix'
  | 'tiles'
  | 'pendulums'
  | 'light-trails'
  | 'exploded'
  | 'warehouse'
  | 'sales'
  | 'teams'
  | 'financial-board'
  | DepartmentVariant
  | RetailVariant;

export interface Design {
  readonly group: Group;
  readonly choices?: readonly SceneChoice[];
  select?(index: number): void;
  update(time: number): void;
  dispose(): void;
}

export interface SceneController {
  setScene(variant: SceneVariant, accent: string): readonly SceneChoice[];
  select(index: number): void;
  pick(clientX: number, clientY: number): number | undefined;
  setPlaying(playing: boolean): void;
  setInteractive(interactive: boolean): void;
  moveCamera(key: string): boolean;
  resetView(): void;
  dispose(): void;
}

/** Añade nuevas escenas aquí. Cada diseño es dueño de sus propios recursos GPU. */
function buildDesign(variant: SceneVariant, accent: string, document: Document): Design {
  switch (variant) {
    case 'dunes':
      return buildDunes(accent);
    case 'nebula':
      return buildNebula(accent);
    case 'helix':
      return buildHelix(accent);
    case 'tiles':
      return buildTiles(accent);
    case 'pendulums':
      return buildPendulums(accent);
    case 'light-trails':
      return buildLightTrails(accent);
    case 'exploded':
      return buildExplodedAssembly(accent);
    case 'warehouse':
      return buildWarehouseDesign(accent);
    case 'sales':
      return buildSalesDesign(accent, document);
    case 'teams':
      return buildHrDesign(accent, document);
    case 'financial-board':
      return buildFinanceDesign(accent, document);
    case 'negotiation':
    case 'delivery':
    case 'showroom':
    case 'checkout':
      return buildRetailDesign(variant, accent, document);
    case 'office':
    case 'onboarding':
    case 'team-calendar':
    case 'cash-flow':
    case 'budget':
      return buildDepartmentDesign(variant, accent, document);
  }

  const group = new Group();
  const color = new Color(accent);
  const material = new MeshStandardMaterial({ color, roughness: 0.32, metalness: 0.25 });

  if (variant === 'orbit') {
    const ringGeometry = new TorusGeometry(1.67, 0.025, 12, 100);
    const satelliteGeometry = new IcosahedronGeometry(0.105, 1);
    const coreGeometry = new IcosahedronGeometry(0.62, 1);
    const core = new Mesh(coreGeometry, material);
    group.add(core);

    const rings = Array.from({ length: 3 }, (_, index) => {
      const orbit = new Group();
      orbit.rotation.set(0.6 + index * 0.77, index * 0.58, index * 0.48);
      const satellite = new Mesh(satelliteGeometry, material);
      orbit.add(new Mesh(ringGeometry, material), satellite);
      group.add(orbit);
      return satellite;
    });

    return {
      group,
      update(time) {
        core.rotation.y = time * 0.37;
        rings.forEach((satellite, index) => {
          const angle = time * (0.7 + index * 0.25) + index * 2.1;
          satellite.position.set(Math.cos(angle) * 1.67, Math.sin(angle) * 1.67, 0);
        });
      },
      dispose() {
        ringGeometry.dispose();
        satelliteGeometry.dispose();
        coreGeometry.dispose();
        material.dispose();
      },
    };
  }

  if (variant === 'waves') {
    const side = 17;
    const geometry = new BoxGeometry(0.12, 1, 0.12);
    // Todas las columnas comparten geometría y material en una sola llamada de dibujo.
    material.color.set('#ffffff');
    const columns = new InstancedMesh(geometry, material, side ** 2);
    columns.instanceMatrix.setUsage(DynamicDrawUsage);
    const transform = new Object3D();
    const columnColor = new Color();
    group.add(columns);

    for (let index = 0; index < columns.count; index++) {
      columnColor.copy(color).multiplyScalar(0.55 + (index % side) / side);
      columns.setColorAt(index, columnColor);
    }

    return {
      group,
      update(time) {
        for (let index = 0; index < columns.count; index++) {
          const x = ((index % side) - (side - 1) / 2) * 0.23;
          const z = (Math.floor(index / side) - (side - 1) / 2) * 0.23;
          const height = 0.14 + 0.9 * (0.5 + 0.5 * Math.sin(Math.hypot(x, z) * 3.5 - time * 2.3));
          transform.position.set(x, height / 2 - 0.5, z);
          transform.scale.y = height;
          transform.updateMatrix();
          columns.setMatrixAt(index, transform.matrix);
        }
        columns.instanceMatrix.needsUpdate = true;
      },
      dispose() {
        columns.dispose();
        geometry.dispose();
        material.dispose();
      },
    };
  }

  const geometry = new TorusKnotGeometry(0.98, 0.28, 192, 24, 2, 3);
  group.add(new Mesh(geometry, material));
  return {
    group,
    update(time) {
      group.rotation.set(0.4 + Math.sin(time * 0.4) * 0.24, time * 0.48, -0.22);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}

function buildDunes(accent: string): Design {
  const group = new Group();
  const geometry = new PlaneGeometry(4.5, 4.5, 40, 40).rotateX(-Math.PI / 2);
  const positions = geometry.getAttribute('position');
  if (positions instanceof BufferAttribute) positions.setUsage(DynamicDrawUsage);
  const surface = new MeshStandardMaterial({
    color: new Color(accent).multiplyScalar(0.48),
    roughness: 0.64,
    side: DoubleSide,
  });
  const lines = new MeshBasicMaterial({
    color: accent,
    wireframe: true,
    opacity: 0.26,
    transparent: true,
  });
  const wire = new Mesh(geometry, lines);
  wire.position.y = 0.008;
  group.add(new Mesh(geometry, surface), wire);

  return {
    group,
    update(time) {
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        positions.setY(
          i,
          0.36 * Math.sin(x * 2.1 + z - time * 1.1) + 0.22 * Math.cos(z * 2.6 + time * 0.8),
        );
      }
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
    },
    dispose() {
      geometry.dispose();
      surface.dispose();
      lines.dispose();
    },
  };
}

function buildNebula(accent: string): Design {
  const group = new Group();
  const count = 1800;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const tint = new Color(accent);
  const core = new Color('#fff0db');
  const color = new Color();
  // Secuencia determinista para conservar el mismo encuadre cada vez que se abre la escena.
  for (let i = 0; i < count; i++) {
    const radius = 0.12 + 2.35 * Math.sqrt(i / count);
    const noise = ((i * 0.61803398875) % 1) - 0.5;
    const angle = (i % 4) * (Math.PI / 2) + radius * 1.9 + noise * (1.65 - radius * 0.36);
    const index = i * 3;
    positions[index] = Math.cos(angle) * radius;
    positions[index + 1] = noise * (0.55 - radius * 0.13);
    positions[index + 2] = Math.sin(angle) * radius;
    color
      .copy(tint)
      .lerp(core, Math.max(0, 1 - radius * 0.47))
      .multiplyScalar(0.48 + Math.abs(noise));
    color.toArray(colors, index);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));
  const material = new PointsMaterial({
    size: 0.034,
    vertexColors: true,
    transparent: true,
    opacity: 0.84,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  group.add(new Points(geometry, material));
  return {
    group,
    update(time) {
      group.rotation.set(-0.25, time * 0.16, 0.12);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}

function buildHelix(accent: string): Design {
  const group = new Group();
  const steps = 30;
  const bead = new IcosahedronGeometry(0.105, 1);
  const bar = new BoxGeometry(1.48, 0.025, 0.025);
  const material = new MeshStandardMaterial({ roughness: 0.32, metalness: 0.2 });
  const beads = new InstancedMesh(bead, material, steps * 2);
  const bars = new InstancedMesh(bar, material, steps);
  const tint = new Color(accent);
  const complement = tint.clone().lerp(new Color('#e1eaff'), 0.58);
  const transform = new Object3D();
  for (let i = 0; i < steps; i++) {
    const angle = i * 0.26;
    const y = (i - (steps - 1) / 2) * 0.115;
    const x = 0.75 * Math.cos(angle);
    const z = 0.75 * Math.sin(angle);
    transform.position.set(x, y, z);
    transform.updateMatrix();
    beads.setMatrixAt(i * 2, transform.matrix);
    beads.setColorAt(i * 2, tint);
    transform.position.set(-x, y, -z);
    transform.updateMatrix();
    beads.setMatrixAt(i * 2 + 1, transform.matrix);
    beads.setColorAt(i * 2 + 1, complement);
    transform.position.set(0, y, 0);
    transform.rotation.y = -angle;
    transform.updateMatrix();
    bars.setMatrixAt(i, transform.matrix);
    bars.setColorAt(i, tint);
    transform.rotation.y = 0;
  }
  group.add(beads, bars);
  return {
    group,
    update(time) {
      group.rotation.set(0, time * 0.45, -0.32);
    },
    dispose() {
      beads.dispose();
      bars.dispose();
      bead.dispose();
      bar.dispose();
      material.dispose();
    },
  };
}

function buildTiles(accent: string): Design {
  const group = new Group();
  const side = 9;
  const geometry = new BoxGeometry(0.36, 0.09, 0.36);
  const material = new MeshStandardMaterial({ roughness: 0.28, metalness: 0.32 });
  const tiles = new InstancedMesh(geometry, material, side ** 2);
  tiles.instanceMatrix.setUsage(DynamicDrawUsage);
  const transform = new Object3D();
  const tint = new Color(accent);
  const color = new Color();
  for (let i = 0; i < tiles.count; i++) {
    color.copy(tint).multiplyScalar(0.48 + ((i * 7) % side) * 0.09);
    tiles.setColorAt(i, color);
  }
  group.add(tiles);
  return {
    group,
    update(time) {
      for (let i = 0; i < tiles.count; i++) {
        const x = (i % side) - (side - 1) / 2;
        const z = Math.floor(i / side) - (side - 1) / 2;
        const pulse = Math.max(0, Math.sin(time * 1.8 - (x + z) * 0.6));
        transform.position.set(x * 0.46, pulse * 0.57, z * 0.46);
        transform.rotation.x = pulse * Math.PI * 0.68;
        transform.updateMatrix();
        tiles.setMatrixAt(i, transform.matrix);
      }
      tiles.instanceMatrix.needsUpdate = true;
    },
    dispose() {
      tiles.dispose();
      geometry.dispose();
      material.dispose();
    },
  };
}

function buildPendulums(accent: string): Design {
  const group = new Group();
  const beam = new BoxGeometry(4.15, 0.08, 0.1);
  const rod = new CylinderGeometry(0.012, 0.012, 1, 8).translate(0, -0.5, 0);
  const weight = new SphereGeometry(0.13, 18, 12);
  const metal = new MeshStandardMaterial({ color: '#b1b9cf', metalness: 0.4, roughness: 0.4 });
  const weights = new MeshStandardMaterial({ color: accent, metalness: 0.28, roughness: 0.24 });
  const rail = new Mesh(beam, metal);
  rail.position.y = 1.08;
  group.add(rail);
  const pendulums = Array.from({ length: 13 }, (_, index) => {
    const pivot = new Group();
    pivot.position.set((index - 6) * 0.31, 1.04, 0);
    const length = 2.1 - index * 0.085;
    const string = new Mesh(rod, metal);
    string.scale.y = length;
    const bob = new Mesh(weight, weights);
    bob.position.y = -length;
    pivot.add(string, bob);
    group.add(pivot);
    return { pivot, length };
  });
  return {
    group,
    update(time) {
      for (const { pivot, length } of pendulums) {
        // Longitudes distintas producen periodos distintos y una onda aparente.
        pivot.rotation.x = 0.72 * Math.cos((time * 2.1) / Math.sqrt(length));
      }
    },
    dispose() {
      beam.dispose();
      rod.dispose();
      weight.dispose();
      metal.dispose();
      weights.dispose();
    },
  };
}

function buildLightTrails(accent: string): Design {
  const group = new Group();
  const bead = new SphereGeometry(0.085, 14, 10);
  const colors = [new Color(accent), new Color('#a4adff'), new Color('#f2b886')];
  const routes = colors.map((color, index) => {
    const points = Array.from({ length: 84 }, (_, point) => {
      const t = (point / 84) * Math.PI * 2;
      const phase = (index * Math.PI * 2) / 3;
      const radius = 1.55 + 0.32 * Math.cos(t * 3 + phase);
      return new Vector3(
        Math.cos(t) * radius,
        0.68 * Math.sin(t * 3 + phase),
        Math.sin(t) * radius,
      );
    });
    const path = new CatmullRomCurve3(points, true);
    const tube = new TubeGeometry(path, 160, 0.014, 6, true);
    const trace = new MeshBasicMaterial({ color, transparent: true, opacity: 0.48 });
    const light = new MeshBasicMaterial({ color: color.clone().lerp(new Color('#ffffff'), 0.5) });
    const particle = new Mesh(bead, light);
    group.add(new Mesh(tube, trace), particle);
    return { path, tube, trace, light, particle };
  });
  return {
    group,
    update(time) {
      routes.forEach(({ path, particle }, index) => {
        path.getPointAt((time * (0.13 + index * 0.035) + index / 3) % 1, particle.position);
      });
      group.rotation.y = time * 0.14;
    },
    dispose() {
      for (const { tube, trace, light } of routes) {
        tube.dispose();
        trace.dispose();
        light.dispose();
      }
      bead.dispose();
    },
  };
}

function buildExplodedAssembly(accent: string): Design {
  const group = new Group();
  const plate = new CylinderGeometry(0.91, 0.91, 0.13, 6);
  const rings = new TorusGeometry(0.7, 0.095, 14, 56).rotateX(-Math.PI / 2);
  const shaft = new CylinderGeometry(0.13, 0.13, 0.8, 16);
  const casing = new MeshStandardMaterial({ color: accent, metalness: 0.36, roughness: 0.32 });
  const core = new MeshStandardMaterial({ color: '#dce6ff', metalness: 0.42, roughness: 0.22 });
  const parts = [
    new Mesh(plate, casing),
    new Mesh(rings, core),
    new Mesh(rings, casing),
    new Mesh(rings, core),
    new Mesh(plate, casing),
  ];
  group.add(new Mesh(shaft, core), ...parts);
  return {
    group,
    update(time) {
      // El giro acompaña la apertura para mostrar cada pieza sin cambiar la cámara.
      const separation = 0.23 + 0.49 * (0.5 + 0.5 * Math.cos(time * 1.3));
      parts.forEach((part, index) => {
        part.position.y = (index - 2) * separation;
        part.rotation.y = (index - 2) * (0.34 + separation * 0.72);
      });
      group.rotation.y = time * 0.34;
    },
    dispose() {
      plate.dispose();
      rings.dispose();
      shaft.dispose();
      casing.dispose();
      core.dispose();
    },
  };
}

export function createThreeScene(
  canvas: HTMLCanvasElement,
  onContextChange: (lost: boolean) => void,
): SceneController {
  const document = canvas.ownerDocument;
  const view = document.defaultView!;
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true });
  if (!context) throw new Error('WebGL 2 no disponible');

  const renderer = new WebGLRenderer({ canvas, context, alpha: true });
  renderer.localClippingEnabled = true;
  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 50);
  const raycaster = new Raycaster();
  const cursor = new Vector2();
  camera.position.set(4.5, 3.8, 6.75);

  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.minDistance = 3.5;
  controls.maxDistance = 13;
  controls.update();
  controls.saveState();

  const keyLight = new DirectionalLight('#fff0dc', 3.1);
  keyLight.position.set(4, 6, 3);
  const rimLight = new DirectionalLight('#9aaeff', 2.7);
  rimLight.position.set(-5, 2, -4);
  scene.add(new AmbientLight('#dadfff', 0.78), keyLight, rimLight);

  let design: Design | undefined;
  let playing = false;
  let lost = false;
  let visible = false;
  let disposed = false;
  let frame: number | undefined;
  let lastTime: number | undefined;
  let elapsed = 0;

  function schedule(): void {
    if (frame === undefined && !disposed && !lost && visible && !document.hidden) {
      frame = view.requestAnimationFrame(draw);
    }
  }

  function draw(now: number): void {
    frame = undefined;
    if (disposed || lost || !visible || document.hidden) return;

    if (playing && lastTime !== undefined) elapsed += Math.min((now - lastTime) / 1000, 0.05);
    lastTime = playing ? now : undefined;
    design?.update(elapsed);
    renderer.render(scene, camera);
    if (playing) schedule();
  }

  function stopFrame(): void {
    if (frame !== undefined) view.cancelAnimationFrame(frame);
    frame = undefined;
    lastTime = undefined;
  }

  function resize(): void {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (!width || !height) return;

    renderer.setPixelRatio(Math.min(view.devicePixelRatio, 1.75));
    renderer.setSize(width, height, false);
    // Conserva el encuadre horizontal al usar el mismo componente en una columna angosta.
    camera.aspect = width / height;
    camera.fov =
      (2 * Math.atan(Math.tan((38 * Math.PI) / 360) / Math.min(camera.aspect, 1)) * 180) / Math.PI;
    camera.updateProjectionMatrix();
    schedule();
  }

  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(canvas);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) schedule();
    else stopFrame();
  });
  visibilityObserver.observe(canvas);

  const onVisibility = () => {
    if (document.hidden) stopFrame();
    else schedule();
  };
  const onLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    stopFrame();
    onContextChange(true);
  };
  const onRestored = () => {
    lost = false;
    onContextChange(false);
    resize();
  };

  controls.addEventListener('change', schedule);
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  return {
    setInteractive(interactive) {
      controls.enabled = interactive;
      canvas.style.touchAction = interactive ? 'none' : 'auto';
    },
    setScene(variant, accent) {
      if (design) {
        scene.remove(design.group);
        design.dispose();
      }
      elapsed = 0;
      lastTime = undefined;
      design = buildDesign(variant, accent, document);
      design.update(0);
      scene.add(design.group);
      schedule();
      return design.choices ?? [];
    },
    select(index) {
      if (!controls.enabled || lost || !design?.choices?.[index]) return;
      design.select?.(index);
      schedule();
    },
    pick(clientX, clientY) {
      if (!controls.enabled || lost || !design?.choices) return undefined;
      const { left, top, width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return undefined;
      cursor.set(((clientX - left) / width) * 2 - 1, 1 - ((clientY - top) / height) * 2);
      camera.updateMatrixWorld();
      design.group.updateMatrixWorld(true);
      raycaster.setFromCamera(cursor, camera);
      for (const { object, point } of raycaster.intersectObject(design.group)) {
        if (object.userData['ignorePick']) continue;
        let visibleParent: Object3D | null = object;
        while (visibleParent?.visible) visibleParent = visibleParent.parent;
        if (visibleParent) continue;
        // Ignora la parte de los vehículos recortada al salir del patio.
        if (
          object instanceof Mesh &&
          object.material instanceof Material &&
          object.material.clippingPlanes?.some((plane) => plane.distanceToPoint(point) < 0)
        ) {
          continue;
        }
        const index: unknown = object.userData['choice'];
        return typeof index === 'number' ? index : undefined;
      }
      return undefined;
    },
    setPlaying(next) {
      playing = next;
      lastTime = undefined;
      schedule();
    },
    moveCamera(key) {
      const step = Math.PI / 18;
      switch (key) {
        case 'ArrowLeft':
          controls.rotateLeft(step);
          break;
        case 'ArrowRight':
          controls.rotateLeft(-step);
          break;
        case 'ArrowUp':
          controls.rotateUp(step);
          break;
        case 'ArrowDown':
          controls.rotateUp(-step);
          break;
        case '+':
        case '=':
          controls.dollyIn(1 / 1.15);
          break;
        case '-':
          controls.dollyOut(1 / 1.15);
          break;
        default:
          return false;
      }
      controls.update();
      return true;
    },
    resetView() {
      controls.reset();
    },
    dispose() {
      disposed = true;
      stopFrame();
      sizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      controls.removeEventListener('change', schedule);
      controls.dispose();
      design?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
