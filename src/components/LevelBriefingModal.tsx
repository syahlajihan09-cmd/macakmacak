import React from 'react';
import { LevelConfig, Restaurant } from '../types/game';
import { ALL_FOOD_ITEMS } from '../data/gameData';
import { motion } from 'motion/react';
import { Play, X, Users, Coins, AlertTriangle, Utensils, Star, Flame } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface LevelBriefingModalProps {
  restaurant: Restaurant;
  levelConfig: LevelConfig;
  starsEarned: number;
  onStartCooking: () => void;
  onClose: () => void;
}

export const LevelBriefingModal: React.FC<LevelBriefingModalProps> = ({
  restaurant,
  levelConfig,
  starsEarned,
  onStartCooking,
  onClose,
}) => {
  const allowedFoods = levelConfig.allowedMenuIds
    .map((id) => ALL_FOOD_ITEMS[id])
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        className="w-full max-w-lg bg-[#FFFDF9] border-4 border-[#FF8A3D] rounded-3xl p-5 text-[#3E2723] shadow-2xl relative overflow-hidden"
      >
        {/* Warm top accent ribbon */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#FFB088] via-[#FF8A3D] to-[#E55934]" />

        {/* Header */}
        <div className="flex items-start justify-between pb-3 mb-4 border-b border-[#F4E3D7]">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${restaurant.bannerColor} flex items-center justify-center text-3xl shadow-inner border-2 border-white`}>
              {restaurant.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#FF8A3D]">
                  {restaurant.name}
                </span>
                <span className="text-[11px] bg-[#FF8A3D] text-white font-black px-2 py-0.5 rounded-full">
                  LEVEL {levelConfig.levelNumber}
                </span>
              </div>
              <h3 className="text-xl font-black text-[#3E2723] mt-0.5">PERSIAPAN MEMASAK</h3>
              <p className="text-xs text-[#785949]">{restaurant.theme}</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#F4E3D7] hover:bg-[#E8D0C0] text-[#3E2723] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Star Rating for this level */}
        <div className="flex items-center justify-between bg-[#FFF3E6] px-4 py-2 rounded-2xl border border-[#FFD2B8] mb-4">
          <span className="text-xs font-bold text-[#785949]">Pencapaian Bintang:</span>
          <div className="flex items-center gap-1.5 text-lg">
            {[1, 2, 3].map((starIdx) => (
              <span
                key={starIdx}
                className={starIdx <= starsEarned ? 'text-amber-400 drop-shadow-sm' : 'text-stone-300'}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Targets & Objectives Box */}
        <div className="bg-[#FFF8F0] p-3.5 rounded-2xl border border-[#FFE2CF] mb-4 space-y-2">
          <div className="text-xs font-black uppercase text-[#E55934] flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#FF8A3D]" />
            Target Layanan Restoran
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-white p-2.5 rounded-xl border border-[#F4E3D7] text-center shadow-xs">
              <Users className="w-4 h-4 mx-auto text-[#0284C7] mb-1" />
              <div className="text-[10px] text-[#785949] font-bold uppercase">Customer</div>
              <div className="text-sm font-black text-[#0284C7]">{levelConfig.targetCustomers} Orang</div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-[#F4E3D7] text-center shadow-xs">
              <Coins className="w-4 h-4 mx-auto text-[#D97706] mb-1" />
              <div className="text-[10px] text-[#785949] font-bold uppercase">Target Koin</div>
              <div className="text-sm font-black text-[#D97706]">{levelConfig.targetCoins}</div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-[#F4E3D7] text-center shadow-xs">
              <AlertTriangle className="w-4 h-4 mx-auto text-[#DC2626] mb-1" />
              <div className="text-[10px] text-[#785949] font-bold uppercase">Maks Kabur</div>
              <div className="text-sm font-black text-[#DC2626]">{levelConfig.maxLostAllowed} Orang</div>
            </div>
          </div>
        </div>

        {/* Available Food Menu Preview */}
        <div className="mb-5">
          <div className="text-xs font-black uppercase text-[#785949] mb-2 flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-[#FF8A3D]" />
            Menu Pesanan di Level Ini ({allowedFoods.length})
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
            {allowedFoods.map((food) => (
              <div
                key={food.id}
                className="flex items-center gap-2 p-2 bg-white rounded-xl border border-[#F4E3D7] shadow-2xs"
              >
                <span className="text-2xl">{food.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-black text-[#3E2723] truncate">{food.name}</div>
                  <div className="text-[10px] text-[#FF8A3D] font-bold">
                    {food.cookTime}s • Rp{food.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Big Start Cooking Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            soundEngine.playDing();
            onStartCooking();
          }}
          className="w-full py-3.5 bg-gradient-to-r from-[#FF8A3D] via-[#FF7033] to-[#E55934] hover:from-[#FFA05C] hover:to-[#FF8A3D] text-white font-black text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer border-2 border-[#FFE2CF] uppercase tracking-wider transition-all"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>MULAI MEMASAK (START)</span>
        </motion.button>
      </motion.div>
    </div>
  );
};
