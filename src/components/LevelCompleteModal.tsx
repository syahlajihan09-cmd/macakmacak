import React, { useEffect } from 'react';
import { GameStats, Restaurant } from '../types/game';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, Star, ArrowRight, RotateCcw, Home, Coins, Users, Flame } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface LevelCompleteModalProps {
  stats: GameStats;
  restaurant: Restaurant;
  levelNumber: number;
  starsEarned: number;
  coinsReward: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onBackToMenu: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  stats,
  restaurant,
  levelNumber,
  starsEarned,
  coinsReward,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onBackToMenu,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF8A3D', '#10B981', '#F59E0B', '#F43F5E', '#3B82F6'],
      });
      soundEngine.playVictory();
    } catch {
      // Ignore
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        className="w-full max-w-md bg-[#FFFDF9] border-4 border-[#10B981] rounded-3xl p-6 text-[#3E2723] shadow-2xl relative overflow-hidden"
      >
        {/* Banner */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#10B981] via-[#FBBF24] to-[#10B981]" />

        {/* Header */}
        <div className="text-center mb-5 mt-1">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#ECFDF5] border-2 border-[#A7F3D0] text-[#059669] mb-2 shadow-inner">
            <Trophy className="w-9 h-9 animate-bounce" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-[#059669]">LEVEL SELESAI!</h2>
          <p className="text-xs text-[#785949] font-medium mt-0.5">
            Pelayanan luar biasa di {restaurant.name} — Level {levelNumber}
          </p>

          {/* Stars display with animation */}
          <div className="flex items-center justify-center gap-3 my-4">
            {[1, 2, 3].map((starIdx) => (
              <motion.div
                key={starIdx}
                initial={{ scale: 0, rotate: -30 }}
                animate={{
                  scale: starIdx <= starsEarned ? 1.3 : 0.9,
                  rotate: 0,
                }}
                transition={{ delay: 0.15 * starIdx, type: 'spring' }}
                className={`text-4xl ${
                  starIdx <= starsEarned
                    ? 'text-amber-400 filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]'
                    : 'text-stone-300'
                }`}
              >
                ★
              </motion.div>
            ))}
          </div>
        </div>

        {/* Level Performance Stats */}
        <div className="bg-[#FFF8F0] rounded-2xl p-4 border-2 border-[#FFE2CF] space-y-2 mb-5">
          <div className="flex items-center justify-between text-xs py-1 border-b border-[#F4E3D7]">
            <span className="flex items-center gap-2 text-[#785949] font-bold">
              <Users className="w-4 h-4 text-[#059669]" />
              Customer Berhasil Dilayani
            </span>
            <span className="font-black text-[#059669] text-sm">{stats.totalServed} Orang</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-[#F4E3D7]">
            <span className="flex items-center gap-2 text-[#785949] font-bold">
              <Coins className="w-4 h-4 text-[#D97706]" />
              Total Koin Didapatkan
            </span>
            <span className="font-black text-[#D97706] text-sm">+{coinsReward} Koin</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-[#F4E3D7]">
            <span className="flex items-center gap-2 text-[#785949] font-bold">
              <Flame className="w-4 h-4 text-[#EA580C]" />
              Combo Tertinggi
            </span>
            <span className="font-black text-[#EA580C] text-sm">x{stats.highestCombo} Combo</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="flex items-center gap-2 text-[#785949] font-bold">
              <Star className="w-4 h-4 text-amber-500" />
              Customer Kabur
            </span>
            <span className="font-black text-[#785949] text-xs">
              {stats.totalLost} Orang (Batas: 5)
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2.5">
          {hasNextLevel && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onNextLevel();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] active:scale-95 text-white font-black text-sm cursor-pointer shadow-lg transition-all"
            >
              <span>LANJUT KE LEVEL BERIKUTNYA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                soundEngine.playClick();
                onReplay();
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-white hover:bg-[#FFF0E0] active:scale-95 text-[#3E2723] font-black text-xs border-2 border-[#FFD2B8] cursor-pointer shadow-xs transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>MAIN LAGI</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onBackToMenu();
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-white hover:bg-[#FFF0E0] active:scale-95 text-[#3E2723] font-black text-xs border-2 border-[#FFD2B8] cursor-pointer shadow-xs transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              <span>MENU UTAMA</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
