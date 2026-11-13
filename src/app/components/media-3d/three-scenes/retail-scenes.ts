// Requiere three y @types/three. Usa las primitivas y texturas locales de diorama-details.
import { Group, MathUtils, Vector2 } from 'three';
import { createDiorama } from './diorama-details';
import type { Design } from './three-scene';

export type RetailVariant = 'negotiation' | 'delivery' | 'showroom' | 'checkout';

const floor = -0.61;
const ink = '#26353d';
const cream = '#e8ddc6';
const wood = '#b98760';
const darkWood = '#705246';
const mint = '#70c9a0';
const amber = '#edb469';

export function buildRetailDesign(
  variant: RetailVariant,
  accent: string,
  document: Document,
): Design {
  const { group, part, sign, contact, base, plant, highlight, dispose } = createDiorama(document);
  group.scale.setScalar(0.86);
  let selected = 0;
  const box = (
    color: string,
    size: [number, number, number],
    position: [number, number, number],
    choice?: number,
  ) => part(group, color, size, position, choice);

  function finish(
    choices: { label: string; detail: string }[],
    update: (time: number) => void,
  ): Design {
    return {
      group,
      choices,
      update,
      dispose,
      select(index) {
        selected = index;
        highlight(index);
      },
    };
  }

  function wall(color: string, height: number, width = 4.46, z = -1.61) {
    box(color, [width, height, 0.12], [0, floor + height / 2, z]);
    box(ink, [width + 0.05, 0.048, 0.17], [0, floor + height, z]);
    box(darkWood, [width, 0.075, 0.14], [0, floor + 0.034, z + 0.016]);
  }

  function person(x: number, z: number, jacket: string, angle: number, sitting = false) {
    const figure = new Group();
    figure.position.set(x, floor, z);
    figure.rotation.y = angle;
    group.add(figure);
    const skin = jacket === ink ? '#bd8166' : '#dba687';
    const hip = sitting ? 0.38 : 0.48;
    part(figure, jacket, [0.35, 0.36, 0.24], [0, hip + 0.14, 0], undefined, 'cylinder');
    part(figure, skin, [0.24, 0.27, 0.23], [0, hip + 0.44, 0], undefined, 'sphere');
    part(figure, '#372f30', [0.25, 0.13, 0.24], [0, hip + 0.536, -0.016], undefined, 'sphere');
    part(figure, cream, [0.075, 0.22, 0.016], [0, hip + 0.2, 0.121]);
    for (const side of [-1, 1]) {
      part(
        figure,
        ink,
        [0.11, sitting ? 0.28 : 0.43, 0.12],
        [side * 0.083, sitting ? 0.14 : 0.238, sitting ? 0.13 : 0],
      );
      part(figure, ink, [0.12, 0.078, 0.22], [side * 0.085, 0.04, 0.05 + (sitting ? 0.13 : 0)]);
      part(figure, jacket, [0.095, 0.27, 0.11], [side * 0.162, hip + 0.14, 0.034]).rotation.x =
        -0.35;
      part(
        figure,
        skin,
        [0.09, 0.095, 0.12],
        [side * 0.16, hip + 0.023, 0.089],
        undefined,
        'sphere',
      );
    }
    return figure;
  }

  function chair(x: number, z: number, angle: number, upholstery = '#466361') {
    const seat = new Group();
    seat.position.set(x, floor, z);
    seat.rotation.y = angle;
    group.add(seat);
    part(seat, upholstery, [0.46, 0.09, 0.45], [0, 0.31, 0]);
    part(seat, upholstery, [0.44, 0.43, 0.082], [0, 0.53, -0.2]);
    for (const xLeg of [-0.16, 0.16]) {
      for (const zLeg of [-0.15, 0.15]) {
        part(seat, ink, [0.045, 0.29, 0.045], [xLeg, 0.145, zLeg]);
      }
    }
    contact(group, 0.68, 0.6, [x, floor + 0.004, z]);
  }

  switch (variant) {
    case 'negotiation': {
      base(4.54, 3.5, floor, '#b19275');
      for (let index = 0; index < 13; index++) {
        box('#94745f', [4.5, 0.003, 0.012], [0, floor + 0.002, -1.48 + index * 0.245]);
      }
      wall('#d6c7af', 1.77);
      box('#557078', [1.02, 1.34, 0.023], [-1.57, 0.27, -1.538]);
      for (const x of [-2.08, -1.57, -1.06]) {
        box(ink, [0.043, 1.39, 0.054], [x, 0.27, -1.516]);
      }
      for (const y of [-0.42, 0.25, 0.96]) {
        box(cream, [1.06, 0.033, 0.061], [-1.57, y, -1.502]);
      }
      box(ink, [2.41, 0.99, 0.11], [0.64, 0.47, -1.49]);
      sign(group, 'PROPUESTA COMERCIAL', [2.2, 0.3], [0.64, 0.73, -1.426], '#16262d');
      box('#466265', [2.13, 0.012, 0.02], [0.64, 0.52, -1.425]);
      for (const [index, value] of [0.11, 0.18, 0.26, 0.34].entries()) {
        box(
          index === 3 ? accent : mint,
          [0.14, value, 0.026],
          [0.67 + index * 0.27, 0.08 + value / 2, -1.419],
        );
      }
      sign(group, 'COTIZACIÓN', [0.83, 0.19], [0.05, 0.36, -1.424], '#16262d', '#d7e5d9');
      sign(group, 'ALCANCE Y PLAZOS', [0.92, 0.12], [0.05, 0.18, -1.424], '#16262d');

      contact(group, 3.12, 1.52, [0, floor + 0.007, 0.36]);
      box('#625e58', [2.63, 0.019, 1.61], [0, floor + 0.015, 0.35]);
      box(ink, [2.1, 0.47, 0.48], [0, -0.356, 0.24]);
      box(darkWood, [2.55, 0.085, 1.1], [0, -0.12, 0.24]);
      box(wood, [2.58, 0.044, 1.12], [0, -0.066, 0.24]);
      for (const x of [-1.55, 1.55]) {
        const face = x < 0 ? Math.PI / 2 : -Math.PI / 2;
        chair(x, 0.24, face);
        person(x, 0.24, x < 0 ? '#935945' : ink, face, true);
      }
      chair(-0.55, -0.66, 0);
      chair(0.55, -0.66, 0);
      plant(group, 1.92, floor, -1.18, 1.15);

      for (const x of [-0.88, 0.88]) {
        box('#6d5a49', [0.26, 0.025, 0.32], [x, -0.034, 0.04]);
        part(group, cream, [0.095, 0.12, 0.095], [x, 0.018, -0.12], undefined, 'cylinder');
        part(group, '#76513d', [0.075, 0.012, 0.075], [x, 0.081, -0.12], undefined, 'cylinder');
      }
      const labels = ['Borrador', 'Enviada', 'Aceptada'];
      const stages = [0, 1, 2].map((index) =>
        sign(
          group,
          labels[index].toUpperCase(),
          [0.69, 0.19],
          [(index - 1) * 0.79, -0.035, 0.66],
          '#26353d',
          [accent, amber, mint][index],
          index,
          true,
        ),
      );
      const proposal = new Group();
      group.add(proposal);
      part(proposal, '#5b776f', [0.5, 0.028, 0.59], [0, 0, 0]);
      part(proposal, cream, [0.45, 0.014, 0.54], [0, 0.02, 0]);
      sign(
        proposal,
        'PROPUESTA',
        [0.39, 0.11],
        [0, 0.028, -0.172],
        '#e8ddc6',
        ink,
        undefined,
        true,
      );
      for (let row = 0; row < 4; row++) {
        part(
          proposal,
          '#737d79',
          [0.31 - row * 0.027, 0.004, 0.013],
          [-row * 0.01, 0.03, -0.075 + row * 0.068],
        );
      }
      const stamp = new Group();
      proposal.add(stamp);
      part(stamp, mint, [0.15, 0.018, 0.15], [0.123, 0.039, 0.15], undefined, 'cylinder');
      sign(stamp, 'OK', [0.1, 0.068], [0.123, 0.049, 0.15], mint, ink, undefined, true);
      let from = -0.66;
      let destination = 0;
      let started = 0;
      let previousTime = -1;
      return finish(
        [
          { label: 'Borrador', detail: 'La cotización está en preparación del lado comercial.' },
          {
            label: 'Enviada',
            detail: 'La cotización se encuentra en el centro de la mesa, lista para revisión.',
          },
          {
            label: 'Aceptada',
            detail: 'El cliente aceptó la propuesta. El sello verde marca el acuerdo.',
          },
        ],
        (time) => {
          if (destination !== selected) {
            from = proposal.position.x;
            destination = selected;
            started = time;
          }
          const progress =
            time === previousTime ? 1 : MathUtils.smoothstep(time - started, 0, 0.55);
          proposal.position.set(
            MathUtils.lerp(from, (selected - 1) * 0.66, progress),
            -0.017,
            0.265 + 0.038 * Math.sin(progress * Math.PI),
          );
          proposal.rotation.y = (proposal.position.x / 0.66) * 0.12;
          stamp.visible = selected === 2 && progress >= 0.9;
          stages.forEach((stage, index) => {
            if (stage) stage.position.y = index === selected ? -0.029 : -0.035;
          });
          previousTime = time;
        },
      );
    }

    case 'delivery': {
      base(4.72, 4.04, floor, '#67777b');
      box('#424e57', [4.57, 0.013, 1.42], [0, floor + 0.006, 0.94]);
      box('#b9b5a3', [4.61, 0.09, 0.43], [0, floor + 0.035, -0.07]);
      for (let index = 0; index < 10; index++) {
        const x = -1.99 + index * 0.44;
        box('#dee1cf', [0.24, 0.006, 0.029], [x, floor + 0.016, 1.1]);
        box('#e0d9c5', [0.013, 0.007, 0.42], [x, floor + 0.083, -0.07]);
      }
      const positions = [-1.69, -0.55, 0.59, 1.73];
      const names = ['DESPACHO', 'MERCADO', 'CAFÉ', 'FARMACIA'];
      const colors = [accent, '#597d6e', '#b66557', '#6593a7'];
      const heights = [1.12, 1.44, 1.13, 1.51];
      const facades = ['#b5a394', '#d7cbb2', '#c8927a', '#c2d2cf'];
      positions.forEach((x, index) => {
        const choice = index === 0 ? undefined : index - 1;
        const color = colors[index];
        const height = heights[index];
        const face = -0.47;
        contact(group, 1.12, 1.3, [x, floor + 0.016, -0.99]);
        box(facades[index], [1.04, height, 1.15], [x, floor + height / 2, face - 0.58], choice);
        box(ink, [1.1, 0.097, 1.21], [x, floor + height, face - 0.58], choice);
        box(color, [0.8, 0.185, 0.048], [x, floor + 0.74, face + 0.019], choice);
        sign(
          group,
          names[index],
          [0.76, 0.154],
          [x, floor + 0.74, face + 0.046],
          color,
          index === 0 ? ink : '#fff4e1',
          choice,
        );
        box(ink, [0.24, 0.47, 0.031], [x + 0.293, floor + 0.235, face + 0.022], choice);
        box('#b8d4cf', [0.13, 0.24, 0.014], [x + 0.293, floor + 0.34, face + 0.043], choice);
        box('#3d6876', [0.46, 0.32, 0.025], [x - 0.167, floor + 0.33, face + 0.022], choice);
        box(cream, [0.017, 0.32, 0.023], [x - 0.167, floor + 0.33, face + 0.043], choice);
        box(wood, [0.47, 0.047, 0.075], [x - 0.167, floor + 0.154, face + 0.048], choice);
        for (let stripe = 0; stripe < (index === 3 ? 1 : 7); stripe++) {
          const panel = box(
            stripe % 2 ? cream : color,
            [index === 3 ? 0.94 : 0.135, 0.052, 0.29],
            [x + (index === 3 ? 0 : (stripe - 3) * 0.135), floor + 0.58, face + 0.139],
            choice,
          );
          panel.rotation.x = 0.18;
        }
        if (height > 1.3) {
          for (const offset of [-0.2, 0.2]) {
            box('#6b8791', [0.25, 0.28, 0.025], [x + offset, floor + 1.115, face + 0.02], choice);
            box(cream, [0.27, 0.038, 0.04], [x + offset, floor + 0.96, face + 0.03], choice);
          }
        }
      });
      // Cada fachada se reconoce también por su silueta y por lo que exhibe.
      const [depot, market, cafe, pharmacy] = positions;
      for (const [index, x] of [depot - 0.25, depot - 0.1, depot + 0.05].entries()) {
        box('#956b51', [0.13, 0.125 + index * 0.025, 0.17], [x, floor + 0.14, -0.21]);
        box(cream, [0.043, 0.02, 0.17], [x, floor + 0.208 + index * 0.0125, -0.21]);
      }
      box('#8d6649', [0.37, 0.16, 0.22], [market - 0.19, floor + 0.16, -0.18], 0);
      for (let i = 0; i < 5; i++) {
        part(
          group,
          i % 2 ? '#a9bc72' : amber,
          [0.068, 0.074, 0.08],
          [market - 0.32 + i * 0.064, floor + 0.266, -0.17],
          0,
          'sphere',
        );
      }
      part(group, cream, [0.28, 0.047, 0.28], [cafe - 0.17, floor + 0.28, -0.13], 1, 'cylinder');
      part(group, ink, [0.042, 0.23, 0.042], [cafe - 0.17, floor + 0.16, -0.13], 1, 'cylinder');
      part(
        group,
        '#97674c',
        [0.08, 0.065, 0.08],
        [cafe - 0.17, floor + 0.33, -0.13],
        1,
        'cylinder',
      );
      box('#456766', [0.35, 0.31, 0.085], [pharmacy + 0.31, floor + 1.14, -0.392], 2);
      box('#dcf0d8', [0.21, 0.058, 0.018], [pharmacy + 0.31, floor + 1.14, -0.343], 2);
      box('#dcf0d8', [0.059, 0.21, 0.018], [pharmacy + 0.31, floor + 1.14, -0.342], 2);
      for (const x of [-1.69, -0.55, 0.59, 1.73]) {
        box(cream, [0.014, 0.006, 0.52], [x - 0.27, floor + 0.016, 0.47]);
        box(cream, [0.014, 0.006, 0.52], [x + 0.27, floor + 0.016, 0.47]);
      }
      plant(group, -2.09, floor + 0.088, -0.08, 0.62);
      plant(group, 2.08, floor + 0.088, -0.08, 0.62);
      const marker = box(accent, [0.48, 0.013, 0.044], [0, floor + 0.02, 0.74]);

      const van = new Group();
      group.add(van);
      const vanShadow = contact(group, 1.13, 0.68, [0, floor + 0.018, 0]);
      const cargoWidth = 0.39;
      const cabWidth = 0.38;
      // El chasis y el capó quedan retranqueados para evitar caras laterales coplanares.
      part(van, ink, [0.87, 0.1, 0.35], [-0.012, 0.154, 0]);
      part(van, cream, [0.57, 0.36, cargoWidth], [-0.155, 0.33, 0]);
      part(van, accent, [0.34, 0.3, cabWidth], [0.285, 0.28, 0]);
      part(van, accent, [0.17, 0.19, 0.368], [0.456, 0.205, 0]);
      part(van, '#324e59', [0.027, 0.138, 0.32], [0.445, 0.346, 0]);
      part(van, ink, [0.022, 0.087, 0.29], [0.544, 0.156, 0]);
      part(van, '#b8c6c3', [0.045, 0.05, 0.41], [0.545, 0.098, 0]);
      const wheels: Group[] = [];
      for (const side of [-1, 1]) {
        part(van, '#476978', [0.18, 0.115, 0.014], [0.302, 0.344, side * (cabWidth / 2 + 0.003)]);
        part(van, cream, [0.04, 0.065, 0.082], [0.544, 0.233, side * 0.145]);
        part(van, '#cc6455', [0.022, 0.072, 0.048], [-0.451, 0.19, side * 0.15]);
        part(van, ink, [0.048, 0.044, 0.023], [0.23, 0.255, side * 0.199]);
        const badge = sign(
          van,
          'REPARTO',
          [0.42, 0.115],
          [-0.154, 0.35, side * (cargoWidth / 2 + 0.008)],
          '#2e474a',
        );
        if (badge && side < 0) badge.rotation.y = Math.PI;
        for (const x of [-0.29, 0.34]) {
          const wheel = new Group();
          wheel.position.set(x, 0.105, side * 0.196);
          van.add(wheel);
          wheels.push(wheel);
          part(
            wheel,
            '#20262b',
            [0.212, 0.075, 0.212],
            [0, 0, 0],
            undefined,
            'cylinder',
          ).rotation.x = Math.PI / 2;
          part(
            wheel,
            '#b2bcc2',
            [0.092, 0.024, 0.092],
            [0, 0, side * 0.04],
            undefined,
            'cylinder',
          ).rotation.x = Math.PI / 2;
          part(wheel, '#798687', [0.092, 0.02, 0.022], [0, 0, side * 0.053]);
        }
      }
      const point = new Vector2();
      const heading = new Vector2();
      let destination = 0;
      let phase = 1.2;
      let previousTime = 0;
      let rerouting = false;
      return finish(
        [
          { label: 'Mercado', detail: 'Entrega de reposición en el mercado de barrio.' },
          { label: 'Café', detail: 'Entrega de insumos en la cafetería.' },
          { label: 'Farmacia', detail: 'Entrega de un pedido en la farmacia.' },
        ],
        (time) => {
          const dt = time - previousTime;
          if (dt === 0 && destination !== selected) {
            // En pausa, enseña el nuevo destino inmediatamente. El viaje continúa al reanudar.
            destination = selected;
            phase = 4.2;
            rerouting = false;
          } else if (destination !== selected && phase < 4.2) {
            // Vuelve por el mismo trayecto antes de tomar la ruta nueva.
            rerouting = true;
            phase = Math.max(0, phase - dt * 1.7);
          } else {
            phase = Math.min(10, phase + dt);
          }
          if ((rerouting && phase === 0) || phase === 10) {
            destination = selected;
            rerouting = false;
            phase = 0;
          }
          const x = positions[destination + 1];
          marker.position.x = positions[selected + 1];
          const progress =
            MathUtils.smoothstep(phase, 0, 4.2) - MathUtils.smoothstep(phase, 5.85, 9.8);
          const straight = x + 1.72 - 0.33;
          const curve = (Math.PI * 0.33) / 2;
          const distance = progress * (straight + curve + 0.22);
          if (distance < straight) {
            point.set(-1.72 + distance, 1.27);
            heading.set(1, 0);
          } else if (distance < straight + curve) {
            const angle = (distance - straight) / 0.33;
            point.set(x - 0.33 + Math.sin(angle) * 0.33, 0.94 + Math.cos(angle) * 0.33);
            heading.set(Math.cos(angle), -Math.sin(angle));
          } else {
            point.set(x, 0.94 - (distance - straight - curve));
            heading.set(0, -1);
          }
          van.position.set(point.x, floor + 0.02, point.y);
          van.rotation.y = -Math.atan2(heading.y, heading.x);
          vanShadow?.position.set(point.x, floor + 0.018, point.y);
          if (vanShadow) vanShadow.rotation.z = van.rotation.y;
          wheels.forEach((wheel) => {
            wheel.rotation.z = -distance / 0.106;
          });
          previousTime = time;
        },
      );
    }

    case 'showroom': {
      base(4.48, 3.72, floor, '#c7b8a1');
      for (let i = -2; i <= 2; i++) {
        box('#ad9b85', [0.014, 0.004, 3.68], [i * 0.71, floor + 0.003, 0]);
      }
      wall('#396861', 1.86, 4.43, -1.66);
      sign(group, 'ESTUDIO MERCADO', [2.32, 0.33], [-0.46, 0.9, -1.591], '#396861');
      sign(group, 'COLECCIÓN CASA', [1.7, 0.18], [-0.46, 0.61, -1.59], '#396861', '#bfd3b9');
      box(darkWood, [1.08, 1.19, 0.32], [1.58, -0.015, -1.43]);
      for (const y of [-0.42, -0.05, 0.33, 0.58]) {
        box(wood, [1.12, 0.053, 0.47], [1.58, y, -1.31]);
      }
      for (let index = 0; index < 6; index++) {
        box(
          index % 2 ? '#d69c76' : cream,
          [0.22, 0.22, 0.225],
          [1.36 + (index % 3) * 0.22, index < 3 ? -0.278 : 0.083, -1.26],
        );
      }
      plant(group, -1.81, floor, -1.13, 1.12);

      contact(group, 3.66, 3.17, [0, floor + 0.006, 0.3]);
      part(group, ink, [2.84, 0.2, 2.84], [0, floor + 0.105, 0.31], undefined, 'cylinder');
      part(group, '#b18a63', [2.9, 0.037, 2.9], [0, floor + 0.219, 0.31], undefined, 'cylinder');
      const carousel = new Group();
      carousel.position.set(0, floor + 0.237, 0.31);
      group.add(carousel);
      const products = [new Group(), new Group(), new Group()];
      products.forEach((product, index) => {
        const angle = (index * Math.PI * 2) / 3;
        product.position.set(Math.sin(angle) * 0.89, 0, Math.cos(angle) * 0.89);
        carousel.add(product);
        part(product, cream, [0.81, 0.15, 0.75], [0, 0.075, 0], index, 'cylinder');
        sign(
          product,
          ['S/ 48', 'S/ 65', 'S/ 89'][index],
          [0.36, 0.11],
          [0, 0.14, 0.29],
          '#26353d',
          '#fff1d7',
          index,
          true,
        );
      });
      const [gift, bottle, diffuser] = products;
      part(gift, '#b66555', [0.49, 0.4, 0.43], [0, 0.35, 0], 0);
      part(gift, accent, [0.53, 0.08, 0.47], [0, 0.57, 0], 0);
      part(gift, '#efe1b8', [0.08, 0.46, 0.012], [0, 0.373, 0.239], 0);
      part(gift, '#efe1b8', [0.08, 0.01, 0.47], [0, 0.616, 0], 0);
      for (const side of [-1, 1]) {
        part(
          gift,
          '#efe1b8',
          [0.17, 0.064, 0.12],
          [side * 0.065, 0.637, 0],
          0,
          'sphere',
        ).rotation.z = side * 0.36;
      }
      part(bottle, '#7caaa8', [0.38, 0.54, 0.38], [0, 0.42, 0], 1, 'cylinder');
      part(bottle, '#7caaa8', [0.38, 0.2, 0.38], [0, 0.674, 0], 1, 'sphere');
      part(bottle, '#3b5f65', [0.21, 0.14, 0.21], [0, 0.796, 0], 1, 'cylinder');
      part(bottle, cream, [0.385, 0.15, 0.385], [0, 0.42, 0], 1, 'cylinder');
      sign(bottle, 'AGUA', [0.23, 0.1], [0, 0.42, 0.194], cream, ink, 1);
      part(diffuser, '#87634b', [0.405, 0.39, 0.405], [0, 0.345, 0], 2, 'cylinder');
      part(diffuser, darkWood, [0.24, 0.08, 0.24], [0, 0.57, 0], 2, 'cylinder');
      sign(diffuser, 'CEDRO', [0.25, 0.15], [0, 0.36, 0.204], '#ebdfbe', ink, 2);
      for (let i = -2; i <= 2; i++) {
        const reed = part(
          diffuser,
          '#523e37',
          [0.023, 0.48 + 0.045 * (i + 2), 0.025],
          [i * 0.055, 0.78 + i * 0.019, (i % 2) * 0.06],
          2,
        );
        reed.rotation.z = -i * 0.17;
      }
      let pose = 0;
      let previousTime = 0;
      return finish(
        [
          { label: 'Caja de regalo', detail: 'Caja de regalo con lazo · S/ 48 · Disponible.' },
          {
            label: 'Botella reutilizable',
            detail: 'Botella con tapa roscada · S/ 65 · Disponible.',
          },
          { label: 'Difusor de cedro', detail: 'Difusor con varillas · S/ 89 · Próximamente.' },
        ],
        (time) => {
          const target = (-selected * Math.PI * 2) / 3 + Math.sin(time * 0.47) * 0.32;
          const delta = MathUtils.euclideanModulo(target - pose + Math.PI, 2 * Math.PI) - Math.PI;
          pose += delta * (time === previousTime ? 1 : 1 - Math.exp(-(time - previousTime) * 7));
          carousel.rotation.y = pose;
          products.forEach((product, index) => {
            product.position.y = index === selected ? 0.085 : 0;
          });
          previousTime = time;
        },
      );
    }

    case 'checkout': {
      base(4.45, 3.4, floor, '#c4b39a');
      wall('#50716a', 1.58);
      sign(group, 'CAJA · PUNTO DE VENTA', [2.35, 0.37], [-0.44, 0.6, -1.54], '#50716a');
      for (const y of [-0.27, 0.17]) {
        box(wood, [1.34, 0.06, 0.36], [1.33, y, -1.35]);
        for (let column = 0; column < 4; column++) {
          box(
            column % 2 ? '#a16755' : cream,
            [0.22, 0.24, 0.21],
            [0.88 + column * 0.29, y + 0.151, -1.32],
          );
        }
      }
      contact(group, 4.15, 1.75, [0, floor + 0.005, 0.15]);
      box(wood, [3.46, 0.66, 0.88], [0, -0.28, 0.14]);
      box(accent, [3.42, 0.07, 0.025], [0, -0.032, 0.59]);
      box(cream, [3.6, 0.071, 0.995], [0, 0.081, 0.14]);
      box(ink, [2.19, 0.042, 0.66], [-0.615, 0.139, 0.17], 0);
      for (let index = 0; index < 12; index++) {
        box('#4b5a5c', [0.022, 0.007, 0.59], [-1.6 + index * 0.18, 0.165, 0.17]);
      }
      const packageBox = box('#ba7759', [0.4, 0.27, 0.34], [-1.4, 0.3, 0.17], 0);
      const packageLabel = sign(
        group,
        'PEDIDO',
        [0.28, 0.12],
        [-1.4, 0.437, 0.17],
        cream,
        ink,
        0,
        true,
      );
      box(ink, [0.37, 0.23, 0.35], [0.47, 0.235, 0.17], 0);
      const scan = box('#d56a56', [0.027, 0.006, 0.62], [0.24, 0.167, 0.17]);
      box(ink, [0.29, 0.32, 0.29], [1.0, 0.26, -0.03], 1);
      const display = sign(
        group,
        'S/ 48.00',
        [0.59, 0.3],
        [1.0, 0.485, 0.126],
        '#213639',
        '#b7dec4',
        1,
      );
      const approved = sign(
        group,
        'PAGADO',
        [0.59, 0.3],
        [1.0, 0.485, 0.129],
        '#345e48',
        '#def6d9',
        1,
      );
      box(ink, [0.37, 0.18, 0.29], [1.4, 0.204, 0.387], 2);
      const receipt = new Group();
      receipt.position.set(1.4, 0.302, 0.449);
      group.add(receipt);
      part(receipt, cream, [0.2, 0.024, 0.31], [0, 0, 0.155], 2);
      for (let row = 0; row < 4; row++) {
        part(
          receipt,
          '#5f6a69',
          [row === 3 ? 0.1 : 0.14, 0.003, 0.013],
          [row === 3 ? -0.02 : 0, 0.013, 0.07 + row * 0.05],
          2,
        );
      }
      sign(group, 'RECIBO', [0.28, 0.104], [1.4, 0.215, 0.536], ink, cream, 2);
      chair(0.52, -0.77, 0);
      person(0.52, -0.77, ink, 0, true);
      person(-1.48, 1.1, '#935945', Math.PI);
      let paper = 0;
      let lastTime = 0;
      return finish(
        [
          { label: 'Escanear', detail: 'El pedido avanza por la cinta hacia el lector.' },
          { label: 'Cobrar', detail: 'El terminal confirma el pago de ejemplo por S/ 48.00.' },
          { label: 'Emitir recibo', detail: 'La impresora entrega el comprobante del pedido.' },
        ],
        (time) => {
          const phase = (time + 1.25) % 5;
          const x = selected === 0 ? -1.47 + 1.7 * MathUtils.smoothstep(phase, 0.25, 3.55) : 0.23;
          packageBox.position.x = x;
          if (packageLabel) packageLabel.position.x = x;
          scan.scale.x = selected === 0 ? 0.022 + 0.018 * (0.5 + Math.sin(time * 5) / 2) : 0;
          if (display) display.visible = selected === 0;
          if (approved) approved.visible = selected > 0;
          const target = selected === 2 ? 1 : 0;
          paper =
            time === lastTime
              ? target
              : MathUtils.lerp(paper, target, 1 - Math.exp((lastTime - time) * 8));
          receipt.visible = paper > 0.01;
          receipt.scale.z = Math.max(0.01, paper);
          lastTime = time;
        },
      );
    }
  }
}
