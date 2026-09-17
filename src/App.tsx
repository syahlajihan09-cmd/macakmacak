import React, { useState, useEffect } from 'react';
import { storageService } from './services/storage';
import { soundEngine } from './services/soundEngine';
import { CHEFS_LIST, RESTAURANTS_LIST, getLevelConfig } from './data/gameData';
import { Chef, KitchenUpgrades, Restaurant } from './types/game';
import { MainMenu } from './components/MainMenu';
import { CookingGame } from './components/CookingGame';
import { ChefSelectModal } from './components/ChefSelectModal';
import { RestaurantSelectModal } from './components/RestaurantSelectModal';
import { ShopModal } from './components/ShopModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  // Load saved data
  const [saveData, setSaveData] = useState(() => storageService.load());

  // Current active selections
  const [currentScreen, setCurrentScreen] = useState<'menu' | 'game'>('menu');
  const [selectedRestoId, setSelectedRestoId] = useState<string>('dapur-ceria');
  const [selectedLevelNumber, setSelectedLevelNumber] = useState<number>(1);
  const [gameKey, setGameKey] = useState<number>(1); // used to force reload game on restart

  // Active modals on main menu
  const [activeModal, setActiveModal] = useState<
    'none' | 'chefSelect' | 'restaurantSelect' | 'shop' | 'settings'
  >('none');

  // Synchronize audio engine with saved settings
  useEffect(() => {
    soundEngine.setMuted(saveData.soundMuted);
    soundEngine.setSfxVolume(saveData.sfxVolume);
    soundEngine.setMusicVolume(saveData.musicVolume);
  }, [saveData.soundMuted, saveData.sfxVolume, saveData.musicVolume]);

  // Save changes to storage whenever saveData updates
  useEffect(() => {
    storageService.save(saveData);
  }, [saveData]);

  // Current active objects
  const activeChef: Chef =
    CHEFS_LIST.find((c) => c.id === saveData.selectedChefId) || CHEFS_LIST[0];
  const activeRestaurant: Restaurant =
    RESTAURANTS_LIST.find((r) => r.id === selectedRestoId) || RESTAURANTS_LIST[0];
  const totalStars = storageService.getTotalStars(saveData.levelStars);

  // Handlers for settings & audio
  const handleToggleMute = (muted: boolean) => {
    soundEngine.setMuted(muted);
    setSaveData((prev) => ({ ...prev, soundMuted: muted }));
  };

  const handleChangeSfxVolume = (vol: number) => {
    soundEngine.setSfxVolume(vol);
    setSaveData((prev) => ({ ...prev, sfxVolume: vol }));
  };

  const handleChangeMusicVolume = (vol: number) => {
    soundEngine.setMusicVolume(vol);
    setSaveData((prev) => ({ ...prev, musicVolume: vol }));
  };

  // Handlers for Chef selection & unlocks
  const handleSelectChef = (chefId: string) => {
    setSaveData((prev) => ({ ...prev, selectedChefId: chefId }));
  };

  const handleUnlockChef = (chef: Chef) => {
    if (saveData.coins >= chef.unlockCost) {
      setSaveData((prev) => ({
        ...prev,
        coins: prev.coins - chef.unlockCost,
        unlockedChefIds: [...prev.unlockedChefIds, chef.id],
        selectedChefId: chef.id,
      }));
    }
  };

  // Handlers for Level & Restaurant selection
  const handleStartLevel = (restaurantId: string, levelNumber: number) => {
    setSelectedRestoId(restaurantId);
    setSelectedLevelNumber(levelNumber);
    setGameKey((k) => k + 1);
    setActiveModal('none');
    setCurrentScreen('game');
  };

  // Handlers for Upgrades in Shop
  const handlePurchaseUpgrade = (key: keyof KitchenUpgrades, cost: number) => {
    if (saveData.coins >= cost) {
      setSaveData((prev) => {
        let nextVal: any;
        if (typeof prev.upgrades[key] === 'boolean') {
          nextVal = true;
        } else if (typeof prev.upgrades[key] === 'number') {
          nextVal = (prev.upgrades[key] as number) + 1;
        }
        return {
          ...prev,
          coins: prev.coins - cost,
          upgrades: {
            ...prev.upgrades,
            [key]: nextVal,
          },
        };
      });
    }
  };

  // Level Complete handler
  const handleCompleteLevel = (stars: number, coinsEarned: number) => {
    const starKey = `${selectedRestoId}_lvl_${selectedLevelNumber}`;
    setSaveData((prev) => {
      const prevStars = prev.levelStars[starKey] || 0;
      const updatedStars = {
        ...prev.levelStars,
        [starKey]: Math.max(prevStars, stars),
      };

      // Check if new restaurants should be unlocked based on total stars
      const newTotalStars = storageService.getTotalStars(updatedStars);
      const newlyUnlockedRestaurants = [...prev.unlockedRestaurantIds];
      RESTAURANTS_LIST.forEach((resto) => {
        if (!newlyUnlockedRestaurants.includes(resto.id) && newTotalStars >= resto.unlockStarsRequired) {
          newlyUnlockedRestaurants.push(resto.id);
        }
      });

      return {
        ...prev,
        coins: prev.coins + coinsEarned,
        levelStars: updatedStars,
        unlockedRestaurantIds: newlyUnlockedRestaurants,
        lifetimeStats: {
          ...prev.lifetimeStats,
          totalEarned: prev.lifetimeStats.totalEarned + coinsEarned,
        },
      };
    });
  };

  const handleUpdateCoins = (newTotal: number) => {
    setSaveData((prev) => ({ ...prev, coins: newTotal }));
  };

  // Next level navigation
  const handleNextLevel = () => {
    if (selectedLevelNumber < activeRestaurant.levelsCount) {
      setSelectedLevelNumber((lvl) => lvl + 1);
      setGameKey((k) => k + 1);
    } else {
      // Return to restaurant select or menu
      setCurrentScreen('menu');
      setActiveModal('restaurantSelect');
    }
  };

  // Restart current level
  const handleRestartLevel = () => {
    setGameKey((k) => k + 1);
  };

  return (
    <div className={`text-[#3E2723] flex flex-col items-center justify-center relative overflow-x-hidden font-sans ${currentScreen === 'game' ? 'w-full h-screen overflow-hidden' : 'min-h-screen bg-[#FDF8F3]'}`}>
      {/* Warm culinary ambient background gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFE5D0] via-[#FFF3E6] to-[#FAF0E6] -z-10" />

      {/* Decorative Kitchen Tile Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 -z-10"
        style={{
          backgroundImage: `radial-gradient(#FFB088 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className={currentScreen === 'game' ? 'w-full h-full flex-1 flex flex-col overflow-hidden' : 'w-full max-w-6xl mx-auto p-3 sm:p-4'}>
        {currentScreen === 'menu' ? (
          <MainMenu
            activeChef={activeChef}
            playerCoins={saveData.coins}
            totalStars={totalStars}
            isMuted={saveData.soundMuted}
            onToggleMute={() => handleToggleMute(!saveData.soundMuted)}
            onPlay={() => {
              // Open restaurant & level select
              setActiveModal('restaurantSelect');
            }}
            onOpenChefSelect={() => setActiveModal('chefSelect')}
            onOpenRestaurantSelect={() => setActiveModal('restaurantSelect')}
            onOpenShop={() => setActiveModal('shop')}
            onOpenSettings={() => setActiveModal('settings')}
          />
        ) : (
          <CookingGame
            key={`game-${selectedRestoId}-${selectedLevelNumber}-${gameKey}`}
            restaurant={activeRestaurant}
            levelConfig={getLevelConfig(selectedRestoId, selectedLevelNumber)}
            chef={activeChef}
            upgrades={saveData.upgrades}
            totalCoins={saveData.coins}
            isMuted={saveData.soundMuted}
            sfxVolume={saveData.sfxVolume}
            musicVolume={saveData.musicVolume}
            onUpdateCoins={handleUpdateCoins}
            onCompleteLevel={handleCompleteLevel}
            onToggleMute={handleToggleMute}
            onChangeSfxVolume={handleChangeSfxVolume}
            onChangeMusicVolume={handleChangeMusicVolume}
            onExitToMenu={() => setCurrentScreen('menu')}
            onNextLevel={handleNextLevel}
            onRestartLevel={handleRestartLevel}
          />
        )}
      </div>

      {/* Main Menu Modals */}
      {activeModal === 'chefSelect' && (
        <ChefSelectModal
          currentChefId={saveData.selectedChefId}
          unlockedChefIds={saveData.unlockedChefIds}
          playerCoins={saveData.coins}
          onSelectChef={handleSelectChef}
          onUnlockChef={handleUnlockChef}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'restaurantSelect' && (
        <RestaurantSelectModal
          unlockedRestaurantIds={saveData.unlockedRestaurantIds}
          levelStars={saveData.levelStars}
          totalStarsEarned={totalStars}
          onSelectLevel={handleStartLevel}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'shop' && (
        <ShopModal
          upgrades={saveData.upgrades}
          playerCoins={saveData.coins}
          onPurchaseUpgrade={handlePurchaseUpgrade}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'settings' && (
        <SettingsModal
          isMuted={saveData.soundMuted}
          sfxVolume={saveData.sfxVolume}
          musicVolume={saveData.musicVolume}
          onToggleMute={handleToggleMute}
          onChangeSfxVolume={handleChangeSfxVolume}
          onChangeMusicVolume={handleChangeMusicVolume}
          onClose={() => setActiveModal('none')}
        />
      )}
    </div>
  );
}
