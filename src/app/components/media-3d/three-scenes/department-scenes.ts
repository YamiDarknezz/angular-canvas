// Requiere three y @types/three. Geometría local, sin texturas ni modelos externos.
import { Group, MathUtils } from 'three';
import { createDiorama } from './diorama-details';
import type { Design } from './three-scene';

export type DepartmentVariant = 'office' | 'onboarding' | 'team-calendar' | 'cash-flow' | 'budget';

/** Comparte geometrías y el reloj del visor entre las escenas del catálogo. */
export function buildDepartmentDesign(
  variant: DepartmentVariant,
  accent: string,
  document: Document,
): Design {
  const {
    group,
    part: mesh,
    sign,
    plant,
    contact,
    base,
    highlight,
    dispose,
  } = createDiorama(document);
  group.scale.setScalar(0.87);
  const box = 'box';
  const cylinder = 'cylinder';
  const sphere = 'sphere';
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
    shape: typeof box | typeof cylinder | typeof sphere,
    color: string,
    size: [number, number, number],
    position: [number, number, number],
    choice?: number,
  ) {
    return mesh(parent, color, size, position, choice, shape);
  }

  function person(parent: Group, x: number, z: number, color: string, choice?: number) {
    const figure = new Group();
    figure.position.set(x, -0.53, z);
    parent.add(figure);
    part(figure, sphere, '#e8b49b', [0.28, 0.29, 0.27], [0, 0.72, 0], choice);
    part(figure, sphere, '#493c38', [0.29, 0.15, 0.28], [0, 0.81, -0.017], choice);
    part(figure, cylinder, color, [0.34, 0.32, 0.24], [0, 0.43, 0], choice);
    for (const side of [-1, 1]) {
      part(figure, box, navy, [0.1, 0.27, 0.14], [side * 0.09, 0.135, 0], choice);
      part(figure, box, navy, [0.12, 0.062, 0.2], [side * 0.09, 0.034, 0.04], choice);
      part(figure, sphere, color, [0.1, 0.29, 0.11], [side * 0.19, 0.43, 0], choice);
    }
    return figure;
  }

  function desk(x: number, z: number, color: string, choice?: number) {
    for (const offset of [-0.35, 0.35]) {
      part(group, box, steel, [0.055, 0.4, 0.42], [x + offset, -0.33, z], choice);
    }
    part(group, box, color, [0.92, 0.09, 0.57], [x, -0.09, z], choice);
    part(group, box, navy, [0.07, 0.15, 0.06], [x, 0.025, z - 0.13], choice);
    part(group, box, navy, [0.39, 0.28, 0.055], [x, 0.11, z - 0.13], choice);
    part(group, box, '#466c80', [0.32, 0.19, 0.015], [x, 0.12, z - 0.096], choice);
    part(group, box, '#8bc9cc', [0.24, 0.027, 0.014], [x, 0.16, z - 0.083], choice);
    part(group, box, bright, [0.17, 0.015, 0.012], [x - 0.035, 0.109, z - 0.082], choice);
    part(group, box, navy, [0.27, 0.016, 0.115], [x, -0.032, z + 0.111], choice);
    contact(group, 0.98, 0.68, [x, -0.526, z]);
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
        highlight(index);
      },
      update(time) {
        lastFrame = time;
        // Si el visor está pausado, el nuevo estado se muestra en el primer render.
        animate(time, selectionChanged && time === timeSelected ? Infinity : time - timeSelected);
        selectionChanged = false;
      },
      dispose,
    };
  }

  const floor = -0.53;
  const workplace = variant === 'office' || variant === 'onboarding';
  base(4.5, 3.6, floor, workplace ? '#b6a58e' : '#45556a');

  switch (variant) {
    case 'office': {
      part(group, box, '#566b83', [4.4, 1.45, 0.12], [0, 0.195, -1.65]);
      part(group, box, '#a7c3ca', [2.47, 0.53, 0.028], [-0.64, 0.49, -1.58]);
      for (const x of [-1.85, -0.65, 0.55]) {
        part(group, box, '#3b5266', [0.046, 0.56, 0.05], [x, 0.49, -1.55]);
      }
      sign(group, 'PERSONAS Y CULTURA', [1.18, 0.24], [1.46, 0.57, -1.577], '#354a65');
      const stations = [
        [-1.36, 0.3],
        [0, -0.2],
        [1.36, 0.32],
      ] as const;
      const people = stations.map(([x, z], index) => {
        const color = [accent, '#80c3ec', '#9fe1ad'][index];
        part(group, box, '#6d6a69', [1.2, 0.02, 1.45], [x, -0.518, z], index);
        sign(
          group,
          ['TALENTO', 'DESARROLLO', 'BIENESTAR'][index],
          [0.92, 0.18],
          [x, -0.504, z + 0.585],
          '#3b414f',
          color,
          index,
          true,
        );
        if (index === 0) {
          desk(x, z - 0.33, bright, index);
          part(group, box, '#62545e', [0.95, 0.48, 0.065], [x, 0.19, z - 0.81], index);
          for (let card = 0; card < 4; card++) {
            part(
              group,
              box,
              card % 2 ? amber : bright,
              [0.14, 0.17, 0.013],
              [x + (card - 1.5) * 0.19, 0.17 + (card % 2) * 0.094, z - 0.769],
              index,
            );
          }
        } else if (index === 1) {
          desk(x, z - 0.33, '#bcd3dd', index);
          part(group, box, navy, [0.97, 0.5, 0.06], [x, 0.25, z - 0.87], index);
          sign(group, 'TALLER', [0.78, 0.21], [x, 0.33, z - 0.835], navy, color, index);
          part(group, box, color, [0.62, 0.03, 0.015], [x, 0.158, z - 0.833], index);
        } else {
          part(group, box, '#4d7a68', [0.88, 0.2, 0.37], [x, -0.36, z - 0.32], index);
          part(group, box, '#699882', [0.9, 0.3, 0.09], [x, -0.21, z - 0.51], index);
          for (const side of [-1, 1]) {
            part(
              group,
              box,
              '#5b8c75',
              [0.12, 0.14, 0.38],
              [x + side * 0.41, -0.23, z - 0.32],
              index,
            );
          }
          part(group, cylinder, '#ab815b', [0.35, 0.13, 0.35], [x + 0.28, -0.43, z + 0.11], index);
        }
        return person(group, x, z + 0.33, color, index);
      });
      plant(group, 1.97, floor, -1.04);
      plant(group, -1.95, floor, -1.13, 0.85);
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
      const labels = ['Bienvenida', 'Documentación', 'Capacitación', 'Integración'];
      const colors = [accent, amber, '#b6a5fa', mint];
      part(group, box, '#435871', [4.41, 1.45, 0.12], [0, 0.195, -1.62]);
      part(group, box, '#26374c', [4.41, 0.07, 0.15], [0, 0.924, -1.62]);
      part(group, box, '#526480', [4.19, 0.025, 0.78], [0, -0.514, 0.77]);
      stops.forEach((x, index) => {
        const color = colors[index];
        sign(
          group,
          labels[index].toUpperCase(),
          [0.99, 0.19],
          [x, 0.65, -1.549],
          '#293b50',
          color,
          index,
        );
        part(group, box, color, [0.86, 0.026, 0.018], [x, 0.5, -1.549], index);
        desk(x, -0.54, color, index);
        part(group, cylinder, color, [0.42, 0.026, 0.42], [x, -0.49, 0.78], index);
        sign(
          group,
          String(index + 1),
          [0.23, 0.18],
          [x, -0.474, 0.78],
          '#3b4c65',
          bright,
          index,
          true,
        );
        if (index < 3) {
          part(group, box, '#8f9ab3', [0.032, 0.57, 0.53], [x + 0.52, -0.22, -0.93]);
        }
        part(
          group,
          box,
          index === 1 ? '#eee4c7' : '#526480',
          [0.16, 0.045, 0.19],
          [x + 0.3, -0.018, -0.45],
          index,
        );
      });
      plant(group, -1.93, floor, 1.42, 0.66);
      plant(group, 1.93, floor, 1.42, 0.66);
      const walker = person(group, stops[0], 0.78, accent);
      const shadow = contact(group, 0.48, 0.41, [stops[0], -0.477, 0.78]);
      let previous = stops[0] as number;
      let destination = 0;
      return finish(
        labels,
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
          if (shadow) shadow.position.x = walker.position.x;
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
      const week = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE'];
      const hours = ['09:00', '11:00', '15:00'];
      const slots = [-0.54, 0.2, 0.94];
      part(group, box, '#222f47', [4.36, 0.13, 3.3], [0, -0.47, 0]);
      part(group, box, '#293452', [4.32, 0.46, 0.12], [0, -0.2, -1.6]);
      sign(group, 'AGENDA SEMANAL', [2.18, 0.25], [0, -0.13, -1.534], '#293452', bright);
      for (let day = 0; day < 5; day++) {
        const x = (day - 2) * 0.66 + 0.22;
        sign(
          group,
          week[day],
          [0.59, 0.266],
          [x, -0.393, -1.19],
          '#384968',
          bright,
          undefined,
          true,
        );
        for (let slot = 0; slot < 3; slot++) {
          part(
            group,
            box,
            slot % 2 ? '#465575' : '#566783',
            [0.6, 0.026, 0.63],
            [x, -0.389, slots[slot]],
          );
        }
      }
      for (const [index, hour] of hours.entries()) {
        sign(
          group,
          hour,
          [0.48, 0.22],
          [-1.78, -0.392, slots[index]],
          '#25364f',
          bright,
          undefined,
          true,
        );
      }
      const titles = ['Entrevista', 'Reunión', 'Capacitación'];
      const appointments = [accent, amber, mint].map((color, index) => {
        const event = new Group();
        group.add(event);
        event.position.set((index - 1) * 1.32 + 0.22, -0.36, slots[index]);
        part(event, box, color, [0.55, 0.14, 0.53], [0, 0.07, 0], index);
        sign(
          event,
          ['ENTREVISTA', 'REUNIÓN', 'TALLER'][index],
          [0.5, 0.19],
          [0, 0.142, 0.025],
          color,
          '#26334c',
          index,
          true,
        );
        return event;
      });
      let appointment = 0;
      const scheduled = new Set<number>();
      const days = ['lunes', 'miércoles', 'viernes'];
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
            appointment.position.y = index === selected ? -0.3 + Math.sin(time * 2) * 0.023 : -0.36;
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
      : [
          [60, 40, 20],
          [78, 40, 38],
          [60, 48, 12],
        ];
    const labels = budget
      ? ['Base', 'Priorizar Operaciones', 'Priorizar RR. HH.']
      : ['Base', 'Aumentar ingresos', 'Aumentar gastos'];
    const names = budget
      ? ['Operaciones', 'Comercial', 'RR. HH.']
      : ['Ingresos', 'Gastos', 'Resultado'];
    const colors = [accent, amber, '#a7b8ff'];
    const backing = '#27384b';
    part(group, box, backing, [4.35, 1.37, 0.13], [0, 0.155, -1.55]);
    part(group, box, '#597187', [4.35, 0.05, 0.16], [0, 0.84, -1.55]);
    sign(
      group,
      budget ? 'PRESUPUESTO POR ÁREA' : 'TESORERÍA · FLUJO DE CAJA',
      [3.38, 0.32],
      [0, 0.49, -1.479],
      backing,
    );
    sign(
      group,
      budget ? 'TOTAL ASIGNADO · 100 %' : 'SIMULACIÓN · MILES DE SOLES',
      [2.29, 0.18],
      [0, 0.23, -1.478],
      backing,
      '#bbcbd3',
    );
    if (budget) {
      contact(group, 4.3, 1.83, [0, floor + 0.005, 0.1]);
      part(group, box, '#27374b', [4.08, 0.17, 1.51], [0, -0.42, 0.08]);
      part(group, box, '#6b8393', [3.84, 0.055, 0.048], [0, -0.336, 0.88]);
      for (let i = 0; i <= 10; i++) {
        const x = -1.88 + i * 0.376;
        part(group, box, '#c4d3d9', [0.018, 0.019, i % 5 ? 0.09 : 0.154], [x, -0.299, 0.89]);
      }
      for (const [index, value] of ['0%', '50%', '100%'].entries()) {
        sign(
          group,
          value,
          [0.28, 0.14],
          [(index - 1) * 1.88, -0.507, 1.11],
          '#45556a',
          bright,
          undefined,
          true,
        );
      }
    }
    if (flow) {
      for (let index = 0; index < 2; index++) {
        const x = (index - 1) * 1.28;
        part(group, box, '#26364c', [0.56, 0.12, 1.28], [x, -0.47, 0.86]);
        for (const side of [-1, 1]) {
          part(group, box, '#7592a1', [0.032, 0.069, 1.25], [x + side * 0.268, -0.385, 0.86]);
        }
        for (let i = 0; i < 7; i++) {
          part(group, box, '#4f6578', [0.47, 0.012, 0.034], [x, -0.404, 0.3 + i * 0.172]);
        }
      }
    }
    const segmentLabels: ReturnType<typeof sign>[][] = [];
    const series = names.map((_, index) => {
      const x = (index - 1) * 1.28;
      if (budget) {
        segmentLabels.push(
          values.map((row) =>
            sign(
              group,
              row[index] + '%',
              [0.52, 0.18],
              [0, 0.201, 0.24],
              '#243649',
              colors[index],
              index + labels.length,
              true,
            ),
          ),
        );
        sign(
          group,
          names[index].toUpperCase(),
          [1.05, 0.22],
          [x, -0.507, 1.46],
          '#34485a',
          colors[index],
          index + labels.length,
          true,
        );
      } else {
        contact(group, 1.09, 0.98, [x, floor + 0.005, -0.27]);
        part(group, box, steel, [0.94, 0.12, 0.92], [x, -0.47, -0.2], index + labels.length);
        part(group, box, '#6c8799', [0.85, 0.033, 0.86], [x, -0.396, -0.2], index + labels.length);
        sign(
          group,
          names[index].toUpperCase(),
          [0.95, 0.19],
          [x, -0.509, 1.58],
          '#34485a',
          colors[index],
          index + labels.length,
          true,
        );
      }
      return part(
        group,
        flow ? cylinder : box,
        colors[index],
        [0.72, 1, 0.72],
        [x, 0, -0.14],
        index + labels.length,
      );
    });
    const lids = flow
      ? names.map((_, index) =>
          part(
            group,
            cylinder,
            '#8aa0a9',
            [0.77, 0.075, 0.77],
            [(index - 1) * 1.28, 0, -0.14],
            index + labels.length,
          ),
        )
      : [];
    const tokens = flow
      ? Array.from({ length: 6 }, (_, index) => {
          const x = index < 3 ? -1.28 : 0;
          const coin = new Group();
          coin.position.set(x, -0.343, 0);
          group.add(coin);
          part(coin, cylinder, colors[index < 3 ? 0 : 1], [0.22, 0.048, 0.22], [0, 0, 0]);
          part(coin, cylinder, '#e2dcc3', [0.146, 0.016, 0.146], [0, 0.025, 0]);
          return coin;
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
            segmentLabels[index].forEach((label, rowIndex) => {
              if (!label) return;
              label.position.x = column.position.x;
              label.visible = rowIndex === scenario;
            });
            offset += width;
            return;
          }
          const height = row[index] * 0.018;
          column.scale.y = height;
          column.position.y = -0.41 + height / 2;
          lids[index].position.y = -0.41 + height;
        });
        tokens.forEach((coin, index) => {
          const incoming = index < 3;
          const phase = ((time * row[incoming ? 0 : 1]) / 95 + (index % 3) / 3) % 1;
          coin.position.z = incoming ? 1.44 - phase * 1.13 : 0.31 + phase * 1.13;
          const size = Math.sin(phase * Math.PI);
          coin.scale.set(size, 1, size);
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
