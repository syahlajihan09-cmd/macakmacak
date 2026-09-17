import * as THREE from 'three';

export interface ChefRig {
  group: THREE.Group;
  head: THREE.Group;
  hat: THREE.Mesh;
  body: THREE.Mesh;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  spatula: THREE.Group;
  knife: THREE.Group;
  plate: THREE.Group;
  updateAnimation: (time: number, state: 'idle' | 'walking' | 'cooking' | 'chopping' | 'serving') => void;
}

export interface CustomerRig {
  id: string;
  group: THREE.Group;
  head: THREE.Group;
  body: THREE.Mesh;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  archetype: 'normal' | 'vip' | 'child' | 'elderly';
  state: 'entering' | 'sitting' | 'waiting' | 'angry' | 'served' | 'leaving';
  walkProgress: number;
  targetSeatPos: THREE.Vector3;
  chairPos: THREE.Vector3;
  updateAnimation: (time: number, elapsedWaitTime: number) => void;
}

// Materials Cache
const charMats = {
  skin: new THREE.MeshStandardMaterial({ color: 0xfbd0b8, roughness: 0.6 }),
  skinDark: new THREE.MeshStandardMaterial({ color: 0xc68642, roughness: 0.6 }),
  chefJacket: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }),
  chefHat: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }),
  chefApron: new THREE.MeshStandardMaterial({ color: 0xd9534f, roughness: 0.5 }),
  chefScarf: new THREE.MeshStandardMaterial({ color: 0xd9534f, roughness: 0.5 }),
  pants: new THREE.MeshStandardMaterial({ color: 0x2b2d42, roughness: 0.7 }),
  shoes: new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.6 }),
  eyes: new THREE.MeshBasicMaterial({ color: 0x111111 }),
  mouth: new THREE.MeshBasicMaterial({ color: 0x8b0000 }),
  blush: new THREE.MeshBasicMaterial({ color: 0xff8b94 }),

  // Customer clothes
  vipSuit: new THREE.MeshStandardMaterial({ color: 0x1d2d44, roughness: 0.35, metalness: 0.1 }),
  vipGold: new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3, metalness: 0.7 }),
  childHoodie: new THREE.MeshStandardMaterial({ color: 0x06d6a0, roughness: 0.6 }),
  elderlySweater: new THREE.MeshStandardMaterial({ color: 0x8d99ae, roughness: 0.8 }),
  casualShirt: new THREE.MeshStandardMaterial({ color: 0xf77f00, roughness: 0.6 }),
  casualShirt2: new THREE.MeshStandardMaterial({ color: 0x4361ee, roughness: 0.6 }),
};

/**
 * Creates 3D Stylized Chef character
 */
export function create3DChef(chefId = 'chef-arief'): ChefRig {
  const group = new THREE.Group();

  // Root Body Group
  const bodyGeo = new THREE.CylinderGeometry(0.22, 0.2, 0.55, 16);
  const body = new THREE.Mesh(bodyGeo, charMats.chefJacket);
  body.position.y = 0.75;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Red Apron on Body
  const apronGeo = new THREE.CylinderGeometry(0.225, 0.205, 0.42, 16, 1, false, 0, Math.PI);
  const apron = new THREE.Mesh(apronGeo, charMats.chefApron);
  apron.position.y = 0.7;
  apron.rotation.y = -Math.PI / 2;
  apron.castShadow = true;
  group.add(apron);

  // Neckerchief
  const scarfGeo = new THREE.TorusGeometry(0.14, 0.035, 8, 16);
  const scarf = new THREE.Mesh(scarfGeo, charMats.chefScarf);
  scarf.position.y = 1.02;
  scarf.rotation.x = Math.PI / 2;
  group.add(scarf);

  // Head
  const headGroup = new THREE.Group();
  headGroup.position.y = 1.25;

  const headGeo = new THREE.SphereGeometry(0.2, 18, 16);
  headGeo.scale(1, 1.05, 0.95);
  const headMesh = new THREE.Mesh(headGeo, charMats.skin);
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.024, 8, 8);
  const leftEye = new THREE.Mesh(eyeGeo, charMats.eyes);
  leftEye.position.set(-0.065, 0.02, 0.17);
  headGroup.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, charMats.eyes);
  rightEye.position.set(0.065, 0.02, 0.17);
  headGroup.add(rightEye);

  // Cheerful smile
  const mouthGeo = new THREE.TorusGeometry(0.035, 0.008, 6, 12, Math.PI);
  const mouth = new THREE.Mesh(mouthGeo, charMats.mouth);
  mouth.position.set(0, -0.06, 0.185);
  mouth.rotation.x = Math.PI * 0.1;
  mouth.rotation.z = Math.PI;
  headGroup.add(mouth);

  // Rosy cheeks
  const cheekGeo = new THREE.SphereGeometry(0.025, 6, 6);
  const leftCheek = new THREE.Mesh(cheekGeo, charMats.blush);
  leftCheek.position.set(-0.11, -0.03, 0.15);
  headGroup.add(leftCheek);
  const rightCheek = new THREE.Mesh(cheekGeo, charMats.blush);
  rightCheek.position.set(0.11, -0.03, 0.15);
  headGroup.add(rightCheek);

  // Tall Chef Hat (Toque)
  const hatGroup = new THREE.Group();
  const hatBaseGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.1, 16);
  const hatBase = new THREE.Mesh(hatBaseGeo, charMats.chefHat);
  hatBase.position.y = 0.18;
  hatGroup.add(hatBase);

  const hatDomeGeo = new THREE.SphereGeometry(0.24, 16, 14);
  hatDomeGeo.scale(1.15, 1.4, 1.15);
  const hatDome = new THREE.Mesh(hatDomeGeo, charMats.chefHat);
  hatDome.position.y = 0.38;
  hatDome.castShadow = true;
  hatGroup.add(hatDome);

  headGroup.add(hatGroup);
  group.add(headGroup);

  // Left Arm
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.28, 0.95, 0);
  const armGeo = new THREE.CylinderGeometry(0.06, 0.055, 0.35, 12);
  const leftArmMesh = new THREE.Mesh(armGeo, charMats.chefJacket);
  leftArmMesh.position.y = -0.16;
  leftArmMesh.castShadow = true;
  leftArm.add(leftArmMesh);
  const leftHandGeo = new THREE.SphereGeometry(0.055, 10, 8);
  const leftHand = new THREE.Mesh(leftHandGeo, charMats.skin);
  leftHand.position.y = -0.34;
  leftArm.add(leftHand);
  group.add(leftArm);

  // Right Arm
  const rightArm = new THREE.Group();
  rightArm.position.set(0.28, 0.95, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, charMats.chefJacket);
  rightArmMesh.position.y = -0.16;
  rightArmMesh.castShadow = true;
  rightArm.add(rightArmMesh);
  const rightHand = new THREE.Mesh(leftHandGeo, charMats.skin);
  rightHand.position.y = -0.34;
  rightArm.add(rightHand);
  group.add(rightArm);

  // Spatula in Right Hand
  const spatula = new THREE.Group();
  const spatHandle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.32, 8),
    charMats.shoes
  );
  spatHandle.position.y = -0.15;
  spatula.add(spatHandle);
  const spatHead = new THREE.Mesh(
    new THREE.BoxGeometry(0.07, 0.1, 0.012),
    charMats.chefHat
  );
  spatHead.position.y = -0.32;
  spatula.add(spatHead);
  spatula.visible = true;
  rightHand.add(spatula);

  // Knife in Left Hand (initially hidden)
  const knife = new THREE.Group();
  const knifeHandle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.16, 8),
    charMats.shoes
  );
  knife.add(knifeHandle);
  const knifeBlade = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.22, 0.008),
    charMats.chefHat
  );
  knifeBlade.position.y = -0.16;
  knife.add(knifeBlade);
  knife.visible = false;
  leftHand.add(knife);

  // Serving Plate in hands
  const plate = new THREE.Group();
  const plateMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.2, 0.03, 16),
    charMats.chefHat
  );
  plate.add(plateMesh);
  plate.position.set(0, -0.3, 0.25);
  plate.visible = false;
  body.add(plate);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.075, 0.07, 0.45, 12);
  const shoeGeo = new THREE.BoxGeometry(0.12, 0.1, 0.18);

  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.11, 0.45, 0);
  const leftLegMesh = new THREE.Mesh(legGeo, charMats.pants);
  leftLegMesh.position.y = -0.22;
  leftLegMesh.castShadow = true;
  leftLeg.add(leftLegMesh);
  const leftShoe = new THREE.Mesh(shoeGeo, charMats.shoes);
  leftShoe.position.set(0, -0.45, 0.03);
  leftLeg.add(leftShoe);
  group.add(leftLeg);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.11, 0.45, 0);
  const rightLegMesh = new THREE.Mesh(legGeo, charMats.pants);
  rightLegMesh.position.y = -0.22;
  rightLegMesh.castShadow = true;
  rightLeg.add(rightLegMesh);
  const rightShoe = new THREE.Mesh(shoeGeo, charMats.shoes);
  rightShoe.position.set(0, -0.45, 0.03);
  rightLeg.add(rightShoe);
  group.add(rightLeg);

  const rig: ChefRig = {
    group,
    head: headGroup,
    hat: hatDome,
    body,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    spatula,
    knife,
    plate,
    updateAnimation: (time: number, state: string) => {
      // Idle breathing
      const breath = Math.sin(time * 3) * 0.015;
      body.position.y = 0.75 + breath;
      headGroup.position.y = 1.25 + breath * 1.2;

      if (state === 'walking') {
        // Leg walk cycle
        leftLeg.rotation.x = Math.sin(time * 8) * 0.55;
        rightLeg.rotation.x = -Math.sin(time * 8) * 0.55;
        leftArm.rotation.x = -Math.sin(time * 8) * 0.45;
        rightArm.rotation.x = Math.sin(time * 8) * 0.45;
        spatula.visible = true;
        knife.visible = false;
        plate.visible = false;
      } else if (state === 'cooking') {
        // Flipping spatula rhythm
        leftLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;
        rightArm.rotation.x = -Math.PI / 3 + Math.sin(time * 12) * 0.25;
        rightArm.rotation.z = -0.2;
        leftArm.rotation.x = -Math.PI / 4;
        spatula.visible = true;
        knife.visible = false;
        plate.visible = false;
      } else if (state === 'chopping') {
        // Chopping knife rhythm
        leftLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;
        leftArm.rotation.x = -Math.PI / 3.5 + Math.sin(time * 16) * 0.3;
        rightArm.rotation.x = -Math.PI / 4;
        spatula.visible = false;
        knife.visible = true;
        plate.visible = false;
      } else if (state === 'serving') {
        // Holding plate
        leftLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;
        leftArm.rotation.x = -Math.PI / 2.8;
        rightArm.rotation.x = -Math.PI / 2.8;
        spatula.visible = false;
        knife.visible = false;
        plate.visible = true;
      } else {
        // Default idle
        leftLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;
        leftArm.rotation.x = Math.sin(time * 2) * 0.08;
        rightArm.rotation.x = Math.cos(time * 2) * 0.08;
        spatula.visible = true;
        knife.visible = false;
        plate.visible = false;
      }
    },
  };

  return rig;
}

/**
 * Creates 3D Customer character with seating, walking, and dynamic moods
 */
export function create3DCustomer(
  id: string,
  archetype: 'normal' | 'vip' | 'child' | 'elderly' = 'normal'
): CustomerRig {
  const group = new THREE.Group();

  let shirtMat = charMats.casualShirt;
  let headScale = 1;
  let bodyHeight = 0.52;

  if (archetype === 'vip') {
    shirtMat = charMats.vipSuit;
  } else if (archetype === 'child') {
    shirtMat = charMats.childHoodie;
    headScale = 0.88;
    bodyHeight = 0.42;
  } else if (archetype === 'elderly') {
    shirtMat = charMats.elderlySweater;
  }

  // Torso
  const bodyGeo = new THREE.CylinderGeometry(0.2, 0.18, bodyHeight, 14);
  const body = new THREE.Mesh(bodyGeo, shirtMat);
  body.position.y = 0.7;
  body.castShadow = true;
  group.add(body);

  if (archetype === 'vip') {
    // Gold bowtie
    const bowGeo = new THREE.BoxGeometry(0.08, 0.035, 0.02);
    const bow = new THREE.Mesh(bowGeo, charMats.vipGold);
    bow.position.set(0, 0.22, 0.18);
    body.add(bow);
  }

  // Head
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.7 + bodyHeight / 2 + 0.22 * headScale;

  const headGeo = new THREE.SphereGeometry(0.18 * headScale, 16, 14);
  const headMesh = new THREE.Mesh(headGeo, charMats.skin);
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Hair
  const hairGeo = new THREE.SphereGeometry(0.19 * headScale, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const hairMat =
    archetype === 'elderly'
      ? charMats.elderlySweater
      : archetype === 'vip'
      ? charMats.shoes
      : charMats.chefApron;
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.y = 0.02;
  headGroup.add(hair);

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.02, 8, 8);
  const leftEye = new THREE.Mesh(eyeGeo, charMats.eyes);
  leftEye.position.set(-0.06 * headScale, 0.02, 0.15 * headScale);
  headGroup.add(leftEye);
  const rightEye = new THREE.Mesh(eyeGeo, charMats.eyes);
  rightEye.position.set(0.06 * headScale, 0.02, 0.15 * headScale);
  headGroup.add(rightEye);

  group.add(headGroup);

  // Arms
  const armGeo = new THREE.CylinderGeometry(0.05, 0.045, 0.3, 10);
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.25, 0.85, 0);
  const leftArmMesh = new THREE.Mesh(armGeo, shirtMat);
  leftArmMesh.position.y = -0.15;
  leftArmMesh.castShadow = true;
  leftArm.add(leftArmMesh);
  group.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.25, 0.85, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, shirtMat);
  rightArmMesh.position.y = -0.15;
  rightArmMesh.castShadow = true;
  rightArm.add(rightArmMesh);
  group.add(rightArm);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.065, 0.06, 0.4, 10);
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.1, 0.4, 0);
  const leftLegMesh = new THREE.Mesh(legGeo, charMats.pants);
  leftLegMesh.position.y = -0.2;
  leftLegMesh.castShadow = true;
  leftLeg.add(leftLegMesh);
  group.add(leftLeg);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.1, 0.4, 0);
  const rightLegMesh = new THREE.Mesh(legGeo, charMats.pants);
  rightLegMesh.position.y = -0.2;
  rightLegMesh.castShadow = true;
  rightLeg.add(rightLegMesh);
  group.add(rightLeg);

  const rig: CustomerRig = {
    id,
    group,
    head: headGroup,
    body,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    archetype,
    state: 'entering',
    walkProgress: 0,
    targetSeatPos: new THREE.Vector3(),
    chairPos: new THREE.Vector3(),
    updateAnimation: (time: number, waitTime: number) => {
      if (rig.state === 'entering') {
        // Walking in towards table
        leftLeg.rotation.x = Math.sin(time * 9) * 0.5;
        rightLeg.rotation.x = -Math.sin(time * 9) * 0.5;
        leftArm.rotation.x = -Math.sin(time * 9) * 0.4;
        rightArm.rotation.x = Math.sin(time * 9) * 0.4;
        body.position.y = 0.7 + Math.abs(Math.sin(time * 9)) * 0.04;
      } else if (rig.state === 'leaving') {
        // Walking out fast
        leftLeg.rotation.x = Math.sin(time * 12) * 0.6;
        rightLeg.rotation.x = -Math.sin(time * 12) * 0.6;
        leftArm.rotation.x = -Math.sin(time * 12) * 0.5;
        rightArm.rotation.x = Math.sin(time * 12) * 0.5;
        body.position.y = 0.7 + Math.abs(Math.sin(time * 12)) * 0.05;
      } else if (rig.state === 'served') {
        // Happy eating
        leftLeg.rotation.x = -Math.PI / 2;
        rightLeg.rotation.x = -Math.PI / 2;
        body.position.y = 0.48 + Math.sin(time * 6) * 0.02;
        headGroup.rotation.x = Math.sin(time * 6) * 0.12;
        rightArm.rotation.x = -Math.PI / 2.5 + Math.sin(time * 8) * 0.2;
        leftArm.rotation.x = -Math.PI / 3;
      } else {
        // Sitting on chair: legs bent 90 degrees
        leftLeg.rotation.x = -Math.PI / 2;
        rightLeg.rotation.x = -Math.PI / 2;
        body.position.y = 0.48;

        if (waitTime < 10) {
          // 0-10s: Relaxed, gentle sway
          headGroup.rotation.y = Math.sin(time * 1.5) * 0.2;
          headGroup.rotation.z = Math.sin(time * 0.8) * 0.05;
          leftArm.rotation.x = -Math.PI / 3.5;
          rightArm.rotation.x = -Math.PI / 3.5;
        } else if (waitTime < 20) {
          // 10-20s: Looking at watch, tapping table
          headGroup.rotation.y = 0.3;
          headGroup.rotation.x = 0.2;
          // Look at left wrist
          leftArm.rotation.x = -Math.PI / 2.2;
          leftArm.rotation.z = 0.3;
          // Tap right hand on table
          rightArm.rotation.x = -Math.PI / 3 + Math.sin(time * 10) * 0.12;
        } else {
          // 20-30s: Angry impatient shaking
          headGroup.rotation.y = Math.sin(time * 10) * 0.15;
          leftArm.rotation.x = -Math.PI / 2.4 + Math.sin(time * 12) * 0.15;
          rightArm.rotation.x = -Math.PI / 2.4 + Math.cos(time * 12) * 0.15;
          body.position.y = 0.48 + Math.abs(Math.sin(time * 8)) * 0.03;
        }
      }
    },
  };

  return rig;
}
