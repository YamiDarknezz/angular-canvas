// Requiere three y @types/three para TypeScript. Modelado procedural con primitivas Three.js.
import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
} from 'three';

import type { Design } from './three-scene';

const CHOICES = [
  {
    label: 'Showroom & Prospectos',
    detail: 'Plataforma giratoria con vehículo concepto EV y acabados de lujo para captación.',
  },
  {
    label: 'Mesa de Negociación',
    detail: 'Pod ejecutivo con panel holográfico de propuestas comerciales y métricas de cierre.',
  },
  {
    label: 'Entrega VIP & Cierre',
    detail:
      'Bahía iluminada con pórtico LED para entrega de unidades y formalización de contratos.',
  },
] as const;

export function buildCommercialDesign(accent: string, variant = 'sales'): Design {
  const group = new Group();
  const scale = 0.8;
  group.scale.setScalar(scale);

  const floor = -0.69;
  const boxGeometry = new BoxGeometry();
  const cylinderGeometry = new CylinderGeometry(0.5, 0.5, 1, 24);
  const wheelGeometry = new CylinderGeometry(1, 1, 1, 20).rotateZ(-Math.PI / 2);
  const materials: MeshStandardMaterial[] = [];

  const material = (color: string | Color, roughness = 0.45, metalness = 0.25) => {
    const surface = new MeshStandardMaterial({
      color,
      roughness,
      metalness,
      emissive: new Color(color),
      emissiveIntensity: 0,
    });
    materials.push(surface);
    return surface;
  };

  function box(
    parent: Object3D,
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

  function cyl(
    parent: Object3D,
    surface: MeshStandardMaterial,
    size: [number, number, number],
    position: [number, number, number],
    choice?: number,
  ) {
    const mesh = new Mesh(cylinderGeometry, surface);
    mesh.scale.set(...size);
    mesh.position.set(...position);
    if (choice !== undefined) mesh.userData['choice'] = choice;
    parent.add(mesh);
    return mesh;
  }

  // Paleta de materiales arquitectónicos
  const baseMat = material('#17212d', 0.8, 0.2);
  const floorMat = material('#1e2b3a', 0.35, 0.3);
  const borderMat = material('#c5a265', 0.3, 0.7); // Borde dorado tenue
  const wallMat = material('#2a3a4d', 0.7, 0.15);
  const glassMat = material('#3d5975', 0.2, 0.4);
  const steelMat = material('#52667d', 0.4, 0.6);
  const canopyMat = material('#243344', 0.6, 0.3);

  const woodPlatform = material('#724e31', 0.65, 0.1);
  const woodSlat = material('#55371f', 0.7, 0.1);
  const marbleDesk = material('#e1e9f0', 0.25, 0.15);
  const leatherSeat = material('#99633e', 0.6, 0.1);
  const plantMat = material('#356345', 0.8, 0.1);
  const potMat = material('#d0dbe5', 0.5, 0.1);

  const accentColor = new Color(accent);
  const accentMat = material(accentColor, 0.3, 0.5);
  const amberMat = material('#f59e0b', 0.35, 0.4);
  const mintMat = material('#10b981', 0.35, 0.4);
  const headlightMat = material('#eaf8ff', 0.15, 0.1);
  const taillightMat = material('#ef4444', 0.2, 0.2);
  const rubberMat = material('#12171f', 0.85, 0.1);
  const rimMat = material('#cbd5e1', 0.25, 0.7);

  // 1. Base y arquitectura general
  box(group, baseMat, [4.74, 0.23, 5.14], [0, floor - 0.131, 0.15]);
  box(group, floorMat, [4.7, 0.05, 5.14], [0, floor - 0.026, 0.15]);
  // Filetes decorativos dorados en el piso
  box(group, borderMat, [4.68, 0.008, 0.02], [0, floor + 0.002, -1.9]);
  box(group, borderMat, [4.68, 0.008, 0.02], [0, floor + 0.002, 2.45]);

  // Pared posterior arquitectónica con columnas
  box(group, wallMat, [4.62, 1.82, 0.14], [0, floor + 0.91, -2.15]);
  for (const x of [-2.05, -0.7, 0.7, 2.05]) {
    box(group, steelMat, [0.12, 1.82, 0.18], [x, floor + 0.91, -2.12]);
  }
  // Paneles de vidrio templado translúcido
  for (const x of [-1.37, 0, 1.37]) {
    box(group, glassMat, [1.2, 1.45, 0.04], [x, floor + 0.95, -2.08]);
  }
  // Alero flotante moderno con luminarias
  box(group, canopyMat, [4.64, 0.12, 1.8], [0, floor + 1.84, -1.35]);
  for (const x of [-1.5, -0.5, 0.5, 1.5]) {
    box(group, headlightMat, [0.35, 0.02, 0.35], [x, floor + 1.77, -1.35]);
  }

  // -------------------------------------------------------------
  // 2. Zona Central: Turntable y Concept Car (Opción 0: Showroom)
  // -------------------------------------------------------------
  const turntableBase = cyl(group, steelMat, [2.7, 0.06, 2.7], [0, floor + 0.025, 0.3], 0);
  const turntableRing = cyl(group, accentMat, [2.76, 0.02, 2.76], [0, floor + 0.04, 0.3], 0);

  const turntable = new Group();
  turntable.position.set(0, floor + 0.05, 0.3);
  group.add(turntable);

  // Auto Deportivo Conceptual EV sobre el turntable
  const car = new Group();
  turntable.add(car);

  // Chasis aerodinámico
  box(car, accentMat, [1.68, 0.22, 0.82], [0, 0.18, 0], 0);
  box(car, accentMat, [0.45, 0.14, 0.78], [0.72, 0.14, 0], 0); // morro afilado
  box(car, accentMat, [0.35, 0.16, 0.78], [-0.74, 0.19, 0], 0); // difusor trasero
  // Cabina de vidrio oscura
  box(car, wallMat, [0.88, 0.2, 0.68], [-0.08, 0.34, 0], 0);
  box(car, glassMat, [0.84, 0.18, 0.65], [-0.08, 0.35, 0], 0);
  // Faros LED frontales y tira trasera
  box(car, headlightMat, [0.03, 0.05, 0.74], [0.94, 0.16, 0], 0);
  box(car, taillightMat, [0.03, 0.04, 0.72], [-0.91, 0.23, 0], 0);

  // Ruedas deportivas con discos de aleación
  const wheelOffset = 0.14;
  for (const x of [-0.52, 0.52]) {
    for (const z of [-0.43, 0.43]) {
      const wheelMesh = new Mesh(wheelGeometry, rubberMat);
      wheelMesh.scale.set(0.12, wheelOffset, wheelOffset);
      wheelMesh.position.set(x, 0.14, z);
      wheelMesh.userData['choice'] = 0;
      car.add(wheelMesh);

      // Llanta deportiva satinada
      const rim = new Mesh(boxGeometry, rimMat);
      rim.scale.set(0.13, 0.12, 0.12);
      rim.position.set(x, 0.14, z);
      rim.userData['choice'] = 0;
      car.add(rim);
    }
  }

  // -------------------------------------------------------------
  // 3. Flanco Izquierdo: Pod Ejecutivo & Holograma (Opción 1: Negociación)
  // -------------------------------------------------------------
  const consultGroup = new Group();
  consultGroup.position.set(-1.42, floor, 0.25);
  group.add(consultGroup);

  // Plataforma de madera
  box(consultGroup, woodPlatform, [1.5, 0.06, 2.05], [0, 0.03, 0], 1);
  // Listones verticales acústicos en la pared posterior
  for (let i = -3; i <= 3; i++) {
    box(consultGroup, woodSlat, [0.045, 1.4, 0.045], [i * 0.18, 0.95, -1.02], 1);
  }

  // Escritorio curvo ejecutivo
  box(consultGroup, marbleDesk, [1.08, 0.07, 0.54], [0, 0.4, -0.05], 1);
  box(consultGroup, steelMat, [0.06, 0.38, 0.46], [-0.48, 0.19, -0.05], 1);
  box(consultGroup, steelMat, [0.06, 0.38, 0.46], [0.48, 0.19, -0.05], 1);

  // Sillas ejecutivas de cuero
  for (const z of [-0.45, 0.35]) {
    const chair = new Group();
    chair.position.set(0, 0.16, z);
    if (z > 0) chair.rotation.y = Math.PI;
    consultGroup.add(chair);
    box(chair, leatherSeat, [0.46, 0.06, 0.42], [0, 0.12, 0], 1);
    box(chair, leatherSeat, [0.46, 0.35, 0.06], [0, 0.3, z > 0 ? 0.2 : -0.2], 1);
    box(chair, steelMat, [0.38, 0.12, 0.36], [0, 0.04, 0], 1);
  }

  // Maceta arquitectónica con planta
  cyl(consultGroup, potMat, [0.22, 0.3, 0.22], [-0.58, 0.18, 0.72], 1);
  cyl(consultGroup, plantMat, [0.26, 0.36, 0.26], [-0.58, 0.46, 0.72], 1);

  // Pantalla Holográfica de Embudo Comercial (flota sobre el escritorio)
  const hudGroup = new Group();
  hudGroup.position.set(0, 0.68, -0.05);
  consultGroup.add(hudGroup);
  box(hudGroup, glassMat, [0.65, 0.38, 0.02], [0, 0, 0], 1);

  // Barras holográficas animadas (Prospectos -> Propuestas -> Cierres)
  const funnelBars = [accentMat, amberMat, mintMat].map((mat, i) => {
    return box(hudGroup, mat, [0.12, 0.14 + (2 - i) * 0.06, 0.03], [(i - 1) * 0.18, 0, 0.015], 1);
  });

  // -------------------------------------------------------------
  // 4. Flanco Derecho: Bahía VIP de Entrega (Opción 2: Cierre)
  // -------------------------------------------------------------
  const deliveryGroup = new Group();
  deliveryGroup.position.set(1.42, floor, 0.25);
  group.add(deliveryGroup);

  // Líneas demarcatorias amarillas
  box(deliveryGroup, amberMat, [1.5, 0.008, 0.04], [0, 0.005, -0.95], 2);
  box(deliveryGroup, amberMat, [1.5, 0.008, 0.04], [0, 0.005, 0.95], 2);
  box(deliveryGroup, amberMat, [0.04, 0.008, 1.9], [-0.72, 0.005, 0], 2);
  box(deliveryGroup, amberMat, [0.04, 0.008, 1.9], [0.72, 0.005, 0], 2);

  // Pórtico luminoso de entrega con arco LED
  box(deliveryGroup, steelMat, [0.12, 1.48, 0.12], [-0.7, 0.74, -0.4], 2);
  box(deliveryGroup, steelMat, [0.12, 1.48, 0.12], [0.7, 0.74, -0.4], 2);
  box(deliveryGroup, steelMat, [1.52, 0.12, 0.12], [0, 1.42, -0.4], 2);
  // Arco LED interior brillante
  const archGlow = box(deliveryGroup, mintMat, [1.32, 0.04, 0.06], [0, 1.34, -0.4], 2);

  // Vehículo de entrega listo para el cliente
  const deliveryCar = new Group();
  deliveryCar.position.set(0, 0, 0);
  deliveryCar.rotation.y = -Math.PI / 12;
  deliveryGroup.add(deliveryCar);
  box(deliveryCar, steelMat, [1.4, 0.2, 0.72], [0, 0.16, 0], 2);
  box(deliveryCar, glassMat, [0.75, 0.17, 0.6], [-0.05, 0.31, 0], 2);
  // Lazo / Baliza de entrega dorada en el techo
  const ribbon = box(deliveryCar, amberMat, [0.24, 0.1, 0.24], [-0.05, 0.44, 0], 2);
  ribbon.rotation.y = Math.PI / 4;

  // Ruedas del auto de entrega
  for (const x of [-0.44, 0.44]) {
    for (const z of [-0.38, 0.38]) {
      const w = new Mesh(wheelGeometry, rubberMat);
      w.scale.set(0.1, 0.12, 0.12);
      w.position.set(x, 0.12, z);
      w.userData['choice'] = 2;
      deliveryCar.add(w);
    }
  }

  // Tótem digital de entrega
  box(deliveryGroup, steelMat, [0.18, 0.62, 0.14], [0.65, 0.31, 0.72], 2);
  box(deliveryGroup, mintMat, [0.14, 0.22, 0.02], [0.65, 0.46, 0.79], 2);

  return {
    group,
    choices: CHOICES,
    select(index) {
      // Resalta los elementos del área seleccionada
      materials.forEach((mat) => {
        mat.emissiveIntensity = 0;
      });
      if (index === 0) {
        accentMat.emissiveIntensity = 0.55;
        headlightMat.emissiveIntensity = 0.8;
        turntableRing.scale.set(2.82, 0.03, 2.82);
      } else if (index === 1) {
        amberMat.emissiveIntensity = 0.6;
        marbleDesk.emissiveIntensity = 0.25;
        woodPlatform.emissiveIntensity = 0.2;
      } else if (index === 2) {
        mintMat.emissiveIntensity = 0.7;
        archGlow.scale.set(1.36, 0.06, 0.08);
      }
    },
    update(time) {
      // Rotación suave del turntable en el showroom
      turntable.rotation.y = time * 0.32;
      // Flotación sutil del auto concepto
      car.position.y = Math.sin(time * 2.5) * 0.015;

      // Pulsación de las barras holográficas de ventas
      funnelBars.forEach((bar, i) => {
        const h = 0.14 + (2 - i) * 0.06 + Math.sin(time * 3 + i * 1.2) * 0.035;
        bar.scale.y = Math.max(0.05, h);
      });

      // Brillo del lazo de entrega
      ribbon.rotation.y = time * 0.8;
    },
    dispose() {
      boxGeometry.dispose();
      cylinderGeometry.dispose();
      wheelGeometry.dispose();
      materials.forEach((m) => m.dispose());
    },
  };
}
