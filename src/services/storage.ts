import { KitchenUpgrades } from '../types/game';

interface StoredGameState {
  coins: number;
  selectedChefId: string;
  unlockedChefIds: string[];
  unlockedRestaurantIds: string[];
  levelStars: Record<string, number>; // key format: `${restaurantId}_lvl_${levelNumber}` => 1, 2, or 3
  upgrades: KitchenUpgrades;
  soundMuted: boolean;
  sfxVolume: number;
  musicVolume: number;
  lifetimeStats: {
    totalServed: number;
    totalLost: number;
    totalDishesMade: number;
    totalEarned: number;
  };
}

const STORAGE_KEY = 'masak_masak_game_save_v1';

const DEFAULT_STATE: StoredGameState = {
  coins: 100, // starting coins
  selectedChefId: 'chef-mia',
  unlockedChefIds: ['chef-mia'],
  unlockedRestaurantIds: ['dapur-ceria'],
  levelStars: {},
  upgrades: {
    stoveCount: 2,
    stoveSpeedLevel: 1,
    ovenSpeedLevel: 1,
    drinkSpeedLevel: 1,
    burnAlarm: true,
  },
  soundMuted: false,
  sfxVolume: 0.8,
  musicVolume: 0.5,
  lifetimeStats: {
    totalServed: 0,
    totalLost: 0,
    totalDishesMade: 0,
    totalEarned: 0,
  },
};

export const storageService = {
  load(): StoredGameState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return { ...DEFAULT_STATE, ...JSON.parse(data) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_STATE;
  },

  save(state: StoredGameState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota
    }
  },

  getTotalStars(levelStars: Record<string, number>): number {
    return Object.values(levelStars).reduce((sum, s) => sum + (s || 0), 0);
  },

  resetSave(): StoredGameState {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    return DEFAULT_STATE;
  }
};
