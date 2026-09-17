import React from 'react';
import { GameStats, Restaurant } from '../types/game';
import { motion } from 'motion/react';
import { RotateCcw, Home, Skull, Users, Coins, UtensilsCrossed, Clock, Star, AlertOctagon } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface GameOverModalProps {
  stats: GameStats;
  restaurant: Restaurant;
  levelNumber: number;
  onTryAgain: () => void;
  onBackToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  restaurant,
  levelNumber,
  onTryAgain,
  onBackToMenu,
}) => {
  const minutes = Math.floor(stats.playTimeSeconds / 60);
  const seconds = stats.playTimeSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const totalAttempted = stats.totalServed + stats.totalLost;
  const serviceRatio = totalAttempted > 0 ? stats.totalServed / totalAttempted : 0;
  let ratingText = 'Perlu Latihan Lagi';
  let starsCount = 1;
  if (serviceRatio >= 0.7) {
    ratingText = 'Cukup Baik';
    starsCount = 3;
  } else if (serviceRatio >= 0.4) {
    ratingText = 'Kurang Teratur';
    starsCount = 2;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 250 }}
        className="w-full max-w-md bg-[#FFFDF9] border-4 border-[#DC2626] rounded-3xl p-6 text-[#3E2723] shadow-2xl relative overflow-hidden"
      >
        {/* Top warning line */}
        <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#DC2626] via-[#F59E0B] to-[#DC2626] animate-pulse" />

        {/* Title */}
        <div className="text-center mb-5 mt-1">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FEE2E2] border-2 border-[#FCA5A5] text-[#DC2626] mb-2 shadow-inner">
            <AlertOctagon className="w-9 h-9 animate-bounce" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-[#DC2626]">GAME OVER</h2>
          <p className="text-xs text-[#991B1B] font-bold mt-1">
            Lebih dari 5 customer meninggalkan restoran! Restoran kewalahan.
          </p>
          <div className="inline-block mt-2 px-3 py-1 bg-[#FFF0E0] rounded-full text-xs font-black text-[#785949] border border-[#FFD2B8]">
            {restaurant.name} — Level {levelNumber}
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="bg-[#FFF8F0] rounded-2xl p-4 border-2 border-[#FFE2CF] space-y-2 mb-5">
          <div className="flex items-center justify-between text-xs py-1 border-b border-[#F4E3D7]">
            <span className="flex items-center gap-2 text-[#785949] font-bold">
              <Users className="w-4 h-4 text-[#059669]" />
              Total Customer Dilayani
            </span>
            <span className="font-black text-[#059669] text-sm">{stats.totalServed} Orang</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-[#F4E3D7]">
            <span className="flex items-center gap-2 text-[#785949] font-bold">
              <Skull className="w-4 h-4 text-[#DC2626]" />
              Total Customer Kabur
            </span>
            <span className="font-black text-[#DC2626] text-sm">{stats.totalLost} Orang (Batas: 5)</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-[#F4E3D7]">
            <span className="flex items-center gap-2 text-[#785949] font-bold">
              <UtensilsCrossed className="w-4 h-4 text-[#D97706]" />
              Total Makanan Dibuat
            </span>
            <span className="font-black text-[#D97706] text-sm">{stats.totalDishesMade} Porsi</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-[#F4E3D7]">
            <span className="flex items-center gap-2 text-[#785949] font-bold">
              <Coins className="w-4 h-4 text-[#D97706]" />
              Total Uang Diperoleh
            </span>
            <span className="font-black text-[#D97706] text-sm">+{stats.totalCoinsEarned} Koin</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-[#F4E3D7]">
            <span className="flex items-center gap-2 text-[#785949] font-bold">
              <Clock className="w-4 h-4 text-[#0284C7]" />
              Waktu Bermain
            </span>
            <span className="font-black text-[#0284C7] text-sm">{timeFormatted}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="flex items-center gap-2 text-[#785949] font-bold">
              <Star className="w-4 h-4 text-amber-500" />
              Rating Restoran
            </span>
            <span className="font-black text-[#B45309] text-xs">
              {'⭐'.repeat(starsCount)} ({ratingText})
            </span>
          </div>
        </div>

        {/* Action Buttons: TRY AGAIN and BACK TO MENU */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              soundEngine.playClick();
              onTryAgain();
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF8A3D] to-[#E55934] hover:from-[#FFA05C] hover:to-[#FF8A3D] active:scale-95 text-white font-black text-sm cursor-pointer shadow-lg transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>TRY AGAIN</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onBackToMenu();
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white hover:bg-[#FFF0E0] active:scale-95 text-[#3E2723] font-black text-sm border-2 border-[#FFD2B8] cursor-pointer shadow-xs transition-all"
          >
            <Home className="w-4 h-4" />
            <span>MENU UTAMA</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
