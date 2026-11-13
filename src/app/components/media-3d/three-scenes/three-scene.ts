// Dependencia de ejecución: three. OrbitControls viene incluido en el mismo paquete.
import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  DynamicDrawUsage,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  TorusGeometry,
  TorusKnotGeometry,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export type SceneVariant = 'sculpture' | 'orbit' | 'waves';

interface Design {
  readonly group: Group;
  update(time: number): void;
  dispose(): void;
}

export interface SceneController {
  setScene(variant: SceneVariant, accent: string): void;
  setPlaying(playing: boolean): void;
  moveCamera(key: string): boolean;
  resetView(): void;
  dispose(): void;
}

/** Añade nuevas escenas aquí. Cada diseño es dueño de sus propios recursos GPU. */
function buildDesign(variant: SceneVariant, accent: string): Design {
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

export function createThreeScene(
  canvas: HTMLCanvasElement,
  onContextChange: (lost: boolean) => void,
): SceneController {
  const document = canvas.ownerDocument;
  const view = document.defaultView!;
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true });
  if (!context) throw new Error('WebGL 2 no disponible');

  const renderer = new WebGLRenderer({ canvas, context, alpha: true });
  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 50);
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
    setScene(variant, accent) {
      if (design) {
        scene.remove(design.group);
        design.dispose();
      }
      elapsed = 0;
      lastTime = undefined;
      design = buildDesign(variant, accent);
      design.update(0);
      scene.add(design.group);
      schedule();
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
