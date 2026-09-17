import React from 'react';
import { Chef } from '../types/game';
import { motion } from 'motion/react';
import { Play, Users, UtensilsCrossed, ShoppingBag, Settings, Star, Coins, Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { GameLogo } from './GameLogo';
import { ChefAvatar } from './ChefAvatar';

interface MainMenuProps {
  activeChef: Chef;
  playerCoins: number;
  totalStars: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onPlay: () => void;
  onOpenChefSelect: () => void;
  onOpenRestaurantSelect: () => void;
  onOpenShop: () => void;
  onOpenSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  activeChef,
  playerCoins,
  totalStars,
  isMuted,
  onToggleMute,
  onPlay,
  onOpenChefSelect,
  onOpenRestaurantSelect,
  onOpenShop,
  onOpenSettings,
}) => {
  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between p-3 sm:p-5 text-[#3E2723] overflow-hidden select-none">
      {/* Background Animated Restaurant Atmosphere */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Overhead Warm Pendant Lamps */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 flex flex-col items-center opacity-70">
          <div className="w-0.5 h-14 bg-[#8D6E63]" />
          <div className="w-12 h-6 bg-[#FFB088] rounded-b-full border-2 border-[#8D6E63] shadow-lg shadow-[#FFD2B8]" />
          <div className="w-20 h-20 bg-amber-300/10 rounded-full blur-xl -mt-6" />
        </div>
        <div className="absolute top-0 right-1/4 translate-x-1/2 flex flex-col items-center opacity-70">
          <div className="w-0.5 h-16 bg-[#8D6E63]" />
          <div className="w-12 h-6 bg-[#FFB088] rounded-b-full border-2 border-[#8D6E63] shadow-lg shadow-[#FFD2B8]" />
          <div className="w-20 h-20 bg-amber-300/10 rounded-full blur-xl -mt-6" />
        </div>

        {/* Floating Steam & Food Bubbles in Background */}
        <motion.div
          animate={{ y: [20, -40], opacity: [0, 0.4, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: 'easeOut' }}
          className="absolute bottom-36 left-1/6 text-2xl"
        >
          ♨️
        </motion.div>
        <motion.div
          animate={{ y: [30, -50], opacity: [0, 0.5, 0] }}
          transition={{ repeat: Infinity, duration: 5.2, ease: 'easeOut', delay: 1.5 }}
          className="absolute bottom-40 right-1/6 text-2xl"
        >
          ♨️
        </motion.div>
        <motion.div
          animate={{ y: [15, -35], opacity: [0, 0.35, 0] }}
          transition={{ repeat: Infinity, duration: 3.8, ease: 'easeOut', delay: 0.8 }}
          className="absolute bottom-32 left-1/2 text-xl"
        >
          ✨
        </motion.div>
      </div>

      {/* Top Bar: Active Chef Quick Glance & Currency / Stars */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between z-10 bg-[#FFFDF9]/95 backdrop-blur-md px-4 py-2.5 rounded-3xl border-2 border-[#FFD2B8] shadow-md">
        {/* Active Chef Info Pill */}
        <button
          onClick={() => {
            soundEngine.playDing();
            onOpenChefSelect();
          }}
          onMouseEnter={() => soundEngine.playClick()}
          className="flex items-center gap-2.5 hover:bg-[#FFF0E0] px-3 py-1 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-[#FFB088]"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFE37D] border-2 border-[#FF8A3D] flex items-center justify-center text-xl shadow-xs overflow-hidden">
            <ChefAvatar chefId={activeChef.id} size="sm" showAnimation={false} />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[10px] text-[#A07055] font-bold uppercase">Chef Bertugas</div>
            <div className="text-xs font-black text-[#E55934] truncate max-w-[120px]">
              {activeChef.name}
            </div>
          </div>
        </button>

        {/* Currency & Stars Balance */}
        <div className="flex items-center gap-2.5">
          {/* Coins */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF0E0] rounded-2xl border border-[#FFD2B8] text-[#D97706] font-black text-xs sm:text-sm shadow-2xs">
            <Coins className="w-4 h-4 text-[#F59E0B]" />
            <span>{playerCoins}</span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF3C7] rounded-2xl border border-[#FDE68A] text-[#B45309] font-black text-xs sm:text-sm shadow-2xs">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{totalStars}</span>
          </div>

          {/* Mute Toggle */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onToggleMute();
            }}
            className="w-8 h-8 rounded-xl bg-[#FFF0E0] hover:bg-[#FFE37D] text-[#785949] flex items-center justify-center border border-[#FFD2B8] cursor-pointer transition-colors"
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>
        </div>
      </div>

      {/* Center: Game Logo + Living Chef Centerpiece */}
      <div className="flex flex-col items-center my-auto z-10 text-center py-2">
        {/* Game Logo */}
        <GameLogo size="lg" />

        {/* Living Chef Character Standing at the Kitchen Counter */}
        <div className="relative mt-2 flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              soundEngine.playDing();
              onOpenChefSelect();
            }}
            onMouseEnter={() => soundEngine.playClick()}
            className="cursor-pointer flex flex-col items-center group"
          >
            {/* Animated Chef Character */}
            <ChefAvatar chefId={activeChef.id} size="xl" pose="idle" />

            {/* Click to change tooltip badge */}
            <div className="mt-1 px-3.5 py-1 rounded-full bg-[#FFF0E0] border border-[#FF8A3D]/40 text-[#4E1D00] text-xs font-black shadow-sm group-hover:bg-[#FFE37D] group-hover:border-[#FF8A3D] transition-all flex items-center gap-1.5">
              <span>{activeChef.name}</span>
              <span className="text-[10px] text-[#FF8A3D] font-bold">({activeChef.perkName})</span>
              <span className="text-[10px] text-[#A07055]">• Ganti Chef</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Menu Buttons */}
      <div className="w-full max-w-md mx-auto flex flex-col gap-3 z-10 pb-2">
        {/* Big Juicy PLAY Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            soundEngine.playDing();
            onPlay();
          }}
          onMouseEnter={() => soundEngine.playClick()}
          className="w-full py-4 bg-gradient-to-r from-[#FF8A3D] via-[#FF7033] to-[#E55934] hover:from-[#FFA05C] hover:to-[#FF8A3D] text-white font-black text-xl rounded-3xl shadow-xl flex items-center justify-center gap-2.5 cursor-pointer border-3 border-[#FFE2CF] transition-all uppercase tracking-wider"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>MULAI MAIN (PLAY)</span>
        </motion.button>

        {/* Secondary Navigation Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* CHEF */}
          <button
            onClick={() => {
              soundEngine.playDing();
              onOpenChefSelect();
            }}
            onMouseEnter={() => soundEngine.playClick()}
            className="flex flex-col items-center justify-center py-2.5 px-2 bg-[#FFFDF9] hover:bg-[#FFF0E0] active:scale-95 text-[#3E2723] font-black text-xs rounded-2xl border-2 border-[#FFD2B8] cursor-pointer shadow-xs transition-all uppercase"
          >
            <Users className="w-4 h-4 text-[#E55934] mb-1" />
            <span>CHEF</span>
          </button>

          {/* RESTAURANT */}
          <button
            onClick={() => {
              soundEngine.playDing();
              onOpenRestaurantSelect();
            }}
            onMouseEnter={() => soundEngine.playClick()}
            className="flex flex-col items-center justify-center py-2.5 px-2 bg-[#FFFDF9] hover:bg-[#FFF0E0] active:scale-95 text-[#3E2723] font-black text-xs rounded-2xl border-2 border-[#FFD2B8] cursor-pointer shadow-xs transition-all uppercase"
          >
            <UtensilsCrossed className="w-4 h-4 text-[#10B981] mb-1" />
            <span>RESTO</span>
          </button>

          {/* SHOP */}
          <button
            onClick={() => {
              soundEngine.playDing();
              onOpenShop();
            }}
            onMouseEnter={() => soundEngine.playClick()}
            className="flex flex-col items-center justify-center py-2.5 px-2 bg-[#FFFDF9] hover:bg-[#FFF0E0] active:scale-95 text-[#3E2723] font-black text-xs rounded-2xl border-2 border-[#FFD2B8] cursor-pointer shadow-xs transition-all uppercase"
          >
            <ShoppingBag className="w-4 h-4 text-[#0284C7] mb-1" />
            <span>TOKO</span>
          </button>

          {/* SETTINGS */}
          <button
            onClick={() => {
              soundEngine.playDing();
              onOpenSettings();
            }}
            onMouseEnter={() => soundEngine.playClick()}
            className="flex flex-col items-center justify-center py-2.5 px-2 bg-[#FFFDF9] hover:bg-[#FFF0E0] active:scale-95 text-[#3E2723] font-black text-xs rounded-2xl border-2 border-[#FFD2B8] cursor-pointer shadow-xs transition-all uppercase"
          >
            <Settings className="w-4 h-4 text-[#8B5CF6] mb-1" />
            <span>SETTING</span>
          </button>
        </div>
      </div>
    </div>
  );
};
