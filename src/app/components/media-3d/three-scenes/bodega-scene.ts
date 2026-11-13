// Requiere three y @types/three. Los productos y el mobiliario se modelan sin archivos externos.
import { Group, MathUtils } from 'three';
import { createDiorama } from './diorama-details';
import type { Design } from './three-scene';

const CHOICES = [
  {
    label: 'Revisar surtido',
    detail: 'El vendedor revisa el anaquel con el bodeguero y ofrece abarrotes, bebidas y snacks.',
  },
  {
    label: 'Registrar pedido',
    detail: 'Pedido de ejemplo: 6 bolsas de arroz, 12 bebidas y 18 paquetes de snacks.',
  },
  {
    label: 'Entregar cajas',
    detail: 'El carro trae tres cajas de reposición desde la vereda hasta la zona de recepción.',
  },
] as const;

export function buildBodegaDesign(accent: string, document: Document): Design {
  const { group, part, sign, contact, base, highlight, dispose } = createDiorama(document);
  group.scale.setScalar(0.83);
  const floor = -0.61;
  const tile = '#c1ac8f';
  const cream = '#eee0c6';
  const ink = '#26383b';
  const green = '#3e6b58';
  const brick = '#b56850';
  const wood = '#ae7e58';
  const seal = '#e4bb8a';
  const blue = '#659ba9';

  const box = (
    color: string,
    size: [number, number, number],
    position: [number, number, number],
    choice?: number,
  ) => part(group, color, size, position, choice);

  base(4.8, 4.36, floor, '#687375');
  box(tile, [4.7, 0.035, 3.07], [0, floor + 0.013, -0.61]);
  for (let column = -5; column <= 5; column++) {
    box('#a59178', [0.012, 0.002, 3.06], [column * 0.42, floor + 0.032, -0.61]);
  }
  for (let row = 0; row < 7; row++) {
    box('#a59178', [4.69, 0.002, 0.012], [0, floor + 0.033, -2.0 + row * 0.431]);
  }
  box('#d5c5ad', [4.71, 0.075, 1.12], [0, floor + 0.008, 1.48]);
  for (const x of [-1.62, -0.81, 0, 0.81, 1.62]) {
    box('#ae9f87', [0.014, 0.003, 1.11], [x, floor + 0.047, 1.48]);
  }
  box('#dfd5c1', [4.76, 0.096, 0.16], [0, floor + 0.013, 2.04]);

  // Corte abierto al frente. La pared y el toldo enmarcan los anaqueles sin tapar el mostrador.
  const back = -1.95;
  box('#cfbc9c', [4.64, 1.96, 0.14], [0, floor + 0.98, back]);
  box(green, [4.7, 0.36, 0.175], [0, floor + 1.77, back]);
  box(ink, [4.77, 0.055, 0.2], [0, floor + 1.965, back]);
  sign(group, 'BODEGA SAN MARTÍN', [2.88, 0.28], [-0.42, floor + 1.775, -1.853], green);
  sign(group, 'ABARROTES', [1.03, 0.18], [1.64, floor + 1.774, -1.853], green, '#ebce9a');
  box('#b29d82', [0.105, 1.64, 1.03], [-2.27, floor + 0.82, -1.42]);
  box(brick, [0.14, 1.73, 0.19], [-2.24, floor + 0.86, -0.91]);
  box(brick, [0.14, 1.73, 0.19], [2.25, floor + 0.86, -1.71]);
  for (let stripe = 0; stripe < 12; stripe++) {
    const canopy = box(
      stripe % 2 ? cream : brick,
      [0.298, 0.045, 0.38],
      [-2.12 + stripe * 0.3, floor + 1.54, -1.62],
    );
    canopy.rotation.x = 0.16;
    box(
      stripe % 2 ? cream : brick,
      [0.298, 0.074, 0.024],
      [-2.12 + stripe * 0.3, floor + 1.48, -1.426],
    );
  }

  function bottle(parent: Group, x: number, y: number, z: number, color: string, choice?: number) {
    part(parent, color, [0.124, 0.19, 0.124], [x, y + 0.101, z], choice, 'cylinder');
    part(parent, color, [0.124, 0.087, 0.124], [x, y + 0.191, z], choice, 'sphere');
    part(parent, ink, [0.062, 0.043, 0.062], [x, y + 0.23, z], choice, 'cylinder');
    part(parent, cream, [0.127, 0.06, 0.127], [x, y + 0.094, z], choice, 'cylinder');
  }

  function packet(parent: Group, x: number, y: number, z: number, color: string, choice?: number) {
    part(parent, color, [0.162, 0.179, 0.1], [x, y + 0.089, z], choice);
    part(parent, cream, [0.116, 0.053, 0.013], [x, y + 0.093, z + 0.052], choice);
    part(parent, color, [0.166, 0.022, 0.106], [x, y + 0.173, z], choice);
  }

  const shelfZ = -1.53;
  box('#67534a', [2.48, 1.33, 0.11], [-0.84, floor + 0.73, -1.791]);
  for (const x of [-2.08, 0.4]) {
    box('#735642', [0.073, 1.38, 0.39], [x, floor + 0.69, shelfZ]);
  }
  for (const [row, front] of ['ABARROTES', 'CONSERVAS', 'SNACKS'].entries()) {
    const y = floor + 0.24 + row * 0.37;
    box(wood, [2.47, 0.057, 0.42], [-0.84, y, shelfZ], 0);
    box(seal, [2.43, 0.034, 0.025], [-0.84, y, -1.308], 0);
    sign(group, front, [0.49, 0.088], [-1.78, y, -1.293], '#6a4e3e', cream, 0);
    for (let item = 0; item < 8; item++) {
      const x = -1.91 + item * 0.296;
      const color = [brick, '#d4a34f', green, blue][(item + row) % 4];
      if (row === 1) {
        part(group, color, [0.167, 0.147, 0.163], [x, y + 0.102, -1.45], 0, 'cylinder');
        part(group, '#c5c7bd', [0.168, 0.023, 0.164], [x, y + 0.18, -1.45], 0, 'cylinder');
        part(group, cream, [0.168, 0.052, 0.165], [x, y + 0.103, -1.45], 0, 'cylinder');
      } else {
        packet(group, x, y + 0.03, -1.45, color, 0);
      }
    }
  }

  // Refrigeradora abierta en maqueta. Los marcos y divisiones dejan ver las botellas.
  const cooler = 1.56;
  box(ink, [1.03, 1.43, 0.52], [cooler, floor + 0.76, -1.58]);
  box('#b4c6c1', [0.92, 1.22, 0.039], [cooler, floor + 0.64, -1.304], 0);
  box(green, [1.04, 0.19, 0.55], [cooler, floor + 1.36, -1.57], 0);
  sign(group, 'BEBIDAS FRÍAS', [0.83, 0.14], [cooler, floor + 1.36, -1.287], green, cream, 0);
  for (const x of [cooler - 0.46, cooler + 0.46]) {
    box(green, [0.066, 1.18, 0.21], [x, floor + 0.65, -1.243], 0);
  }
  for (let row = 0; row < 3; row++) {
    const y = floor + 0.2 + row * 0.31;
    box(cream, [0.91, 0.04, 0.23], [cooler, y, -1.235], 0);
    for (let column = 0; column < 4; column++) {
      bottle(
        group,
        cooler - 0.3 + column * 0.2,
        y + 0.019,
        -1.202,
        [blue, '#ac7749', green][row],
        0,
      );
    }
  }

  function person(
    x: number,
    z: number,
    color: string,
    skin: string,
    facing: number,
    choice: number,
  ) {
    const figure = new Group();
    figure.position.set(x, floor + 0.038, z);
    figure.rotation.y = facing;
    group.add(figure);
    part(figure, color, [0.33, 0.36, 0.22], [0, 0.53, 0], choice, 'cylinder');
    part(figure, skin, [0.23, 0.26, 0.22], [0, 0.812, 0], choice, 'sphere');
    part(figure, '#473831', [0.24, 0.13, 0.235], [0, 0.884, -0.022], choice, 'sphere');
    for (const side of [-1, 1]) {
      part(figure, ink, [0.108, 0.35, 0.12], [side * 0.087, 0.184, 0], choice);
      part(figure, ink, [0.12, 0.075, 0.2], [side * 0.087, 0.034, 0.053], choice);
      part(figure, color, [0.099, 0.264, 0.112], [side * 0.162, 0.55, 0.037], choice).rotation.x =
        -0.46;
      part(figure, skin, [0.082, 0.081, 0.12], [side * 0.167, 0.444, 0.116], choice, 'sphere');
    }
    contact(group, 0.49, 0.46, [x, floor + 0.043, z]);
    return figure;
  }

  const seller = person(-1.55, 0.87, '#366e81', '#b47b5a', Math.PI * 0.83, 1);
  part(seller, cream, [0.097, 0.061, 0.017], [0.077, 0.642, 0.115], 1);
  const keeper = person(-0.7, -0.49, green, '#d19d7c', 0.32, 1);
  part(keeper, '#d3a86d', [0.211, 0.29, 0.017], [0, 0.51, 0.115], 1);

  contact(group, 2.45, 1.18, [-0.89, floor + 0.045, 0.08]);
  box(wood, [2.28, 0.66, 0.58], [-0.91, floor + 0.36, 0.07]);
  box(ink, [2.31, 0.087, 0.61], [-0.91, floor + 0.079, 0.07]);
  box(green, [2.23, 0.49, 0.032], [-0.91, floor + 0.372, 0.369]);
  for (let panel = 0; panel < 9; panel++) {
    box('#517a62', [0.022, 0.42, 0.013], [-1.93 + panel * 0.24, floor + 0.36, 0.39]);
  }
  box(cream, [2.38, 0.067, 0.69], [-0.91, floor + 0.715, 0.07]);
  sign(group, 'PEDIDOS DE REPOSICIÓN', [1.49, 0.2], [-0.93, floor + 0.411, 0.402], '#375a4d');
  packet(group, -1.74, floor + 0.75, 0.1, '#bd8058', 0);
  bottle(group, -1.48, floor + 0.75, 0.11, blue, 0);
  packet(group, -1.21, floor + 0.75, 0.08, '#b85c49', 0);

  const pad = new Group();
  pad.position.set(-0.66, floor + 0.745, 0.06);
  group.add(pad);
  part(pad, '#785442', [0.44, 0.035, 0.42], [0, 0.008, 0], 1);
  part(pad, cream, [0.374, 0.015, 0.365], [0, 0.034, 0], 1);
  sign(pad, 'PEDIDO', [0.31, 0.095], [0, 0.044, -0.108], cream, ink, 1, true);
  for (let line = 0; line < 3; line++) {
    part(pad, '#738777', [0.208, 0.004, 0.016], [-0.025, 0.044, -0.019 + line * 0.065], 1);
  }
  const check = sign(pad, 'OK', [0.098, 0.076], [0.121, 0.045, 0.136], green, cream, 1, true);

  box(ink, [0.37, 0.141, 0.18], [-0.1, floor + 0.82, -0.071], 1);
  const displays = [
    sign(group, 'SURTIDO', [0.313, 0.085], [-0.1, floor + 0.84, 0.021], ink, cream, 1),
    sign(group, 'PEDIDO OK', [0.313, 0.085], [-0.1, floor + 0.84, 0.023], green, cream, 1),
    sign(group, 'ENTREGA', [0.313, 0.085], [-0.1, floor + 0.84, 0.025], green, cream, 2),
  ];

  const zoneX = 1.18;
  const zoneZ = 0.39;
  box('#8d9a79', [1.29, 0.006, 0.83], [zoneX, floor + 0.043, zoneZ], 2);
  for (const x of [zoneX - 0.615, zoneX + 0.615]) {
    box('#e7ca87', [0.023, 0.006, 0.78], [x, floor + 0.048, zoneZ], 2);
  }
  sign(
    group,
    'RECEPCIÓN',
    [0.83, 0.17],
    [zoneX - 0.11, floor + 0.055, 0.99],
    green,
    cream,
    2,
    true,
  );
  const cart = new Group();
  group.add(cart);
  part(cart, ink, [0.73, 0.068, 0.55], [0, 0.12, 0], 2);
  part(cart, '#6b8c83', [0.73, 0.037, 0.55], [0, 0.169, 0], 2);
  for (const x of [-0.29, 0.29]) {
    part(cart, ink, [0.046, 0.53, 0.043], [x, 0.384, 0.24], 2);
  }
  part(cart, green, [0.64, 0.068, 0.088], [0, 0.658, 0.24], 2);
  const wheels: Group[] = [];
  for (const side of [-1, 1]) {
    for (const z of [-0.19, 0.19]) {
      const wheel = new Group();
      wheel.position.set(side * 0.275, 0.074, z);
      cart.add(wheel);
      wheels.push(wheel);
      part(wheel, '#292d2c', [0.148, 0.047, 0.148], [0, 0, 0], 2, 'cylinder').rotation.z =
        Math.PI / 2;
      part(wheel, '#aeb4a8', [0.015, 0.065, 0.028], [side * 0.026, 0, 0], 2);
    }
  }
  const cartShadow = contact(group, 0.89, 0.7, [0, floor + 0.058, 0]);

  const crates = [
    {
      x: -0.177,
      y: 0.186,
      z: -0.037,
      endX: 1.0,
      endY: 0,
      endZ: 0.25,
      label: 'ARROZ',
      color: '#b88556',
    },
    {
      x: 0.175,
      y: 0.186,
      z: -0.033,
      endX: 1.37,
      endY: 0,
      endZ: 0.25,
      label: 'BEBIDAS',
      color: '#c59361',
    },
    {
      x: -0.172,
      y: 0.411,
      z: -0.041,
      endX: 1.19,
      endY: 0,
      endZ: -0.11,
      label: 'SNACKS',
      color: '#b37b50',
    },
  ].map((data) => {
    const crate = new Group();
    group.add(crate);
    part(crate, data.color, [0.325, 0.225, 0.332], [0, 0.1125, 0], 2);
    part(crate, seal, [0.073, 0.009, 0.334], [0, 0.226, 0], 2);
    sign(crate, data.label, [0.265, 0.091], [0, 0.116, 0.167], cream, '#5e473a', 2);
    return { crate, ...data };
  });

  let selected: number | undefined;
  let lastTime = 0;
  let progress = 0;
  return {
    group,
    choices: CHOICES,
    select(index) {
      selected = index;
      highlight(index);
    },
    update(time) {
      const dt = time - lastTime;
      lastTime = time;
      const cycle = (time + 1.3) % 16;
      const step = selected ?? (cycle < 4 ? 0 : cycle < 7.5 ? 1 : 2);
      if (selected === undefined) {
        progress = MathUtils.smoothstep(cycle, 7.5, 12.4) - MathUtils.smoothstep(cycle, 13.6, 16);
      } else if (dt === 0) {
        // La selección también responde con la animación pausada o con movimiento reducido.
        progress = selected === 2 ? 1 : 0;
      } else {
        progress = MathUtils.clamp(progress + dt * (selected === 2 ? 0.41 : -0.6), 0, 1);
      }
      displays.forEach((display, index) => {
        if (display) display.visible = index === step;
      });
      if (check) check.visible = step !== 0;
      pad.rotation.z = step === 1 ? -0.11 : 0;

      const rolling = MathUtils.smoothstep(progress, 0, 0.69);
      const cartX = MathUtils.lerp(1.55, 1.49, rolling);
      const cartZ = MathUtils.lerp(1.6, 0.7, rolling);
      cart.position.set(cartX, floor + 0.052, cartZ);
      cartShadow?.position.set(cartX, floor + 0.058, cartZ);
      wheels.forEach((wheel) => {
        wheel.rotation.x = (-0.9 * rolling) / 0.074;
      });
      crates.forEach(({ crate, x, y, z, endX, endY, endZ }, index) => {
        // La caja de arriba se mueve primero. Las cajas se acomodan sin atravesarse.
        const begin = [0.78, 0.86, 0.69][index];
        const moved = MathUtils.smoothstep(progress, begin, begin + 0.13);
        const lift = Math.sin(moved * Math.PI) * 0.25;
        crate.position.set(
          MathUtils.lerp(cartX + x, endX, moved),
          floor + 0.052 + MathUtils.lerp(y, endY, moved) + lift,
          MathUtils.lerp(cartZ + z, endZ, moved),
        );
      });
    },
    dispose,
  };
}
