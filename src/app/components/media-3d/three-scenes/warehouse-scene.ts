// Requiere three y @types/three para TypeScript. Los modelos se crean con geometría local.
import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Plane,
  Vector3,
} from 'three';

import type { Design } from './three-scene';

const CHOICES = [
  {
    label: 'Recepción',
    detail: 'El camión verde entra por el carril izquierdo y se detiene dentro del muelle.',
  },
  {
    label: 'Almacenaje',
    detail: 'Los pallets junto a la fachada representan la zona de preparación de pedidos.',
  },
  {
    label: 'Despacho',
    detail: 'El camión ámbar sale del muelle derecho y recorre el carril de despacho.',
  },
] as const;

/** Patio de dos muelles. El visor proporciona el reloj y libera los recursos al cambiar de escena. */
export function buildWarehouseDesign(accent: string): Design {
  const group = new Group();
  const scale = 0.8;
  group.scale.setScalar(scale);

  const floor = -0.69;
  const roadEdge = 2.72;
  const frontage = -0.58;
  const leftLane = -1.16;
  const rightLane = 1.16;
  const dockPosition = -1.36;
  const offsite = roadEdge + 0.74;
  const cycle = 8.6;
  const wheelRadius = 0.132;
  const boxGeometry = new BoxGeometry();
  const wheelGeometry = new CylinderGeometry(1, 1, 1, 16).rotateZ(-Math.PI / 2);
  const materials: MeshStandardMaterial[] = [];
  // El plano recorta los camiones al cruzar el borde de la maqueta. El salto del bucle queda oculto.
  const roadClip = new Plane(new Vector3(0, 0, -1), roadEdge * scale);

  const material = (color: string | Color, truck = false) => {
    const surface = new MeshStandardMaterial({
      color,
      roughness: 0.75,
      clippingPlanes: truck ? [roadClip] : null,
    });
    materials.push(surface);
    return surface;
  };

  function box(
    parent: Group,
    surface: MeshStandardMaterial,
    size: [number, number, number],
    position: [number, number, number],
    choice?: number,
  ) {
    const mesh = new Mesh(boxGeometry, surface);
    mesh.scale.set(...size);
    mesh.position.set(...position);
    if (choice !== undefined) mesh.userData['choice'] = choice;
    parent.add(mesh);
    return mesh;
  }

  const asphalt = material('#29384c');
  const base = material('#182537');
  const concrete = material('#a1aebb');
  const roof = material('#526a82');
  const recess = material('#172331');
  const door = material('#455d73');
  const lanePaint = material('#d0dbe5');
  const caution = material('#f7af54');
  const inbound = new Color(accent);
  const outbound = new Color('#ffae58');
  const markers = [inbound, new Color('#c2a17a'), outbound].map((color) => material(color));

  box(group, base, [4.74, 0.23, 5.14], [0, floor - 0.131, 0.15]);
  box(group, asphalt, [4.7, 0.05, 5.14], [0, floor - 0.026, 0.15]);

  // La estructura deja huecos reales bajo los portones, por donde pasan los vehículos.
  box(group, concrete, [4.34, 1.72, 0.14], [0, floor + 0.86, -2.27]);
  for (const x of [-2.09, 2.09]) {
    box(group, concrete, [0.16, 1.72, 1.7], [x, floor + 0.86, -1.42]);
  }
  box(group, concrete, [0.8, 1.72, 1.7], [0, floor + 0.86, -1.42], 1);
  box(group, roof, [4.51, 0.15, 1.94], [0, floor + 1.77, -1.44]);
  box(group, concrete, [4.39, 0.42, 0.17], [0, floor + 1.49, frontage - 0.06]);
  for (let i = -5; i <= 5; i++) {
    box(group, door, [0.032, 0.029, 1.82], [i * 0.39, floor + 1.85, -1.44]);
  }
  box(group, recess, [1.45, 0.11, 0.65], [0, floor + 1.92, -1.53]);
  for (const x of [-0.49, 0, 0.49]) {
    box(group, roof, [0.38, 0.045, 0.44], [x, floor + 1.99, -1.53]);
  }

  for (let z = -0.16; z + 0.12 <= roadEdge; z += 0.48) {
    box(group, lanePaint, [0.035, 0.009, 0.24], [0, floor + 0.005, z]);
  }
  for (const x of [-2.12, 2.12]) {
    box(group, lanePaint, [0.038, 0.009, 3.05], [x, floor + 0.005, 1.18]);
  }

  const shutters = [leftLane, rightLane].map((x, lane) => {
    const choice = lane === 0 ? 0 : 2;
    const marker = markers[choice];
    box(group, marker, [1.63, 0.12, 0.22], [x, floor + 1.25, frontage], choice);
    for (const offset of [-0.72, 0.72]) {
      box(group, roof, [0.095, 1.23, 0.18], [x + offset, floor + 0.615, frontage], choice);
      box(group, caution, [0.075, 0.24, 0.075], [x + offset, floor + 0.12, frontage + 0.19]);
    }
    box(group, recess, [1.35, 0.01, 1.55], [x, floor + 0.006, -1.35], choice);
    const arrowZ = lane === 0 ? 0.82 : 1.49;
    box(group, marker, [0.046, 0.009, 0.38], [x, floor + 0.006, arrowZ], choice);
    for (const side of [-1, 1]) {
      const arrow = box(
        group,
        marker,
        [0.045, 0.009, 0.19],
        [x + side * 0.057, floor + 0.006, arrowZ + (lane === 0 ? -0.16 : 0.16)],
        choice,
      );
      arrow.rotation.y = (side * (lane === 0 ? 1 : -1) * Math.PI) / 4;
    }

    const shutter = new Group();
    shutter.position.set(x, floor, frontage - 0.02);
    box(shutter, door, [1.33, 1.18, 0.06], [0, 0.59, 0], choice);
    for (let row = 1; row < 8; row++) {
      box(shutter, roof, [1.33, 0.018, 0.014], [0, row * 0.147, 0.033], choice);
    }
    group.add(shutter);
    return shutter;
  });

  // Pallets apilados en el espacio de preparación entre los dos carriles.
  for (const z of [-0.31, 0.08]) {
    box(group, roof, [0.47, 0.065, 0.34], [0, floor + 0.035, z], 1);
    for (const x of [-0.114, 0.114]) {
      box(group, markers[1], [0.2, 0.21, 0.28], [x, floor + 0.17, z], 1);
    }
  }
  box(group, markers[1], [0.24, 0.19, 0.25], [0, floor + 0.37, -0.31], 1);
  box(group, recess, [0.49, 0.23, 0.052], [0, floor + 0.81, frontage + 0.032], 1);
  box(group, roof, [0.018, 0.23, 0.013], [0, floor + 0.81, frontage + 0.065], 1);

  const rubber = material('#111b28', true);
  const rims = material('#9ba9b7', true);
  const glass = material('#29465d', true);
  const cargo = material('#ced9e1', true);
  const headlight = material('#fff3cf', true);
  const taillight = material('#f04d45', true);

  const trucks = [leftLane, rightLane].map((x, lane) => {
    const choice = lane === 0 ? 0 : 2;
    const paint = material(markers[choice].color, true);
    const body = new Group();
    body.position.set(x, floor, 0);
    body.rotation.y = lane === 0 ? Math.PI : 0;
    group.add(body);
    box(body, rubber, [0.65, 0.115, 1.24], [0, 0.17, 0], choice);
    box(body, cargo, [0.69, 0.52, 0.81], [0, 0.49, -0.23], choice);
    box(body, paint, [0.62, 0.42, 0.45], [0, 0.4, 0.42], choice);
    box(body, glass, [0.52, 0.16, 0.024], [0, 0.505, 0.654], choice);
    box(body, rims, [0.4, 0.077, 0.022], [0, 0.278, 0.66], choice);

    const wheels: Group[] = [];
    for (const side of [-1, 1]) {
      box(body, glass, [0.018, 0.148, 0.23], [side * 0.315, 0.51, 0.45], choice);
      box(body, paint, [0.016, 0.082, 0.67], [side * 0.347, 0.51, -0.23], choice);
      box(body, headlight, [0.092, 0.055, 0.022], [side * 0.245, 0.28, 0.661], choice);
      box(body, taillight, [0.084, 0.052, 0.022], [side * 0.23, 0.235, -0.64], choice);
      for (const z of [-0.4, 0.39]) {
        const wheel = new Group();
        wheel.position.set(side * 0.31, wheelRadius, z);
        body.add(wheel);
        wheels.push(wheel);
        const tire = new Mesh(wheelGeometry, rubber);
        tire.scale.set(0.11, wheelRadius, wheelRadius);
        tire.userData['choice'] = choice;
        wheel.add(tire);
        box(wheel, rims, [0.025, 0.11, 0.043], [side * 0.058, 0, 0], choice);
      }
    }
    return { body, wheels, paint };
  });

  return {
    group,
    choices: CHOICES,
    select(index) {
      markers.forEach((marker, current) => {
        marker.emissive.copy(marker.color);
        marker.emissiveIntensity = index === current ? 0.54 : 0;
      });
      trucks.forEach(({ paint }, lane) => {
        paint.emissive.copy(paint.color);
        paint.emissiveIntensity = index === lane * 2 ? 0.36 : 0;
      });
    },
    update(time) {
      trucks.forEach(({ body, wheels }, lane) => {
        const arriving = lane === 0;
        const phase = (time + (arriving ? 2.5 : 2.8)) % cycle;
        const progress = arriving
          ? MathUtils.smoothstep(phase, 0.6, 5.75)
          : MathUtils.smoothstep(phase, 1.25, 6.5);
        body.position.z = MathUtils.lerp(
          arriving ? offsite : dockPosition,
          arriving ? dockPosition : offsite,
          progress,
        );
        const wheelAngle = (progress * (offsite - dockPosition)) / wheelRadius;
        for (const wheel of wheels) wheel.rotation.x = wheelAngle;

        const opening = arriving
          ? MathUtils.smoothstep(phase, 0.5, 1.7)
          : MathUtils.smoothstep(phase, 0.3, 1.25);
        const closing = arriving
          ? MathUtils.smoothstep(phase, 5.9, 6.8)
          : MathUtils.smoothstep(phase, 4.6, 5.4);
        // El portón se enrolla dentro del dintel y permanece arriba hasta que pase todo el camión.
        const height = Math.max(0.035, 1 - (opening - closing));
        shutters[lane].scale.y = height;
        shutters[lane].position.y = floor + 1.18 * (1 - height);
      });
    },
    dispose() {
      boxGeometry.dispose();
      wheelGeometry.dispose();
      materials.forEach((surface) => surface.dispose());
    },
  };
}
