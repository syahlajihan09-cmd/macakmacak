import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Chef, CookingSlot, Customer, FoodItem, PreparedFood } from '../types/game';
import { build3DRestaurant, Restaurant3DEnvironment } from '../three/restaurantScene';
import { create3DChef, create3DCustomer, ChefRig, CustomerRig } from '../three/characterModels';
import { createFoodMesh } from '../three/foodModels';
import { soundEngine } from '../services/soundEngine';

interface ThreeRestaurantCanvasProps {
  restaurantId: string;
  chef: Chef;
  customers: Customer[];
  cookingSlots: CookingSlot[];
  preparedFoods: PreparedFood[];
  availableFoods: FoodItem[];
  onStartCooking: (foodId: string) => void;
  onCollectCookedItem: (slotId: string) => void;
  onDiscardBurntItem: (slotId: string) => void;
  onServeCustomer: (foodId: string, customerId?: string) => void;
  onDiscardPreparedFood: (preparedId: string) => void;
}

export const ThreeRestaurantCanvas: React.FC<ThreeRestaurantCanvasProps> = ({
  restaurantId,
  chef,
  customers,
  cookingSlots,
  preparedFoods,
  availableFoods,
  onStartCooking,
  onCollectCookedItem,
  onDiscardBurntItem,
  onServeCustomer,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const restoEnvRef = useRef<Restaurant3DEnvironment | null>(null);
  const chefRigRef = useRef<ChefRig | null>(null);
  const customerRigsRef = useRef<Map<string, CustomerRig>>(new Map());
  const foodMeshesOnStovesRef = useRef<Map<string, THREE.Group>>(new Map());
  const preparedMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const customerFoodMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const steamParticlesRef = useRef<THREE.Points | null>(null);

  // Chef AI position & target interpolation
  const chefPosRef = useRef<THREE.Vector3>(new THREE.Vector3(-5.0, 0, -1.2));
  const chefTargetPosRef = useRef<THREE.Vector3>(new THREE.Vector3(-5.0, 0, -1.2));
  const chefActionStateRef = useRef<'idle' | 'walking' | 'cooking' | 'chopping' | 'serving'>('idle');

  // Interactive 3D Raycasting
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Customer order 2D screen positions projected from 3D customer heads
  const [projectedOrders, setProjectedOrders] = useState<
    Array<{
      customer: Customer;
      screenX: number;
      screenY: number;
      visible: boolean;
    }>
  >([]);

  // Door opening animation tracker
  const doorOpenTimeRef = useRef(0);

  // Setup Three.js scene & render loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x1a1c23);

    // 2. Camera (Wide Landscape Isometric / Elevated view)
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    camera.position.set(0, 11.2, 13.5);
    camera.lookAt(0.2, 1.0, -0.6);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing & soft shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambLight = new THREE.AmbientLight(0xffedd8, 0.75);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xfff5ea, 1.4);
    dirLight.position.set(8, 16, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 35;
    const d = 14;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0008;
    scene.add(dirLight);

    const windowLight = new THREE.DirectionalLight(0xa0c4ff, 0.45);
    windowLight.position.set(4.5, 6, -10);
    scene.add(windowLight);

    // 5. Build 3D Restaurant Environment
    const restoEnv = build3DRestaurant(restaurantId);
    restoEnvRef.current = restoEnv;
    scene.add(restoEnv.group);

    // 6. Build 3D Chef Character
    const chefRig = create3DChef(chef.id);
    chefRigRef.current = chefRig;
    chefRig.group.position.copy(chefPosRef.current);
    chefRig.group.rotation.y = 0;
    scene.add(chefRig.group);

    // 7. Steam Particles for Sizzling & Cooking
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = -6.5 + (Math.random() - 0.5) * 2;
      particlePositions[i + 1] = 1.2 + Math.random() * 1.5;
      particlePositions[i + 2] = -2.5 + (Math.random() - 0.5) * 1.2;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.12,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const steamPoints = new THREE.Points(particleGeo, particleMat);
    steamParticlesRef.current = steamPoints;
    scene.add(steamPoints);

    // Handle Resize
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 8. Main Animation Loop
    let animFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      restoEnv.updateAnimations(elapsedTime);

      // Interpolate Chef walking position
      const chefPos = chefPosRef.current;
      const targetPos = chefTargetPosRef.current;
      const dist = chefPos.distanceTo(targetPos);
      if (dist > 0.08) {
        chefPos.lerp(targetPos, delta * 6);
        chefRig.group.position.copy(chefPos);
        const dir = targetPos.clone().sub(chefPos).normalize();
        chefRig.group.rotation.y = Math.atan2(dir.x, dir.z);
        chefActionStateRef.current = 'walking';
      } else {
        chefPos.copy(targetPos);
        chefRig.group.position.copy(chefPos);
      }

      // Update Chef animations
      chefRig.updateAnimation(elapsedTime, chefActionStateRef.current);

      // Animate Entrance Door
      const isDoorInUse = Array.from(customerRigsRef.current.values()).some(
        (c: CustomerRig) => (c.state === 'entering' && c.walkProgress < 0.35) || (c.state === 'leaving' && c.walkProgress > 0.65)
      );
      if (isDoorInUse) {
        doorOpenTimeRef.current = Math.min(1, doorOpenTimeRef.current + delta * 3.5);
      } else {
        doorOpenTimeRef.current = Math.max(0, doorOpenTimeRef.current - delta * 3.0);
      }
      restoEnv.entranceDoorMesh.rotation.y = doorOpenTimeRef.current * (Math.PI / 2.2);

      // Update Customers in 3D
      customerRigsRef.current.forEach((rig) => {
        if (rig.state === 'entering') {
          rig.walkProgress = Math.min(1, rig.walkProgress + delta * 0.45);
          rig.group.position.lerpVectors(restoEnv.stations.entranceDoor, rig.chairPos, rig.walkProgress);
          const dir = rig.chairPos.clone().sub(restoEnv.stations.entranceDoor).normalize();
          rig.group.rotation.y = Math.atan2(dir.x, dir.z);

          if (rig.walkProgress >= 1) {
            rig.state = 'sitting';
            rig.group.position.copy(rig.chairPos);
            rig.group.rotation.y = Math.PI;
          }
        } else if (rig.state === 'leaving') {
          rig.walkProgress = Math.min(1, rig.walkProgress + delta * 0.55);
          rig.group.position.lerpVectors(rig.chairPos, restoEnv.stations.entranceDoor, rig.walkProgress);
          const dir = restoEnv.stations.entranceDoor.clone().sub(rig.chairPos).normalize();
          rig.group.rotation.y = Math.atan2(dir.x, dir.z);
        }

        const custData = customers.find((c) => c.id === rig.id);
        rig.updateAnimation(elapsedTime, custData ? custData.elapsedWaitTime : 0);
      });

      // Animate Steam particles
      if (steamParticlesRef.current) {
        const posAttr = steamParticlesRef.current.geometry.attributes.position;
        const arr = posAttr.array as Float32Array;
        for (let i = 1; i < arr.length; i += 3) {
          arr[i] += delta * 0.45;
          if (arr[i] > 3.0) {
            arr[i] = 1.2;
            arr[i - 1] = -7.5 + Math.random() * 3.5;
            arr[i + 1] = -2.5 + (Math.random() - 0.5) * 1.0;
          }
        }
        posAttr.needsUpdate = true;
      }

      // Render 3D Scene
      renderer.render(scene, camera);

      // Project Customer 3D head positions to 2D screen coordinates
      if (container) {
        const rect = container.getBoundingClientRect();
        const projected: typeof projectedOrders = [];

        customers.forEach((c) => {
          const rig = customerRigsRef.current.get(c.id);
          if (rig && !c.isLeaving && rig.state !== 'leaving') {
            const headPos = rig.group.position.clone();
            headPos.y += 1.85;
            headPos.project(camera);

            const x = ((headPos.x + 1) * rect.width) / 2;
            const y = ((-headPos.y + 1) * rect.height) / 2;

            projected.push({
              customer: c,
              screenX: x,
              screenY: y,
              visible: headPos.z < 1,
            });
          }
        });
        setProjectedOrders(projected);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [restaurantId, chef.id]);

  // Synchronize 3D Customers
  useEffect(() => {
    const scene = sceneRef.current;
    const restoEnv = restoEnvRef.current;
    if (!scene || !restoEnv) return;

    const currentMap = customerRigsRef.current;
    const activeIds = new Set(customers.map((c) => c.id));

    currentMap.forEach((rig, id) => {
      if (!activeIds.has(id)) {
        scene.remove(rig.group);
        currentMap.delete(id);
      }
    });

    customers.forEach((c) => {
      const chairPos = restoEnv.stations.chairs[c.seatIndex] || new THREE.Vector3(2.5, 0, -2.2);

      if (!currentMap.has(c.id)) {
        const archetype =
          c.personality === 'vip'
            ? 'vip'
            : c.personality === 'kid'
            ? 'child'
            : c.personality === 'family'
            ? 'elderly'
            : 'normal';

        const rig = create3DCustomer(c.id, archetype);
        rig.chairPos.copy(chairPos);
        rig.targetSeatPos.copy(chairPos);
        rig.group.position.copy(restoEnv.stations.entranceDoor);
        rig.state = 'entering';
        rig.walkProgress = 0;
        scene.add(rig.group);
        currentMap.set(c.id, rig);
      } else {
        const rig = currentMap.get(c.id)!;
        if (c.isLeaving && rig.state !== 'leaving') {
          rig.state = 'leaving';
          rig.walkProgress = 0;
        } else if (c.mood === 'served' && rig.state !== 'served') {
          rig.state = 'served';

          const tablePos = restoEnv.stations.tables[c.seatIndex];
          if (tablePos && c.orderItems.length > 0) {
            const foodId = c.orderItems[0].foodId;
            const foodMesh = createFoodMesh(foodId, false);
            foodMesh.position.set(tablePos.x, 0.95, tablePos.z);
            scene.add(foodMesh);
            customerFoodMeshesRef.current.set(c.id, foodMesh);
            soundEngine.playCoin();
          }
        }
      }
    });
  }, [customers]);

  // Synchronize 3D Stoves and Frying Pans
  useEffect(() => {
    const scene = sceneRef.current;
    const restoEnv = restoEnvRef.current;
    if (!scene || !restoEnv) return;

    cookingSlots.forEach((slot, idx) => {
      if (restoEnv.stoveFlames[idx]) {
        restoEnv.stoveFlames[idx].visible = slot.state === 'cooking' || slot.state === 'burning';
      }

      const existingMesh = foodMeshesOnStovesRef.current.get(slot.id);
      const foodId = slot.foodId || slot.targetFood?.id;

      if (foodId && (slot.state === 'cooking' || slot.state === 'ready' || slot.state === 'burning' || slot.state === 'burnt')) {
        if (!existingMesh) {
          const panPos = restoEnv.stations.stoves[idx];
          if (panPos) {
            const mesh = createFoodMesh(foodId, slot.state === 'burnt');
            mesh.position.set(panPos.x, panPos.y + 0.05, panPos.z);
            scene.add(mesh);
            foodMeshesOnStovesRef.current.set(slot.id, mesh);
          }
        } else {
          if (slot.state === 'burnt') {
            scene.remove(existingMesh);
            const panPos = restoEnv.stations.stoves[idx];
            if (panPos) {
              const mesh = createFoodMesh(foodId, true);
              mesh.position.set(panPos.x, panPos.y + 0.05, panPos.z);
              scene.add(mesh);
              foodMeshesOnStovesRef.current.set(slot.id, mesh);
            }
          }
        }
      } else {
        if (existingMesh) {
          scene.remove(existingMesh);
          foodMeshesOnStovesRef.current.delete(slot.id);
        }
      }
    });

    const activeSlotIdx = cookingSlots.findIndex((s) => s.state === 'cooking');
    if (activeSlotIdx !== -1) {
      const stovePos = restoEnv.stations.stoves[activeSlotIdx];
      if (stovePos) {
        chefTargetPosRef.current.set(stovePos.x, 0, stovePos.z + 1.2);
        chefActionStateRef.current = 'cooking';
      }
    } else {
      const burntIdx = cookingSlots.findIndex((s) => s.state === 'burning' || s.state === 'burnt');
      if (burntIdx !== -1) {
        const stovePos = restoEnv.stations.stoves[burntIdx];
        if (stovePos) {
          chefTargetPosRef.current.set(stovePos.x, 0, stovePos.z + 1.2);
          chefActionStateRef.current = 'cooking';
        }
      } else if (chefActionStateRef.current === 'cooking') {
        chefActionStateRef.current = 'idle';
      }
    }
  }, [cookingSlots]);

  // Synchronize Prepared Food on Serving Counter Trays
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    preparedMeshesRef.current.forEach((mesh) => scene.remove(mesh));
    preparedMeshesRef.current.clear();

    preparedFoods.forEach((pf, idx) => {
      if (idx < 3) {
        const mesh = createFoodMesh(pf.foodId, false);
        mesh.position.set(-1.0, 1.18, -2.0 + idx * 1.5);
        scene.add(mesh);
        preparedMeshesRef.current.set(pf.id, mesh);
      }
    });
  }, [preparedFoods]);

  // 3D Canvas Click Handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    const restoEnv = restoEnvRef.current;
    if (!container || !camera || !scene || !restoEnv) return;

    const rect = container.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, camera);
    const intersects = raycasterRef.current.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const hitPoint = intersects[0].point;

      // 1. Check if clicked near Stoves
      restoEnv.stations.stoves.forEach((sPos, idx) => {
        if (hitPoint.distanceTo(sPos) < 1.0) {
          const slot = cookingSlots[idx];
          if (slot) {
            if (slot.state === 'ready') {
              onCollectCookedItem(slot.id);
            } else if (slot.state === 'burnt') {
              onDiscardBurntItem(slot.id);
            } else if (slot.state === 'empty' && availableFoods.length > 0) {
              onStartCooking(availableFoods[0].id);
            }
          }
        }
      });

      // 2. Check if clicked near Cutting Board
      if (hitPoint.distanceTo(restoEnv.stations.cuttingBoard) < 1.0) {
        chefTargetPosRef.current.set(-4.4, 0, -1.3);
        chefActionStateRef.current = 'chopping';
        soundEngine.playChop();
      }

      // 3. Check if clicked near Drink Dispenser
      if (hitPoint.distanceTo(restoEnv.stations.drinkDispenser) < 1.0) {
        chefTargetPosRef.current.set(-7.6, 0, 0.5);
        soundEngine.playPour();
        const drink = availableFoods.find((f) => f.category === 'drink');
        if (drink) {
          onStartCooking(drink.id);
        }
      }

      // 4. Check if clicked near Serving Trays
      if (hitPoint.distanceTo(restoEnv.stations.servingCounter) < 2.5) {
        if (preparedFoods.length > 0) {
          onServeCustomer(preparedFoods[0].foodId);
        }
      }

      // 5. Check if clicked on a Customer Table
      restoEnv.stations.tables.forEach((tPos, seatIdx) => {
        if (hitPoint.distanceTo(tPos) < 1.4) {
          const customerAtTable = customers.find(
            (c) => c.seatIndex === seatIdx && !c.isLeaving && c.mood !== 'served'
          );
          if (customerAtTable && customerAtTable.orderItems.length > 0) {
            const requestedFoodId = customerAtTable.orderItems[0].foodId;
            const readyItem = preparedFoods.find((pf) => pf.foodId === requestedFoodId);
            if (readyItem) {
              onServeCustomer(readyItem.foodId, customerAtTable.id);
            } else {
              soundEngine.playDing();
            }
          }
        }
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleCanvasClick}
      className="relative w-full h-full cursor-pointer select-none overflow-hidden"
    >
      {/* 3D World-Space Projected Customer Order Bubbles */}
      {projectedOrders.map(({ customer, screenX, screenY, visible }) => {
        if (!visible || customer.isLeaving || customer.mood === 'served') return null;

        const maxWait = customer.maxWaitTime || 30;
        const progress = Math.max(0, 1 - customer.elapsedWaitTime / maxWait);
        const orderItem = customer.orderItems.find((it) => !it.isCompleted) || customer.orderItems[0];
        const food = availableFoods.find((f) => f.id === orderItem?.foodId);

        const ringColor =
          customer.elapsedWaitTime < 10
            ? '#10B981'
            : customer.elapsedWaitTime < 20
            ? '#F59E0B'
            : '#EF4444';

        const isReady = preparedFoods.some((pf) => pf.foodId === orderItem?.foodId);

        return (
          <div
            key={customer.id}
            style={{
              left: `${screenX}px`,
              top: `${screenY}px`,
              transform: 'translate(-50%, -100%)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (orderItem) {
                onServeCustomer(orderItem.foodId, customer.id);
              }
            }}
            className={`absolute z-30 transition-all pointer-events-auto cursor-pointer ${
              customer.elapsedWaitTime > 20 ? 'animate-bounce' : ''
            }`}
          >
            <div className="relative bg-[#FFFDF9] border-3 border-[#FF8A3D] rounded-2xl p-2 shadow-xl flex items-center gap-2 hover:scale-110 active:scale-95 transition-transform">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <svg className="w-9 h-9 -rotate-90">
                  <circle cx="18" cy="18" r="15" stroke="#E5E7EB" strokeWidth="3" fill="none" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    stroke={ringColor}
                    strokeWidth="3.5"
                    fill="none"
                    strokeDasharray={94}
                    strokeDashoffset={94 * (1 - progress)}
                    className="transition-all duration-200"
                  />
                </svg>
                <span className="absolute text-[10px] font-black text-[#3E2723]">
                  {Math.max(0, Math.ceil(maxWait - customer.elapsedWaitTime))}s
                </span>
              </div>

              <div className="flex flex-col">
                <div className="text-[10px] font-black uppercase text-[#785949] leading-tight">
                  {customer.name}
                </div>
                <div className="text-xs font-black text-[#3E2723] flex items-center gap-1">
                  <span>{food?.name || orderItem?.foodId}</span>
                </div>
              </div>

              {isReady && (
                <div className="bg-[#10B981] text-white text-[9px] font-black px-2 py-1 rounded-lg animate-pulse shadow-xs">
                  SAJIKAN!
                </div>
              )}

              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-[#FF8A3D]" />
            </div>
          </div>
        );
      })}

      {/* 3D Scene Controls Hint Badge */}
      <div className="absolute bottom-2 left-3 z-20 pointer-events-none bg-black/50 backdrop-blur-xs text-white/90 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-white/10 hidden sm:flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>3D Interaktif: Klik kompor, bahan, atau customer langsung di restoran!</span>
      </div>
    </div>
  );
};
