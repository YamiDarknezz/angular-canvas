// Requiere three y @types/three. Geometría local, sin texturas ni modelos externos.
import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
} from 'three';
import type { Design } from './three-scene';

export type DepartmentVariant =
  | 'negotiation'
  | 'delivery'
  | 'showroom'
  | 'office'
  | 'onboarding'
  | 'team-calendar'
  | 'cash-flow'
  | 'financial-board'
  | 'budget';

/** Comparte geometrías y el reloj del visor entre las escenas del catálogo. */
export function buildDepartmentDesign(variant: DepartmentVariant, accent: string): Design {
  const group = new Group();
  const box = new BoxGeometry();
  const cylinder = new CylinderGeometry(0.5, 0.5, 1, 24);
  const sphere = new SphereGeometry(0.5, 16, 12);
  const surfaces = new Map<string, MeshStandardMaterial>();
  const bright = '#e1eaf5';
  const steel = '#506885';
  const navy = '#23324a';
  const amber = '#ffc675';
  const mint = '#76e4b7';
  let selected = 0;
  let selectionChanged = false;
  let timeSelected = 0;
  let lastFrame = 0;

  function part(
    parent: Group,
    shape: BoxGeometry | CylinderGeometry | SphereGeometry,
    color: string,
    size: [number, number, number],
    position: [number, number, number],
    choice?: number,
  ) {
    // Un material por color y opción permite destacar todas las piezas asociadas al clic.
    const key = color + '/' + choice;
    let material = surfaces.get(key);
    if (!material) {
      material = new MeshStandardMaterial({
        color,
        roughness: 0.68,
        emissive: color,
        emissiveIntensity: 0,
      });
      surfaces.set(key, material);
    }
    const mesh = new Mesh(shape, material);
    mesh.scale.set(...size);
    mesh.position.set(...position);
    if (choice !== undefined) mesh.userData['choice'] = choice;
    parent.add(mesh);
    return mesh;
  }

  function person(parent: Group, x: number, z: number, color: string, choice?: number) {
    const figure = new Group();
    figure.position.set(x, -0.53, z);
    parent.add(figure);
    part(figure, sphere, '#e8b49b', [0.28, 0.29, 0.27], [0, 0.72, 0], choice);
    part(figure, cylinder, color, [0.34, 0.32, 0.24], [0, 0.43, 0], choice);
    for (const side of [-1, 1]) {
      part(figure, box, navy, [0.1, 0.27, 0.14], [side * 0.09, 0.135, 0], choice);
      part(figure, sphere, color, [0.1, 0.29, 0.11], [side * 0.19, 0.43, 0], choice);
    }
    return figure;
  }

  function desk(x: number, z: number, color: string, choice?: number) {
    part(group, box, steel, [0.78, 0.4, 0.48], [x, -0.33, z], choice);
    part(group, box, color, [0.92, 0.09, 0.57], [x, -0.09, z], choice);
    part(group, box, navy, [0.39, 0.28, 0.055], [x, 0.11, z - 0.13], choice);
    part(group, box, bright, [0.31, 0.17, 0.015], [x, 0.12, z - 0.096], choice);
  }

  function finish(
    labels: string[],
    describe: string[] | ((index: number) => string),
    animate: (time: number, age: number) => void,
  ): Design {
    return {
      group,
      choices: labels.map((label, index) => ({
        label,
        get detail() {
          return typeof describe === 'function' ? describe(index) : describe[index];
        },
      })),
      select(index) {
        selected = index;
        selectionChanged = true;
        timeSelected = lastFrame;
        for (const [key, surface] of surfaces) {
          surface.emissiveIntensity = key.endsWith('/' + index) ? 0.27 : 0;
        }
      },
      update(time) {
        lastFrame = time;
        // Si el visor está pausado, el nuevo estado se muestra en el primer render.
        animate(time, selectionChanged && time === timeSelected ? Infinity : time - timeSelected);
        selectionChanged = false;
      },
      dispose() {
        box.dispose();
        cylinder.dispose();
        sphere.dispose();
        surfaces.forEach((material) => material.dispose());
      },
    };
  }

  part(group, box, navy, [4.5, 0.19, 3.6], [0, -0.63, 0]);

  switch (variant) {
    case 'negotiation': {
      part(group, box, steel, [2.55, 0.12, 1.1], [0, 0, 0]);
      for (const x of [-0.95, 0.95]) {
        part(group, box, navy, [0.19, 0.52, 0.78], [x, -0.27, 0]);
        person(group, x * 1.64, 0, x < 0 ? accent : '#aeb7ff').rotation.y =
          x < 0 ? Math.PI / 2 : -Math.PI / 2;
      }
      const proposal = new Group();
      group.add(proposal);
      part(proposal, box, bright, [0.48, 0.03, 0.7], [0, 0, 0]);
      for (let row = 0; row < 4; row++) {
        part(proposal, box, steel, [0.31, 0.008, 0.025], [0, 0.019, -0.2 + row * 0.1]);
      }
      const seal = part(proposal, cylinder, mint, [0.16, 0.023, 0.16], [0.1, 0.024, 0.22]);
      [-0.82, 0, 0.82].forEach((x, index) =>
        part(
          group,
          box,
          [accent, amber, mint][index],
          [0.48, 0.025, 0.12],
          [x, 0.075, 0.44],
          index,
        ),
      );
      return finish(
        ['Borrador', 'Enviada', 'Aceptada'],
        [
          'La propuesta sigue en preparación del lado comercial.',
          'La propuesta está en el centro, lista para revisión.',
          'El cliente aceptó la propuesta. El sello verde marca el acuerdo.',
        ],
        (time) => {
          proposal.position.set((selected - 1) * 0.75, 0.13 + Math.sin(time * 2) * 0.032, -0.05);
          proposal.rotation.y = (selected - 1) * 0.19;
          seal.visible = selected === 2;
        },
      );
    }
    case 'delivery': {
      part(group, box, steel, [4.1, 0.025, 0.57], [0, -0.519, 0.99]);
      part(group, box, bright, [0.61, 0.53, 0.64], [-1.62, -0.26, -0.74]);
      part(group, box, accent, [0.76, 0.1, 0.77], [-1.62, 0.05, -0.74]);
      const stops = [-0.53, 0.53, 1.59];
      stops.forEach((x, index) => {
        part(group, box, steel, [0.53, 0.025, 1.57], [x, -0.519, -0.01]);
        part(group, box, bright, [0.65, 0.58, 0.64], [x, -0.24, -1.08], index);
        part(
          group,
          box,
          [accent, '#8db1ec', mint][index],
          [0.72, 0.12, 0.72],
          [x, 0.11, -1.08],
          index,
        );
        part(group, box, navy, [0.25, 0.3, 0.025], [x, -0.37, -0.75], index);
      });
      const van = new Group();
      group.add(van);
      part(van, box, accent, [0.58, 0.35, 0.34], [-0.09, 0.25, 0]);
      part(van, box, bright, [0.29, 0.24, 0.32], [0.31, 0.19, 0]);
      part(van, box, navy, [0.023, 0.12, 0.26], [0.455, 0.24, 0]);
      for (const x of [-0.28, 0.29]) {
        for (const z of [-0.17, 0.17]) {
          part(van, cylinder, navy, [0.18, 0.075, 0.18], [x, 0.08, z]).rotation.x = Math.PI / 2;
        }
      }
      return finish(
        ['Cliente Norte', 'Cliente Centro', 'Cliente Sur'],
        [
          'Ruta de ejemplo con entrega en recepción.',
          'Ruta de ejemplo con entrega en el punto de venta.',
          'Ruta de ejemplo con entrega en el local del cliente.',
        ],
        (time) => {
          const phase = (time + 0.8) % 8;
          const along = MathUtils.smoothstep(phase, 0, 2.7) - MathUtils.smoothstep(phase, 5.8, 8);
          const branch =
            MathUtils.smoothstep(phase, 2.7, 4.1) - MathUtils.smoothstep(phase, 4.8, 5.8);
          van.position.set(
            MathUtils.lerp(-1.58, stops[selected], along),
            -0.51,
            0.99 - 1.13 * branch,
          );
          van.rotation.y = phase > 2.55 && phase < 5.95 ? Math.PI / 2 : 0;
        },
      );
    }
    case 'showroom': {
      const turntable = new Group();
      group.add(turntable);
      part(turntable, cylinder, steel, [3.35, 0.17, 3.35], [0, -0.44, 0]);
      const products = [new Group(), new Group(), new Group()];
      const shapes = [box, cylinder, sphere];
      products.forEach((product, index) => {
        const angle = (index * Math.PI * 2) / 3;
        product.position.set(Math.sin(angle) * 1.01, -0.35, Math.cos(angle) * 1.01);
        turntable.add(product);
        part(product, cylinder, navy, [0.82, 0.15, 0.82], [0, 0.075, 0], index);
        part(
          product,
          shapes[index],
          [accent, '#9fbffc', mint][index],
          [0.5, 0.62, 0.5],
          [0, 0.47, 0],
          index,
        );
        part(product, cylinder, bright, [0.26, 0.11, 0.26], [0, 0.8, 0], index);
      });
      return finish(
        ['Caja', 'Botella', 'Difusor'],
        [
          'Caja de regalo · S/ 48 · Disponible.',
          'Botella reutilizable · S/ 65 · Disponible.',
          'Difusor de escritorio · S/ 89 · Próximamente.',
        ],
        (time) => {
          turntable.rotation.y = time * 0.31;
          products.forEach((product, index) => {
            product.position.y = index === selected ? -0.14 + Math.sin(time * 2) * 0.03 : -0.35;
          });
        },
      );
    }
    case 'office': {
      const stations = [
        [-1.36, 0.3],
        [0, -0.68],
        [1.36, 0.32],
      ] as const;
      const people = stations.map(([x, z], index) => {
        const color = [accent, '#80c3ec', '#9fe1ad'][index];
        part(group, box, color, [1.23, 0.035, 1.5], [x, -0.51, z], index);
        desk(x, z - 0.31, bright, index);
        return person(group, x, z + 0.33, color, index);
      });
      return finish(
        ['Talento', 'Desarrollo', 'Bienestar'],
        [
          'Talento coordina vacantes y entrevistas.',
          'Desarrollo prepara capacitaciones y planes de carrera.',
          'Bienestar organiza beneficios y actividades de equipo.',
        ],
        (time) => {
          people.forEach((figure, index) => {
            figure.rotation.y = (index === selected ? 0.55 : 0.15) * Math.sin(time * 1.5 + index);
          });
        },
      );
    }
    case 'onboarding': {
      const stops = [-1.56, -0.52, 0.52, 1.56];
      stops.forEach((x, index) => {
        desk(x, -0.54, [accent, amber, '#b6a5fa', mint][index], index);
        part(group, cylinder, steel, [0.32, 0.025, 0.32], [x, -0.51, 0.78], index);
      });
      const walker = person(group, stops[0], 0.78, accent);
      let previous = stops[0] as number;
      let destination = 0;
      return finish(
        ['Bienvenida', 'Documentación', 'Capacitación', 'Integración'],
        [
          'La persona conoce su plan del primer día.',
          'Se revisan los documentos y se activan sus accesos.',
          'La persona practica con las herramientas del puesto.',
          'Se presenta al equipo y conoce a su persona de apoyo.',
        ],
        (_time, age) => {
          if (destination !== selected) {
            previous = walker.position.x;
            destination = selected;
          }
          const progress = MathUtils.smoothstep(age, 0, 1.05);
          if (progress === 1) previous = stops[selected];
          walker.position.x = MathUtils.lerp(previous, stops[selected], progress);
          walker.position.y =
            -0.53 +
            (progress < 1 && previous !== stops[selected]
              ? 0.07 * Math.abs(Math.sin(age * 15))
              : 0);
          walker.rotation.y =
            progress < 1 && previous !== stops[selected]
              ? (Math.sign(stops[selected] - previous) * Math.PI) / 2
              : Math.PI;
        },
      );
    }
    case 'team-calendar': {
      for (let day = 0; day < 5; day++) {
        const x = (day - 2) * 0.73;
        part(group, box, bright, [0.61, 0.055, 0.27], [x, -0.49, -1.19]);
        for (let slot = 0; slot < 3; slot++) {
          part(group, box, steel, [0.63, 0.04, 0.6], [x, -0.49, (slot - 1) * 0.74 + 0.2]);
        }
      }
      const slots = [-0.54, 0.2, 0.94];
      const appointments = [accent, amber, mint].map((color, index) =>
        part(
          group,
          box,
          color,
          [0.52, 0.2, 0.48],
          [(index - 1) * 1.46, -0.36, slots[index]],
          index,
        ),
      );
      let appointment = 0;
      const scheduled = new Set<number>();
      const titles = ['Entrevista', 'Reunión', 'Capacitación'];
      const days = ['lunes', 'miércoles', 'viernes'];
      const hours = ['09:00', '11:00', '15:00'];
      const design = finish(
        [...titles, 'Cambiar horario'],
        (index) => {
          const event = index === 3 ? appointment : index;
          const moved = scheduled.has(event);
          return (
            titles[event] +
            ' · ' +
            days[event] +
            ' ' +
            hours[moved ? (event + 1) % hours.length : event] +
            (moved ? ' · Reprogramada.' : ' · Horario original.')
          );
        },
        (time) => {
          appointments.forEach((appointment, index) => {
            appointment.position.y = index === selected ? -0.27 + Math.sin(time * 2) * 0.04 : -0.36;
          });
        },
      );
      return {
        ...design,
        select(index) {
          if (index < appointments.length) {
            appointment = index;
            design.select?.(index);
            return;
          }
          const reschedule = !scheduled.has(appointment);
          if (reschedule) scheduled.add(appointment);
          else scheduled.delete(appointment);
          appointments[appointment].position.z =
            slots[reschedule ? (appointment + 1) % 3 : appointment];
        },
      };
    }
    case 'cash-flow':
    case 'financial-board':
    case 'budget':
      return buildFinance();
  }

  function buildFinance(): Design {
    const budget = variant === 'budget';
    const flow = variant === 'cash-flow';
    const values = budget
      ? [
          [40, 35, 25],
          [55, 25, 20],
          [32, 24, 44],
        ]
      : flow
        ? [
            [60, 40, 20],
            [78, 40, 38],
            [60, 48, 12],
          ]
        : [
            [72, 54, 18],
            [100, 71, 29],
          ];
    const labels = budget
      ? ['Base', 'Priorizar Operaciones', 'Priorizar RR. HH.']
      : flow
        ? ['Base', 'Aumentar ingresos', 'Aumentar gastos']
        : ['Mes', 'Trimestre'];
    const names = budget
      ? ['Operaciones', 'Comercial', 'RR. HH.']
      : ['Ingresos', 'Gastos', 'Resultado'];
    const colors = [accent, amber, '#a7b8ff'];
    if (budget) part(group, box, steel, [3.95, 0.17, 1.33], [0, -0.42, 0]);
    if (flow) {
      for (const x of [-1.28, 0]) {
        part(group, box, steel, [0.46, 0.035, 1.24], [x, -0.51, 0.88]);
      }
    }
    const series = names.map((_, index) => {
      const x = (index - 1) * 1.28;
      if (!budget)
        part(group, box, steel, [0.94, 0.12, 0.92], [x, -0.47, -0.14], index + labels.length);
      return part(
        group,
        flow ? cylinder : box,
        colors[index],
        [0.72, 1, 0.72],
        [x, 0, -0.14],
        index + labels.length,
      );
    });
    const tokens = flow
      ? Array.from({ length: 6 }, (_, index) => {
          const x = index < 3 ? -1.28 : 0;
          return part(group, cylinder, colors[index < 3 ? 0 : 1], [0.2, 0.055, 0.2], [x, -0.38, 0]);
        })
      : [];
    let scenario = 0;
    const summary = (row: number[]) =>
      row
        .map((value, index) => names[index] + ' ' + (budget ? value + '%' : 'S/ ' + value + ' mil'))
        .join(' · ');
    const design = finish(
      [...labels, ...names],
      (index) => {
        if (index < labels.length) return summary(values[index]);
        const value = values[scenario][index - labels.length];
        return (
          names[index - labels.length] +
          ' · ' +
          (budget ? value + '% del presupuesto' : 'S/ ' + value + ' mil')
        );
      },
      (time) => {
        const row = values[scenario];
        let offset = -1.88;
        series.forEach((column, index) => {
          if (budget) {
            const width = row[index] * 0.0376;
            column.scale.set(width - 0.045, 0.53, 1.13);
            column.position.set(offset + width / 2, -0.07, 0);
            offset += width;
            return;
          }
          const height = row[index] * 0.018;
          column.scale.y = height;
          column.position.y = -0.41 + height / 2;
        });
        tokens.forEach((coin, index) => {
          const incoming = index < 3;
          const phase = ((time * row[incoming ? 0 : 1]) / 95 + (index % 3) / 3) % 1;
          coin.position.z = incoming ? 1.37 - phase * 1.1 : 0.27 + phase * 1.1;
          const size = Math.sin(phase * Math.PI);
          coin.scale.set(0.22 * size, 0.055, 0.22 * size);
        });
      },
    );
    return {
      ...design,
      select(index) {
        if (index < labels.length) scenario = index;
        design.select?.(index);
      },
    };
  }
}
