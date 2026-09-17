import React, { useState } from 'react';
import { Restaurant } from '../types/game';
import { RESTAURANTS_LIST, getLevelConfig } from '../data/gameData';
import { motion } from 'motion/react';
import { Lock, Star, ChevronRight, X, Play, ArrowLeft, Utensils } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { LevelBriefingModal } from './LevelBriefingModal';

interface RestaurantSelectModalProps {
  unlockedRestaurantIds: string[];
  levelStars: Record<string, number>;
  totalStarsEarned: number;
  onSelectLevel: (restaurantId: string, levelNumber: number) => void;
  onClose: () => void;
}

export const RestaurantSelectModal: React.FC<RestaurantSelectModalProps> = ({
  unlockedRestaurantIds,
  levelStars,
  totalStarsEarned,
  onSelectLevel,
  onClose,
}) => {
  const [selectedRestoId, setSelectedRestoId] = useState<string>('dapur-ceria');
  const [viewingLevels, setViewingLevels] = useState<boolean>(false);
  const [briefingLevelNum, setBriefingLevelNum] = useState<number | null>(null);

  const currentResto = RESTAURANTS_LIST.find((r) => r.id === selectedRestoId) || RESTAURANTS_LIST[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-3xl bg-[#FFFDF9] border-4 border-[#FF8A3D] rounded-3xl p-5 sm:p-6 text-[#3E2723] shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#F4E3D7]">
          <div className="flex items-center gap-2">
            {viewingLevels && (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setViewingLevels(false);
                }}
                className="w-9 h-9 rounded-full bg-[#F4E3D7] hover:bg-[#E8D0C0] text-[#3E2723] flex items-center justify-center cursor-pointer mr-1 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-[#FF8A3D]">
                {viewingLevels ? currentResto.name : 'Jelajahi Kuliner'}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#3E2723]">
                {viewingLevels ? `PILIH LEVEL MEMASAK` : 'PILIH RESTORAN'}
              </h3>
              <p className="text-xs text-[#785949]">
                {viewingLevels
                  ? `Selesaikan level secara berurutan untuk menguasai menu ${currentResto.name}!`
                  : 'Kumpulkan bintang dari setiap level untuk membuka restoran berikutnya!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF3C7] rounded-2xl border border-[#FDE68A] text-[#B45309] text-xs font-black">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{totalStarsEarned} Total Bintang</span>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-[#F4E3D7] hover:bg-[#E8D0C0] text-[#3E2723] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View 1: Restaurants Grid */}
        {!viewingLevels ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RESTAURANTS_LIST.map((resto) => {
              const isUnlocked = unlockedRestaurantIds.includes(resto.id);
              const starsNeeded = resto.unlockStarsRequired;
              const hasEnoughStars = totalStarsEarned >= starsNeeded;

              // Total stars earned in this restaurant
              let restoStars = 0;
              for (let lvl = 1; lvl <= resto.levelsCount; lvl++) {
                const key = `${resto.id}_lvl_${lvl}`;
                restoStars += levelStars[key] || 0;
              }

              return (
                <div
                  key={resto.id}
                  onClick={() => {
                    if (isUnlocked || hasEnoughStars) {
                      setSelectedRestoId(resto.id);
                      setViewingLevels(true);
                      soundEngine.playDing();
                    } else {
                      soundEngine.playUrgentTick();
                    }
                  }}
                  className={`group relative rounded-3xl border-3 p-4 flex flex-col justify-between transition-all cursor-pointer ${
                    isUnlocked
                      ? 'bg-white border-[#F4E3D7] hover:border-[#FF8A3D] hover:shadow-lg active:scale-98'
                      : 'bg-[#FAF5F0] border-[#E8D9CE] opacity-80'
                  }`}
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${resto.bannerColor} flex items-center justify-center text-3xl shadow-inner border-2 border-white`}>
                        {resto.icon}
                      </div>

                      {isUnlocked ? (
                        <span className="flex items-center gap-1 text-xs font-black text-[#B45309] bg-[#FEF3C7] px-2.5 py-1 rounded-full border border-[#FDE68A]">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{restoStars} / {resto.levelsCount * 3}</span>
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] font-black text-[#DC2626] bg-[#FEE2E2] px-2.5 py-1 rounded-full border border-[#FCA5A5]">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Butuh {starsNeeded} ★</span>
                        </div>
                      )}
                    </div>

                    <h4 className="text-lg font-black text-[#3E2723] group-hover:text-[#FF8A3D] transition-colors">
                      {resto.name}
                    </h4>
                    <div className="text-xs text-[#E55934] font-bold mb-1">{resto.theme}</div>
                    <p className="text-[11px] text-[#785949] leading-relaxed line-clamp-2">
                      {resto.description}
                    </p>

                    {/* Menu Item Previews */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {resto.availableMenus.slice(0, 4).map((m) => (
                        <span
                          key={m.id}
                          className="text-[10px] bg-[#FFF0E0] px-2 py-0.5 rounded-lg text-[#785949] border border-[#FFD2B8] font-bold flex items-center gap-1"
                        >
                          <span>{m.icon}</span>
                          <span>{m.name}</span>
                        </span>
                      ))}
                      {resto.availableMenus.length > 4 && (
                        <span className="text-[10px] text-[#A07055] px-1 py-0.5 font-bold">
                          +{resto.availableMenus.length - 4} lainnya
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F4E3D7] flex items-center justify-between text-xs font-black text-[#FF8A3D]">
                    <span>{isUnlocked ? 'Lihat Peta Level' : `Kumpulkan ${starsNeeded} Bintang`}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* View 2: Levels Roadmap */
          <div>
            {/* Restaurant Banner Info */}
            <div className="flex items-center gap-3 bg-[#FFF3E6] p-3.5 rounded-2xl border border-[#FFD2B8] mb-5">
              <span className="text-3xl">{currentResto.icon}</span>
              <div>
                <h4 className="text-sm font-black text-[#3E2723]">{currentResto.name}</h4>
                <p className="text-xs text-[#785949]">{currentResto.description}</p>
              </div>
            </div>

            {/* Level Nodes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {Array.from({ length: currentResto.levelsCount }).map((_, idx) => {
                const levelNum = idx + 1;
                const starKey = `${currentResto.id}_lvl_${levelNum}`;
                const prevStarKey = `${currentResto.id}_lvl_${levelNum - 1}`;
                const stars = levelStars[starKey] || 0;

                const isLevelUnlocked = levelNum === 1 || !!levelStars[prevStarKey];

                return (
                  <button
                    key={levelNum}
                    disabled={!isLevelUnlocked}
                    onClick={() => {
                      if (isLevelUnlocked) {
                        soundEngine.playClick();
                        setBriefingLevelNum(levelNum);
                      } else {
                        soundEngine.playUrgentTick();
                      }
                    }}
                    className={`relative rounded-3xl border-3 p-4 flex flex-col items-center justify-center transition-all ${
                      isLevelUnlocked
                        ? 'bg-white border-[#F4E3D7] hover:border-[#FF8A3D] hover:shadow-md active:scale-95 cursor-pointer'
                        : 'bg-[#FAF5F0] border-[#E8D9CE] text-[#A07055] cursor-not-allowed opacity-75'
                    }`}
                  >
                    <span className="text-xs font-black uppercase text-[#A07055]">Level</span>
                    <span className="text-3xl font-black text-[#3E2723] my-1">{levelNum}</span>

                    {/* Star ratings */}
                    <div className="flex items-center gap-1 my-1 text-base">
                      {[1, 2, 3].map((starIdx) => (
                        <span
                          key={starIdx}
                          className={starIdx <= stars ? 'text-amber-400 drop-shadow-xs' : 'text-stone-300'}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    {!isLevelUnlocked ? (
                      <span className="text-[10px] text-[#A07055] font-bold flex items-center gap-1 mt-1">
                        <Lock className="w-3 h-3" /> Terkunci
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#E55934] font-black flex items-center gap-1 mt-1">
                        <Play className="w-2.5 h-2.5 fill-current" /> Main Sekarang
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Level Briefing Modal Popup */}
        {briefingLevelNum !== null && (
          <LevelBriefingModal
            restaurant={currentResto}
            levelConfig={getLevelConfig(currentResto.id, briefingLevelNum)}
            starsEarned={levelStars[`${currentResto.id}_lvl_${briefingLevelNum}`] || 0}
            onStartCooking={() => {
              const lvl = briefingLevelNum;
              setBriefingLevelNum(null);
              onSelectLevel(currentResto.id, lvl);
            }}
            onClose={() => setBriefingLevelNum(null)}
          />
        )}
      </motion.div>
    </div>
  );
};
