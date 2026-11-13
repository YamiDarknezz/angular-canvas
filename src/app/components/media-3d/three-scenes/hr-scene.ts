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
import { createDiorama } from './diorama-details';

const CHOICES = [
  {
    label: 'Atracción & Talento',
    detail: 'Mural Kanban de selección y reclutamiento con seguimiento de etapas y postulantes.',
  },
  {
    label: 'Espacios Colaborativos',
    detail:
      'Estaciones de trabajo ágiles con monitores curvos ultrawide, portátiles y división acústica.',
  },
  {
    label: 'Cultura & Bienestar',
    detail:
      'Lounge biofílico con sofá seccional de diseño, muro vegetal y espacio de café e integración.',
  },
] as const;

export function buildHrDesign(accent: string, document: Document): Design {
  const group = new Group();
  const details = createDiorama(document, group);
  const scale = 0.8;
  group.scale.setScalar(scale);

  const floor = -0.69;
  const boxGeometry = new BoxGeometry();
  const cylinderGeometry = new CylinderGeometry(0.5, 0.5, 1, 24);
  const materials: MeshStandardMaterial[] = [];

  const material = (color: string | Color, roughness = 0.5, metalness = 0.15) => {
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

  // Materiales escandinavos y de campus tecnológico
  const baseMat = material('#171f2a', 0.85, 0.1);
  const parquetMat = material('#7e5f43', 0.6, 0.1); // Parquet de roble natural
  const borderMat = material('#59402a', 0.7, 0.1);
  const wallMat = material('#2a3747', 0.75, 0.1);
  const acousticSlat = material('#3d4e63', 0.8, 0.05);
  const deskOak = material('#937355', 0.55, 0.1);
  const acousticFelt = material('#43566d', 0.85, 0.05);

  const glassMat = material('#3c5670', 0.2, 0.35);
  const aluminumMat = material('#d2dce6', 0.25, 0.6);
  const steelMat = material('#55687d', 0.4, 0.5);
  const darkPlastic = material('#18222e', 0.4, 0.2);

  const sofaFabric = material('#2a394a', 0.8, 0.05);
  const woodWalnut = material('#4e3725', 0.65, 0.1);
  const plantMat = material('#2d5e3f', 0.85, 0.05);
  const potWhite = material('#e2eaf1', 0.4, 0.1);
  const mugMat = material('#d97706', 0.4, 0.1);

  const accentColor = new Color(accent);
  const accentMat = material(accentColor, 0.3, 0.4);
  const amberMat = material('#f59e0b', 0.35, 0.3);
  const mintMat = material('#10b981', 0.35, 0.3);
  const cyanMat = material('#38bdf8', 0.3, 0.4);
  const lampGlow = material('#fef08a', 0.15, 0.1);

  // 1. Base y arquitectura general
  box(group, baseMat, [4.74, 0.23, 5.14], [0, floor - 0.131, 0.15]);
  box(group, parquetMat, [4.7, 0.05, 5.14], [0, floor - 0.026, 0.15]);
  for (const [index, label] of ['TALENTO', 'DESARROLLO', 'BIENESTAR'].entries()) {
    const x = (index - 1) * 1.47;
    details.sign(
      group,
      label,
      [1.18, 0.23],
      [x, floor + 0.009, 1.67],
      '#303c52',
      '#eae9f6',
      index,
      true,
    );
    details.contact(group, 1.43, 1.73, [x, floor + 0.006, 0.02]);
  }
  box(group, borderMat, [4.68, 0.008, 0.03], [0, floor + 0.002, -1.9]);
  box(group, borderMat, [4.68, 0.008, 0.03], [0, floor + 0.002, 2.45]);

  // Pared posterior con listones acústicos verticales
  box(group, wallMat, [4.62, 1.82, 0.14], [0, floor + 0.91, -2.15]);
  for (let i = -10; i <= 10; i++) {
    box(group, acousticSlat, [0.06, 1.82, 0.04], [i * 0.22, floor + 0.91, -2.06]);
  }

  // -------------------------------------------------------------
  // 2. Flanco Izquierdo: Atracción & Talento (Opción 0: Kanban)
  // -------------------------------------------------------------
  const talentGroup = new Group();
  talentGroup.position.set(-1.46, floor, 0.2);
  group.add(talentGroup);

  // Mampara de vidrio divisoria con marco de aluminio
  box(talentGroup, darkPlastic, [1.52, 1.62, 0.06], [0, 0.81, -0.92], 0);
  box(talentGroup, glassMat, [1.44, 1.54, 0.03], [0, 0.81, -0.92], 0);

  // Tarjetas flotantes del tablero Kanban de selección (Atracción -> Entrevistas -> Ofertas)
  const kanbanColumns = [cyanMat, amberMat, accentMat, mintMat];
  const kanbanCards: Mesh[] = [];
  kanbanColumns.forEach((colMat, col) => {
    for (let row = 0; row < 2; row++) {
      const card = box(
        talentGroup,
        colMat,
        [0.26, 0.16, 0.02],
        [-0.48 + col * 0.32, 1.15 - row * 0.24, -0.89],
        0,
      );
      kanbanCards.push(card);
    }
  });

  // Mesa redonda de entrevistas y café 1-on-1
  cyl(talentGroup, deskOak, [0.74, 0.05, 0.74], [0, 0.38, 0.2], 0);
  cyl(talentGroup, steelMat, [0.08, 0.36, 0.08], [0, 0.18, 0.2], 0);
  cyl(talentGroup, steelMat, [0.42, 0.03, 0.42], [0, 0.015, 0.2], 0);

  // Sillones de entrevista estilo nórdico
  for (const side of [-1, 1]) {
    const chair = new Group();
    chair.position.set(side * 0.54, 0, 0.2);
    chair.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;
    talentGroup.add(chair);
    box(chair, sofaFabric, [0.44, 0.08, 0.42], [0, 0.24, 0], 0);
    box(chair, sofaFabric, [0.44, 0.34, 0.06], [0, 0.42, -0.18], 0);
    cyl(chair, woodWalnut, [0.04, 0.2, 0.04], [-0.16, 0.1, -0.14], 0);
    cyl(chair, woodWalnut, [0.04, 0.2, 0.04], [0.16, 0.1, -0.14], 0);
    cyl(chair, woodWalnut, [0.04, 0.2, 0.04], [0, 0.1, 0.14], 0);
  }

  // Tablet de evaluación en la mesa
  box(talentGroup, aluminumMat, [0.22, 0.015, 0.16], [0, 0.41, 0.18], 0);
  box(talentGroup, cyanMat, [0.2, 0.005, 0.14], [0, 0.42, 0.18], 0);

  // -------------------------------------------------------------
  // 3. Zona Central: Espacios Colaborativos Ágiles (Opción 1: Equipos)
  // -------------------------------------------------------------
  const workGroup = new Group();
  workGroup.position.set(0.12, floor, 0.2);
  group.add(workGroup);

  // Gran mesa compartida de roble
  box(workGroup, deskOak, [1.68, 0.06, 0.92], [0, 0.38, 0], 1);
  box(workGroup, steelMat, [0.06, 0.36, 0.82], [-0.74, 0.18, 0], 1);
  box(workGroup, steelMat, [0.06, 0.36, 0.82], [0.74, 0.18, 0], 1);

  // Panel acústico central de fieltro
  box(workGroup, acousticFelt, [1.6, 0.36, 0.04], [0, 0.58, 0], 1);

  // Puesto Izquierdo: Monitor Curvo Ultrawide 34" y Laptop abierta
  const ultrawide = box(workGroup, darkPlastic, [0.68, 0.34, 0.03], [-0.38, 0.65, -0.06], 1);
  const ultrawideScreen = box(workGroup, cyanMat, [0.64, 0.3, 0.01], [-0.38, 0.65, -0.045], 1);

  // Laptop de aluminio abierta
  const laptopLeft = new Group();
  laptopLeft.position.set(-0.38, 0.41, 0.22);
  workGroup.add(laptopLeft);
  box(laptopLeft, aluminumMat, [0.32, 0.015, 0.22], [0, 0, 0], 1);
  const screenLeft = box(laptopLeft, aluminumMat, [0.32, 0.2, 0.015], [0, 0.09, -0.1], 1);
  screenLeft.rotation.x = -Math.PI / 12;
  box(screenLeft, cyanMat, [0.29, 0.17, 0.005], [0, 0, 0.009], 1);

  // Lámpara de escritorio articulada
  const lamp = new Group();
  lamp.position.set(-0.72, 0.41, -0.15);
  workGroup.add(lamp);
  cyl(lamp, steelMat, [0.12, 0.02, 0.12], [0, 0, 0], 1);
  box(lamp, steelMat, [0.02, 0.34, 0.02], [0, 0.17, 0], 1);
  const lampHead = box(lamp, lampGlow, [0.14, 0.04, 0.08], [0.08, 0.34, 0], 1);

  // Taza de café artesanal
  cyl(workGroup, mugMat, [0.06, 0.08, 0.06], [-0.15, 0.45, 0.25], 1);

  // Puesto Derecho: Doble pantalla y maceta de escritorio
  box(workGroup, darkPlastic, [0.42, 0.28, 0.02], [0.18, 0.62, -0.06], 1);
  box(workGroup, accentMat, [0.39, 0.25, 0.01], [0.18, 0.62, -0.048], 1);
  box(workGroup, darkPlastic, [0.42, 0.28, 0.02], [0.58, 0.62, -0.06], 1);
  box(workGroup, mintMat, [0.39, 0.25, 0.01], [0.58, 0.62, -0.048], 1);

  // Sillas ergonómicas de oficina
  for (const x of [-0.38, 0.38]) {
    const chair = new Group();
    chair.position.set(x, 0, 0.62);
    workGroup.add(chair);
    box(chair, darkPlastic, [0.45, 0.08, 0.42], [0, 0.24, 0], 1);
    box(chair, acousticFelt, [0.42, 0.42, 0.06], [0, 0.48, 0.19], 1);
    cyl(chair, steelMat, [0.06, 0.2, 0.06], [0, 0.1, 0], 1);
    cyl(chair, steelMat, [0.38, 0.02, 0.38], [0, 0.01, 0], 1);
  }

  // -------------------------------------------------------------
  // 4. Flanco Derecho: Cultura, Bienestar & Lounge (Opción 2: Bienestar)
  // -------------------------------------------------------------
  const loungeGroup = new Group();
  loungeGroup.position.set(1.52, floor, 0.18);
  group.add(loungeGroup);

  // Sofá seccional en L escandinavo
  const sofa = new Group();
  sofa.position.set(0, 0, 0);
  loungeGroup.add(sofa);

  // Asiento principal
  box(sofa, sofaFabric, [1.32, 0.26, 0.62], [0, 0.13, 0], 2);
  box(sofa, sofaFabric, [1.32, 0.42, 0.16], [0, 0.42, -0.23], 2);
  // Extensión lateral en L
  box(sofa, sofaFabric, [0.56, 0.26, 0.64], [0.38, 0.13, 0.62], 2);
  box(sofa, sofaFabric, [0.16, 0.42, 0.64], [0.58, 0.42, 0.62], 2);

  // Cojines decorativos de color
  const pillowA = box(sofa, amberMat, [0.22, 0.22, 0.08], [-0.35, 0.36, -0.12], 2);
  pillowA.rotation.z = Math.PI / 16;
  const pillowB = box(sofa, accentMat, [0.22, 0.22, 0.08], [0.05, 0.36, -0.12], 2);
  pillowB.rotation.z = -Math.PI / 14;

  // Mesa baja circular de café
  cyl(loungeGroup, woodWalnut, [0.58, 0.04, 0.58], [-0.32, 0.18, 0.62], 2);
  cyl(loungeGroup, steelMat, [0.06, 0.16, 0.06], [-0.32, 0.08, 0.62], 2);

  // Muro vegetal biofílico en la pared lateral
  const greenWall = new Group();
  greenWall.position.set(0.65, 0.95, -0.7);
  loungeGroup.add(greenWall);
  box(greenWall, darkPlastic, [0.1, 1.45, 0.85], [0, 0, 0], 2);
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 3; c++) {
      box(greenWall, plantMat, [0.08, 0.18, 0.22], [-0.03, -0.55 + r * 0.28, -0.28 + c * 0.28], 2);
    }
  }

  // Gran maceta cilíndrica con planta ficus
  cyl(loungeGroup, potWhite, [0.34, 0.42, 0.34], [-0.55, 0.21, -0.65], 2);
  cyl(loungeGroup, plantMat, [0.42, 0.55, 0.42], [-0.55, 0.62, -0.65], 2);

  return {
    group,
    choices: CHOICES,
    select(index) {
      materials.forEach((mat) => {
        mat.emissiveIntensity = 0;
      });
      if (index === 0) {
        cyanMat.emissiveIntensity = 0.6;
        amberMat.emissiveIntensity = 0.5;
        accentMat.emissiveIntensity = 0.5;
      } else if (index === 1) {
        cyanMat.emissiveIntensity = 0.7;
        accentMat.emissiveIntensity = 0.6;
        lampGlow.emissiveIntensity = 0.8;
      } else if (index === 2) {
        plantMat.emissiveIntensity = 0.4;
        amberMat.emissiveIntensity = 0.6;
        accentMat.emissiveIntensity = 0.5;
      }
    },
    update(time) {
      // Leve oscilación de las tarjetas Kanban
      kanbanCards.forEach((card, i) => {
        card.position.z = -0.89 + Math.sin(time * 2 + i * 0.8) * 0.008;
      });

      // Brillo tenue y parpadeo de pantallas ultrawide
      const screenPulse = (Math.sin(time * 3) + 1) * 0.05;
      ultrawideScreen.scale.y = 1 + screenPulse;

      // Resplandor cálido de la lámpara
      lampHead.scale.set(0.14 * (0.95 + screenPulse), 0.04, 0.08);
    },
    dispose() {
      boxGeometry.dispose();
      cylinderGeometry.dispose();
      materials.forEach((m) => m.dispose());
      details.dispose();
    },
  };
}
