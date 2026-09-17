export type CustomerMood = 'happy' | 'bored' | 'angry' | 'leaving' | 'served';

export type CustomerPersonalityType = 
  | 'ceria' 
  | 'impatient' 
  | 'foodie' 
  | 'kid' 
  | 'family' 
  | 'vip';

export interface FoodItem {
  id: string;
  name: string;
  category: 'fastfood' | 'breakfast' | 'italian' | 'indonesian' | 'dessert' | 'drink';
  price: number;
  cookTime: number; // in seconds
  burnTime: number; // grace period before burning in seconds
  icon: string; // emoji or SVG key
  description: string;
  stationType: 'pan' | 'oven' | 'pot' | 'drink' | 'assembly' | 'instant';
  ingredients?: string[];
}

export interface OrderItem {
  id: string;
  foodId: string;
  name: string;
  icon: string;
  isCompleted: boolean;
}

export interface Customer {
  id: string;
  name: string;
  avatarSeed: number;
  personality: CustomerPersonalityType;
  orderItems: OrderItem[];
  maxWaitTime: number; // e.g. 30s
  elapsedWaitTime: number; // starts at 0
  mood: CustomerMood;
  seatIndex: number;
  totalBill: number;
  isLeaving: boolean;
  satisfactionStars: number;
}

export interface Chef {
  id: string;
  name: string;
  title: string;
  avatar: string;
  description: string;
  perkName: string;
  perkDescription: string;
  speedMultiplier: number; // e.g. 1.25 for +25%
  patienceBonus: number; // in seconds, e.g. +6s
  burnToleranceMultiplier: number; // e.g. 1.5 for +50% longer
  coinMultiplier: number; // e.g. 1.35 for +35% coins
  unlockCost: number; // coins
  unlocked: boolean;
  color: string;
}

export interface Restaurant {
  id: string;
  name: string;
  theme: string;
  description: string;
  availableMenus: FoodItem[];
  unlocked: boolean;
  unlockStarsRequired: number;
  icon: string;
  bannerColor: string;
  levelsCount: number;
}

export interface LevelConfig {
  levelNumber: number;
  restaurantId: string;
  targetCustomers: number;
  targetCoins: number;
  maxLostAllowed: number; // default 5
  spawnIntervalSeconds: number; // e.g. 5 seconds
  allowedMenuIds: string[];
  starScores: [number, number, number]; // coin thresholds for 1, 2, 3 stars
}

export interface KitchenUpgrades {
  stoveCount: number; // 2 -> 3 -> 4
  stoveSpeedLevel: number; // 1 -> 2 -> 3
  ovenSpeedLevel: number; // 1 -> 2 -> 3
  drinkSpeedLevel: number; // 1 -> 2 -> 3
  burnAlarm: boolean; // sound/visual alarm before burn
}

export interface CookingSlot {
  id: string;
  type: 'pan' | 'oven' | 'pot' | 'drink';
  foodId: string | null;
  state: 'empty' | 'cooking' | 'ready' | 'burning' | 'burnt';
  progress: number; // 0 to 100
  timeInState: number; // seconds
  targetFood?: FoodItem;
}

export interface PreparedFood {
  id: string;
  foodId: string;
  name: string;
  icon: string;
  createdAt: number;
}

export interface GameStats {
  totalServed: number;
  totalLost: number;
  totalDishesMade: number;
  totalCoinsEarned: number;
  playTimeSeconds: number;
  highestCombo: number;
  burntDishesCount: number;
}
