// Requiere three y @types/three. Los letreros y sombras se dibujan localmente en canvas.
import {
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  SphereGeometry,
  SRGBColorSpace,
  type Object3D,
} from 'three';

type Dimensions = [number, number, number];
type Shape = 'box' | 'cylinder' | 'sphere';

/** Primitivas compartidas por una sola maqueta, con disposición de todos sus recursos. */
export function createDiorama(document: Document, group = new Group()) {
  const geometry = {
    box: new BoxGeometry(),
    cylinder: new CylinderGeometry(0.5, 0.5, 1, 24),
    sphere: new SphereGeometry(0.5, 16, 12),
  };
  const plane = new PlaneGeometry();
  const materials = new Map<string, MeshStandardMaterial>();
  const labels = new Map<string, MeshBasicMaterial>();
  let shadow: MeshBasicMaterial | undefined;

  function part(
    parent: Object3D,
    color: string,
    size: Dimensions,
    position: Dimensions,
    choice?: number,
    shape: Shape = 'box',
  ) {
    const key = color + '/' + choice;
    let material = materials.get(key);
    if (!material) {
      material = new MeshStandardMaterial({ color, roughness: 0.78, emissive: color });
      material.emissiveIntensity = 0;
      materials.set(key, material);
    }
    const mesh = new Mesh(geometry[shape], material);
    mesh.position.set(...position);
    mesh.scale.set(...size);
    if (choice !== undefined) mesh.userData['choice'] = choice;
    parent.add(mesh);
    return mesh;
  }

  function sign(
    parent: Object3D,
    text: string,
    size: [number, number],
    position: Dimensions,
    background = '#172630',
    ink = '#fff1d7',
    choice?: number,
    floor = false,
  ) {
    const key = JSON.stringify([text, background, ink, size]);
    let material = labels.get(key);
    if (!material) {
      const canvas = document.createElement('canvas');
      canvas.width = 384;
      canvas.height = Math.max(32, Math.round((canvas.width * size[1]) / size[0]));
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `700 ${Math.min(canvas.height * 0.6, 76)}px system-ui`;
      ctx.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width - 28);
      const map = new CanvasTexture(canvas);
      map.colorSpace = SRGBColorSpace;
      map.anisotropy = 4;
      material = new MeshBasicMaterial({ map, toneMapped: false });
      labels.set(key, material);
    }
    const mesh = new Mesh(plane, material);
    mesh.scale.set(size[0], size[1], 1);
    mesh.position.set(...position);
    if (floor) mesh.rotation.x = -Math.PI / 2;
    if (choice !== undefined) mesh.userData['choice'] = choice;
    else mesh.userData['ignorePick'] = true;
    parent.add(mesh);
    return mesh;
  }

  // Sombra de contacto de bajo costo. Se comparte la misma textura en toda la escena.
  function contact(parent: Object3D, width: number, depth: number, position: Dimensions) {
    if (!shadow) {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const gradient = ctx.createRadialGradient(32, 32, 4, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(10, 18, 26, 0.62)');
      gradient.addColorStop(0.58, 'rgba(10, 18, 26, 0.38)');
      gradient.addColorStop(1, 'rgba(10, 18, 26, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      shadow = new MeshBasicMaterial({
        map: new CanvasTexture(canvas),
        transparent: true,
        depthWrite: false,
      });
    }
    const mesh = new Mesh(plane, shadow);
    mesh.rotation.x = -Math.PI / 2;
    mesh.scale.set(width, depth, 1);
    mesh.position.set(...position);
    mesh.userData['ignorePick'] = true;
    parent.add(mesh);
    return mesh;
  }

  function base(width: number, depth: number, floor: number, color: string) {
    part(group, '#17232f', [width + 0.08, 0.22, depth + 0.08], [0, floor - 0.14, 0]);
    part(group, color, [width, 0.07, depth], [0, floor - 0.035, 0]);
    part(group, '#566779', [width, 0.017, 0.026], [0, floor - 0.073, depth / 2 + 0.042]);
  }

  function plant(parent: Object3D, x: number, y: number, z: number, scale = 1) {
    const pot = new Group();
    parent.add(pot);
    pot.position.set(x, y, z);
    pot.scale.setScalar(scale);
    part(pot, '#ad6e55', [0.25, 0.24, 0.25], [0, 0.12, 0], undefined, 'cylinder');
    part(pot, '#4b3830', [0.22, 0.028, 0.22], [0, 0.244, 0], undefined, 'cylinder');
    for (let index = 0; index < 5; index++) {
      const angle = (index * Math.PI * 2) / 5;
      const leaf = part(
        pot,
        index % 2 ? '#5b9275' : '#38715d',
        [0.13, 0.32, 0.11],
        [Math.sin(angle) * 0.11, 0.34 + 0.035 * index, Math.cos(angle) * 0.11],
        undefined,
        'sphere',
      );
      leaf.rotation.set(Math.cos(angle) * 0.67, 0, -Math.sin(angle) * 0.67);
    }
  }

  function highlight(index: number) {
    materials.forEach((material, key) => {
      material.emissiveIntensity = key.endsWith('/' + index) ? 0.24 : 0;
    });
  }

  function dispose() {
    Object.values(geometry).forEach((shape) => shape.dispose());
    plane.dispose();
    materials.forEach((material) => material.dispose());
    labels.forEach((material) => {
      material.map?.dispose();
      material.dispose();
    });
    shadow?.map?.dispose();
    shadow?.dispose();
  }

  return { group, part, sign, contact, base, plant, highlight, dispose };
}
