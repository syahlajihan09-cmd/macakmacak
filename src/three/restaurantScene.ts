import * as THREE from 'three';
import { create3DFryingPan, materials } from './foodModels';

export interface Station3DPoints {
  stoves: THREE.Vector3[];
  cuttingBoard: THREE.Vector3;
  oven: THREE.Vector3;
  drinkDispenser: THREE.Vector3;
  servingCounter: THREE.Vector3;
  refrigerator: THREE.Vector3;
  trashCan: THREE.Vector3;
  tables: THREE.Vector3[];
  chairs: THREE.Vector3[];
  entranceDoor: THREE.Vector3;
}

export interface Restaurant3DEnvironment {
  group: THREE.Group;
  entranceDoorMesh: THREE.Group;
  ovenDoorMesh: THREE.Group;
  ovenLight: THREE.PointLight;
  stoveFlames: THREE.Group[];
  drinkStream: THREE.Mesh;
  trashCanMesh: THREE.Group;
  stations: Station3DPoints;
  fryingPans: THREE.Group[];
  updateAnimations: (time: number) => void;
}

// Color palettes for different restaurants
export const RESTO_THEMES = {
  'dapur-ceria': {
    floorColor: 0xd4a373,
    wallColor: 0xffeedb,
    counterTop: 0xf8f9fa,
    accent: 0xe76f51,
  },
  'pasta-corner': {
    floorColor: 0x8b5a2b,
    wallColor: 0xbd5338, // rustic brick
    counterTop: 0x2b2d42,
    accent: 0x2a9d8f,
  },
  'nusantara-kitchen': {
    floorColor: 0x5c3d28,
    wallColor: 0xf5ebe0,
    counterTop: 0x3d2618,
    accent: 0xd4a373,
  },
  'sweet-chill': {
    floorColor: 0xffe5ec,
    wallColor: 0xfbf8cc,
    counterTop: 0xffc6ff,
    accent: 0x9bf6ff,
  },
  'grand-chef': {
    floorColor: 0x212529,
    wallColor: 0x343a40,
    counterTop: 0xd4af37, // gold marble
    accent: 0xe9c46a,
  },
};

export function build3DRestaurant(restaurantId = 'dapur-ceria'): Restaurant3DEnvironment {
  const group = new THREE.Group();
  const theme = RESTO_THEMES[restaurantId as keyof typeof RESTO_THEMES] || RESTO_THEMES['dapur-ceria'];

  // 1. FLOOR (Spacious Landscape Layout: width 20 x depth 14)
  const floorGeo = new THREE.BoxGeometry(22, 0.4, 15);
  const floorMat = new THREE.MeshStandardMaterial({
    color: theme.floorColor,
    roughness: 0.5,
    metalness: 0.05,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -0.2;
  floor.receiveShadow = true;
  group.add(floor);

  // Wooden plank lines or checker lines on floor
  const gridHelper = new THREE.GridHelper(20, 20, 0x000000, 0x000000);
  gridHelper.position.y = 0.005;
  (gridHelper.material as THREE.Material).opacity = 0.08;
  (gridHelper.material as THREE.Material).transparent = true;
  group.add(gridHelper);

  // 2. WALLS
  const wallMat = new THREE.MeshStandardMaterial({
    color: theme.wallColor,
    roughness: 0.8,
  });

  // Back Wall
  const backWallGeo = new THREE.BoxGeometry(22, 7, 0.4);
  const backWall = new THREE.Mesh(backWallGeo, wallMat);
  backWall.position.set(0, 3.5, -7.5);
  backWall.receiveShadow = true;
  group.add(backWall);

  // Left Wall (Kitchen side)
  const leftWallGeo = new THREE.BoxGeometry(0.4, 7, 15);
  const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
  leftWall.position.set(-11, 3.5, 0);
  leftWall.receiveShadow = true;
  group.add(leftWall);

  // Right Wall (Entrance side with door opening)
  const rightWallGeo = new THREE.BoxGeometry(0.4, 7, 8.5);
  const rightWall = new THREE.Mesh(rightWallGeo, wallMat);
  rightWall.position.set(11, 3.5, -3.25);
  rightWall.receiveShadow = true;
  group.add(rightWall);

  // Baseboards / Wall trims
  const trimGeo = new THREE.BoxGeometry(22, 0.25, 0.45);
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x4a2c11, roughness: 0.5 });
  const backTrim = new THREE.Mesh(trimGeo, trimMat);
  backTrim.position.set(0, 0.125, -7.4);
  group.add(backTrim);

  // 3. ENTRANCE DOOR (Pivot hinge on right wall at x: 11, z: 3.5)
  const doorPivot = new THREE.Group();
  doorPivot.position.set(11, 0, 1.8);
  const doorPanelGeo = new THREE.BoxGeometry(0.12, 3.4, 1.8);
  const doorMat = new THREE.MeshStandardMaterial({
    color: 0x5c3d28,
    roughness: 0.6,
  });
  const doorPanel = new THREE.Mesh(doorPanelGeo, doorMat);
  doorPanel.position.set(0, 1.7, 0.9);
  doorPanel.castShadow = true;
  doorPivot.add(doorPanel);

  // Glass window pane inside door
  const doorGlassGeo = new THREE.BoxGeometry(0.14, 1.6, 1.1);
  const doorGlass = new THREE.Mesh(doorGlassGeo, materials.glass());
  doorGlass.position.set(0, 2.0, 0.9);
  doorPivot.add(doorGlass);

  // Door Handle (Brass)
  const doorHandleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.25, 12);
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
  const doorHandle = new THREE.Mesh(doorHandleGeo, brassMat);
  doorHandle.position.set(-0.08, 1.6, 1.6);
  doorPivot.add(doorHandle);

  group.add(doorPivot);

  // 4. RESTAURANT WINDOWS on Back Wall (Showing sunny outdoor garden/street view)
  const windowFrameGeo = new THREE.BoxGeometry(3.2, 2.2, 0.2);
  const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  const windowFrame = new THREE.Mesh(windowFrameGeo, windowFrameMat);
  windowFrame.position.set(4.5, 4.2, -7.3);
  group.add(windowFrame);

  const windowGlassGeo = new THREE.BoxGeometry(3.0, 2.0, 0.05);
  const windowGlass = new THREE.Mesh(
    windowGlassGeo,
    new THREE.MeshBasicMaterial({ color: 0xbde0fe, transparent: true, opacity: 0.5 })
  );
  windowGlass.position.set(4.5, 4.2, -7.2);
  group.add(windowGlass);

  // Chalkboard Menu on Wall
  const boardGeo = new THREE.BoxGeometry(2.4, 1.8, 0.08);
  const boardMat = new THREE.MeshStandardMaterial({ color: 0x1e2022, roughness: 0.9 });
  const menuBoard = new THREE.Mesh(boardGeo, boardMat);
  menuBoard.position.set(-2.5, 4.2, -7.3);
  group.add(menuBoard);

  // Frame around menu board
  const menuFrameGeo = new THREE.BoxGeometry(2.55, 1.95, 0.05);
  const menuFrame = new THREE.Mesh(menuFrameGeo, trimMat);
  menuFrame.position.set(-2.5, 4.2, -7.34);
  group.add(menuFrame);

  // 5. PENDANT LAMPS with warm point lighting
  const lampPositions = [
    new THREE.Vector3(-6, 5.2, -2),
    new THREE.Vector3(-1.5, 5.2, -2),
    new THREE.Vector3(3.5, 5.2, 1.5),
    new THREE.Vector3(7.5, 5.2, 1.5),
  ];

  lampPositions.forEach((pos) => {
    // Cord
    const cordGeo = new THREE.CylinderGeometry(0.01, 0.01, 1.6, 6);
    const cord = new THREE.Mesh(cordGeo, charMats_black());
    cord.position.set(pos.x, pos.y + 0.8, pos.z);
    group.add(cord);

    // Lamp Shade (Cone)
    const shadeGeo = new THREE.ConeGeometry(0.42, 0.35, 16, 1, true);
    const shadeMat = new THREE.MeshStandardMaterial({
      color: 0x2b2d42,
      roughness: 0.3,
      side: THREE.DoubleSide,
    });
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.set(pos.x, pos.y, pos.z);
    group.add(shade);

    // Bulb glow
    const bulbGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffe899 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(pos.x, pos.y - 0.08, pos.z);
    group.add(bulb);

    // Warm PointLight
    const pLight = new THREE.PointLight(0xffd180, 1.2, 8);
    pLight.position.set(pos.x, pos.y - 0.15, pos.z);
    pLight.castShadow = true;
    pLight.shadow.bias = -0.001;
    group.add(pLight);
  });

  // 6. KITCHEN COUNTER & WORKSTATIONS (LEFT / CENTER AREA)
  // Main Cooking Counter (along z: -2.8 to 1.8 at x: -5.5)
  const counterBaseGeo = new THREE.BoxGeometry(4.2, 1.0, 1.5);
  const counterBaseMat = new THREE.MeshStandardMaterial({ color: 0x3a4042, roughness: 0.6 });
  const counterBase = new THREE.Mesh(counterBaseGeo, counterBaseMat);
  counterBase.position.set(-6.0, 0.5, -2.5);
  counterBase.castShadow = true;
  counterBase.receiveShadow = true;
  group.add(counterBase);

  // Countertop (Stainless / polished marble)
  const topGeo = new THREE.BoxGeometry(4.4, 0.1, 1.7);
  const topMat = new THREE.MeshStandardMaterial({
    color: theme.counterTop,
    roughness: 0.2,
    metalness: 0.6,
  });
  const counterTop = new THREE.Mesh(topGeo, topMat);
  counterTop.position.set(-6.0, 1.05, -2.5);
  counterTop.castShadow = true;
  counterTop.receiveShadow = true;
  group.add(counterTop);

  // 2x Stoves with burner rings
  const stovePositions = [new THREE.Vector3(-7.2, 1.1, -2.5), new THREE.Vector3(-5.8, 1.1, -2.5)];
  const stoveFlames: THREE.Group[] = [];
  const fryingPans: THREE.Group[] = [];

  stovePositions.forEach((pos, idx) => {
    // Metal burner plate
    const burnerGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.025, 24);
    const burner = new THREE.Mesh(burnerGeo, charMats_black());
    burner.position.copy(pos);
    group.add(burner);

    // Cast iron grate
    const grateGeo = new THREE.TorusGeometry(0.35, 0.02, 8, 16);
    const grate = new THREE.Mesh(grateGeo, charMats_black());
    grate.rotation.x = Math.PI / 2;
    grate.position.set(pos.x, pos.y + 0.015, pos.z);
    group.add(grate);

    // Fire flame group
    const flameGroup = new THREE.Group();
    flameGroup.position.set(pos.x, pos.y + 0.03, pos.z);
    for (let f = 0; f < 8; f++) {
      const angle = (f / 8) * Math.PI * 2;
      const fCone = new THREE.Mesh(
        new THREE.ConeGeometry(0.04, 0.14, 6),
        new THREE.MeshBasicMaterial({ color: 0x3a86ff }) // Blue base
      );
      fCone.position.set(Math.cos(angle) * 0.24, 0.06, Math.sin(angle) * 0.24);
      flameGroup.add(fCone);

      const fTip = new THREE.Mesh(
        new THREE.ConeGeometry(0.03, 0.12, 6),
        new THREE.MeshBasicMaterial({ color: 0xff5400 }) // Orange flame
      );
      fTip.position.set(Math.cos(angle) * 0.24, 0.12, Math.sin(angle) * 0.24);
      flameGroup.add(fTip);
    }
    flameGroup.visible = false; // toggled when cooking
    group.add(flameGroup);
    stoveFlames.push(flameGroup);

    // 3D Frying pan on stove
    const pan = create3DFryingPan();
    pan.position.set(pos.x, pos.y + 0.03, pos.z);
    pan.rotation.y = idx === 0 ? 0.4 : -0.4;
    group.add(pan);
    fryingPans.push(pan);
  });

  // Cutting Board Station (x: -4.5, y: 1.1, z: -2.5)
  const boardGeo2 = new THREE.BoxGeometry(0.7, 0.04, 0.5);
  const boardWood = new THREE.Mesh(
    boardGeo2,
    new THREE.MeshStandardMaterial({ color: 0xbf8148, roughness: 0.6 })
  );
  boardWood.position.set(-4.4, 1.12, -2.5);
  boardWood.castShadow = true;
  group.add(boardWood);

  // Chef Knife on Cutting board
  const knifeGeo = new THREE.BoxGeometry(0.04, 0.01, 0.28);
  const knifeOnBoard = new THREE.Mesh(knifeGeo, materials.stainless());
  knifeOnBoard.position.set(-4.15, 1.15, -2.5);
  knifeOnBoard.rotation.y = 0.2;
  group.add(knifeOnBoard);

  // Sliced tomatoes on board
  for (let i = 0; i < 3; i++) {
    const sGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 12);
    const sMesh = new THREE.Mesh(sGeo, materials.tomato());
    sMesh.position.set(-4.5 + i * 0.08, 1.15, -2.5);
    group.add(sMesh);
  }

  // 7. BAKING OVEN with glowing interior and opening door (x: -9.2, z: -2.5)
  const ovenBodyGeo = new THREE.BoxGeometry(1.4, 1.3, 1.2);
  const ovenBody = new THREE.Mesh(ovenBodyGeo, materials.stainless());
  ovenBody.position.set(-9.2, 0.65, -2.5);
  ovenBody.castShadow = true;
  group.add(ovenBody);

  // Oven Door with glass
  const ovenDoorPivot = new THREE.Group();
  ovenDoorPivot.position.set(-8.5, 0.1, -2.5); // hinge at bottom
  const ovenDoorGeo = new THREE.BoxGeometry(0.08, 1.1, 1.15);
  const ovenDoorMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3 });
  const ovenDoor = new THREE.Mesh(ovenDoorGeo, ovenDoorMat);
  ovenDoor.position.set(0, 0.55, 0);
  ovenDoorPivot.add(ovenDoor);

  const ovenGlassGeo = new THREE.BoxGeometry(0.1, 0.6, 0.75);
  const ovenGlass = new THREE.Mesh(ovenGlassGeo, materials.glass());
  ovenGlass.position.set(0, 0.55, 0);
  ovenDoorPivot.add(ovenGlass);

  // Handle
  const ovenHandleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.6, 8);
  const ovenHandle = new THREE.Mesh(ovenHandleGeo, materials.stainless());
  ovenHandle.rotation.x = Math.PI / 2;
  ovenHandle.position.set(0.07, 1.0, 0);
  ovenDoorPivot.add(ovenHandle);
  group.add(ovenDoorPivot);

  // Interior Oven Light
  const ovenLight = new THREE.PointLight(0xff7b00, 0.2, 2.5);
  ovenLight.position.set(-9.1, 0.65, -2.5);
  group.add(ovenLight);

  // 8. DRINK DISPENSER STATION (x: -9.2, z: 0.5)
  const dispBaseGeo = new THREE.BoxGeometry(1.0, 1.0, 1.1);
  const dispBase = new THREE.Mesh(dispBaseGeo, materials.stainless());
  dispBase.position.set(-9.2, 0.5, 0.5);
  dispBase.castShadow = true;
  group.add(dispBase);

  // 2x Transparent Juice/Tea Tanks
  for (let d = 0; d < 2; d++) {
    const zOffset = d === 0 ? 0.26 : 0.74;
    const tankGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.6, 16);
    const tank = new THREE.Mesh(tankGeo, materials.glass());
    tank.position.set(-9.2, 1.35, zOffset);
    group.add(tank);

    const juiceGeo = new THREE.CylinderGeometry(0.165, 0.165, 0.5, 16);
    const juiceMat = new THREE.MeshStandardMaterial({
      color: d === 0 ? 0xc86420 : 0xffa200,
      roughness: 0.2,
      transparent: true,
      opacity: 0.8,
    });
    const juice = new THREE.Mesh(juiceGeo, juiceMat);
    juice.position.set(-9.2, 1.3, zOffset);
    group.add(juice);

    // Tap spout
    const tapGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 8);
    const tap = new THREE.Mesh(tapGeo, materials.stainless());
    tap.rotation.z = Math.PI / 2;
    tap.position.set(-8.9, 1.15, zOffset);
    group.add(tap);
  }

  // Pouring stream mesh (hidden by default)
  const streamGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8);
  const streamMat = new THREE.MeshStandardMaterial({
    color: 0xc86420,
    transparent: true,
    opacity: 0.85,
  });
  const drinkStream = new THREE.Mesh(streamGeo, streamMat);
  drinkStream.position.set(-8.85, 1.15, 0.26);
  drinkStream.visible = false;
  group.add(drinkStream);

  // 9. SERVING COUNTER (Pass-through counter separating kitchen and dining: x: -1.0)
  const passCounterGeo = new THREE.BoxGeometry(0.8, 1.05, 5.0);
  const passCounter = new THREE.Mesh(passCounterGeo, counterBaseMat);
  passCounter.position.set(-1.0, 0.525, -0.5);
  passCounter.castShadow = true;
  passCounter.receiveShadow = true;
  group.add(passCounter);

  const passTopGeo = new THREE.BoxGeometry(1.0, 0.08, 5.2);
  const passTop = new THREE.Mesh(passTopGeo, topMat);
  passTop.position.set(-1.0, 1.1, -0.5);
  passTop.castShadow = true;
  group.add(passTop);

  // 3x Prepared Food Serving Trays on pass counter
  for (let t = 0; t < 3; t++) {
    const trayGeo = new THREE.BoxGeometry(0.65, 0.03, 0.8);
    const tray = new THREE.Mesh(trayGeo, materials.stainless());
    tray.position.set(-1.0, 1.15, -2.0 + t * 1.5);
    tray.castShadow = true;
    group.add(tray);
  }

  // 10. TRASH CAN FOR BURNT FOOD (x: -3.0, z: -4.8)
  const trashPivot = new THREE.Group();
  trashPivot.position.set(-3.0, 0, -5.0);
  const trashBodyGeo = new THREE.CylinderGeometry(0.28, 0.22, 0.7, 16);
  const trashMat = new THREE.MeshStandardMaterial({ color: 0x2b2d42, metalness: 0.6, roughness: 0.3 });
  const trashBody = new THREE.Mesh(trashBodyGeo, trashMat);
  trashBody.position.y = 0.35;
  trashBody.castShadow = true;
  trashPivot.add(trashBody);

  const trashLidGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.06, 16);
  const trashLid = new THREE.Mesh(trashLidGeo, materials.stainless());
  trashLid.position.y = 0.73;
  trashPivot.add(trashLid);

  // Pedal
  const pedalGeo = new THREE.BoxGeometry(0.08, 0.04, 0.12);
  const pedal = new THREE.Mesh(pedalGeo, materials.stainless());
  pedal.position.set(0, 0.04, 0.26);
  trashPivot.add(pedal);
  group.add(trashPivot);

  // 11. DINING ROOM WITH 4 TABLES & CHAIRS (RIGHT / FRONT AREA)
  const tablePositions = [
    new THREE.Vector3(2.5, 0, -3.2), // Table 1
    new THREE.Vector3(7.2, 0, -3.2), // Table 2
    new THREE.Vector3(2.5, 0, 1.5),  // Table 3
    new THREE.Vector3(7.2, 0, 1.5),  // Table 4
  ];

  const chairPositions: THREE.Vector3[] = [];

  tablePositions.forEach((pos, idx) => {
    // 3D Table Top
    const tableTopGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.07, 32);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.45,
    });
    const tableTop = new THREE.Mesh(tableTopGeo, tableMat);
    tableTop.position.set(pos.x, 0.9, pos.z);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    group.add(tableTop);

    // Table pedestal leg
    const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.85, 12);
    const leg = new THREE.Mesh(legGeo, charMats_black());
    leg.position.set(pos.x, 0.45, pos.z);
    leg.castShadow = true;
    group.add(leg);

    const legBaseGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.05, 24);
    const legBase = new THREE.Mesh(legBaseGeo, charMats_black());
    legBase.position.set(pos.x, 0.025, pos.z);
    group.add(legBase);

    // Table number card & flower vase centerpiece
    const vaseGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.18, 12);
    const vase = new THREE.Mesh(vaseGeo, materials.ceramicPlate());
    vase.position.set(pos.x, 1.02, pos.z);
    group.add(vase);

    const flowerGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const flower = new THREE.Mesh(flowerGeo, materials.lettuce());
    flower.position.set(pos.x, 1.15, pos.z);
    group.add(flower);

    // 2x Chairs per table (one facing customer, one across)
    const chairZOffset = 1.0;
    const customerChairPos = new THREE.Vector3(pos.x, 0, pos.z + chairZOffset);
    chairPositions.push(customerChairPos);

    [-chairZOffset, chairZOffset].forEach((offset) => {
      const chairGroup = new THREE.Group();
      chairGroup.position.set(pos.x, 0, pos.z + offset);
      chairGroup.rotation.y = offset > 0 ? Math.PI : 0;

      // Seat cushion
      const seatGeo = new THREE.BoxGeometry(0.55, 0.08, 0.55);
      const seatMat = new THREE.MeshStandardMaterial({ color: theme.accent, roughness: 0.6 });
      const seat = new THREE.Mesh(seatGeo, seatMat);
      seat.position.y = 0.48;
      seat.castShadow = true;
      chairGroup.add(seat);

      // Backrest
      const backGeo = new THREE.BoxGeometry(0.55, 0.5, 0.06);
      const back = new THREE.Mesh(backGeo, seatMat);
      back.position.set(0, 0.77, 0.24);
      back.castShadow = true;
      chairGroup.add(back);

      // Chair Legs
      for (let lx = -0.22; lx <= 0.22; lx += 0.44) {
        for (let lz = -0.22; lz <= 0.22; lz += 0.44) {
          const cLegGeo = new THREE.CylinderGeometry(0.025, 0.02, 0.48, 8);
          const cLeg = new THREE.Mesh(cLegGeo, charMats_black());
          cLeg.position.set(lx, 0.24, lz);
          cLeg.castShadow = true;
          chairGroup.add(cLeg);
        }
      }
      group.add(chairGroup);
    });
  });

  // 12. POTTED PLANTS & INDOOR DECORATIONS
  const plantPositions = [new THREE.Vector3(10.0, 0, -6.5), new THREE.Vector3(-1.0, 0, -6.5)];
  plantPositions.forEach((pPos) => {
    const potGeo = new THREE.CylinderGeometry(0.35, 0.25, 0.6, 16);
    const potMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.set(pPos.x, 0.3, pPos.z);
    pot.castShadow = true;
    group.add(pot);

    // Leaves
    for (let l = 0; l < 7; l++) {
      const angle = (l / 7) * Math.PI * 2;
      const leafGeo = new THREE.SphereGeometry(0.22, 8, 8);
      leafGeo.scale(0.5, 1.4, 0.3);
      const leaf = new THREE.Mesh(leafGeo, materials.basil());
      leaf.position.set(
        pPos.x + Math.cos(angle) * 0.18,
        0.8 + Math.sin(l) * 0.1,
        pPos.z + Math.sin(angle) * 0.18
      );
      leaf.rotation.set(0.4 * Math.cos(angle), angle, 0.4 * Math.sin(angle));
      group.add(leaf);
    }
  });

  const stations: Station3DPoints = {
    stoves: stovePositions,
    cuttingBoard: new THREE.Vector3(-4.4, 1.1, -2.5),
    oven: new THREE.Vector3(-8.8, 1.1, -2.5),
    drinkDispenser: new THREE.Vector3(-8.8, 1.1, 0.5),
    servingCounter: new THREE.Vector3(-1.0, 1.1, -0.5),
    refrigerator: new THREE.Vector3(-9.5, 1.1, -5.0),
    trashCan: new THREE.Vector3(-3.0, 0.7, -5.0),
    tables: tablePositions,
    chairs: chairPositions,
    entranceDoor: new THREE.Vector3(10.0, 0, 2.5),
  };

  return {
    group,
    entranceDoorMesh: doorPivot,
    ovenDoorMesh: ovenDoorPivot,
    ovenLight,
    stoveFlames,
    drinkStream,
    trashCanMesh: trashPivot,
    stations,
    fryingPans,
    updateAnimations: (time: number) => {
      // Subtle flame flicker
      stoveFlames.forEach((flame, idx) => {
        if (flame.visible) {
          flame.scale.y = 0.9 + Math.sin(time * 20 + idx) * 0.25;
        }
      });
    },
  };
}

function charMats_black() {
  return new THREE.MeshStandardMaterial({ color: 0x1f2421, roughness: 0.6 });
}
