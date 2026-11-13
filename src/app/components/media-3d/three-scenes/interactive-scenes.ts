import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
} from 'three';

import type { Design } from './three-scene';

export interface SceneChoice {
  readonly label: string;
  readonly detail: string;
}

type InteractiveVariant = 'sales' | 'teams';

const SALES = [
  { label: 'Prospectos', detail: '120 prospectos de ejemplo entran al embudo.' },
  { label: 'Propuestas', detail: '48 oportunidades de ejemplo reciben una propuesta.' },
  { label: 'Cierres', detail: '16 oportunidades de ejemplo llegan al cierre.' },
] as const;

const TEAMS = [
  { label: 'Talento', detail: 'Reclutamiento, entrevistas e incorporación.' },
  { label: 'Desarrollo', detail: 'Formación, mentoría y planes de carrera.' },
  { label: 'Bienestar', detail: 'Beneficios, clima laboral y acompañamiento.' },
] as const;

/** Geometría procedural, sin modelos ni texturas externos. */
export function buildInteractiveDesign(variant: InteractiveVariant, accent: string): Design {
  const group = new Group();
  const tint = new Color(accent);
  const pale = new Color('#e4efff');
  const materials = Array.from(
    { length: 3 },
    (_, index) =>
      new MeshStandardMaterial({
        color: tint.clone().lerp(pale, index * 0.19),
        roughness: 0.48,
        metalness: 0.16,
      }),
  );
  const pieces = materials.map((material, index) => {
    const piece = new Group();
    group.add(piece);
    if (variant !== 'sales') piece.position.x = (index - 1) * 1.36;

    return {
      piece,
      material,
      add(geometry: BoxGeometry | SphereGeometry | CylinderGeometry, x = 0, y = 0, z = 0) {
        const mesh = new Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.userData['choice'] = index;
        piece.add(mesh);
      },
    };
  });

  const geometries: (BoxGeometry | SphereGeometry | CylinderGeometry)[] = [];
  let choices: readonly SceneChoice[];
  switch (variant) {
    case 'sales':
      pieces.forEach(({ add, piece }, index) => {
        const radius = 1.38 - index * 0.33;
        const tier = new CylinderGeometry(radius, radius - 0.27, 0.54, 8);
        geometries.push(tier);
        piece.position.y = (1 - index) * 0.72;
        add(tier);
      });
      choices = SALES;
      break;
    case 'teams': {
      const pedestal = new CylinderGeometry(0.57, 0.61, 0.13, 32);
      const head = new SphereGeometry(0.16, 20, 12);
      const body = new CylinderGeometry(0.16, 0.24, 0.38, 20);
      geometries.push(pedestal, head, body);
      pieces.forEach(({ add, piece }, index) => {
        piece.position.z = index === 1 ? -0.46 : 0.36;
        add(pedestal, 0, -0.42);
        for (const [x, z] of [
          [0, -0.2],
          [-0.25, 0.23],
          [0.25, 0.23],
        ]) {
          add(body, x, -0.16, z);
          add(head, x, 0.21, z);
        }
      });
      choices = TEAMS;
      break;
    }
  }

  let selected: number | undefined;
  const select = (index: number) => {
    selected = index;
    pieces.forEach(({ material }, current) => {
      material.color.copy(tint).lerp(pale, current === index ? 0.58 : current * 0.19);
      material.emissive.copy(tint);
      material.emissiveIntensity = current === index ? 0.34 : 0;
    });
  };

  return {
    group,
    choices,
    select,
    update(time) {
      group.rotation.y = Math.sin(time * 0.55) * 0.12;
      pieces.forEach(({ piece }, index) => {
        const active = selected === index;
        if (variant === 'sales') {
          piece.position.x = active ? 0.56 : 0;
          piece.rotation.y = active ? 0.3 + Math.sin(time * 1.3) * 0.14 : 0;
        } else {
          piece.position.y = active ? 0.36 + Math.sin(time * 2) * 0.05 : 0;
        }
      });
    },
    dispose() {
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
    },
  };
}
