import * as THREE from 'three';

// Material cache for optimal performance and unified realistic stylized PBR
const materialCache: Record<string, THREE.Material> = {};

function getMaterial(key: string, createFn: () => THREE.Material): THREE.Material {
  if (!materialCache[key]) {
    materialCache[key] = createFn();
  }
  return materialCache[key];
}

// Materials
export const materials = {
  bun: () =>
    getMaterial('bun', () =>
      new THREE.MeshStandardMaterial({
        color: 0xd9822b,
        roughness: 0.55,
        metalness: 0.05,
      })
    ),
  bunInside: () =>
    getMaterial('bunInside', () =>
      new THREE.MeshStandardMaterial({
        color: 0xf3d29c,
        roughness: 0.7,
      })
    ),
  patty: () =>
    getMaterial('patty', () =>
      new THREE.MeshStandardMaterial({
        color: 0x5c2c16,
        roughness: 0.85,
        metalness: 0.1,
      })
    ),
  pattyBurnt: () =>
    getMaterial('pattyBurnt', () =>
      new THREE.MeshStandardMaterial({
        color: 0x1f1917,
        roughness: 0.95,
      })
    ),
  cheese: () =>
    getMaterial('cheese', () =>
      new THREE.MeshStandardMaterial({
        color: 0xffb703,
        roughness: 0.4,
        metalness: 0.05,
      })
    ),
  lettuce: () =>
    getMaterial('lettuce', () =>
      new THREE.MeshStandardMaterial({
        color: 0x40916c,
        roughness: 0.6,
        side: THREE.DoubleSide,
      })
    ),
  tomato: () =>
    getMaterial('tomato', () =>
      new THREE.MeshStandardMaterial({
        color: 0xdb222a,
        roughness: 0.35,
        metalness: 0.1,
      })
    ),
  onion: () =>
    getMaterial('onion', () =>
      new THREE.MeshStandardMaterial({
        color: 0xf1faee,
        roughness: 0.5,
        transparent: true,
        opacity: 0.9,
      })
    ),
  sesame: () =>
    getMaterial('sesame', () =>
      new THREE.MeshStandardMaterial({
        color: 0xfefae0,
        roughness: 0.5,
      })
    ),
  pizzaCrust: () =>
    getMaterial('pizzaCrust', () =>
      new THREE.MeshStandardMaterial({
        color: 0xd4a373,
        roughness: 0.7,
      })
    ),
  pizzaCheese: () =>
    getMaterial('pizzaCheese', () =>
      new THREE.MeshStandardMaterial({
        color: 0xffe882,
        roughness: 0.45,
      })
    ),
  pepperoni: () =>
    getMaterial('pepperoni', () =>
      new THREE.MeshStandardMaterial({
        color: 0x9e2a2b,
        roughness: 0.5,
      })
    ),
  basil: () =>
    getMaterial('basil', () =>
      new THREE.MeshStandardMaterial({
        color: 0x2d6a4f,
        roughness: 0.6,
      })
    ),
  pasta: () =>
    getMaterial('pasta', () =>
      new THREE.MeshStandardMaterial({
        color: 0xffe599,
        roughness: 0.6,
      })
    ),
  sauce: () =>
    getMaterial('sauce', () =>
      new THREE.MeshStandardMaterial({
        color: 0xbc2a18,
        roughness: 0.3,
        metalness: 0.15,
      })
    ),
  meatball: () =>
    getMaterial('meatball', () =>
      new THREE.MeshStandardMaterial({
        color: 0x603813,
        roughness: 0.8,
      })
    ),
  ceramicPlate: () =>
    getMaterial('ceramicPlate', () =>
      new THREE.MeshStandardMaterial({
        color: 0xf8f9fa,
        roughness: 0.2,
        metalness: 0.05,
      })
    ),
  glass: () =>
    getMaterial('glass', () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.88,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.4,
      })
    ),
  icedTea: () =>
    getMaterial('icedTea', () =>
      new THREE.MeshStandardMaterial({
        color: 0xc86420,
        roughness: 0.2,
        transparent: true,
        opacity: 0.82,
      })
    ),
  lemon: () =>
    getMaterial('lemon', () =>
      new THREE.MeshStandardMaterial({
        color: 0xffd166,
        roughness: 0.4,
      })
    ),
  ice: () =>
    getMaterial('ice', () =>
      new THREE.MeshStandardMaterial({
        color: 0xe0fbfc,
        roughness: 0.15,
        transparent: true,
        opacity: 0.75,
      })
    ),
  straw: () =>
    getMaterial('straw', () =>
      new THREE.MeshStandardMaterial({
        color: 0x06d6a0,
        roughness: 0.3,
      })
    ),
  stainless: () =>
    getMaterial('stainless', () =>
      new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.25,
        metalness: 0.85,
      })
    ),
  panHandle: () =>
    getMaterial('panHandle', () =>
      new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.7,
      })
    ),
};

/**
 * Creates a fully detailed, multi-layered 3D Burger:
 * bottom bun -> patty -> melted cheese -> tomato slices -> lettuce leaf -> top bun with sesame seeds
 */
export function create3DBurger(isBurnt = false): THREE.Group {
  const group = new THREE.Group();

  // Bottom bun
  const bottomBunGeo = new THREE.CylinderGeometry(0.24, 0.23, 0.07, 24);
  const bottomBun = new THREE.Mesh(bottomBunGeo, materials.bun());
  bottomBun.position.y = 0.035;
  bottomBun.castShadow = true;
  bottomBun.receiveShadow = true;
  group.add(bottomBun);

  // Patty
  const pattyGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.07, 24);
  const patty = new THREE.Mesh(
    pattyGeo,
    isBurnt ? materials.pattyBurnt() : materials.patty()
  );
  patty.position.y = 0.095;
  patty.castShadow = true;
  patty.receiveShadow = true;
  group.add(patty);

  if (!isBurnt) {
    // Melted cheese layer (square rotated with droop)
    const cheeseGeo = new THREE.BoxGeometry(0.38, 0.02, 0.38);
    const cheese = new THREE.Mesh(cheeseGeo, materials.cheese());
    cheese.position.y = 0.135;
    cheese.rotation.y = Math.PI / 4;
    cheese.castShadow = true;
    group.add(cheese);

    // Tomato slices
    for (let i = 0; i < 2; i++) {
      const tomatoGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.025, 16);
      const tomato = new THREE.Mesh(tomatoGeo, materials.tomato());
      tomato.position.set(i === 0 ? -0.07 : 0.07, 0.155, i === 0 ? 0.03 : -0.03);
      tomato.rotation.x = (Math.random() - 0.5) * 0.1;
      tomato.castShadow = true;
      group.add(tomato);
    }

    // Wavy lettuce (flattened deformed disk)
    const lettuceGeo = new THREE.CylinderGeometry(0.27, 0.26, 0.02, 16);
    const lettuce = new THREE.Mesh(lettuceGeo, materials.lettuce());
    lettuce.position.y = 0.175;
    lettuce.scale.set(1.05, 1, 0.95);
    lettuce.castShadow = true;
    group.add(lettuce);
  }

  // Top bun (dome)
  const topBunGeo = new THREE.SphereGeometry(
    0.25,
    24,
    16,
    0,
    Math.PI * 2,
    0,
    Math.PI * 0.48
  );
  const topBun = new THREE.Mesh(topBunGeo, isBurnt ? materials.pattyBurnt() : materials.bun());
  topBun.position.y = isBurnt ? 0.12 : 0.18;
  topBun.castShadow = true;
  topBun.receiveShadow = true;
  group.add(topBun);

  // Sesame seeds on top
  if (!isBurnt) {
    const sesameGeo = new THREE.ConeGeometry(0.012, 0.022, 6);
    const sesameMat = materials.sesame();
    const seedPositions = [
      [0, 0.3, 0],
      [0.08, 0.28, 0.06],
      [-0.07, 0.28, 0.08],
      [0.09, 0.27, -0.07],
      [-0.08, 0.27, -0.06],
      [0.02, 0.28, 0.12],
      [-0.12, 0.25, 0.01],
      [0.13, 0.25, 0.02],
    ];
    seedPositions.forEach(([x, y, z]) => {
      const seed = new THREE.Mesh(sesameGeo, sesameMat);
      seed.position.set(x, y, z);
      seed.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
      seed.rotation.z = Math.random() * Math.PI;
      group.add(seed);
    });
  }

  return group;
}

/**
 * Creates a fully detailed 3D Pizza (crust, sauce, melted mozzarella, pepperonis, basil)
 */
export function create3DPizza(isBurnt = false): THREE.Group {
  const group = new THREE.Group();

  // Crust edge
  const crustGeo = new THREE.TorusGeometry(0.3, 0.045, 12, 32);
  const crust = new THREE.Mesh(
    crustGeo,
    isBurnt ? materials.pattyBurnt() : materials.pizzaCrust()
  );
  crust.rotation.x = Math.PI / 2;
  crust.position.y = 0.035;
  crust.castShadow = true;
  group.add(crust);

  // Base dough
  const baseGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.03, 32);
  const base = new THREE.Mesh(
    baseGeo,
    isBurnt ? materials.pattyBurnt() : materials.pizzaCrust()
  );
  base.position.y = 0.015;
  base.castShadow = true;
  group.add(base);

  if (!isBurnt) {
    // Tomato sauce & Melted cheese
    const cheeseGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.015, 32);
    const cheese = new THREE.Mesh(cheeseGeo, materials.pizzaCheese());
    cheese.position.y = 0.032;
    cheese.castShadow = true;
    group.add(cheese);

    // Pepperonis
    const pCoords = [
      [0, 0],
      [0.13, 0.11],
      [-0.14, 0.09],
      [0.12, -0.12],
      [-0.11, -0.13],
      [0.18, 0],
      [-0.18, -0.02],
    ];
    pCoords.forEach(([x, z]) => {
      const pepGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.01, 16);
      const pep = new THREE.Mesh(pepGeo, materials.pepperoni());
      pep.position.set(x, 0.043, z);
      pep.rotation.y = Math.random() * Math.PI;
      pep.castShadow = true;
      group.add(pep);
    });

    // Basil leaves
    const basilGeo = new THREE.SphereGeometry(0.03, 8, 6);
    basilGeo.scale(1, 0.2, 0.6);
    const bCoords = [
      [0.06, 0.08],
      [-0.06, -0.07],
      [0.07, -0.05],
      [-0.08, 0.06],
    ];
    bCoords.forEach(([x, z]) => {
      const leaf = new THREE.Mesh(basilGeo, materials.basil());
      leaf.position.set(x, 0.046, z);
      leaf.rotation.set((Math.random() - 0.5) * 0.2, Math.random() * Math.PI, 0);
      group.add(leaf);
    });
  }

  return group;
}

/**
 * Creates 3D Spaghetti in a ceramic bowl with bolognese sauce & meatball
 */
export function create3DSpaghetti(isBurnt = false): THREE.Group {
  const group = new THREE.Group();

  // Ceramic Bowl
  const bowlGeo = new THREE.CylinderGeometry(0.3, 0.16, 0.12, 24, 1, true);
  const bowl = new THREE.Mesh(bowlGeo, materials.ceramicPlate());
  bowl.position.y = 0.06;
  bowl.castShadow = true;
  group.add(bowl);

  const bowlBottomGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.02, 24);
  const bowlBottom = new THREE.Mesh(bowlBottomGeo, materials.ceramicPlate());
  bowlBottom.position.y = 0.01;
  group.add(bowlBottom);

  // Pasta Mound
  const pastaGeo = new THREE.SphereGeometry(
    0.23,
    16,
    12,
    0,
    Math.PI * 2,
    0,
    Math.PI * 0.5
  );
  const pasta = new THREE.Mesh(
    pastaGeo,
    isBurnt ? materials.pattyBurnt() : materials.pasta()
  );
  pasta.position.y = 0.05;
  pasta.castShadow = true;
  group.add(pasta);

  if (!isBurnt) {
    // Red Bolognese sauce top
    const sauceGeo = new THREE.SphereGeometry(
      0.15,
      14,
      10,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.45
    );
    const sauce = new THREE.Mesh(sauceGeo, materials.sauce());
    sauce.position.y = 0.12;
    group.add(sauce);

    // Meatballs
    const mbGeo = new THREE.SphereGeometry(0.045, 12, 10);
    const mbCoords = [
      [0, 0.18, 0],
      [0.07, 0.16, 0.04],
      [-0.06, 0.15, -0.04],
    ];
    mbCoords.forEach(([x, y, z]) => {
      const mb = new THREE.Mesh(mbGeo, materials.meatball());
      mb.position.set(x, y, z);
      mb.castShadow = true;
      group.add(mb);
    });
  }

  return group;
}

/**
 * Creates 3D Crispy Fried Chicken Drumstick on ceramic plate
 */
export function create3DFriedChicken(isBurnt = false): THREE.Group {
  const group = new THREE.Group();

  // Ceramic Plate
  const plateGeo = new THREE.CylinderGeometry(0.28, 0.22, 0.03, 24);
  const plate = new THREE.Mesh(plateGeo, materials.ceramicPlate());
  plate.position.y = 0.015;
  plate.castShadow = true;
  group.add(plate);

  // Bone
  const boneGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.22, 12);
  const bone = new THREE.Mesh(boneGeo, materials.sesame());
  bone.position.set(0.08, 0.07, 0);
  bone.rotation.z = Math.PI / 4;
  bone.castShadow = true;
  group.add(bone);

  // Crispy Meat (bulky meat mass)
  const meatGeo = new THREE.SphereGeometry(0.12, 16, 14);
  meatGeo.scale(1.2, 0.9, 0.9);
  const meat = new THREE.Mesh(
    meatGeo,
    isBurnt ? materials.pattyBurnt() : materials.bun()
  );
  meat.position.set(-0.04, 0.09, 0);
  meat.castShadow = true;
  group.add(meat);

  return group;
}

/**
 * Creates 3D Iced Drink in transparent glass with liquid, ice cubes, lemon slice, and straw
 */
export function create3DIcedDrink(): THREE.Group {
  const group = new THREE.Group();

  // Glass cup (transparent physical material)
  const glassGeo = new THREE.CylinderGeometry(0.12, 0.09, 0.32, 24, 1, true);
  const glass = new THREE.Mesh(glassGeo, materials.glass());
  glass.position.y = 0.16;
  glass.castShadow = true;
  group.add(glass);

  const glassBottomGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.03, 24);
  const glassBottom = new THREE.Mesh(glassBottomGeo, materials.glass());
  glassBottom.position.y = 0.015;
  group.add(glassBottom);

  // Liquid (iced tea or juice)
  const liquidGeo = new THREE.CylinderGeometry(0.115, 0.088, 0.24, 20);
  const liquid = new THREE.Mesh(liquidGeo, materials.icedTea());
  liquid.position.y = 0.13;
  group.add(liquid);

  // 3D Ice cubes floating inside
  const iceGeo = new THREE.BoxGeometry(0.055, 0.055, 0.055);
  const ice1 = new THREE.Mesh(iceGeo, materials.ice());
  ice1.position.set(0.02, 0.2, 0.02);
  ice1.rotation.set(0.3, 0.5, 0.2);
  group.add(ice1);

  const ice2 = new THREE.Mesh(iceGeo, materials.ice());
  ice2.position.set(-0.03, 0.18, -0.02);
  ice2.rotation.set(-0.4, 0.2, 0.6);
  group.add(ice2);

  // Straw
  const strawGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.38, 12);
  const straw = new THREE.Mesh(strawGeo, materials.straw());
  straw.position.set(0.04, 0.23, 0.03);
  straw.rotation.set(0.15, 0, -0.22);
  straw.castShadow = true;
  group.add(straw);

  // Lemon slice on rim
  const lemonGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.015, 16);
  const lemon = new THREE.Mesh(lemonGeo, materials.lemon());
  lemon.position.set(-0.11, 0.31, 0);
  lemon.rotation.z = Math.PI / 3;
  group.add(lemon);

  return group;
}

/**
 * Creates 3D Frying Pan with handle
 */
export function create3DFryingPan(): THREE.Group {
  const group = new THREE.Group();

  // Pan body
  const panGeo = new THREE.CylinderGeometry(0.32, 0.28, 0.08, 24, 1, false);
  const pan = new THREE.Mesh(panGeo, materials.stainless());
  pan.position.y = 0.04;
  pan.castShadow = true;
  pan.receiveShadow = true;
  group.add(pan);

  // Inner bottom
  const panBottomGeo = new THREE.CylinderGeometry(0.27, 0.27, 0.01, 24);
  const panBottom = new THREE.Mesh(panBottomGeo, materials.pattyBurnt());
  panBottom.position.y = 0.02;
  group.add(panBottom);

  // Long handle
  const handleGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.45, 12);
  const handle = new THREE.Mesh(handleGeo, materials.panHandle());
  handle.rotation.z = Math.PI / 2;
  handle.position.set(0.48, 0.07, 0);
  handle.castShadow = true;
  group.add(handle);

  return group;
}

/**
 * Creates a finished food 3D model by foodId
 */
export function createFoodMesh(foodId: string, isBurnt = false): THREE.Group {
  switch (foodId) {
    case 'burger':
    case 'burger-spesial':
    case 'cheese-burger':
    case 'rendang-burger':
      return create3DBurger(isBurnt);
    case 'pizza-slice':
    case 'pizza-margherita':
    case 'pizza-meat':
      return create3DPizza(isBurnt);
    case 'spaghetti-bolognese':
    case 'pasta-carbonara':
    case 'mie-goreng':
      return create3DSpaghetti(isBurnt);
    case 'ayam-goreng':
    case 'kentang-goreng':
    case 'sate-ayam':
      return create3DFriedChicken(isBurnt);
    case 'es-teh-manis':
    case 'es-jeruk':
    case 'lemonade':
    case 'strawberry-shake':
    case 'soda-gembira':
      return create3DIcedDrink();
    default:
      return create3DBurger(isBurnt);
  }
}
