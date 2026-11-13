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
    label: 'Bóveda & Tesorería',
    detail:
      'Bóveda acorazada con compuerta de engranajes y reservas de lingotes de oro en custodia.',
  },
  {
    label: 'Mesa de Operaciones',
    detail:
      'Terminal de trading algorítmico con pantallas de velas financieras y gráficos en tiempo real.',
  },
  {
    label: 'Servidores & Auditoría',
    detail:
      'Batería de servidores criptográficos con LEDs de transacción y panel de ticker financiero.',
  },
] as const;

export function buildFinanceDesign(accent: string, variant = 'financial-board'): Design {
  const group = new Group();
  const scale = 0.8;
  group.scale.setScalar(scale);

  const floor = -0.69;
  const boxGeometry = new BoxGeometry();
  const cylinderGeometry = new CylinderGeometry(0.5, 0.5, 1, 24);
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

  // Materiales de alta seguridad financiera
  const baseMat = material('#131b24', 0.85, 0.2);
  const floorMat = material('#1d2735', 0.4, 0.35);
  const borderMat = material('#33465e', 0.5, 0.4);
  const wallMat = material('#243346', 0.7, 0.3);
  const steelMat = material('#52657e', 0.35, 0.65);
  const chromeMat = material('#a6b8cc', 0.2, 0.85);
  const vaultBodyMat = material('#3b4e65', 0.4, 0.6);

  // Oro puro pulido para los lingotes de la tesorería
  const goldMat = material('#f59e0b', 0.22, 0.88);
  const palletWood = material('#4b3c2c', 0.75, 0.1);

  const accentColor = new Color(accent);
  const accentMat = material(accentColor, 0.3, 0.5);
  const mintMat = material('#10b981', 0.3, 0.4); // Velas alcistas / Verde
  const redMat = material('#ef4444', 0.3, 0.4); // Velas bajistas / Rojo
  const screenMat = material('#0d1520', 0.2, 0.3);
  const laserMat = material('#38bdf8', 0.2, 0.6);

  // 1. Base y arquitectura de búnker financiero
  box(group, baseMat, [4.74, 0.23, 5.14], [0, floor - 0.131, 0.15]);
  box(group, floorMat, [4.7, 0.05, 5.14], [0, floor - 0.026, 0.15]);

  // Guías de seguridad láser en el suelo
  box(group, laserMat, [4.68, 0.008, 0.02], [0, floor + 0.002, -1.9]);
  box(group, laserMat, [4.68, 0.008, 0.02], [0, floor + 0.002, 2.45]);

  // Pared posterior acorazada con vigas estructurales
  box(group, wallMat, [4.62, 1.82, 0.16], [0, floor + 0.91, -2.15]);
  for (const x of [-2.05, -0.7, 0.7, 2.05]) {
    box(group, steelMat, [0.14, 1.82, 0.2], [x, floor + 0.91, -2.12]);
  }

  // -------------------------------------------------------------
  // 2. Flanco Izquierdo: Bóveda & Lingotes de Oro (Opción 0: Bóveda)
  // -------------------------------------------------------------
  const vaultGroup = new Group();
  vaultGroup.position.set(-1.42, floor, 0.15);
  group.add(vaultGroup);

  // Marco exterior de la bóveda
  box(vaultGroup, steelMat, [1.68, 1.72, 0.18], [0, 0.86, -1.18], 0);

  // Compuerta circular masiva
  const vaultDoor = new Group();
  vaultDoor.position.set(0, 0.86, -1.06);
  vaultGroup.add(vaultDoor);

  const doorBody = cyl(vaultDoor, vaultBodyMat, [1.38, 0.16, 1.38], [0, 0, 0], 0);
  doorBody.rotation.x = Math.PI / 2;

  // Pernos radiales de cerrojo cromado
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const bolt = cyl(
      vaultDoor,
      chromeMat,
      [0.08, 0.18, 0.08],
      [Math.cos(angle) * 0.72, Math.sin(angle) * 0.72, 0],
      0,
    );
    bolt.rotation.z = angle + Math.PI / 2;
  }

  // Engranaje central rotatorio con manivela
  const vaultWheel = new Group();
  vaultWheel.position.set(0, 0, 0.1);
  vaultDoor.add(vaultWheel);

  const wheelCore = cyl(vaultWheel, chromeMat, [0.42, 0.06, 0.42], [0, 0, 0], 0);
  wheelCore.rotation.x = Math.PI / 2;
  for (let s = 0; s < 4; s++) {
    const spoke = box(vaultWheel, chromeMat, [0.58, 0.04, 0.03], [0, 0, 0.02], 0);
    spoke.rotation.z = (s * Math.PI) / 4;
  }

  // Terminal de acceso biométrico junto a la bóveda
  box(vaultGroup, steelMat, [0.18, 0.38, 0.1], [0.94, 0.86, -1.08], 0);
  const bioLed = box(vaultGroup, mintMat, [0.08, 0.08, 0.02], [0.94, 0.94, -1.02], 0);

  // Pallet industrial con lingotes de oro apilados
  box(vaultGroup, palletWood, [0.82, 0.08, 0.76], [0, 0.04, 0.25], 0);
  for (let layer = 0; layer < 3; layer++) {
    const isEven = layer % 2 === 0;
    const rows = 4;
    for (let r = 0; r < rows; r++) {
      const offset = (r - (rows - 1) / 2) * 0.15;
      const barSize: [number, number, number] = isEven ? [0.62, 0.06, 0.11] : [0.11, 0.06, 0.62];
      const barPos: [number, number, number] = isEven
        ? [0, 0.11 + layer * 0.065, 0.25 + offset]
        : [offset, 0.11 + layer * 0.065, 0.25];
      box(vaultGroup, goldMat, barSize, barPos, 0);
    }
  }

  // Carretilla acorazada con maletín de valores
  const cartGroup = new Group();
  cartGroup.position.set(0.68, 0, 0.72);
  vaultGroup.add(cartGroup);
  box(cartGroup, steelMat, [0.45, 0.1, 0.35], [0, 0.1, 0], 0);
  box(cartGroup, chromeMat, [0.04, 0.35, 0.04], [0.2, 0.28, 0], 0);
  box(cartGroup, chromeMat, [0.04, 0.04, 0.32], [0.2, 0.44, 0], 0);
  box(cartGroup, accentMat, [0.32, 0.18, 0.24], [0, 0.24, 0], 0);

  // -------------------------------------------------------------
  // 3. Zona Central: Terminal de Trading & Velas Financieras (Opción 1: Trading)
  // -------------------------------------------------------------
  const tradeGroup = new Group();
  tradeGroup.position.set(0.15, floor, 0.2);
  group.add(tradeGroup);

  // Escritorio de trading curvo
  box(tradeGroup, steelMat, [1.45, 0.07, 0.58], [0, 0.38, 0], 1);
  box(tradeGroup, baseMat, [0.06, 0.36, 0.48], [-0.64, 0.18, 0], 1);
  box(tradeGroup, baseMat, [0.06, 0.36, 0.48], [0.64, 0.18, 0], 1);

  // Silla ejecutiva de trading
  box(tradeGroup, baseMat, [0.45, 0.08, 0.45], [0, 0.24, 0.48], 1);
  box(tradeGroup, steelMat, [0.42, 0.38, 0.06], [0, 0.44, 0.68], 1);

  // Pantallas de trading triples panorámicas
  const screensGroup = new Group();
  screensGroup.position.set(0, 0.68, -0.06);
  tradeGroup.add(screensGroup);

  // Pantalla central (Gráfico de velas)
  box(screensGroup, screenMat, [0.68, 0.44, 0.03], [0, 0, 0], 1);
  // Pantalla izquierda (Área / Curva)
  const leftScreen = box(screensGroup, screenMat, [0.42, 0.38, 0.03], [-0.54, 0, 0.08], 1);
  leftScreen.rotation.y = Math.PI / 8;
  // Pantalla derecha (Histograma)
  const rightScreen = box(screensGroup, screenMat, [0.42, 0.38, 0.03], [0.54, 0, 0.08], 1);
  rightScreen.rotation.y = -Math.PI / 8;

  // Velas japonesas volumétricas 3D (Candlestick Chart animado)
  const candleGroup = new Group();
  candleGroup.position.set(0, 0, 0.025);
  screensGroup.add(candleGroup);

  const candleData = [
    { type: 'bull', baseH: 0.12, x: -0.24 },
    { type: 'bull', baseH: 0.18, x: -0.16 },
    { type: 'bear', baseH: 0.1, x: -0.08 },
    { type: 'bull', baseH: 0.24, x: 0 },
    { type: 'bear', baseH: 0.14, x: 0.08 },
    { type: 'bull', baseH: 0.28, x: 0.16 },
    { type: 'bull', baseH: 0.22, x: 0.24 },
  ];

  const candleMeshes = candleData.map((d, i) => {
    const mat = d.type === 'bull' ? mintMat : redMat;
    const body = box(candleGroup, mat, [0.045, d.baseH, 0.015], [d.x, 0, 0], 1);
    const wick = box(candleGroup, chromeMat, [0.008, d.baseH + 0.08, 0.008], [d.x, 0, 0], 1);
    return { body, wick, baseH: d.baseH, i };
  });

  // -------------------------------------------------------------
  // 4. Flanco Derecho: Servidores Criptográficos & Ticker (Opción 2: Auditoría)
  // -------------------------------------------------------------
  const serverGroup = new Group();
  serverGroup.position.set(1.56, floor, 0.15);
  group.add(serverGroup);

  // Racks de servidores gemelos
  for (const x of [-0.36, 0.36]) {
    box(serverGroup, baseMat, [0.58, 1.55, 0.52], [x, 0.77, -0.6], 2);
    box(serverGroup, screenMat, [0.52, 1.48, 0.02], [x, 0.77, -0.33], 2);
  }

  // Matriz de LEDs indicadores de transacciones y validación de bloques
  const leds: Mesh[] = [];
  for (let rack = -1; rack <= 1; rack += 2) {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 3; col++) {
        const ledMat = (row + col) % 3 === 0 ? mintMat : (row + col) % 3 === 1 ? laserMat : goldMat;
        const led = box(
          serverGroup,
          ledMat,
          [0.028, 0.028, 0.015],
          [rack * 0.36 + (col - 1) * 0.12, 0.32 + row * 0.18, -0.31],
          2,
        );
        leds.push(led);
      }
    }
  }

  // Cinta de Ticker Financiero en la parte superior
  const tickerGroup = new Group();
  tickerGroup.position.set(0, floor + 1.82, -1.8);
  group.add(tickerGroup);
  box(tickerGroup, screenMat, [4.6, 0.18, 0.04], [0, 0, 0], 2);

  const tickerSegments = [-1.6, -0.8, 0, 0.8, 1.6].map((x, i) => {
    const mat = i % 2 === 0 ? mintMat : goldMat;
    return box(tickerGroup, mat, [0.45, 0.08, 0.03], [x, 0, 0.02], 2);
  });

  return {
    group,
    choices: CHOICES,
    select(index) {
      materials.forEach((mat) => {
        mat.emissiveIntensity = 0;
      });
      if (index === 0) {
        goldMat.emissiveIntensity = 0.65;
        chromeMat.emissiveIntensity = 0.45;
        bioLed.scale.set(0.12, 0.12, 0.03);
      } else if (index === 1) {
        mintMat.emissiveIntensity = 0.7;
        redMat.emissiveIntensity = 0.55;
        laserMat.emissiveIntensity = 0.4;
      } else if (index === 2) {
        laserMat.emissiveIntensity = 0.75;
        mintMat.emissiveIntensity = 0.6;
        goldMat.emissiveIntensity = 0.4;
      }
    },
    update(time) {
      // Giro sutil de la manivela de seguridad de la bóveda
      vaultWheel.rotation.z = Math.sin(time * 0.8) * 0.35;

      // Fluctuación dinámica de las velas bursátiles (trading volatility)
      candleMeshes.forEach(({ body, wick, baseH, i }) => {
        const delta = Math.sin(time * 3.5 + i * 1.1) * 0.05;
        const currentH = Math.max(0.04, baseH + delta);
        body.scale.y = currentH / baseH;
        body.position.y = delta * 0.5;
        wick.position.y = delta * 0.5;
      });

      // Parpadeo de LEDs de transacciones en los servidores
      leds.forEach((led, i) => {
        const pulse = (Math.sin(time * 8 + i * 1.7) + 1) * 0.5;
        led.scale.set(0.028 * (0.8 + pulse * 0.5), 0.028 * (0.8 + pulse * 0.5), 0.015);
      });

      // Ticker financiero desplazándose sutilmente
      tickerSegments.forEach((seg, i) => {
        seg.position.x = ((i * 0.9 + time * 0.3) % 4.2) - 2.1;
      });
    },
    dispose() {
      boxGeometry.dispose();
      cylinderGeometry.dispose();
      materials.forEach((m) => m.dispose());
    },
  };
}
