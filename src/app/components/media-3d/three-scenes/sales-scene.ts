// Requiere three y @types/three. Embudo comercial 3D interactivo con partículas descendentes.
import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  Group,
  LatheGeometry,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry,
  Vector2,
} from 'three';

import { createDiorama } from './diorama-details';
import type { Design } from './three-scene';

const CHOICES = [
  {
    label: 'Prospectos (Leads)',
    detail: '120 prospectos calificados entran en la etapa inicial de captación comercial.',
  },
  {
    label: 'Propuestas (Pipeline)',
    detail: '48 oportunidades avanzan a la etapa de cotización formal y propuesta de valor.',
  },
  {
    label: 'Cierres (Won Deals)',
    detail: '16 contratos ganados se concretan exitosamente como ingresos recurrentes.',
  },
] as const;

export function buildSalesDesign(accent: string, document: Document): Design {
  const group = new Group();
  const details = createDiorama(document, group);
  const scale = 0.8;
  group.scale.setScalar(scale);

  const floor = -0.69;
  const boxGeometry = new BoxGeometry();
  const cylinderGeometry = new CylinderGeometry(0.5, 0.5, 1, 32);
  const sphereGeometry = new SphereGeometry(0.5, 16, 12);
  // Sección cerrada del anillo. El hueco deja ver las partículas entre etapas.
  const ringGeometry = new LatheGeometry(
    [
      [0.37, -0.5],
      [0.49, 0.4],
      [0.5, 0.5],
      [0.43, 0.5],
      [0.33, -0.44],
      [0.37, -0.5],
    ].map(([x, y]) => new Vector2(x, y)),
    40,
  );
  const materials: MeshStandardMaterial[] = [];

  const material = (color: string | Color, roughness = 0.4, metalness = 0.25) => {
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

  // Materiales de arquitectura
  const baseMat = material('#151e28', 0.8, 0.2);
  const floorMat = material('#1f2a38', 0.35, 0.3);
  const steelMat = material('#4b6077', 0.35, 0.6);
  const darkMat = material('#121820', 0.5, 0.2);

  const leadMat = material(accent, 0.25, 0.4); // Top - Cyan/Accent
  const propMat = material('#f59e0b', 0.25, 0.4); // Mid - Amber
  const wonMat = material('#10b981', 0.25, 0.4); // Bottom - Mint/Emerald
  const particleMat = material('#ffffff', 0.1, 0.1);

  // 1. Base isométrica
  box(group, baseMat, [4.74, 0.23, 5.14], [0, floor - 0.131, 0.15]);
  box(group, floorMat, [4.7, 0.05, 5.14], [0, floor - 0.026, 0.15]);

  // Pedestal central de soporte
  cyl(group, darkMat, [2.4, 0.08, 2.4], [0, floor + 0.04, 0]);
  cyl(group, steelMat, [1.8, 0.04, 1.8], [0, floor + 0.08, 0]);
  details.contact(group, 3.4, 2.8, [0, floor + 0.006, 0.12]);
  details.sign(
    group,
    'CONVERSIÓN COMERCIAL',
    [1.94, 0.27],
    [0.52, floor + 0.008, 1.97],
    '#293a48',
    '#f8e6d0',
    undefined,
    true,
  );

  // Cuenca receptora de cierres en la base
  cyl(group, steelMat, [0.95, 0.18, 0.95], [0, floor + 0.18, 0], 2);
  cyl(group, wonMat, [0.82, 0.06, 0.82], [0, floor + 0.26, 0], 2);

  // -------------------------------------------------------------
  // 2. Anillos Cónicos del Embudo (3 Niveles de Conversión)
  // -------------------------------------------------------------
  const funnelGroup = new Group();
  funnelGroup.position.set(0, floor + 0.3, 0);
  group.add(funnelGroup);

  const tiers = [leadMat, propMat, wonMat].map((mat, index) => {
    const width = 2.6 - index * 0.7;
    const origY = 1.45 - index * 0.5;
    const mesh = new Mesh(ringGeometry, mat);
    mesh.position.y = origY;
    mesh.scale.set(width, 0.44, width);
    mesh.userData['choice'] = index;
    funnelGroup.add(mesh);
    return { mesh, mat, origY };
  });

  // Columnas guía verticales de cristal / acero
  for (let i = 0; i < 3; i++) {
    const angle = Math.PI + (i * Math.PI) / 2;
    const x = Math.cos(angle) * 1.55;
    const z = Math.sin(angle) * 1.55;
    cyl(funnelGroup, steelMat, [0.064, 1.53, 0.064], [x, 0.765, z]);
    cyl(funnelGroup, steelMat, [0.19, 0.075, 0.19], [x, 0.035, z]);
  }

  // -------------------------------------------------------------
  // 3. Partículas de Datos Fluyendo a través del Embudo
  // -------------------------------------------------------------
  const particleCount = 14;
  const particles: { mesh: Mesh; speed: number; phase: number; radius: number }[] = [];

  for (let i = 0; i < particleCount; i++) {
    const mesh = new Mesh(sphereGeometry, particleMat);
    mesh.scale.setScalar(0.08);
    funnelGroup.add(mesh);
    particles.push({
      mesh,
      speed: 0.6 + (i % 5) * 0.15,
      phase: i / particleCount,
      radius: 0.45 + (i % 3) * 0.2,
    });
  }

  // -------------------------------------------------------------
  // 4. Paneles Holográficos de Métricas KPI Laterales
  // -------------------------------------------------------------
  const kpiData: {
    label: string;
    color: MeshStandardMaterial;
    pos: [number, number, number];
    choice: number;
  }[] = [
    { label: '120 PROSPECTOS', color: leadMat, pos: [-1.52, 1.44, 0.85], choice: 0 },
    { label: '48 PROPUESTAS', color: propMat, pos: [1.49, 0.88, 0.28], choice: 1 },
    { label: '16 CIERRES', color: wonMat, pos: [-0.55, 0.35, 1.58], choice: 2 },
  ];

  const kpiPanels = kpiData.map((d) => {
    const pGroup = new Group();
    pGroup.position.set(d.pos[0], d.pos[1], d.pos[2]);
    group.add(pGroup);

    box(pGroup, darkMat, [1.1, 0.36, 0.05], [0, 0, 0], d.choice);
    box(pGroup, d.color, [1.02, 0.05, 0.06], [0, -0.15, 0], d.choice);
    details.sign(
      pGroup,
      d.label,
      [1.04, 0.24],
      [0, 0.023, 0.028],
      '#1b2530',
      ['#ffdda9', '#f6c16b', '#9ee3c7'][d.choice],
      d.choice,
    );

    return { pGroup, choice: d.choice, mat: d.color };
  });

  return {
    group,
    choices: CHOICES,
    select(index) {
      tiers.forEach(({ mesh, mat, origY }, current) => {
        mat.emissiveIntensity = index === current ? 0.48 : 0;
        mesh.position.y = origY + (index === current ? 0.105 : 0);
      });
    },
    update(time) {
      // Partículas descendentes en espiral a través del embudo
      particles.forEach((p) => {
        const t = (time * p.speed + p.phase) % 1;
        // Altura: desciende desde y = 1.75 hasta y = 0.15
        const y = 1.75 - t * 1.6;
        // Radio: se estrecha conforme desciende (forma cónica de embudo)
        const currentR = p.radius * (1 - t * 0.77);
        const angle = time * 2.5 + p.phase * Math.PI * 2 + t * Math.PI * 3;
        p.mesh.position.set(Math.cos(angle) * currentR, y, Math.sin(angle) * currentR);
      });

      // Flotación sutil de los paneles KPI
      kpiPanels.forEach((kpi, idx) => {
        kpi.pGroup.position.y = kpiData[idx].pos[1] + Math.sin(time * 2 + idx) * 0.03;
      });
    },
    dispose() {
      boxGeometry.dispose();
      cylinderGeometry.dispose();
      sphereGeometry.dispose();
      ringGeometry.dispose();
      materials.forEach((m) => m.dispose());
      details.dispose();
    },
  };
}
