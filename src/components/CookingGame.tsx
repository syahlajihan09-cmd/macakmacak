import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Chef,
  CookingSlot,
  Customer,
  CustomerPersonalityType,
  FoodItem,
  GameStats,
  KitchenUpgrades,
  LevelConfig,
  OrderItem,
  PreparedFood,
  Restaurant,
} from '../types/game';
import { ALL_FOOD_ITEMS, CUSTOMER_NAMES, CUSTOMER_PERSONALITIES } from '../data/gameData';
import { soundEngine } from '../services/soundEngine';
import { GameHUD } from './GameHUD';
import { CustomerCard } from './CustomerCard';
import { KitchenStation } from './KitchenStation';
import { ThreeRestaurantCanvas } from './ThreeRestaurantCanvas';
import { KitchenActionDock } from './KitchenActionDock';
import { PauseModal } from './PauseModal';
import { GameOverModal } from './GameOverModal';
import { LevelCompleteModal } from './LevelCompleteModal';
import { SettingsModal } from './SettingsModal';
import { ChefAvatar } from './ChefAvatar';
import { motion, AnimatePresence } from 'motion/react';

interface CookingGameProps {
  restaurant: Restaurant;
  levelConfig: LevelConfig;
  chef: Chef;
  upgrades: KitchenUpgrades;
  totalCoins: number;
  isMuted: boolean;
  sfxVolume: number;
  musicVolume: number;
  onUpdateCoins: (newTotal: number) => void;
  onCompleteLevel: (starsEarned: number, coinsEarned: number) => void;
  onToggleMute: (muted: boolean) => void;
  onChangeSfxVolume: (vol: number) => void;
  onChangeMusicVolume: (vol: number) => void;
  onExitToMenu: () => void;
  onNextLevel: () => void;
  onRestartLevel: () => void;
}

export const CookingGame: React.FC<CookingGameProps> = ({
  restaurant,
  levelConfig,
  chef,
  upgrades,
  totalCoins,
  isMuted,
  sfxVolume,
  musicVolume,
  onUpdateCoins,
  onCompleteLevel,
  onToggleMute,
  onChangeSfxVolume,
  onChangeMusicVolume,
  onExitToMenu,
  onNextLevel,
  onRestartLevel,
}) => {
  // Allowed foods for this level
  const allowedFoods = levelConfig.allowedMenuIds
    .map((id) => ALL_FOOD_ITEMS[id])
    .filter(Boolean) as FoodItem[];

  // Game state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersServed, setCustomersServed] = useState<number>(0);
  const [customersLost, setCustomersLost] = useState<number>(0);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [comboCount, setComboCount] = useState<number>(0);
  const [highestCombo, setHighestCombo] = useState<number>(0);
  const [dishesMadeCount, setDishesMadeCount] = useState<number>(0);
  const [burntDishesCount, setBurntDishesCount] = useState<number>(0);
  const [playTimeSeconds, setPlayTimeSeconds] = useState<number>(0);

  // Floating text notices (e.g. "PERFECT!", "FAST SERVICE!", "COMBO x2")
  const [floatingTexts, setFloatingTexts] = useState<{ id: string; text: string; color: string }[]>([]);

  // Modals
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [starsEarned, setStarsEarned] = useState<number>(1);

  // Cooking Slots initialization based on upgrades
  const initialSlots = useRef<CookingSlot[]>([
    { id: 'pan-1', type: 'pan', foodId: null, state: 'empty', progress: 0, timeInState: 0 },
    { id: 'pan-2', type: 'pan', foodId: null, state: 'empty', progress: 0, timeInState: 0 },
    ...(upgrades.stoveCount >= 3
      ? [{ id: 'pan-3', type: 'pan', foodId: null, state: 'empty', progress: 0, timeInState: 0 } as CookingSlot]
      : []),
    ...(upgrades.stoveCount >= 4
      ? [{ id: 'pan-4', type: 'pan', foodId: null, state: 'empty', progress: 0, timeInState: 0 } as CookingSlot]
      : []),
    { id: 'oven-1', type: 'oven', foodId: null, state: 'empty', progress: 0, timeInState: 0 },
    { id: 'drink-1', type: 'drink', foodId: null, state: 'empty', progress: 0, timeInState: 0 },
  ]);

  const [cookingSlots, setCookingSlots] = useState<CookingSlot[]>(initialSlots.current);
  const [preparedFoods, setPreparedFoods] = useState<PreparedFood[]>([]);

  // Seat capacity
  const MAX_SEATS = 4;

  // Add floating banner
  const addFloatingText = useCallback((text: string, color: string = 'text-amber-300') => {
    const id = `${Date.now()}_${Math.random()}`;
    setFloatingTexts((prev) => [...prev, { id, text, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  }, []);

  // Customer Spawner
  const spawnCustomer = useCallback(() => {
    setCustomers((prevCustomers) => {
      // Don't spawn if counter seats are full
      const activeCustomers = prevCustomers.filter((c) => !c.isLeaving && c.mood !== 'served');
      if (activeCustomers.length >= MAX_SEATS) {
        return prevCustomers;
      }

      // Find lowest unoccupied seat index (0 to 3)
      const occupiedSeats = new Set(activeCustomers.map((c) => c.seatIndex));
      let availableSeat = 0;
      for (let i = 0; i < MAX_SEATS; i++) {
        if (!occupiedSeats.has(i)) {
          availableSeat = i;
          break;
        }
      }

      // Random personality
      const randomPersonality =
        CUSTOMER_PERSONALITIES[Math.floor(Math.random() * CUSTOMER_PERSONALITIES.length)];
      const randomName = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];

      // Determine order count (1, 2, or 3 items based on level & personality)
      let itemCount = 1;
      if (randomPersonality.type === 'family' || levelConfig.levelNumber >= 4) {
        itemCount = Math.random() > 0.5 ? 2 : (levelConfig.levelNumber >= 6 && Math.random() > 0.7 ? 3 : 1);
      } else if (randomPersonality.type === 'foodie') {
        itemCount = Math.random() > 0.4 ? 2 : 1;
      }

      // Select random allowed items
      const orderItems: OrderItem[] = [];
      let totalBill = 0;
      for (let i = 0; i < itemCount; i++) {
        const item = allowedFoods[Math.floor(Math.random() * allowedFoods.length)];
        orderItems.push({
          id: `order_${Date.now()}_${i}`,
          foodId: item.id,
          name: item.name,
          icon: item.icon,
          isCompleted: false,
        });
        totalBill += item.price;
      }

      // Apply VIP / Personality and Chef modifiers
      totalBill = Math.round(totalBill * randomPersonality.tipMultiplier * chef.coinMultiplier);
      const maxWaitTime = randomPersonality.baseWaitTime + chef.patienceBonus;

      soundEngine.playDoorbell();

      const newCustomer: Customer = {
        id: `cust_${Date.now()}_${Math.random()}`,
        name: randomName,
        avatarSeed: Math.floor(Math.random() * 100),
        personality: randomPersonality.type,
        orderItems,
        maxWaitTime,
        elapsedWaitTime: 0,
        mood: 'happy',
        seatIndex: availableSeat,
        totalBill,
        isLeaving: false,
        satisfactionStars: 3,
      };

      return [...prevCustomers, newCustomer];
    });
  }, [allowedFoods, chef.coinMultiplier, chef.patienceBonus, levelConfig.levelNumber]);

  // Main game tick (runs every 200ms for smooth cooking progress and customer wait timer)
  useEffect(() => {
    if (isPaused || isGameOver || isLevelComplete) return;

    const interval = setInterval(() => {
      setPlayTimeSeconds((prev) => prev + 0.2);

      // 1. Update Cooking Slots
      setCookingSlots((prevSlots) =>
        prevSlots.map((slot) => {
          if (slot.state === 'empty' || !slot.targetFood) return slot;

          const food = slot.targetFood;
          const dt = 0.2;
          const nextTimeInState = slot.timeInState + dt;

          if (slot.state === 'cooking') {
            // Speed calculation with chef perk & kitchen upgrades
            let speedFactor = 1.0 * chef.speedMultiplier;
            if (slot.type === 'pan' || slot.type === 'pot') {
              speedFactor *= 1 + (upgrades.stoveSpeedLevel - 1) * 0.2;
            } else if (slot.type === 'oven') {
              speedFactor *= 1 + (upgrades.ovenSpeedLevel - 1) * 0.2;
            } else if (slot.type === 'drink') {
              speedFactor *= 1 + (upgrades.drinkSpeedLevel - 1) * 0.25;
            }

            const totalCookDuration = food.cookTime / speedFactor;
            const nextProgress = Math.min(100, (nextTimeInState / totalCookDuration) * 100);

            if (nextProgress >= 100) {
              soundEngine.playDing();
              return {
                ...slot,
                state: 'ready',
                progress: 100,
                timeInState: 0,
              };
            }

            return {
              ...slot,
              progress: nextProgress,
              timeInState: nextTimeInState,
            };
          }

          if (slot.state === 'ready') {
            // Check burning grace period
            const burnToleranceSeconds = food.burnTime * chef.burnToleranceMultiplier;
            if (food.stationType !== 'drink' && nextTimeInState >= burnToleranceSeconds * 0.6) {
              // Warning phase: smoke and burn alarm
              if (upgrades.burnAlarm) {
                soundEngine.playBurnAlarm();
              }
              return {
                ...slot,
                state: 'burning',
                timeInState: nextTimeInState,
              };
            }

            return {
              ...slot,
              timeInState: nextTimeInState,
            };
          }

          if (slot.state === 'burning') {
            const burnToleranceSeconds = food.burnTime * chef.burnToleranceMultiplier;
            if (nextTimeInState >= burnToleranceSeconds) {
              // Becomes completely burnt!
              soundEngine.playFoodBurnt();
              setBurntDishesCount((c) => c + 1);
              return {
                ...slot,
                state: 'burnt',
                timeInState: nextTimeInState,
              };
            }
            return {
              ...slot,
              timeInState: nextTimeInState,
            };
          }

          return slot;
        })
      );

      // 2. Update Customers Wait Times & Mood Transitions
      setCustomers((prevCustomers) => {
        const updated: Customer[] = [];
        let newlyLostCount = 0;

        for (const cust of prevCustomers) {
          if (cust.isLeaving || cust.mood === 'served') {
            updated.push(cust);
            continue;
          }

          const nextWait = cust.elapsedWaitTime + 0.2;

          // Check if customer exceeded max wait time (>30s)
          if (nextWait >= cust.maxWaitTime) {
            soundEngine.playCustomerLost();
            newlyLostCount++;
            updated.push({
              ...cust,
              elapsedWaitTime: nextWait,
              mood: 'leaving',
              isLeaving: true,
            });
            continue;
          }

          // Urgent sound cue when crossing 20 seconds
          if (cust.elapsedWaitTime < 20 && nextWait >= 20) {
            soundEngine.playUrgentTick();
          }

          let mood = cust.mood;
          if (nextWait > 20) {
            mood = 'angry';
          } else if (nextWait > 10) {
            mood = 'bored';
          } else {
            mood = 'happy';
          }

          updated.push({
            ...cust,
            elapsedWaitTime: nextWait,
            mood,
          });
        }

        if (newlyLostCount > 0) {
          setCustomersLost((prevLost) => {
            const newTotalLost = prevLost + newlyLostCount;
            // Reset combo on lost customer
            setComboCount(0);
            addFloatingText('Customer Kabur!', 'text-rose-400');

            // Strictly check GAME OVER: max 5 allowed, 6th loses!
            if (newTotalLost > levelConfig.maxLostAllowed) {
              soundEngine.playGameOver();
              setIsGameOver(true);
            }
            return newTotalLost;
          });
        }

        return updated;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [
    isPaused,
    isGameOver,
    isLevelComplete,
    chef,
    upgrades,
    levelConfig.maxLostAllowed,
    addFloatingText,
  ]);

  // Periodic customer arrival interval
  useEffect(() => {
    if (isPaused || isGameOver || isLevelComplete) return;

    // Initial first customer spawn immediately if none
    if (customers.length === 0) {
      spawnCustomer();
    }

    const interval = setInterval(() => {
      spawnCustomer();
    }, levelConfig.spawnIntervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [isPaused, isGameOver, isLevelComplete, levelConfig.spawnIntervalSeconds, spawnCustomer, customers.length]);

  // Clean up departed customers from memory after animation
  useEffect(() => {
    const timer = setInterval(() => {
      setCustomers((prev) => prev.filter((c) => !c.isLeaving || c.elapsedWaitTime < c.maxWaitTime + 1.5));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check Level Complete Goal
  useEffect(() => {
    if (isGameOver || isLevelComplete) return;

    if (customersServed >= levelConfig.targetCustomers) {
      soundEngine.playLevelWon();
      setIsLevelComplete(true);

      // Star calculation
      let calculatedStars = 1;
      if (customersLost === 0 && coinsEarned >= levelConfig.starScores[2]) {
        calculatedStars = 3;
      } else if (customersLost <= 2 && coinsEarned >= levelConfig.starScores[1]) {
        calculatedStars = 2;
      } else {
        calculatedStars = 1;
      }

      setStarsEarned(calculatedStars);
      onCompleteLevel(calculatedStars, coinsEarned);
    }
  }, [customersServed, levelConfig, isGameOver, isLevelComplete, customersLost, coinsEarned, onCompleteLevel]);

  // Kitchen Actions:
  // 1. Start Cooking on a Slot
  const handleStartCooking = (slotId: string, food: FoodItem) => {
    setCookingSlots((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId && slot.state === 'empty') {
          if (slot.type === 'pan' || slot.type === 'pot') {
            soundEngine.playSizzle();
          } else {
            soundEngine.playChop();
          }
          return {
            ...slot,
            foodId: food.id,
            targetFood: food,
            state: 'cooking',
            progress: 0,
            timeInState: 0,
          };
        }
        return slot;
      })
    );
  };

  // 2. Collect Cooked Item from Station into Prepared Food Serving Tray
  const handleCollectCookedItem = (slotId: string) => {
    const slot = cookingSlots.find((s) => s.id === slotId);
    if (!slot || !slot.targetFood || (slot.state !== 'ready' && slot.state !== 'burning')) return;

    const food = slot.targetFood;

    // Check if any active customer directly needs this food right now!
    const matchingCustomer = customers
      .filter((c) => !c.isLeaving && c.mood !== 'served')
      .sort((a, b) => b.elapsedWaitTime - a.elapsedWaitTime) // prioritize most urgent/angry customer first!
      .find((c) => c.orderItems.some((item) => item.foodId === food.id && !item.isCompleted));

    if (matchingCustomer) {
      // Direct serve!
      serveItemToCustomer(matchingCustomer.id, food.id);
    } else {
      // Move to Prepared Food Tray if space available
      if (preparedFoods.length >= 6) {
        addFloatingText('Meja Saji Penuh!', 'text-rose-400');
        return;
      }

      soundEngine.playDing();
      setDishesMadeCount((c) => c + 1);
      setPreparedFoods((prev) => [
        ...prev,
        {
          id: `prep_${Date.now()}_${Math.random()}`,
          foodId: food.id,
          name: food.name,
          icon: food.icon,
          createdAt: Date.now(),
        },
      ]);
    }

    // Reset slot
    setCookingSlots((prev) =>
      prev.map((s) =>
        s.id === slotId ? { ...s, foodId: null, targetFood: undefined, state: 'empty', progress: 0, timeInState: 0 } : s
      )
    );
  };

  // 3. Discard Burnt Food
  const handleDiscardBurntItem = (slotId: string) => {
    soundEngine.playTrash();
    addFloatingText('Dibuang ke Tong Sampah', 'text-stone-400');
    setCookingSlots((prev) =>
      prev.map((s) =>
        s.id === slotId ? { ...s, foodId: null, targetFood: undefined, state: 'empty', progress: 0, timeInState: 0 } : s
      )
    );
  };

  // 4. Serve Prepared Food from Tray
  const handleServePreparedFood = (prepFoodId: string) => {
    const prepFood = preparedFoods.find((p) => p.id === prepFoodId);
    if (!prepFood) return;

    // Find customer needing this food (prioritizing the most angry/urgent first!)
    const targetCustomer = customers
      .filter((c) => !c.isLeaving && c.mood !== 'served')
      .sort((a, b) => b.elapsedWaitTime - a.elapsedWaitTime)
      .find((c) => c.orderItems.some((item) => item.foodId === prepFood.foodId && !item.isCompleted));

    if (targetCustomer) {
      setPreparedFoods((prev) => prev.filter((p) => p.id !== prepFoodId));
      serveItemToCustomer(targetCustomer.id, prepFood.foodId);
    } else {
      addFloatingText('Tidak ada pesanan menu ini!', 'text-amber-300');
      soundEngine.playUrgentTick();
    }
  };

  // 5. Discard from prepared tray
  const handleDiscardPreparedFood = (prepFoodId: string) => {
    soundEngine.playTrash();
    setPreparedFoods((prev) => prev.filter((p) => p.id !== prepFoodId));
  };

  // Helper: Serve customer from 3D scene click or floating bubble click
  const handleServeCustomer = (foodId: string, customerId?: string) => {
    const readyItem = preparedFoods.find((pf) => pf.foodId === foodId);
    if (readyItem) {
      handleServePreparedFood(readyItem.id);
    } else {
      if (customerId) {
        soundEngine.playDing();
        addFloatingText('Masak makanan ini dulu!', 'text-amber-300');
      }
    }
  };

  // Helper: Deliver food item to customer and check order completion
  const serveItemToCustomer = (customerId: string, foodId: string) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((cust) => {
        if (cust.id !== customerId) return cust;

        let completedOne = false;
        const updatedOrderItems = cust.orderItems.map((item) => {
          if (!completedOne && item.foodId === foodId && !item.isCompleted) {
            completedOne = true;
            return { ...item, isCompleted: true };
          }
          return item;
        });

        // Check if all items in order are completed!
        const allDone = updatedOrderItems.every((it) => it.isCompleted);

        if (allDone) {
          // Customer successfully satisfied!
          soundEngine.playOrderServed();
          soundEngine.playCoin();

          const newCombo = comboCount + 1;
          setComboCount(newCombo);
          setHighestCombo((h) => Math.max(h, newCombo));

          // Combo multiplier
          let multiplier = 1;
          if (newCombo >= 10) multiplier = 5;
          else if (newCombo >= 5) multiplier = 3;
          else if (newCombo >= 3) multiplier = 2;

          if (newCombo >= 3) {
            soundEngine.playCombo(multiplier);
            addFloatingText(`COMBO x${multiplier}!`, 'text-orange-400');
          } else if (cust.elapsedWaitTime <= 10) {
            addFloatingText('PERFECT! CEPAT!', 'text-emerald-400');
          } else {
            addFloatingText('TERIMA KASIH!', 'text-amber-300');
          }

          const payout = Math.round(cust.totalBill * multiplier);
          setCoinsEarned((prev) => prev + payout);
          onUpdateCoins(totalCoins + payout);
          setCustomersServed((prev) => prev + 1);

          return {
            ...cust,
            orderItems: updatedOrderItems,
            mood: 'served',
            isLeaving: true,
          };
        } else {
          // Partial fulfillment
          soundEngine.playDing();
          addFloatingText('1 Pesanan Terpenuhi!', 'text-emerald-300');
          return {
            ...cust,
            orderItems: updatedOrderItems,
          };
        }
      })
    );
  };

  // Combo multiplier calculation for HUD
  let currentComboMultiplier = 1;
  if (comboCount >= 10) currentComboMultiplier = 5;
  else if (comboCount >= 5) currentComboMultiplier = 3;
  else if (comboCount >= 3) currentComboMultiplier = 2;

  const currentStats: GameStats = {
    totalServed: customersServed,
    totalLost: customersLost,
    totalDishesMade: dishesMadeCount,
    totalCoinsEarned: coinsEarned,
    playTimeSeconds: Math.round(playTimeSeconds),
    highestCombo,
    burntDishesCount,
  };

  // Determine Chef pose and reaction dialogue
  let chefPose: 'idle' | 'cooking' | 'happy' | 'urgent' = 'idle';
  let chefDialogue = `Chef ${chef.name} siap menyajikan masakan terbaik!`;

  if (cookingSlots.some((s) => s.state === 'burning')) {
    chefPose = 'urgent';
    chefDialogue = 'Awas masakan hampir gosong! Segera angkat!';
  } else if (customers.some((c) => c.elapsedWaitTime > 20 && !c.isLeaving && c.mood !== 'served')) {
    chefPose = 'urgent';
    chefDialogue = 'Customer di meja mulai kesal, ayo lebih cepat!';
  } else if (comboCount >= 2) {
    chefPose = 'happy';
    chefDialogue = `Luar biasa! Combo x${currentComboMultiplier}! Pertahankan!`;
  } else if (cookingSlots.some((s) => s.state === 'cooking')) {
    chefPose = 'cooking';
    chefDialogue = 'Sedang meracik dan memasak hidangan lezat...';
  }

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col bg-[#1A1C23] text-[#3E2723] select-none overflow-hidden">
      {/* TOP MINIMAL LANDSCAPE HUD */}
      <GameHUD
        restaurant={restaurant}
        levelNumber={levelConfig.levelNumber}
        chef={chef}
        coinsEarned={coinsEarned}
        totalCoins={totalCoins}
        customersServed={customersServed}
        targetCustomers={levelConfig.targetCustomers}
        customersLost={customersLost}
        maxLostAllowed={levelConfig.maxLostAllowed}
        comboCount={comboCount}
        comboMultiplier={currentComboMultiplier}
        isMuted={isMuted}
        onToggleMute={() => onToggleMute(!isMuted)}
        onPause={() => setIsPaused(true)}
        onRestart={onRestartLevel}
        onExit={onExitToMenu}
      />

      {/* FLOATING ANNOUNCEMENTS (COMBO, PERFECT, ETC.) */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center gap-1">
        <AnimatePresence>
          {floatingTexts.map((f) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1.25 }}
              exit={{ opacity: 0, y: -20 }}
              className={`font-black text-xs sm:text-sm uppercase px-4 py-1.5 bg-[#FFFDF9] border-2 border-[#FF8A3D] rounded-full shadow-2xl ${f.color}`}
            >
              {f.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* FULL 3D RESTAURANT VIEWPORT (WIDE LANDSCAPE 16:9 RATIO) */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-gradient-to-b from-[#1E222D] to-[#12141A]">
        <ThreeRestaurantCanvas
          restaurantId={restaurant.id}
          chef={chef}
          customers={customers}
          cookingSlots={cookingSlots}
          preparedFoods={preparedFoods}
          availableFoods={allowedFoods}
          onStartCooking={handleStartCooking}
          onCollectCookedItem={handleCollectCookedItem}
          onDiscardBurntItem={handleDiscardBurntItem}
          onServeCustomer={handleServeCustomer}
          onDiscardPreparedFood={handleDiscardPreparedFood}
        />

        {/* BOTTOM FLOATING KITCHEN ACTION BAR */}
        <div className="absolute bottom-2 left-0 right-0 z-30 px-3 pointer-events-none flex justify-center">
          <KitchenActionDock
            slots={cookingSlots}
            availableFoods={allowedFoods}
            preparedFoods={preparedFoods}
            onStartCooking={handleStartCooking}
            onCollectCookedItem={handleCollectCookedItem}
            onDiscardBurntItem={handleDiscardBurntItem}
            onServePreparedFood={handleServePreparedFood}
            onDiscardPreparedFood={handleDiscardPreparedFood}
          />
        </div>
      </div>

      {/* Modals */}
      {isPaused && (
        <PauseModal
          onResume={() => setIsPaused(false)}
          onRestart={() => {
            setIsPaused(false);
            onRestartLevel();
          }}
          onOpenSettings={() => setShowSettings(true)}
          onExitLevel={onExitToMenu}
        />
      )}

      {isGameOver && (
        <GameOverModal
          stats={currentStats}
          restaurant={restaurant}
          levelNumber={levelConfig.levelNumber}
          onTryAgain={onRestartLevel}
          onBackToMenu={onExitToMenu}
        />
      )}

      {isLevelComplete && (
        <LevelCompleteModal
          stats={currentStats}
          restaurant={restaurant}
          levelNumber={levelConfig.levelNumber}
          starsEarned={starsEarned}
          coinsReward={coinsEarned}
          hasNextLevel={levelConfig.levelNumber < restaurant.levelsCount}
          onNextLevel={onNextLevel}
          onReplay={onRestartLevel}
          onBackToMenu={onExitToMenu}
        />
      )}

      {showSettings && (
        <SettingsModal
          isMuted={isMuted}
          sfxVolume={sfxVolume}
          musicVolume={musicVolume}
          onToggleMute={onToggleMute}
          onChangeSfxVolume={onChangeSfxVolume}
          onChangeMusicVolume={onChangeMusicVolume}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};
